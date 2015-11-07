angular.module('KarelApp.controllers', []).
    controller('KarelControllers', ['$scope', 'storage', function($scope, storage) {
        if (!!storage.get('karelProgram')) {
            $scope.program = storage.get('karelProgram');
        }

        $scope.compile = function () {
            storage.set('karelProgram', $scope.program);

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
                });
        }
    }]);