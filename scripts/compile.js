
var compile = function(editor) {
    var tokens = lexicographic.getTokens(editor.getSession().getValue());
    var intercode = syntax.parse(tokens);
    evaluator.evaluate(
        intercode,
        {
            "rows": 6,
            "cols": 6,
            "karel": {
                "x": 1,
                "y": 2,
                "beepers": 0,
                "orientationIndex": 3,
                "orientation": {
                    x: 1,
                    y: 0
                }
            },
            "grid": [
                [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
                [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": true, "b": 0}, {"w": false, "b": 1}, {"w": false, "b": 0}],
                [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": false, "b": 0}],
                [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
                [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
                [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}]
            ]
        }
    );
};