const orientation = [
        {x: 0, y: -1},
        {x: -1, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 0}
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
            printWorld(world);

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
                    world.karel.x += world.karel.orientation.x;
                    world.karel.y += world.karel.orientation.y;

                    if (world.grid[world.karel.y][world.karel.x].w) {
                        console.log("WALL");
                    }
                    break;

                case INTERCODE_KEYS.TURN_LEFT:
                    console.log("TURN LEFT");
                    world.karel.orientationIndex = (((world.karel.orientationIndex + 1) % 4) + 4) % 4;
                    world.karel.orientation = orientation[world.karel.orientationIndex];
                    break;
                case INTERCODE_KEYS.PICK_BEEPER:
                    if (world.grid[world.karel.y][world.karel.x].b === 0) {
                        console.log("NO BEEPERS!");
                    } else {
                        world.grid[world.karel.y][world.karel.x].b--;
                        world.karel.beepers++;
                    }
                    break;
                case INTERCODE_KEYS.PUT_BEEPER:
                    if (world.karel.beepers > 0) {
                        world.grid[world.karel.y][world.karel.x].b++;
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
    evaluateCondition: function(token){
        switch (token) {
            case 'frontIsClear':
                if (world.grid[world.karel.y][world.karel.x].w) {
                    return false;
                } else {
                    return true;
                }
                break;
        }
    }
};