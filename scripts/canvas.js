canvas = {
    stage: null,
    renderer: null,
    currentKarels: null,
    karelSprites: [],

    init: function (world, karel) {
        this.renderer = new PIXI.WebGLRenderer(
            800, 
            600, 
            { 
                backgroundColor : 0x1099bb 
            });

        document.body.appendChild(this.renderer.view);

        this.stage = new PIXI.Container();

        var texture = PIXI.Texture.fromImage('img/link.gif');

        for (var i = 0; i < 10; i++) {
            karelSprites[i] = new PIXI.Sprite(texture);
            stage.addChild(karelSprites[i]);
        }

        currentKarels = [karel];

        requestAnimationFrame(animate);
    },

    step: function (karels, speed) {
        if (karels.constructor !== Array) {
            karels = [karels];
        }

        karels = _.deepCopy(karels);

        // _.each(karels, function (karel, i) {
        //     new TWEEN.tween()
        // });

        currentKarels = karels;
    },

    draw: function () {
        _.each(karels, function (karel, i) {
            karel.position
        });
    },

    animate: function (time) {
        requestAnimationFrame(animate);

        TWEEN.update(time);

        // render the container
        this.renderer.render(stage);
    }
}