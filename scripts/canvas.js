canvas = {
    stage: null,
    renderer: null,
    currentKarels: null,
    karelSprites: [],

    init: function () {
        this.renderer = new PIXI.autoDetectRenderer(
            555, 
            500, 
            {
                view: document.getElementById('canvas'),
                backgroundColor: 0x1099bb 
            });

        this.stage = new PIXI.Container();

        var texture = PIXI.Texture.fromImage('img/link.gif');

        window.addEventListener('resize', this.onResize);
        this.onResize();

        for (var i = 0; i < 10; i++) {
            this.karelSprites[i] = new PIXI.Sprite(texture);
            this.stage.addChild(this.karelSprites[i]);
        }

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

    step: function (karels, speed) {
        karels = _.deepCopy(karels);

        // _.each(karels, function (karel, i) {
        //     new TWEEN.tween()
        // });

        this.currentKarels = karels;
    },

    draw: function () {
        _.each(karels, function (karel, i) {
            // karel.position
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