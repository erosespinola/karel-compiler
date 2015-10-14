
var fileReader = require('./file-reader');
var lexicography = require('./lexicography');

console.log(lexicography.getTokens(fileReader.readFile('inputs/input.txt')));