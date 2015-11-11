const orientation = [
        {x: 0, y: -1},
        {x: 1, y: 0},
        {x: 0, y: 1},
        {x: -1, y: 0}
    ];

var printWorld = function(world){
    console.log(world.karel.beepers, world.karel.orientation.x, world.karel.orientation.y);
    for (var i = 0; i < world.rows; i++) {
        var line = '';
        for (var j = 0; j < world.cols; j++) {
            if (world.karel.x === j && world.karel.y === i) {
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
    world: null,
    evaluate: function(interCode, world) {
        console.log(interCode);

        var counter = 0;
        var callStack = [];
        var iterateCounters = [];

        this.world = world;

        while (counter < interCode.length){
            printWorld(this.world);

            var op = interCode[counter];
            switch (op) {
                case INTERCODE_KEYS.JMP:
                    counter = interCode[counter+1];
                    continue;

                case INTERCODE_KEYS.CALL:
                    callStack.push(counter+2);
                    counter = interCode[counter+1];
                    continue;

                case INTERCODE_KEYS.RET:
                    counter = callStack.pop();
                    continue;

                case INTERCODE_KEYS.ITE:
                    iterateCounters[interCode[counter+1]] = interCode[counter+2];
                    counter += 3;
                    continue;

                case INTERCODE_KEYS.DECJMP:
                    if (--iterateCounters[interCode[counter+1]] === 0) {
                        counter += 3;
                    } else {
                        counter = interCode[counter+2];
                    }
                    continue;
                case INTERCODE_KEYS.MOVE:
                    this.world.karel.x += this.world.karel.orientation.x;
                    this.world.karel.y += this.world.karel.orientation.y;

                    if (this.world.grid[this.world.karel.y][this.world.karel.x].w) {
                        console.log("WALL");
                    }
                    break;

                case INTERCODE_KEYS.TURN_LEFT:
                    console.log("TURN LEFT");
                    this.world.karel.orientationIndex = (((this.world.karel.orientationIndex - 1) % 4) + 4) % 4;
                    this.world.karel.orientation = orientation[this.world.karel.orientationIndex];
                    break;

                case INTERCODE_KEYS.PICK_BEEPER:
                    if (this.world.grid[this.world.karel.y][this.world.karel.x].b === 0) {
                        console.log("NO BEEPERS!");
                    } else {
                        this.world.grid[this.world.karel.y][this.world.karel.x].b--;
                        this.world.karel.beepers++;
                    }
                    break;

                case INTERCODE_KEYS.PUT_BEEPER:
                    if (this.world.karel.beepers > 0) {
                        this.world.grid[this.world.karel.y][this.world.karel.x].b++;
                    } else {
                        console.log("NO BEEPERS!");
                    }
                    break;

                case INTERCODE_KEYS.TURN_OFF:
                    return;
            }

            counter++;
        }
    },
    evaluateCondition: function(conditional){
        switch (conditional) {
            case INTERCODE_KEYS.FRONT_IS_CLEAR:
                var frontX = this.world.karel.x + this.world.karel.orientation.x;
                var frontY = this.world.karel.y + this.world.karel.orientation.y;
                return !this.world.grid[frontY][frontY].w;

            case INTERCODE_KEYS.LEFT_IS_CLEAR:
                var orientationIndex = (((this.world.karel.orientationIndex - 1) % 4) + 4) % 4;
                var frontX = this.world.karel.x + orientation[orientationIndex].x;
                var frontY = this.world.karel.y + orientation[orientationIndex].y;
                return !this.world.grid[frontY][frontY].w;

            case INTERCODE_KEYS.LEFT_IS_BLOCKED:
                return !this.evaluateCondition(INTERCODE_KEYS.LEFT_IS_CLEAR);

            case INTERCODE_KEYS.RIGHT_IS_CLEAR:
                var orientationIndex = (((this.world.karel.orientationIndex + 1) % 4) + 4) % 4;
                var frontX = this.world.karel.x + orientation[orientationIndex].x;
                var frontY = this.world.karel.y + orientation[orientationIndex].y;
                return !this.world.grid[frontY][frontY].w;

            case INTERCODE_KEYS.RIGHT_IS_BLOCKED:
                return !this.evaluateCondition(INTERCODE_KEYS.RIGHT_IS_CLEAR);

            case INTERCODE_KEYS.NEXT_TO_A_BEEPER:
                for (var i = this.world.karel.y - 1; i <= this.world.karel.y + 1 ) {
                    for (var j = this.world.karel.x; j <= this.world.karel.x; j++) {
                        if (this.world.grid[i].b > 0 && i !== this.world.karel.y && j !== this.world.karel.x) {
                            return true;
                        }
                    }
                }
                return false;

            case INTERCODE_KEYS.NOT_NEXT_TO_A_BEEPER:
                return !this.evaluateCondition(INTERCODE_KEYS.NEXT_TO_A_BEEPER);

            case INTERCODE_KEYS.ANY_BEEPERS_IN_BEEPERS_BAG:
                return (this.world.karel.beepers > 0);

            case INTERCODE_KEYS.NOT_ANY_BEEPERS_IN_BEEPERS_BAG:
                return (this.world.karel.beepers === 0);

            case INTERCODE_KEYS.FACING_NORTH:
                return (this.world.karel.orientationIndex === 0);

            case INTERCODE_KEYS.FACING_EAST:
                return (this.world.karel.orientationIndex === 1);

            case INTERCODE_KEYS.FACING_SOUTH:
                return (this.world.karel.orientationIndex === 2);

            case INTERCODE_KEYS.FACING_WEST:
                return (this.world.karel.orientationIndex === 3);

            case INTERCODE_KEYS.NOT_FACING_NORTH:
                return !this,evaluateCondition(INTERCODE_KEYS.FACING_NORTH);

            case INTERCODE_KEYS.NOT_FACING_EAST:
                return !this,evaluateCondition(INTERCODE_KEYS.FACING_EAST);

            case INTERCODE_KEYS.NOT_FACING_SOUTH:
                return !this,evaluateCondition(INTERCODE_KEYS.FACING_SOUTH);

            case INTERCODE_KEYS.NOT_FACING_WEST:
                return !this,evaluateCondition(INTERCODE_KEYS.FACING_WEST);
        }
    }
};