// Self-contained object to render canvas

canvas = {
    stage: null,
    renderer: null,
    karelSprites: {},
    tileSize: 32,
    karelColors: 8,
    currentBeepers: {},

    worldContainer: null,
    beeperContainer: null,

    karelFrames: [],

    grassTexture: null,
    beeperTexture: null,
    wallTexture: null,

    // 
    init: function (loadedCallback) {
        this.renderer = new PIXI.autoDetectRenderer(
            555, 
            500, 
            {
                view: document.getElementById('canvas'),
                backgroundColor: 0x1099bb 
            });

        this.stage = new PIXI.Container();

        this.beeperContainer = new PIXI.Container();
        this.worldContainer = new PIXI.Container();

        this.stage.addChild(this.worldContainer);
        this.stage.addChild(this.beeperContainer);

        window.addEventListener('resize', this.onResize);
        this.onResize();

        var loader = PIXI.loader
            .add('player1', 'img/player1.png')
            .add('player2', 'img/player2.png')
            .add('player3', 'img/player3.png')
            .add('player4', 'img/player4.png')
            .add('player5', 'img/player5.png')
            .add('player6', 'img/player6.png')
            .add('player7', 'img/player7.png')
            .add('player8', 'img/player8.png')
            .add('grass', 'img/grass.png')
            .add('beeper', 'img/beeper.png')
            .add('wall', 'img/wall.png')
            .load(function (loader, resources) {
                canvas.grassTexture = resources['grass'].texture;
                canvas.beeperTexture = resources['beeper'].texture;
                canvas.wallTexture = resources['wall'].texture;

                canvas.karelFrames.push(getFramesFromSpriteSheet(resources['player1'].texture, 32, 32));
                canvas.karelFrames.push(getFramesFromSpriteSheet(resources['player2'].texture, 32, 32));
                canvas.karelFrames.push(getFramesFromSpriteSheet(resources['player3'].texture, 32, 32));
                canvas.karelFrames.push(getFramesFromSpriteSheet(resources['player4'].texture, 32, 32));
                canvas.karelFrames.push(getFramesFromSpriteSheet(resources['player5'].texture, 32, 32));
                canvas.karelFrames.push(getFramesFromSpriteSheet(resources['player6'].texture, 32, 32));
                canvas.karelFrames.push(getFramesFromSpriteSheet(resources['player7'].texture, 32, 32));
                canvas.karelFrames.push(getFramesFromSpriteSheet(resources['player8'].texture, 32, 32));

                requestAnimationFrame(canvas.animate);

                if (loadedCallback) {
                    loadedCallback();
                }
            })
    },

    reset: function(world, karel) {
        _.each(this.karelSprites, function(k, i) {
            if (i != 0) {
                this.stage.removeChild(k);
            }
        }, this);

        canvas.drawBeepers(world);
        canvas.drawKarel(karel, true);
    },

    drawWorld: function(world, karel) {
        var graphics = new PIXI.Graphics();

        graphics.beginFill(0x88ffbb);
        graphics.lineStyle(1, 0x88ffbb);

        // Draw the grass tiles
        for (var i = 0; i < world.rows; i++) {
            for (var j = 0; j < world.cols; j++) {
                var sprite = new PIXI.Sprite(this.grassTexture);
                
                sprite.position.y = i * this.tileSize;
                sprite.position.x = j * this.tileSize;
                
                this.worldContainer.addChild(sprite);
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

        this.worldContainer.addChild(graphics);

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

        // Beepers were removed
        if (beeperObject.count <= 0) {
            if (beeperObject.text) {
                this.beeperContainer.removeChild(beeperObject.text);
                beeperObject.text = null;
            }
            if (beeperObject.sprite) {
                this.beeperContainer.removeChild(beeperObject.sprite);
                beeperObject.sprite = null;
            }
        }
        // One beeper was added, no text required
        else if (beeperObject.count === 1) {
            if (beeperObject.text) {
                this.beeperContainer.removeChild(beeperObject.text);
                beeperObject.text = null;
            }

            if (!beeperObject.sprite) {
                beeperObject.sprite = new PIXI.Sprite(this.beeperTexture);

                beeperObject.sprite.position.y = y * this.tileSize;
                beeperObject.sprite.position.x = x * this.tileSize;

                this.beeperContainer.addChild(beeperObject.sprite);
            }
        }
        // More than one beeper added, requires text
        else if (beeperObject.count > 1) {
            if (!beeperObject.sprite) {
                beeperObject.sprite = new PIXI.Sprite(this.beeperTexture);

                beeperObject.sprite.position.y = y * this.tileSize;
                beeperObject.sprite.position.x = x * this.tileSize;

                this.beeperContainer.addChild(beeperObject.sprite);
            }

            if (beeperObject.text) {
                beeperObject.text.text = beeperObject.count;
            }
            else {
                beeperObject.text = new PIXI.Text(beeperObject.count, { font: 'bold ' + this.tileSize / 2.0 + 'px Arial', fill: 'red' });

                beeperObject.text.position.x = beeperObject.sprite.position.x + this.tileSize / 2.0 - beeperObject.text.width / 2.0;
                beeperObject.text.position.y = beeperObject.sprite.position.y + this.tileSize / 2.0 - beeperObject.text.height / 2.0;

                this.beeperContainer.addChild(beeperObject.text);
            }
        }
    },

    // Redraw all the beepers in the map
    drawBeepers: function(world) {
        for (var i = 0; i < world.rows; i++) {
            for (var j = 0; j < world.cols; j++) {
                this.setBeepers(j, i, world.grid[i][j].b);
            }
        }
    },

    // Draw all the walls 
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

    // Draw an array of Karels, animate the movements 
    drawKarel: function(karel, skipAnimation) {
        _.each(karel, function(k) {
            var id = k.id;

            var new_x = k.x * this.tileSize,
                new_y = k.y * this.tileSize;

            // Sprite hasn't been added yet, add it to the world
            if (!k.added) {
                this.karelSprites[id] = new PlayerSprite(this.karelFrames[id % this.karelColors]);
                this.karelSprites[id].position.x = new_x;
                this.karelSprites[id].position.y = new_y;
                this.stage.addChild(this.karelSprites[id]);
                k.added = true;
            }

            var sprite = this.karelSprites[id];

            // Sprite has been destroyed already
            if (!sprite) return;

            // Animation speed varies according to the speed slider
            sprite.animationSpeed = 1.0 / speed * 100;

            // Play pick beeper animation if required
            if (k.interactedWithBeeper) {
                k.interactedWithBeeper = false;

                if (_.isMatch(k.orientation, {x: 0, y: -1}) || _.isMatch(k.orientation, {x: 1, y: 0}))
                    sprite.playRange(40, 47);
                else
                    sprite.playRange(32, 39);
                
                sprite.onComplete = function() {
                    if (_.isMatch(k.orientation, {x: 0, y: -1}))
                    sprite.gotoAndStop(8);
                    else if (_.isMatch(k.orientation, {x: 1, y: 0}))
                        sprite.gotoAndStop(24);
                    else if (_.isMatch(k.orientation, {x: 0, y: 1}))
                        sprite.gotoAndStop(0);
                    else if (_.isMatch(k.orientation, {x: -1, y: 0}))
                        sprite.gotoAndStop(16);

                    sprite.onComplete = null;
                };
            }
            // Skip animation for insta-teleportation
            else if (skipAnimation) {
                sprite.position.x = new_x;
                sprite.position.y = new_y;

                if (_.isMatch(k.orientation, {x: 0, y: -1}))
                    sprite.gotoAndStop(8);
                else if (_.isMatch(k.orientation, {x: 1, y: 0}))
                    sprite.gotoAndStop(24);
                else if (_.isMatch(k.orientation, {x: 0, y: 1}))
                    sprite.gotoAndStop(0);
                else if (_.isMatch(k.orientation, {x: -1, y: 0}))
                    sprite.gotoAndStop(16);
            }
            // Amnimate a movement and rotate sprite to the correct position
            else if (
                Math.abs(new_x - sprite.position.x) > this.tileSize / 2.0 || 
                Math.abs(new_y - sprite.position.y) > this.tileSize / 2.0) {

                new TWEEN.Tween(sprite.position)
                    .to({ x: new_x, y: new_y }, speed)
                    .start();

                if (_.isMatch(k.orientation, {x: 0, y: -1}))
                    sprite.playRange(9, 15);
                else if (_.isMatch(k.orientation, {x: 1, y: 0}))
                    sprite.playRange(25, 31);
                else if (_.isMatch(k.orientation, {x: 0, y: 1}))
                    sprite.playRange(1, 7);
                else if (_.isMatch(k.orientation, {x: -1, y: 0}))
                    sprite.playRange(17, 23);
            }
            else {
                if (_.isMatch(k.orientation, {x: 0, y: -1}))
                    sprite.gotoAndStop(8);
                else if (_.isMatch(k.orientation, {x: 1, y: 0}))
                    sprite.gotoAndStop(24);
                else if (_.isMatch(k.orientation, {x: 0, y: 1}))
                    sprite.gotoAndStop(0);
                else if (_.isMatch(k.orientation, {x: -1, y: 0}))
                    sprite.gotoAndStop(16);
            }
        }, this);
    },

    // Remove a karel sprite
    turnoffKarel: function (id) {
        if (id !== 0 && this.karelSprites[id]) {
            this.stage.removeChild(this.karelSprites[id]);
            delete this.karelSprites[id];
        }
    },

    // Play the animation loop
    animate: function (time) {
        requestAnimationFrame(canvas.animate);

        TWEEN.update(time);

        // render the container
        canvas.renderer.render(canvas.stage);
    },

    // Resize the canvas in case the container size changed
    onResize: function () {
        canvas.renderer.resize($('#canvas-container').width(), 450);
    }
};
 
// Read the individual sprites off a spritesheet
function getFramesFromSpriteSheet(texture, frameWidth, frameHeight) {
    var frames = [];
 
    for (var j = 0; j < texture.height; j += frameHeight) {
        for (var i = 0; i < texture.width; i += frameWidth) {
            frames.push(new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(i, j, frameWidth, frameHeight)));
        }
    }
 
    return frames;
}