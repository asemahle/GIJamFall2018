class Renderer {
    constructor(params) {
        this.levelLoader = params.levelLoader;
        this.player = params.player;
        this.width = params.width;
        this.height = params.height;

        this.tilesLoaded = false;
        this.canvas = null;
        this.ctx = null;
        this.tiledata = null;
    }

    init() {
        var img = new Image();
        img.src = 'sprites.png';
        this.canvas = document.getElementById('hidden');
        this.ctx = canvas.getContext('2d');

        console.log('Loading tiles');
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            img.style.display = 'none';

            this.tiledata = [];
            for (let y = 0; y < 9; y++) {
                for (let x = 0; x < 9; x++) {
                    tiledata.push( this.ctx.getImageData(x * 32, y * 32, (x+1) * 32, (y+1) * 32) );
                }
            }

            this.tilesLoaded = true;
            console.log('Tiles loaded');
        };
    }

    update() {
        if (this.tilesLoaded && this.levelLoader.data != null) {
            let tw = this.levelLoader.data.layers[0].width;
            let th = this.levelLoader.data.layers[0].height;

            for (let tile of this.levelLoader.data.layers[0].data) {

            }
        }
    }
}