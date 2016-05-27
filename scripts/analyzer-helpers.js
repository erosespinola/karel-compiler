var tokens;         // tokens list
var currentToken;   // current token index
var symbolTable;    // represent symbol table

helper = {};

/* Init class variables */
helper.init = function(tks) {
    tokens = tks;
    currentToken = 0;
    symbolTable = {};
};

/* Checks if the current token is like the given one */
helper.read = function(token) {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken].text === token;
};

/* Checks if the current token is like the given one
    and moves to the following token */
helper.require = function(token) {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken++].text === token;
};

/* Checks if the current token is like the given one
    if so moves to the following token */
helper.ifRead = function(token) {
    if (helper.read(token)) {
        currentToken++;
        return true;
    }
    return false;
};

/* Returns the current token and moves to the following
    token */
helper.fetchToken = function() {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken++].text;
};

/* Adds a function with the given name and the given memory
    address to the symbol table*/
helper.addNewFunction = function(name, index) {
    symbolTable[name] = index;
};

/* Returns the memory address of the given function name if
    it exists, if not returns 0xFF */
helper.findStartPointOfFunction = function(name) {
    if (symbolTable.hasOwnProperty(name)) return symbolTable[name];
    return '0xFF';
};

/* Returns current token */
helper.peekCurrentToken = function() {
    if (currentToken >= tokens.length) return false;
    return tokens[currentToken];
};

/* Returns token in current position plus n given positions */
helper.lookAhead = function(n) {
    if (currentToken + n >= tokens.length) return {text: null};
    return tokens[currentToken + n];
};

/* Returns current token */
helper.getCurrentToken = function () {
    if (currentToken >= tokens.length) return tokens[tokens.length - 1];
    return tokens[currentToken];
};
/* Returns current token -2 */
helper.getCurrentTokenForError = function () {
    var errorToken = currentToken -2;
    if (errorToken >= tokens.length) return tokens[tokens.length - 1];
    if (errorToken < 0 ) return tokens[0];
    return tokens[errorToken];
};
