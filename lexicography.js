var fileReader = require('./file-reader');

const LETTER = 0, DIGIT = 1, PUNCTUATION = 2, PIPE = 3, AMPERSAND = 4, ERROR = 5, WHITESPACE = 6;
const NEXT = 0,  TNEW = 1, SKIP = 2;
const VALID_STATES = [1, 2, 3];

const STATES = [[1, 3, 2, 4, 5, 6, 0],
				[1, 6, 2, 4, 5, 6, 0],
				[1, 3, 2, 4, 5, 6, 0],
				[6, 3, 2, 6, 6, 6, 0],
				[6, 6, 6, 2, 6, 6, 6],
				[6, 6, 6, 6, 2, 6, 6],
				[0, 0, 0, 0, 0, 5, 0]];

const TRANSITIONS = [[SKIP, SKIP, SKIP, SKIP, SKIP, SKIP, SKIP],
					 [TNEW, NEXT, TNEW, NEXT, TNEW, TNEW, NEXT],
					 [TNEW, TNEW, TNEW, TNEW, NEXT, NEXT, NEXT],
					 [TNEW, NEXT, TNEW, NEXT, NEXT, NEXT, NEXT],
					 [NEXT, NEXT, NEXT, NEXT, NEXT, NEXT, NEXT],
					 [NEXT, NEXT, NEXT, NEXT, NEXT, NEXT, NEXT],
					 [TNEW, TNEW, TNEW, TNEW, TNEW, NEXT, TNEW]];

var map = function(char) {
	if (char.match(/[{}\(\)!]/))
		return PUNCTUATION;
	else if (char.match(/([a-zA-Z])/))
		return LETTER;
	else if (char.match(/[0-9]/))
		return DIGIT;
	else if (char.match(/[&]/))
		return AMPERSAND;
	else if (char.match(/[|]/))
		return PIPE;
	else if (char.match(/\s/))
		return WHITESPACE;
	return ERROR;
}

var type = function(token, state) {
	var types = { 1: "ALPHABETIC", 3: "NUMBER", 6: "INVALID" };
	if (state === 2) {
		var punctuations = { "{": "OPENING BRACE",
							 "}": "CLOSING BRACE",
							 "(": "OPENING PARENTHESIS", 
							 ")": "CLOSING PARENTHESIS",
							 "!": "NOT",
							 "&&": "AND",
							 "||": "OR" };
		return punctuations[token];
	}
	return types[state];
}

exports.getTokens = function(program) {
	var currentState = 0;
	var tokens = [];
	var tokenIndex = 0;

	for (var i = 0; i < program.length; i++) {
		var nextState = STATES[currentState][map(program[i])];

		switch(TRANSITIONS[currentState][nextState]) {
			case NEXT:
				break;
			case TNEW:
				var currentToken = program.substring(tokenIndex, i);
				tokens.push({ text: currentToken, type: type(currentToken, currentState) });
				tokenIndex = i;
				break;
			case SKIP:
				tokenIndex = i;
				break;
		}

		currentState = nextState;
	};

	return tokens;
};