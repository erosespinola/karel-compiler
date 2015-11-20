canvas = {
    stage: null,
    renderer: null,
    currentKarels: null,
    karelSprites: [],
    tileSize: 32,
    beeperSprites: [],
    textSprites: [],
    currentBeepers: {},

    assets: [
        'img/player1.png', 
        'img/grass.png', 
        'img/misc1.png', 
        'img/misc2.png', 
        'img/beeper.png', 
        'img/wall.png'
    ],

    grassTexture: null,
    miscTexture1: null,
    miscTexture2: null,
    beeperTexture: null,
    wallTexture: null,
    playerTexture: null,

    playerSprite: null,

    karelAdded: false,

    init: function (loadedCallback) {
        this.renderer = new PIXI.autoDetectRenderer(
            555, 
            500, 
            {
                view: document.getElementById('canvas'),
                backgroundColor: 0x1099bb 
            });

        this.stage = new PIXI.Container();

        // this.stage.setInteractive(true);
        // this.stage.on('click', function(a) {
        //     console.log('asadas', a);
        // });

        window.addEventListener('resize', this.onResize);
        this.onResize();

        this.currentKarels = [{
            x: 0,
            y: 0,
            orientation: {
                x: 0,
                y: -1
            }
        }];

        var loader = PIXI.loader
            .add('player1', 'img/player1.png')
            .add('grass', 'img/grass.png')
            .add('misc1', 'img/misc1.png')
            .add('misc2', 'img/misc2.png')
            .add('beeper', 'img/beeper.png')
            .add('wall', 'img/wall.png')
            .load(function (loader, resources) {
                canvas.grassTexture = resources['grass'].texture;
                canvas.miscTexture1 = resources['misc1'].texture;
                canvas.miscTexture2 = resources['misc2'].texture;
                canvas.beeperTexture = resources['beeper'].texture;
                canvas.wallTexture = resources['wall'].texture;
                canvas.playerTexture = resources['player1'].texture;

                var frames = getFramesFromSpriteSheet(canvas.playerTexture, 32, 32);

                canvas.playerSprite = new PlayerSprite(frames);

                requestAnimationFrame(canvas.animate);

                if (loadedCallback) {
                    loadedCallback();
                }
            })
    },

    reset: function(world, karel) {
        canvas.drawBeepers(world);
        canvas.drawKarel([karel], true);
    },

    drawWorld: function(world, karel) {
        var graphics = new PIXI.Graphics();

        graphics.beginFill(0x88ffbb);
        graphics.lineStyle(1, 0x88ffbb);

        for (var i = 0; i < world.rows; i++) {
            for (var j = 0; j < world.cols; j++) {
                var sprite = new PIXI.Sprite(this.grassTexture);
                
                sprite.position.y = i * this.tileSize;
                sprite.position.x = j * this.tileSize;
                
                this.stage.addChild(sprite);
            }
        }

        for (var i = 0; i < world.rows; i++) {
            for (var j = 0; j < world.cols; j++) {
                if (chance.bool({likelihood: 4})) {
                    var sprite = new PIXI.Sprite(chance.pick([
                        this.miscTexture1, 
                        this.miscTexture2
                    ]));

                    sprite.position.y = i * this.tileSize;
                    sprite.position.x = j * this.tileSize;
                    
                    this.stage.addChild(sprite);
                }
            }
        }

        // Draw grid
        for (var i = 0; i < world.rows; i++) {
            graphics.moveTo(0, i * this.tileSize);
            graphics.lineTo(world.cols * this.tileSize, i * this.tileSize);
        }

        for (var i = 0; i < world.cols; i++) {
            graphics.moveTo(i * this.tileSize, 0);
            graphics.lineTo(i * this.tileSize, world.rows * this.tileSize);
        }

        this.drawWalls(world);
        this.drawBeepers(world);

        this.stage.addChild(graphics);
        this.stage.addChild(this.playerSprite);

        this.drawKarel(karel, true);
    },

    setBeepers: function(x, y, newBeepers) {
        var key = x + ' ' + y,
            beeperObject = this.currentBeepers[key],
            newBeepers = newBeepers || 0;

        if (!beeperObject) {
            this.currentBeepers[key] = beeperObject = { sprite: null, text: null, count: 0 };
        }

        beeperObject.count = newBeepers;

        if (beeperObject.count <= 0) {
            if (beeperObject.text) {
                this.stage.removeChild(beeperObject.text);
                beeperObject.text = null;
            }
            if (beeperObject.sprite) {
                this.stage.removeChild(beeperObject.sprite);
                beeperObject.sprite = null;
            }
        }
        else if (beeperObject.count === 1) {
            if (beeperObject.text) {
                this.stage.removeChild(beeperObject.text);
                beeperObject.text = null;
            }

            if (!beeperObject.sprite) {
                beeperObject.sprite = new PIXI.Sprite(this.beeperTexture);

                beeperObject.sprite.position.y = y * this.tileSize;
                beeperObject.sprite.position.x = x * this.tileSize;

                this.stage.addChild(beeperObject.sprite);
            }
        }
        else if (beeperObject.count > 1) {
            if (!beeperObject.sprite) {
                beeperObject.sprite = new PIXI.Sprite(this.beeperTexture);

                beeperObject.sprite.position.y = y * this.tileSize;
                beeperObject.sprite.position.x = x * this.tileSize;

                this.stage.addChild(beeperObject.sprite);
            }

            if (beeperObject.text) {
                beeperObject.text = beeperObject.count;
            }
            else {
                beeperObject.text = new PIXI.Text(beeperObject.count, { font: 'bold ' + this.tileSize / 2.0 + 'px Arial', fill: 'red' });

                beeperObject.text.position.x = beeperObject.sprite.position.x + this.tileSize / 2.0 - beeperObject.text.width / 2.0;
                beeperObject.text.position.y = beeperObject.sprite.position.y + this.tileSize / 2.0 - beeperObject.text.height / 2.0;

                this.stage.addChild(beeperObject.text);
            }
        }
    },

    drawBeepers: function(world) {
        for (var i = 0; i < world.rows; i++) {
            for (var j = 0; j < world.cols; j++) {
                this.setBeepers(j, i, world.grid[i][j].b);
            }
        }
    },

    drawWalls: function(world) {
        for (var i = 0; i < world.rows; i++) {
            for (var j = 0; j < world.cols; j++) {
                if (world.grid[i][j].w) {
                    var wall = new PIXI.Sprite(this.wallTexture);

                    wall.position.y = i * this.tileSize;
                    wall.position.x = j * this.tileSize;

                    this.stage.addChild(wall);
                }
            }
        }
    },

    drawKarel: function(karel, skipAnimation) {
        // REVISIT: Clean draw of all the karels, optimize?
        // _.each(this.karelSprites, function(sprite) {
        //     canvas.stage.removeChild(sprite);
        // });

        _.each(karel, function(k) {
            // var sprite;

            canvas.playerSprite.animationSpeed = 1.0 / speed * 100;

            var new_x = k.x * canvas.tileSize,
                new_y = k.y * canvas.tileSize;

            if (skipAnimation) {
                canvas.playerSprite.position.x = new_x;
                canvas.playerSprite.position.y = new_y;

                if (_.isMatch(k.orientation, {x: 0, y: -1}))
                    canvas.playerSprite.gotoAndStop(8);
                else if (_.isMatch(k.orientation, {x: 1, y: 0}))
                    canvas.playerSprite.gotoAndStop(24);
                else if (_.isMatch(k.orientation, {x: 0, y: 1}))
                    canvas.playerSprite.gotoAndStop(0);
                else if (_.isMatch(k.orientation, {x: -1, y: 0}))
                    canvas.playerSprite.gotoAndStop(16);
            }
            else if (
                Math.abs(new_x - canvas.playerSprite.position.x) > canvas.tileSize / 2.0 || 
                Math.abs(new_y - canvas.playerSprite.position.y) > canvas.tileSize / 2.0) {

                new TWEEN.Tween(canvas.playerSprite.position)
                    .to({ x: new_x, y: new_y }, speed)
                    .start();

                if (_.isMatch(k.orientation, {x: 0, y: -1}))
                    canvas.playerSprite.playRange(9, 15);
                else if (_.isMatch(k.orientation, {x: 1, y: 0}))
                    canvas.playerSprite.playRange(25, 31);
                else if (_.isMatch(k.orientation, {x: 0, y: 1}))
                    canvas.playerSprite.playRange(1, 7);
                else if (_.isMatch(k.orientation, {x: -1, y: 0}))
                    canvas.playerSprite.playRange(17, 23);
            }
            else {
                if (_.isMatch(k.orientation, {x: 0, y: -1}))
                    canvas.playerSprite.gotoAndStop(8);
                else if (_.isMatch(k.orientation, {x: 1, y: 0}))
                    canvas.playerSprite.gotoAndStop(24);
                else if (_.isMatch(k.orientation, {x: 0, y: 1}))
                    canvas.playerSprite.gotoAndStop(0);
                else if (_.isMatch(k.orientation, {x: -1, y: 0}))
                    canvas.playerSprite.gotoAndStop(16);
            }

            // canvas.karelSprites.push(sprite);
            // canvas.stage.addChild(sprite);
        });
    },

    animate: function (time) {
        requestAnimationFrame(canvas.animate);

        TWEEN.update(time);

        // render the container
        canvas.renderer.render(canvas.stage);
    },

    onResize: function () {
        canvas.renderer.resize($('#canvas-container').width(), 450);
    }
};
 
function getFramesFromSpriteSheet(texture, frameWidth, frameHeight) {
    var frames = [];
 
    for (var j = 0; j < texture.height; j += frameHeight) {
        for (var i = 0; i < texture.width; i += frameWidth) {
            frames.push(new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(i, j, frameWidth, frameHeight)));
        }
    }
 
    return frames;
}