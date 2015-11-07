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
    }]).
    controller('KarelIntercodeControllers', ['$scope', 'storage', function($scope, storage) {
        if (!!storage.get('karelIntercodeProgram')) {
            $scope.program = storage.get('karelIntercodeProgram');
        }

        $scope.compile = function () {
            storage.set('karelIntercodeProgram', $scope.program);

            console.log($scope.program);
            var intercode; //scope.program

            /*evaluator.evaluate(
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
                });*/
        }
    }]);