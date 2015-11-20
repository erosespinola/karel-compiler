canvas = {
    stage: null,
    renderer: null,
    currentKarels: null,
    karelSprites: [],
    tileSize: 32,
    beeperSprites: [],

    assets: [
        'img/player1.png', 
        'img/grass.png', 
        'img/misc1.png', 
        'img/misc2.png', 
        'img/beeper.png', 
        'img/wall.png'
    ],

    // linkNorthTexture: PIXI.Texture.fromImage('img/link_north.png'),
    // linkSouthTexture: PIXI.Texture.fromImage('img/link_south.png'),
    // linkEastTexture: PIXI.Texture.fromImage('img/link_east.png'),
    // linkWestTexture: PIXI.Texture.fromImage('img/link_west.png'),
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

    // step: function (karels) {
    //     karels = _.deepCopy(karels);

    //     _.each(karels, function (karel, i) {
    //         canvas.karelSprites[i].position.x = karels[i].x * canvas.tileSize;
    //         canvas.karelSprites[i].position.y = karels[i].y * canvas.tileSize;
    //         //new TWEEN.tween()
    //     });

    //     this.currentKarels = karels;
    // },

    drawWorld: function(world, karel) {
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

        this.drawWalls(world);
        this.drawBeepers(world);

        this.stage.addChild(this.playerSprite);

        this.drawKarel(karel);
    },

    drawBeepers: function(world) {
        // REVISIT: Clean draw of all the beepers, optimize?
        _.each(this.beeperSprites, function(sprite) {
            canvas.stage.removeChild(sprite);
        });

        for (var i = 0; i < world.rows; i++) {
            for (var j = 0; j < world.cols; j++) {
                if (world.grid[i][j].b > 0) {
                    var beeper = new PIXI.Sprite(this.beeperTexture);

                    beeper.position.y = i * this.tileSize;
                    beeper.position.x = j * this.tileSize;

                    this.beeperSprites.push(beeper);

                    this.stage.addChild(beeper);
                }
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

    drawKarel: function(karel) {
        // REVISIT: Clean draw of all the karels, optimize?
        // _.each(this.karelSprites, function(sprite) {
        //     canvas.stage.removeChild(sprite);
        // });

        _.each(karel, function(k) {
            // var sprite;

            canvas.playerSprite.animationSpeed = 1.0 / speed * 100;

            var new_x = k.x * canvas.tileSize,
                new_y = k.y * canvas.tileSize;

            if (Math.abs(new_x - canvas.playerSprite.position.x) > canvas.tileSize / 2.0 || 
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