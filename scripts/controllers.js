angular.module('KarelApp.controllers', []).
    controller('KarelControllers', ['$scope', function($scope) {

        $scope.compile = function () {
            var tokens = lexicographic.getTokens($scope.program);

            var intercode = syntax.parse(tokens);

            // console.log(intercode);

            evaluator.evaluate(
                intercode,
                {
                    "rows": 6,
                    "cols": 6,
                    "karel": {
                        "x": 1,
                        "y": 2,
                        "beepers": 0,
                        "orientation": 1
                    },
                    "grid": [
                        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
                        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": true, "b": 0}, {"w": false, "b": 1}, {"w": false, "b": 0}],
                        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": true, "b": 0}, {"w": true, "b": 0}, {"w": false, "b": 0}],
                        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
                        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}],
                        [{"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}, {"w": false, "b": 0}]
                    ]
                });
        }
    }]);