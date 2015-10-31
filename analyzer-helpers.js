var tokens;
var currentToken = 0;
var symbolTable = {};

exports.setTokens = function(tks) {
    tokens = tks;
};

exports.read = function(token) {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken].text === token;
};

exports.require = function(token) {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken++].text === token;
};

exports.ifRead = function(token) {
    if (exports.read(token)) {
        currentToken++;
        return true;
    }
    return false;
};

exports.fetchToken = function() {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken++].text;
};

exports.addNewFunction = function(name, index) {
    symbolTable[name] = index;
};

exports.findStartPointOfFunction = function(name) {
    if (symbolTable.hasOwnProperty(name)) return symbolTable[name];
    return '0xFF';
};

exports.peekCurrentToken = function() {
    if (currentToken >= tokens.length) return false;

    return tokens[currentToken];
};

exports.lookAhead = function(n) {
    if (currentToken + n >= tokens.length) return {text: null};

    return tokens[currentToken + n];
}