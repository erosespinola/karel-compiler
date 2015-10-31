var fileReader = require('./file-reader');

const NORTH = 0, EAST = 1, SOUTH = 2, WEST = 3;

var counter = 0;
var callstack = [];

exports.init = function(filename){
	return JSON.parse( fileReader.readFile(filename) );
}

var printWorld = function(world){
	console.log(world.karel);
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

exports.evaluate = function(intercode, world){
	console.log(intercode);

	while(counter < intercode.length){
		var op = intercode[counter];
		switch(op){
			case 'JMP':
				counter = intercode[counter+1];
				continue;
			case 'CALL':
				// Code...
				break
			case 'move':
				switch(world.karel.orientation){
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
				if (world.grid[world.karel.y][world.karel.x].w){
					console.log("WALL");
				}
				break;
			case 'turnleft':
				world.karel.orientation = (((world.karel.orientation-1) % 4) + 4) % 4;
				break;
			case 'pickbeeper':
				if (world.grid[world.karel.y][world.karel.x].b === 0){
					console.log("NO BEEPERS!");
				}
				else{
					world.grid[world.karel.y][world.karel.x].b--;
					world.karel.beepers++;
				}
				break;
			case 'turnoff':
				return;
		}
		printWorld(world);
		counter++;
	}
};