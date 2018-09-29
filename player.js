class Player {
    constructor(params) {
        this.engine = params.engine;
        this.body = null;
        this.colliders = [];
        this.sectionMass = 0.1;
    }

    addBody(obj) {
        var group = Body.nextGroup(true);
        var bodyCount = 0;
        var snake = Composites.stack(obj.x, obj.y, 1, 25, 10, 10, (x, y) => {
            bodyCount++;
            return Bodies.rectangle(x - 20, y, 20, 15, {friction: 0.2, mass: bodyCount == 1 ? 0.1 : 0.01, frictionAir: bodyCount === 1 ? 0.015 : 0.015, collisionFilter: { group: group, category: 2 }, chamfer: 3 });
        });
        Composites.chain(snake, 0.3, 0, -0.3, 0, { stiffness: 1, length: 1, damping: 0.1, render: { type: 'line' } });


        this.colliders = [];
        for (let part of snake.bodies) {
            var collider = Bodies.circle(part.position.x, part.position.y, 15, {
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

        // process inputs to move head
        var force = numCollisions > 0
            ? (0.15 / 3) * this.sectionMass
            : (0.15 / 3) * this.sectionMass / 3;
        var forceUp = numCollisions > 0
            ? force
            : force;

        if (Inp.up) {
            Body.applyForce( head, {x: head.position.x, y: head.position.y}, {x: 0, y: -forceUp});
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
        force = (0.001 / 3) * this.sectionMass;
        for (let i = 0; i < this.colliders.length; i++) {
            let collider = this.colliders[i];
            let segment = this.body.bodies[i];
            if (collider.isColliding || collider.lastCollision < 7) {

                if (Inp.up) {
                    Body.applyForce( segment, {x: segment.position.x, y: segment.position.y}, {x: 0, y: -force*2});
                }
                if (Inp.left) {
                    Body.applyForce( segment, {x: segment.position.x, y: segment.position.y}, {x: -force, y: 0});
                }
                if (Inp.right) {
                    Body.applyForce( segment, {x: segment.position.x, y: segment.position.y}, {x: force, y: 0});
                }
                if (Inp.down) {
                    Body.applyForce( segment, {x: segment.position.x, y: segment.position.y}, {x: 0, y: force});
                }
            }
        }
    }

    updateColliders() {
        for (let i = 0; i < this.body.bodies.length; i++) {
            var part = this.body.bodies[i];
            var collider = this.colliders[i];
            Body.setPosition(collider, { x: part.position.x, y: part.position.y });

            collider.isColliding = false;
            collider.render.strokeStyle = "#c8c2c7";

            for (let body of this.engine.world.bodies) {
                if (body.isWall) {
                    let collision = Matter.SAT.collides(body, collider);
                    if (collision.collided) {
                        collider.lastCollision = 0;
                        collider.isColliding = true;
                        collider.render.strokeStyle = "#c80008";
                    }
                }
            }

            if (!collider.isColliding) {
                collider.lastCollision++;
            }

        }
    }
}
