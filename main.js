var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;

function main() {
    // module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Constraint = Matter.Constraint,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Body = Matter.Body;

    // create an engine
    var engine = Engine.create();

    // create a renderer
    var render = Render.create({
        element: document.body,
        engine: engine
    });

    // create two boxes and a ground
    var boxA = Bodies.rectangle(400, 200, 80, 80, {friction: 0});
    var boxB = Bodies.rectangle(450, 50, 80, 80, {friction: 0});
    var ground = Bodies.rectangle(400, 610, 810, 60, {isStatic: true, friction: 0});

    var player = Composite.create();
    Composite.add( player, boxA );
    Composite.add( player, boxB );
    Composite.add( player, Constraint.create({
        bodyA: boxA,
        bodyB: boxB,
        stiffness: 0.01,
        damping: 0
    }));

    var blockStack = Composites.stack(100, 200, 1, 8, 10, 10, function(x, y) {
        return Bodies.rectangle(x, y, 50, 50);
    });

    // add all of the bodies to the world
    World.add(engine.world, [blockStack, player, ground]);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    document.onkeydown = function (e) {
        e = e || window.event;
        console.log('PRESS', e.keyCode);
        switch(e.keyCode) {
            case UP:
                console.log('PRESS UP');
                Body.applyForce( boxA, {x: boxA.position.x, y: boxA.position.y}, {x: 0, y: -0.1});
                break;
            case LEFT:
                console.log('PRESS LEFT');
                Body.applyForce( boxA, {x: boxA.position.x, y: boxA.position.y}, {x: -0.1, y: 0});
                break;
            case RIGHT:
                console.log('PRESS RIGHT');
                Body.applyForce( boxA, {x: boxA.position.x, y: boxA.position.y}, {x: 0.1, y: 0});
                break;
        }
        if (e.keyCode === UP) {

        }
    };

    console.log('END');
}
