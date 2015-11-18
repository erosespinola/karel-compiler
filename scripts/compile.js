var world = {
    "rows": 16,
    "cols": 9,
    "karel": [{
        "x": 1,
        "y": 2,
        "beepers": 0,
        "orientationIndex": 1,
        "orientation": {
            x: 1,
            y: 0
        }
    }],
    "grid": [
        [{"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}],
        [{"w": true, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": true, "b": 0}, {"w": false, "b": 1}, {"w": true, "b": 0}],
        [{"w": true, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}],
        [{"w": true, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": true, "b": 0}],
        [{"w": true, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": true, "b": 0}],
        [{"w": true, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": true, "b": 0}],
        [{"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}],
        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}]
    ]
};

canvas.init();
canvas.drawWorld(world, world.karel);

var compile = function(editor) {
    var program = editor.getSession().getValue();
    var tokens = lexicographic.getTokens(program);
    var intercode = syntax.parse(tokens);

    localStorage.setItem('karelProgram', program);

    evaluator.evaluate(
        intercode,
        world
    );
};