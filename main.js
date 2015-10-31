
var fileReader = require('./file-reader');
var lexicography = require('./lexicography');
var analyzer = require('./syntax-analyzer');
var evaluator = require('./evaluator');

var file = fileReader.readFile('inputs/input.txt');
var tokens = lexicography.getTokens(file);

var intercode = analyzer.parse(tokens);
var world = evaluator.init('inputs/world.json');
evaluator.evaluate(intercode, world);
