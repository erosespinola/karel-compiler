
var fileReader = require('./file-reader');
var lexicography = require('./lexicography');
var analizer = require('./syntax-analizer');

var file = fileReader.readFile('inputs/input.txt');
var tokens = lexicography.getTokens(file);

console.log(tokens);

var values = analizer.parse(tokens);

console.log(values);