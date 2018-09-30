// key codes
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var SPACE = 32;

// game states
var state = 0;
var STATE_MENU = 0;
var STATE_PLAY = 1;
var STATE_WIN = 2;
var STATE_DIE = 3;

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
var levelLoader;

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

var WIDTH = 2000;
var HEIGHT = 2000;

var frameDeltas = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var lastFrameTS = 0;

var NUM_LEVELS = 7;
var CURR_LEVEL = 6;


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

function loadCurrLevel() {
    World.clear(this.engine.world);
    player = new Player({ engine: engine });
    levelLoader.player = player;
    levelLoader.load('level' + CURR_LEVEL);
}

function startFromMenu() {
    CURR_LEVEL = parseInt($('#levelSelect').val());
    toState(STATE_PLAY);
}

function toMenu() {
    toState(STATE_MENU);
}

function toNextLevel() {
    CURR_LEVEL++;
    toState(STATE_PLAY);
}

function toState(newState) {
    let oldState = state;

    // to menu
    if (newState === STATE_MENU) {
        $('#menucontainer').show();
    }
    // win level
    else if (state === STATE_PLAY && newState === STATE_WIN) {
        if (CURR_LEVEL !== NUM_LEVELS) {
            $('#nextlvlcontainer').show();
        }
        else {
            $('#wincontainer').show();
        }
    }
    // start nxt level
    else if (newState === STATE_PLAY) {
        state = newState;

        $('.lvloverlay').hide();
        $('#' + CURR_LEVEL).show();
        $('.overlay').hide();
        loadCurrLevel();
    }
    else {
        throw('Unhandled state transition');
    }
}

function main() {
    engine = Engine.create();
    render = Render.create({
        element: $('.container')[0],
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
    player = new Player({ engine: engine });

    levelLoader = new LevelLoader({ engine: engine, player: player });
    levelLoader.load('level' + CURR_LEVEL);

    Render.run(render);

    // var customRenderer = new Renderer({ levelLoader: levelLoader, player: player, width: WIDTH, height: HEIGHT });
    // customRenderer.init();
    // Events.on(render, 'afterRender', () => {
    //     customRenderer.update();
    // });

    // game loop
    function draw(){
        // display fps
        frameDeltas.unshift((Date.now() - lastFrameTS)/1000);
        frameDeltas.pop();
        lastFrameTS = Date.now();
        var fpsAvg = 1 / (frameDeltas.reduce((a,b) => a + b) / frameDeltas.length);
        document.getElementById("fps").innerHTML = String(Math.floor(fpsAvg));

        // logic

        if (state === STATE_PLAY) {
            if (!levelLoader.isLoading && !player.win) {
                player.update();
                Engine.update(engine, 1000/60, 1);

                if (player.dead && (Date.now() - player.deathTS > 3000)) {
                    loadCurrLevel(levelLoader);
                    player.dead = false;
                }
            }
            else if (player.win) {
                toState(STATE_WIN);

            }
            else if (levelLoader.crashed) {
                console.log('Exiting');
                return;
            }
        }



        // loop!
        requestAnimationFrame(draw);
    }
    draw();
}
