class LevelLoader {

    constructor(params) {
        this.engine = params.engine;
        this.player = params.player;
        this.isLoading = false;
        this.crashed = false;
        this.data = null;
    }

    load(filename) {
        this.isLoading = true;
        console.log('Loading level: ' + filename);

        $.getJSON(filename + '.json', (data) => {
            console.log('Success loading level: ' + filename);
            console.log(data);

            this.data = data;
            this.populateWorld(data);

            this.isLoading = false;
        }, () => {
            console.log('Error loading level: ' + filename);
            this.crashed = true;
        });
    }

    populateWorld(data) {
        this.engine.world.gravity.y = 1.6;

        var bodies = [];

        for (let obj of data.layers[1].objects) {
            if ((obj.properties || {}).isPlayer) {
                this.player.addBody(obj);
                bodies.push(this.player.body);
                bodies = bodies.concat(this.player.colliders);
            }
            else if ((obj.properties || {}).isGoal) {
                let body = Bodies.rectangle(obj.x + obj.width/2, obj.y + obj.height/2, obj.width, obj.height, {isStatic: true, friction: 0.2, chamfer: { radius: 25 },});
                body.render.strokeStyle = "#0cc824";
                body.render.lineWidth = 40;
                body.render.fillStyle = "#000";
                body.isGoal = true;
                bodies.push(body);
            }
            else if ((obj.properties || {}).noClimb) {
                let body = Bodies.rectangle(obj.x + obj.width/2, obj.y + obj.height/2, obj.width, obj.height, {isStatic: true, friction: 0.0, chamfer: { radius: 25 },});
                body.render.strokeStyle = "#05eafa";
                body.render.lineWidth = 40;
                body.noClimb = true;
                bodies.push(body);
            }
            else if ((obj.properties || {}).lava) {
                let body = Bodies.rectangle(obj.x + obj.width/2, obj.y + obj.height/2, obj.width, obj.height, {isStatic: true, isSensor:true, friction: 0.0, chamfer: { radius: 25 },});
                body.render.strokeStyle = "#fa1505";
                body.render.lineWidth = 40;
                body.render.fillStyle = "#fa1505";
                body.isLava = true;
                bodies.push(body);
            }
            else if ((obj.properties || {}).fake) {
                let body = Bodies.rectangle(obj.x + obj.width/2, obj.y + obj.height/2, obj.width, obj.height, {isStatic: true, isSensor:true, friction: 0.0, chamfer: { radius: 25 },});
                body.render.lineWidth = 40;
                body.render.strokeStyle = body.render.fillStyle;
                body.fake = true;
                bodies.push(body);
            }
            else {
                let body = Bodies.rectangle(obj.x + obj.width/2, obj.y + obj.height/2, obj.width, obj.height, {isStatic: true, friction: 0.2, chamfer: { radius: 25 },});
                body.isWall = true;
                body.render.lineWidth = 40;
                body.render.strokeStyle = body.render.fillStyle;
                bodies.push(body);
            }
        }


        // add all of the bodies to the world
        World.add(engine.world, bodies);
    }
}