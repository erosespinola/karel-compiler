var tokens;
var currentToken;
var symbolTable;

helper = {};

helper.setTokens = function(tks) {
    tokens = tks;

    currentToken = 0;
    symbolTable = {};
};

helper.read = function(token) {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken].text === token;
};

helper.require = function(token) {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken++].text === token;
};

helper.ifRead = function(token) {
    if (helper.read(token)) {
        currentToken++;
        return true;
    }
    return false;
};

helper.fetchToken = function() {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken++].text;
};

helper.addNewFunction = function(name, index) {
    symbolTable[name] = index;
};

helper.findStartPointOfFunction = function(name) {
    if (symbolTable.hasOwnProperty(name)) return symbolTable[name];
    return '0xFF';
};

helper.peekCurrentToken = function() {
    if (currentToken >= tokens.length) return false;

    return tokens[currentToken];
};

helper.lookAhead = function(n) {
    if (currentToken + n >= tokens.length) return {text: null};

    return tokens[currentToken + n];
}