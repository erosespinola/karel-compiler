
var fileReader = require('./file-reader');
var lexicography = require('./lexicography');
var analyzer = require('./syntax-analyzer');

var file = fileReader.readFile('inputs/input.txt');
var tokens = lexicography.getTokens(file);

console.log(tokens);

var values = analyzer.parse(tokens);

console.log(values);