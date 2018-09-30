class Player {
    constructor(params) {
        this.engine = params.engine;
        this.body = null;
        this.colliders = [];
        this.sectionMass = 0.1;
        this.win = false;
        this.dead = false;
    }

    addBody(obj) {
        var group = Body.nextGroup(true);
        var bodyCount = 0;
        var snake = Composites.stack(obj.x, obj.y, 1, 30, 5, 0, (x, y) => {
            bodyCount++;
            return Bodies.rectangle(x - 20, y, bodyCount === 1 ? 75 : 65 , bodyCount === 1 ? 50 : 20, {friction: 0.2, mass: bodyCount === 1 ? 10 : 0.7, frictionAir: bodyCount === 1 ? 0.015 : 0.015, collisionFilter: { group: group, category: 2 }, chamfer: 3 });
        });
        Composites.chain(snake, 0.3, 0, -0.3, 0, { stiffness: 1, length: 1, damping: 0.1, render: { type: 'line' } });


        this.colliders = [];
        var first = true;
        for (let part of snake.bodies) {
            var collider = Bodies.circle(part.position.x, part.position.y, first ? 50 : 20, {
                isStatic: true,
                isSensor: true,
                render: {
                    fillStyle: 'transparent',
                    lineWidth: 1
                },
                collisionFilter: { mask: 1, category: 2 },
            });
            collider.isCollider = true;
            this.colliders.push(collider);
            first = false;
        }
        console.log(this.colliders);

        this.body = snake;
    }

    update() {
        this.updateColliders();

        var numCollisions = this.colliders.filter((collider) => collider.isColliding).length;
        var head = this.body.bodies[0];

        // track player
        Bounds.shift(render.bounds, {x: head.position.x - WIDTH / 2, y: head.position.y - HEIGHT / 2});

        if (this.dead) return;


        // process inputs to move head
        var force = 0.2 + convertRange(Math.min(numCollisions, 10), [0, 10], [0, 0.03 * 3]);


        let numKeysPressed = Inp.up + Inp.left + Inp.right + Inp.down;
        if (numKeysPressed > 1) {
            force *= (Math.sqrt(2) / 2);
        }
        if (Inp.up) {
            Body.applyForce( head, {x: head.position.x, y: head.position.y}, {x: 0, y: -force});
        }
        if (Inp.left) {
            Body.applyForce( head, {x: head.position.x, y: head.position.y}, {x: -force, y: 0});
        }
        if (Inp.right) {
            Body.applyForce( head, {x: head.position.x, y: head.position.y}, {x: force, y: 0});
        }
        if (Inp.down) {
            Body.applyForce( head, {x: head.position.x, y: head.position.y}, {x: 0, y: force});
        }

        // process inputs to move body segments
        force = 0.01;
        var count = 0;
        for (let i = 1; i < this.colliders.length; i++) {
            let collider = this.colliders[i];
            let segment = this.body.bodies[i];
            if (collider.isColliding && (Inp.up || Inp.down || Inp.right || Inp.left) && count < 5 && Inp.space) {
                count++;
                Body.applyForce( segment, {x: segment.position.x, y: segment.position.y}, {x: -Math.cos(segment.angle) * force, y: -Math.sin(segment.angle) * force})
            }
        }
    }

    updateColliders() {
        for (let i = 0; i < this.body.bodies.length; i++) {
            let part = this.body.bodies[i];
            let collider = this.colliders[i];
            let constraint = this.body.constraints[i] || null;

            Body.setPosition(collider, { x: part.position.x, y: part.position.y });

            collider.isColliding = false;
            collider.render.strokeStyle = "#c8c2c7";

            for (let body of this.engine.world.bodies) {
                if (body.isWall) {
                    let collision = Matter.SAT.collides(body, collider);
                    if (collision.collided) {
                        collider.lastCollision = 0;
                        collider.isColliding = true;
                        collider.wallCollision = Math.abs(collision.normal.y) < 0.5;
                        collider.render.strokeStyle = "#c80008";

                        if (collider.wallCollision) {
                            collider.render.strokeStyle = "#0cc824";
                        }
                    }
                }
                if (body.isLava && i < 25) {
                    let collision = Matter.SAT.collides(body, collider);
                    if (collision.collided && constraint) {
                        Body.applyForce( part, {x: part.position.x, y: part.position.y}, {x: 0, y: -3});
                        this.dead = true;
                        this.deathTS = Date.now();
                    }
                }
                if (body.isGoal && !this.dead) {
                    let collision = Matter.SAT.collides(body, collider);
                    if (collision.collided) {
                        this.win = true;
                    }
                }
            }

            if (!collider.isColliding) {
                collider.lastCollision++;
            }

        }
    }
}
