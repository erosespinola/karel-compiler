canvas = {
    stage: null,
    renderer: null,
    currentKarels: null,
    karelSprites: [],
    tileSize: 32,
    beeperSprites: [],

    linkNorthTexture: PIXI.Texture.fromImage('img/link_north.png'),
    linkSouthTexture: PIXI.Texture.fromImage('img/link_south.png'),
    linkEastTexture: PIXI.Texture.fromImage('img/link_east.png'),
    linkWestTexture: PIXI.Texture.fromImage('img/link_west.png'),
    grassTexture: PIXI.Texture.fromImage('img/grass.png'),
    beeperTexture: PIXI.Texture.fromImage('img/beeper.png'),
    wallTexture: PIXI.Texture.fromImage('img/wall.png'),

    init: function () {
        this.renderer = new PIXI.autoDetectRenderer(
            555, 
            500, 
            {
                view: document.getElementById('canvas'),
                backgroundColor: 0x1099bb 
            });

        this.stage = new PIXI.Container();

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

        requestAnimationFrame(this.animate);
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

    draw: function () {
        _.each(karels, function (karel, i) {
            // karel.position
        });
    },

    drawWorld: function(world, karel) {
        for (var i = 0; i < world.rows; i++) {
            for (var j = 0; j < world.cols; j++) {
                var sprite = new PIXI.Sprite(this.grassTexture);
                
                sprite.position.y = i * this.tileSize;
                sprite.position.x = j * this.tileSize;
                
                this.stage.addChild(sprite);
            }
        }

        this.drawWalls(world);
        this.drawBeepers(world);
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
        _.each(this.karelSprites, function(sprite) {
            canvas.stage.removeChild(sprite);
        });

        _.each(karel, function(k) {
            var sprite;

            if (_.isMatch(k.orientation, {x: 0, y: -1}))
                sprite = new PIXI.Sprite(canvas.linkNorthTexture);
            else if (_.isMatch(k.orientation, {x: 1, y: 0}))
                sprite = new PIXI.Sprite(canvas.linkEastTexture);
            else if (_.isMatch(k.orientation, {x: 0, y: 1}))
                sprite = new PIXI.Sprite(canvas.linkSouthTexture);
            else if (_.isMatch(k.orientation, {x: -1, y: 0}))
                sprite = new PIXI.Sprite(canvas.linkWestTexture);

            sprite.position.x = k.x * canvas.tileSize;
            sprite.position.y = k.y * canvas.tileSize;

            canvas.karelSprites.push(sprite);
            canvas.stage.addChild(sprite);
        });
    },

    animate: function (time) {
        requestAnimationFrame(canvas.animate);

        TWEEN.update(time);

        // render the container
        canvas.renderer.render(canvas.stage);
    },

    onResize: function () {
        canvas.renderer.resize($('#canvas-container').width(), 500);
    }
}