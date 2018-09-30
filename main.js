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

var frameDeltas = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var lastFrameTS = 0;


function convertRange( value, r1, r2 ) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

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
    levelLoader.load('level4');

    Render.run(render);

    // game loop
    function draw(){
        // display fps
        frameDeltas.unshift((Date.now() - lastFrameTS)/1000);
        frameDeltas.pop();
        lastFrameTS = Date.now();
        var fpsAvg = 1 / (frameDeltas.reduce((a,b) => a + b) / frameDeltas.length);
        document.getElementById("fps").innerHTML = String(Math.floor(fpsAvg));

        // logic
        if (!levelLoader.isLoading && !player.win) {
            player.update();
            Engine.update(engine, 1000/60, 1);
        }
        else if (player.win) {
            console.log('You win!');
            return;
        }
        else if (levelLoader.crashed) {
            console.log('Exiting');
            return;
        }

        // loop!
        requestAnimationFrame(draw);
    }
    draw();
}
