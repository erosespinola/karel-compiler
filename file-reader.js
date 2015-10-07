var readFile = function(filename){
	fs = require('fs');
	var data = fs.readFileSync(filename, 'utf8');
	return data.split(/\n/);
}

readFile('inputs/input.txt');