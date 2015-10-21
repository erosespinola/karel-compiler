var tokens;
var interCode = [];
var interCodeIndex = 0;
var currentToken = 0;

const OR = 1, AND = 2, NOT = 3;

exports.parse = function(ts) {
	tokens = ts;
	conditional();
	return interCode;
};

var simpleConditional = function() {
	if (read("frontIsClear")) {
		interCode[interCodeIndex++] = "frontIsClear";
		currentToken++;
	}
	else if (read("frontIsBlocked")) {
		interCode[interCodeIndex++] = "frontIsBlocked";
		currentToken++;
	}
	else if (read("leftIsClear")) {
		interCode[interCodeIndex++] = "leftIsClear";
		currentToken++;
	}
	else if (read("leftIsBlocked")) {
		interCode[interCodeIndex++] = "leftIsBlocked";
		currentToken++;
	}
	else if (read("rightIsClear")) {
		interCode[interCodeIndex++] = "rightIsClear";
		currentToken++;
	}
	else if (read("rightIsBlocked")) {
		interCode[interCodeIndex++] = "rightIsBlocked";
		currentToken++;
	}
	else if (read("nextToABeeper")) {
		interCode[interCodeIndex++] = "nextToABeeper";
		currentToken++;
	}
	else if (read("notNextToABeeper")) {
		interCode[interCodeIndex++] = "notNextToABeeper";
		currentToken++;
	}
	else if (read("anyBeepersInBeeperBag")) {
		interCode[interCodeIndex++] = "anyBeepersInBeeperBag";
		currentToken++;
	}
	else if (read("noBeepersInBeeperBag")) {
		interCode[interCodeIndex++] = "noBeepersInBeeperBag";
		currentToken++;
	}
	else if (read("facingNorth")) {
		interCode[interCodeIndex++] = "facingNorth";
		currentToken++;
	}
	else if (read("facingSouth")) {
		interCode[interCodeIndex++] = "facingSouth";
		currentToken++;
	}
	else if (read("facingEast")) {
		interCode[interCodeIndex++] = "facingEast";
		currentToken++;
	}
	else if (read("facingWest")) {
		interCode[interCodeIndex++] = "facingWest";
		currentToken++;
	}
	else if (read("notFacingNorth")) {
		interCode[interCodeIndex++] = "notFacingNorth";
		currentToken++;
	}
	else if (read("notFacingSouth")) {
		interCode[interCodeIndex++] = "notFacingSouth";
		currentToken++;
	}
	else if (read("notFacingEast")) {
		interCode[interCodeIndex++] = "notFacingEast";
		currentToken++;
	}
	else if (read("notFacingWest")) {
		interCode[interCodeIndex++] = "notFacingWest";
		currentToken++;
	}
	else {
		console.log({ "error": "Not a valid simple conditional" });
	} 
};

var isSimpleConditional = function() {
	return 
	 read("frontIsClear") ||
	 read("leftIsClear") ||
	 read("leftIsBlocked") ||
	 read("rightIsClear") ||
	 read("rightIsBlocked") ||
	 read("nextToABeeper") ||
	 read("notNextToABeeper") ||
	 read("anyBeepersInBeeperBag") ||
	 read("noBeepersInBeeperBag") ||
	 read("facingNorth") ||
	 read("facingSouth") ||
	 read("facingEast") ||
	 read("facingWest") ||
	 read("notFacingNorth") ||
	 read("notFacingSouth") ||
	 read("notFacingEast") ||
	 read("notFacingWest");
};

var conditional = function() {
	composedConditional();
	// TODO: Finish this (?)
};

var composedConditional = function() {
	orConditional();	
};

var orConditional = function() {
	if (read('||')) {
		require('||');
		interCode[interCodeIndex++] = 'OR';
		conditional();
	}
	andConditional();
};

var andConditional = function() {
	if (read('&&')) {
		require('&&');
		interCode[interCodeIndex++] = 'AND';
		conditional();
	}
	notConditional();
};

var notConditional = function() {
	if (read('!')) {
		require('!');
		interCode[interCodeIndex++] = 'NOT';
	}
	simpleConditional();
};

var read = function(token) {
	if (currentToken >= tokens.length) return false;
	return tokens[currentToken].text === token;
};

var require = function(token) {
	if (currentToken >= tokens.length) return false;
	return tokens[currentToken++].text === token;	
};