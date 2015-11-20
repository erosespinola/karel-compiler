const orientation = [
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0}
];

var RuntimeErrors = {
    wall_at_position: "Karel can't pass through a wall",
    no_beeper_at_position: "There are no beepers at this position",
    no_remaining_beepers: "Karel has no beepers to drop"

};

var speed = 500;

var changeSpeed = function(range) {
    speed = 1001 - range * 100;
}

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
    executions: null,
    evaluate: function(interCode, world) {
        console.log(interCode);

        world = _.cloneDeep(world);
        canvas.reset(world, world.karel);

        this.executions = [{
            counter: 0,
            callStack: [],
            counters: [],
            karel: world.karel[0]
        }];

        this.run(interCode, world);
    },
    run: function(intercode, world) {
        var running = false;
        _.each(this.executions, function (execution, i) {
            var karelRunning = this.evaluateStep(execution, world, execution.karel);

            running |= karelRunning;

            if (!karelRunning) {
                // Kill i's children
            }
        }, this);

        canvas.drawKarel(_.map(this.executions, function (d) { return d.karel; }));

        if (running) {
            setTimeout(function() {
                evaluator.run(interCode, world);
            }, speed);
        }
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

            // printWorld(world, karel);
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
                    execution.counters.push(interCode[execution.counter+1]);
                    execution.counter += 2;
                    continue;

                case INTERCODE_KEYS.DECJMP:
                    if (--execution.counters[execution.counters.length - 1] === 0) {
                        execution.counter += 2;
                        execution.counters.pop();
                    } else {
                        execution.counter = interCode[execution.counter+1];
                    }
                    continue;
                case INTERCODE_KEYS.MOVE:
                    karel.x += karel.orientation.x;
                    karel.y += karel.orientation.y;

                    if (world.grid[karel.y][karel.x].w) {
                        this.throwRuntimeError(RuntimeErrors.wall_at_position);
                    }
                    break;

                case INTERCODE_KEYS.TURN_LEFT:
                    console.log('TURN LEFT');
                    karel.orientationIndex = (((karel.orientationIndex - 1) % 4) + 4) % 4;
                    karel.orientation = orientation[karel.orientationIndex];
                    break;

                case INTERCODE_KEYS.PICK_BEEPER:
                    if (world.grid[karel.y][karel.x].b === 0) {
                        this.throwRuntimeError(RuntimeErrors.no_beeper_at_position);
                    } else {
                        world.grid[karel.y][karel.x].b--;
                        karel.beepers++;
                        karel.interactedWithBeeper = true;
                        canvas.setBeepers(karel.x, karel.y, world.grid[karel.y][karel.x].b);
                    }
                    
                    break;

                case INTERCODE_KEYS.PUT_BEEPER:
                    if (karel.beepers > 0) {
                        world.grid[karel.y][karel.x].b++;
                        karel.interactedWithBeeper = true;
                        canvas.setBeepers(karel.x, karel.y, world.grid[karel.y][karel.x].b);
                    } else {
                        this.throwRuntimeError(RuntimeErrors.no_remaining_beepers);
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

                case INTERCODE_KEYS.WHILE:
                    var operatorStack = [];
                    var conditionalStack = [];
                    var element = null;
                    var operator = null;

                    do {
                        element = interCode[++execution.counter];
                        if (element === INTERCODE_KEYS.AND || element === INTERCODE_KEYS.OR || element === INTERCODE_KEYS.NOT) {
                            operatorStack.push(element);
                        } else {
                            conditionalStack.push(this.evaluateCondition(execution, element, world, karel));
                        }
                    } while (interCode[execution.counter + 1] !== 'JMP');

                    while (operatorStack.length > 0) {
                        operator = operatorStack.pop();
                        if (operator === 'NOT') {
                            conditionalStack.push(!conditionalStack.pop());
                        } else if (operator === 'AND') {
                            conditionalStack.push(conditionalStack.pop() && conditionalStack.pop());
                        } else if (operator === 'OR') {
                            conditionalStack.push(conditionalStack.pop() || conditionalStack.pop());
                        }
                    }
                    
                    console.log(conditionalStack[0]);
                    if (conditionalStack.pop()) {
                        execution.counter += 2;
                    }
                    
                    break;

                case INTERCODE_KEYS.TURN_OFF:
                    execution.counter = interCode.length;
                    break;
            }

            execution.counter++;
            finished_step = true;
        }

        return execution.counter < interCode.length;
    },
    throwRuntimeError: function(error) {
        $("#errors").text("Runtime Error: " + error);
        console.log(error);
        throw new Error(error);
    }
};