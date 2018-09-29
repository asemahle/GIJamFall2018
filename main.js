// key codes
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var SPACE = 32;

// game states
var state = 0;
var STATE_DEBUG = 0;
var STATE_LOAD_LEVEL = 1;

// input state
var Inp = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
};

var player;
var render;
var engine;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Body = Matter.Body,
    Bounds = Matter.Bounds,
    Events = Matter.Events;

var WIDTH = 1600;
var HEIGHT = 1600;

function initInput() {
    document.onkeydown = function (e) {
        e = e || window.event;
        switch(e.keyCode) {
            case UP:
                Inp.up = true;
                break;
            case LEFT:
                Inp.left = true;
                break;
            case RIGHT:
                Inp.right = true;
                break;
            case DOWN:
                Inp.down = true;
                break;
            case SPACE:
                Inp.space = true;
                break;
        }
    };
    document.onkeyup = function (e) {
        e = e || window.event;
        switch(e.keyCode) {
            case UP:
                Inp.up = false;
                break;
            case LEFT:
                Inp.left = false;
                break;
            case RIGHT:
                Inp.right = false;
                break;
            case DOWN:
                Inp.down = false;
                break;
            case SPACE:
                Inp.space = false;
                break;
        }
    }
}

function main() {
    engine = Engine.create();
    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: WIDTH,
            height: HEIGHT,
            hasBounds: true,
            wireframes: false,
            background: '#111'
        }
    });


    initInput();
    var player = new Player({ engine: engine });

    var levelLoader = new LevelLoader({ engine: engine, player: player });
    levelLoader.load('tiletest2');

    Render.run(render);

    // game loop
    function draw(){
        if (!levelLoader.isLoading) {
            player.update();
            Engine.update(engine, 1000/60, 1);
        }
        else if (levelLoader.crashed) {
            console.log('Exiting');
            return;
        }

        requestAnimationFrame(draw);
    }
    draw();
}
