const LETTER = 0, DIGIT = 1, PUNCTUATION = 2, PIPE = 3, AMPERSAND = 4, OTHER = 5;
const VALID_STATES = [1, 2, 3];
const STATES = [[1, 3, 2, 4, 5, 6],
				[1, 6, 6, 6, 6, 6],
				[6, 6, 6, 6, 6, 6],
				[6, 3, 6, 6, 6, 6],
				[6, 6, 6, 2, 6, 6],
				[6, 6, 6, 6, 2, 6],
				[6, 6, 6, 6, 6, 6]];

var map = function(char) {
	if (char.match(/[{}\[\]!]/))
		return PUNCTUATION;
	else if (char.match(/([a-zA-Z])/))
		return LETTER;
	else if (char.match(/[0-9]/))
		return DIGIT;
	else if (char.match(/[&]/))
		return AMPERSAND;
	else if (char.match(/[|]/))
		return PIPE;
	return OTHER;
}

var type = function(token, state) {
	var types = { 1: "ALPHABETIC", 3: "NUMBER" };
	if (state === 2) {
		var punctuations = { "{": "OPENING BRACE",
							 "}": "CLOSING BRACE",
							 "[": "OPENING SQUARE BRACKET", 
							 "]": "CLOSING SQUARE BRACKET",
							 "!": "NOT",
							 "&&": "AND",
							 "||": "OR" };
		return punctuations[token];
	}
	return types[state];
}

var getTokenState = function(token) {
	var currentState = 0;
	for (var i = 0; i < token.length; i++) {
		if (currentState === 6)
			return currentState;
		currentState = STATES[currentState][map(token[i])];
	};

	return currentState;
};

var getTokens = function(lines) {
	tokens = [];
	lines.forEach(function(line) {
		line.split(" ").forEach(function(token) {
			var state = getTokenState(token);
			if (VALID_STATES.indexOf(state) > -1)
				tokens.push({ token: token, valid: true, type: type(token, state) });
			else
				tokens.push({ token: token, valid: false, type: "NON VALID" });
		});
	});

	return tokens;
};

console.log(getTokens(["hola dude", "&&", "1235", "%"]));