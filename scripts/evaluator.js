const orientation = [
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0}
];

var printWorld = function(world, karel){
    console.log(karel.beepers, karel.orientation.x, karel.orientation.y);

    for (var i = 0; i < world.rows; i++) {
        var line = '';
        for (var j = 0; j < world.cols; j++) {
            if (karel.x === j && karel.y === i) {
                line += 'K';
            } else if (world.grid[i][j].b > 0) {
                line += world.grid[i][j].b;
            } else if (world.grid[i][j].w) {
                line += '#';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
}

evaluator = {
    speed: 250,
    evaluate: function(interCode, world) {
        console.log(interCode);

        world = _.cloneDeep(world);

        execution = {
            counter: 0,
            callStack: [],
            counters: []
        };

        karelExecutions = [execution];

        this.evaluateStep(execution, world, world.karel[0], function () {

            _.each(karelExecutions, function (ex) {

            });
        });
    },
        evaluateCondition: function(execution, conditional, world, karel){
        switch (conditional) {
            case INTERCODE_KEYS.FRONT_IS_CLEAR:
                var frontX = karel.x + karel.orientation.x;
                var frontY = karel.y + karel.orientation.y;
                return !world.grid[frontY][frontX].w;

            case INTERCODE_KEYS.FRONT_IS_BLOCKED:
                return !this.evaluateCondition(execution, INTERCODE_KEYS.FRONT_IS_CLEAR, world, karel);

            case INTERCODE_KEYS.LEFT_IS_CLEAR:
                var orientationIndex = (((karel.orientationIndex - 1) % 4) + 4) % 4;
                var frontX = karel.x + orientation[orientationIndex].x;
                var frontY = karel.y + orientation[orientationIndex].y;
                return !world.grid[frontY][frontX].w;

            case INTERCODE_KEYS.LEFT_IS_BLOCKED:
                return !this.evaluateCondition(execution, INTERCODE_KEYS.LEFT_IS_CLEAR, world, karel);

            case INTERCODE_KEYS.RIGHT_IS_CLEAR:
                var orientationIndex = (((karel.orientationIndex + 1) % 4) + 4) % 4;
                var frontX = karel.x + orientation[orientationIndex].x;
                var frontY = karel.y + orientation[orientationIndex].y;
                return !world.grid[frontY][frontX].w;

            case INTERCODE_KEYS.RIGHT_IS_BLOCKED:
                return !this.evaluateCondition(execution, INTERCODE_KEYS.RIGHT_IS_CLEAR, world, karel);

            case INTERCODE_KEYS.NEXT_TO_A_BEEPER:
                return (world.grid[karel.y][karel.x].b > 0);

            case INTERCODE_KEYS.NOT_NEXT_TO_A_BEEPER:
                return !this.evaluateCondition(execution, INTERCODE_KEYS.NEXT_TO_A_BEEPER, world, karel);

            case INTERCODE_KEYS.ANY_BEEPERS_IN_BEEPER_BAG:
                return (karel.beepers > 0);

            case INTERCODE_KEYS.NOT_ANY_BEEPERS_IN_BEEPER_BAG:
                return (karel.beepers === 0);

            case INTERCODE_KEYS.FACING_NORTH:
                return (karel.orientationIndex === 0);

            case INTERCODE_KEYS.FACING_EAST:
                return (karel.orientationIndex === 1);

            case INTERCODE_KEYS.FACING_SOUTH:
                return (karel.orientationIndex === 2);

            case INTERCODE_KEYS.FACING_WEST:
                return (karel.orientationIndex === 3);

            case INTERCODE_KEYS.NOT_FACING_NORTH:
                return !this,evaluateCondition(execution, INTERCODE_KEYS.FACING_NORTH, world, karel);

            case INTERCODE_KEYS.NOT_FACING_EAST:
                return !this,evaluateCondition(execution, INTERCODE_KEYS.FACING_EAST, world, karel);

            case INTERCODE_KEYS.NOT_FACING_SOUTH:
                return !this,evaluateCondition(execution, INTERCODE_KEYS.FACING_SOUTH, world, karel);

            case INTERCODE_KEYS.NOT_FACING_WEST:
                return !this,evaluateCondition(execution, INTERCODE_KEYS.FACING_WEST, world, karel);
        }
    },
    evaluateStep: function(execution, world, karel) {
        var op = interCode[execution.counter],
            finished_step = false;
        
        while (!finished_step){
            var op = interCode[execution.counter];

            printWorld(world, karel);
            console.log(op);

            switch (op) {
                case INTERCODE_KEYS.JMP:
                    execution.counter = interCode[execution.counter+1];
                    continue;

                case INTERCODE_KEYS.CALL:
                    execution.callStack.push(execution.counter+2);
                    execution.counter = interCode[execution.counter+1];
                    continue;

                case INTERCODE_KEYS.RET:
                    execution.counter = execution.callStack.pop();
                    continue;

                case INTERCODE_KEYS.ITE:
                    execution.counters[interCode[execution.counter+1]] = interCode[execution.counter+2];
                    execution.counter += 3;
                    continue;

                case INTERCODE_KEYS.DECJMP:
                    if (--execution.counters[interCode[execution.counter+1]] === 0) {
                        execution.counter += 3;
                    } else {
                        execution.counter = interCode[execution.counter+2];
                    }
                    continue;
                case INTERCODE_KEYS.MOVE:
                    karel.x += karel.orientation.x;
                    karel.y += karel.orientation.y;

                    if (world.grid[karel.y][karel.x].w) {
                        console.log('WALL');
                    }
                    break;

                case INTERCODE_KEYS.TURN_LEFT:
                    console.log('TURN LEFT');
                    karel.orientationIndex = (((karel.orientationIndex - 1) % 4) + 4) % 4;
                    karel.orientation = orientation[karel.orientationIndex];
                    break;

                case INTERCODE_KEYS.PICK_BEEPER:
                    if (world.grid[karel.y][karel.x].b === 0) {
                        console.log('NO BEEPERS!');
                    } else {
                        world.grid[karel.y][karel.x].b--;
                        karel.beepers++;
                    }
                    break;

                case INTERCODE_KEYS.PUT_BEEPER:
                    if (karel.beepers > 0) {
                        world.grid[karel.y][karel.x].b++;
                    } else {
                        console.log('NO BEEPERS!');
                    }
                    break;

                case INTERCODE_KEYS.IF:
                    if (interCode[execution.counter + 1] === 'NOT') {
                        if (!this.evaluateCondition(execution, interCode[execution.counter + 2], world, karel)){
                            execution.counter += 4;
                        } else {
                            execution.counter += 2;
                        }
                    } else if (interCode[execution.counter + 1] === 'AND' || interCode[execution.counter + 1] === 'OR') {
                        execution.counter++;
                    } else {
                        if (this.evaluateCondition(execution, interCode[execution.counter + 1], world, karel)) {
                            execution.counter += 3;
                        } else {
                            execution.counter += 1;
                        }
                    }
                    break;

                case INTERCODE_KEYS.AND:
                    // result = this.evaluateCondition(execution.counter, interCode[execution.counter + 1]) && this.evaluateCondition(execution.counter, interCode[execution.counter + 2]);
                    var result = false;
                    if (interCode[execution.counter + 1] === 'NOT') {
                        result = !this.evaluateCondition(execution, interCode[execution.counter + 2], world, karel);

                        if (interCode[execution.counter + 3] === 'NOT') {
                            result = result && !this.evaluateCondition(execution, interCode[execution.counter + 4], world, karel);
                            execution.counter = (result) ? execution.counter + 7 : execution.counter + 5;

                        } else {
                            result = result && this.evaluateCondition(execution, interCode[execution.counter + 3], world, karel);
                            execution.counter = (result) ? execution.counter + 6 : execution.counter + 4;
                        }
                    } else {
                        result = this.evaluateCondition(execution, interCode[execution.counter + 1], world, karel);

                        if (interCode[execution.counter + 2] === 'NOT') {
                            result = result && !this.evaluateCondition(execution, interCode[execution.counter + 3], world, karel);
                            execution.counter = (result) ? execution.counter + 6 : execution.counter + 4;

                        } else {
                            result = result && this.evaluateCondition(execution, interCode[execution.counter + 2], world, karel);
                            execution.counter = (result) ? execution.counter + 5 : execution.counter + 3;
                        }
                    }
                    break;

                case INTERCODE_KEYS.OR:
                    var conditionals = 0;
                    var conditionalStack = [];

                    while (conditionals < 2) {

                        if (interCode[++execution.counter] !== 'NOT') {
                            conditionals++;
                            conditionalStack.push(this.evaluateCondition(execution, interCode[execution.counter], world, karel));

                        } else {
                            conditionalStack.push(interCode[execution.counter]);
                        }
                    }
                    
                    var tmpStack = [];
                    var currentElement = null;
                    
                    while (conditionalStack > 0) {
                        currentElement = conditionalStack.pop();

                        if (currentElement === 'NOT') {
                            tmpStack.push(!tmpStack.pop());

                        } else if (currentElement === 'OR') {
                            tmpStack.push(tmpStack.pop() || tmpStack.pop());

                        } else {
                            tmpStack.push(currentElement);
                        }
                    }

                    if (tmpStack.pop()) {
                        execution.counter += 3;
                    } else {
                        execution.counter++;
                    }
                    break;

                case INTERCODE_KEYS.TURN_OFF:
                    return;
            }

            execution.counter++;
            finished_step = true;
        }

        canvas.drawBeepers(world);
        canvas.drawKarel([karel]);

        if (execution.counter < interCode.length) {
            setTimeout(function() {
                evaluator.evaluateStep(execution, world, karel);
            }, this.speed);
        }
    }
};