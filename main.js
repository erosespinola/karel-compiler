
var fileReader = require('./file-reader');
var lexicography = require('./lexicography');
var rec_desc = require('./rec-desc');

var file = fileReader.readFile('inputs/input.txt');
var tokens = lexicography.getTokens(file);
var values = rec_desc.parse(tokens);

console.log(values);