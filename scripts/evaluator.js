const NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3;


var printWorld = function(world){
    console.log(world.karel.beepers, world.karel.orientation);
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
    evaluate: function(interCode, world) {
        console.log(interCode);

        var counter = 0;
        var callStack = [];
        var iterateCounters = [];

        while (counter < interCode.length){
            printWorld(world);

            var op = interCode[counter];
            switch(op){
                case 'JMP':
                    counter = interCode[counter+1];
                    continue;

                case 'CALL':
                    callStack.push(counter+2);
                    counter = interCode[counter+1];
                    continue;

                case 'RET':
                    counter = callStack.pop();
                    continue;

                case 'ITE':
                    iterateCounters[interCode[counter+1]] = interCode[counter+2];
                    counter += 3;
                    continue;

                case 'DJNZ':
                    if (--iterateCounters[interCode[counter+1]] === 0) {
                        counter += 3;
                    } else {
                        counter = interCode[counter+2];
                    }
                    continue;

                case 'move':
                    switch (world.karel.orientation) {
                        case NORTH:
                            world.karel.y--;
                            break
                        case EAST:
                            world.karel.x++;
                            break;
                        case SOUTH:
                            world.karel.y++;
                            break;
                        case WEST:
                            world.karel.x--;
                            break;
                    }

                    if (world.grid[world.karel.y][world.karel.x].w) {
                        console.log("WALL");
                    }
                    break;

                case 'turnleft':
                    world.karel.orientation = (((world.karel.orientation-1) % 4) + 4) % 4;
                    break;

                case 'pickbeeper':
                    if (world.grid[world.karel.y][world.karel.x].b === 0) {
                        console.log("NO BEEPERS!");
                    }
                    else {
                        world.grid[world.karel.y][world.karel.x].b--;
                        world.karel.beepers++;
                    }
                    break;

                case 'turnoff':
                    return;
            }

            counter++;
        }
    }
};