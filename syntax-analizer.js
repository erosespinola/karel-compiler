var helper = require('./analizer-helpers');
var interCodeIndex = 0;
var interCode = [];

exports.parse = function(tokens) {
	helper.setTokens(tokens);
	program();
	return interCode;
};

/* Program */
var program = function() {
	if (helper.require('class') && helper.require('program')) {
		if (helper.require('{')) {
			functionsDeclarations();
			mainFunction();
			if (!helper.require('}')) {
				console.log(9);
			} 
		} else {
			console.log(10);
		}
	} else {
		console.log(11);
	}
};

var mainFunction = function() {
	if (helper.require('program') && helper.require('(') &&
		helper.require(')') && helper.require('{')) {
		body();
		if (!helper.require('}')) {
			console.log(12);
		}
	} else {
		console.log(13);
	}
};

/* Functions */
var functionsDeclarations = function() {
	while (helper.read('void')) {
		functionDeclaration();
	}
};

var functionDeclaration = function() {
	if (helper.require('void')) {
		nameFunction();
		if (helper.require('(') && helper.require(')')) {
			if (helper.require('{')) {
				body();
				if (helper.require('}')) {
					interCode[interCodeIndex++] = 'RETURN';
				} else {
					console.log(14);
				}
			} else {
				console.log(15);
			}
		} else {
			console.log(16);
		}
	} else {
		console.log(17);
	}
};

var nameFunction = function() {
	var name = helper.fetchToken();
	helper.addNewFunction(name, interCodeIndex);
};

var callFunction = function() {
	nameOfFunction();
	if (helper.require('(')) {
		if (!helper.require(')')) {
			console.log(18);
		}    
	} else {
		console.log(19);
	}  
};

var nameOfFunction = function() {
	if (helper.read('move') || helper.read('turnoff') || 
		helper.read('pickbeeper') || helper.read('turnleft') ||
		helper.read('putbeeper')) {
		officialFunction();
	} else {
		customerFunction();
	}
};

var officialFunction = function() {
	if (helper.read('turnleft')) {
		helper.require('turnleft');
	}  
	else if (helper.read('turnoff')) {
		helper.require('turnoff');
	}
	else if (helper.read('move')) {
		helper.require('move');
	}
	else if (helper.read('pickbeeper')) {
		helper.require('pickbeeper');
	}
	else if (helper.read('putbeeper')) {
		helper.require('putbeeper');
	}
};
    
var customerFunction = function () {
	var nameFunction = helper.fetchToken();
	var posFunctionInCodeInter = helper.findStartPointOfFunction(nameFunction);
	if (posFunctionInCodeInter !== '0xFF') {
		interCode[interCodeIndex++] = 'CALL';
		interCode[interCodeIndex++] = posFunctionInCodeInter;
	} else {
		console.log(20);
	}
};

/* Body */
var body = function() {
	expressions();
};

/* Expressions */
var expressions = function() {
	expression();
	expressionsPrima();
};

var expressionsPrima = function() {
	if (!helper.read('}')) {
		expression();
		expressionsPrima();
	}
};

var expression = function() {
	if (!helper.read('}')) {
		if (helper.read('if')) {
			ifExpression();
		}
		else if (helper.read('while')) {
			whileExpression();
		} 
		else if (helper.read('iterate')) {
			iterateExpression();
		} else {
			callFunction();  
		}
	}
};

var ifExpression = function() {
	if (helper.require('if') && helper.require('(')) {
		conditional();
		if (helper.require(')'))
		{
			body();
			if (helper.read('else'))
			{
				elseIf();
			}
		}
	}
};

var elseIf = function() {
	if (helper.require('else'))
	{
		if (helper.require('{'))
		{
			body();
			if (!helper.require('}'))
			{
				
			}
		}
	}
};

var whileExpression = function() {
	// TODO
};

var iterateExpression = function() {
	// TODO
};

/* Conditionals */
var simpleConditional = function() {
	if (helper.ifRead("frontIsClear")) interCode[interCodeIndex++] = "frontIsClear";
	else if (helper.ifRead("frontIsBlocked")) interCode[interCodeIndex++] = "frontIsBlocked";
	else if (helper.ifRead("leftIsClear")) interCode[interCodeIndex++] = "leftIsClear";
	else if (helper.ifRead("leftIsBlocked")) interCode[interCodeIndex++] = "leftIsBlocked";
	else if (helper.ifRead("rightIsClear")) interCode[interCodeIndex++] = "rightIsClear";
	else if (helper.ifRead("rightIsBlocked")) interCode[interCodeIndex++] = "rightIsBlocked";
	else if (helper.ifRead("nextToABeeper")) interCode[interCodeIndex++] = "nextToABeeper";
	else if (helper.ifRead("notNextToABeeper")) interCode[interCodeIndex++] = "notNextToABeeper";
	else if (helper.ifRead("anyBeepersInBeeperBag")) interCode[interCodeIndex++] = "anyBeepersInBeeperBag";
	else if (helper.ifRead("noBeepersInBeeperBag")) interCode[interCodeIndex++] = "noBeepersInBeeperBag";
	else if (helper.ifRead("facingNorth")) interCode[interCodeIndex++] = "facingNorth";
	else if (helper.ifRead("facingSouth")) interCode[interCodeIndex++] = "facingSouth";
	else if (helper.ifRead("facingEast")) interCode[interCodeIndex++] = "facingEast";
	else if (helper.ifRead("facingWest")) interCode[interCodeIndex++] = "facingWest";
	else if (helper.ifRead("notFacingNorth")) interCode[interCodeIndex++] = "notFacingNorth";
	else if (helper.ifRead("notFacingSouth")) interCode[interCodeIndex++] = "notFacingSouth";
	else if (helper.ifRead("notFacingEast")) interCode[interCodeIndex++] = "notFacingEast";
	else if (helper.ifRead("notFacingWest")) interCode[interCodeIndex++] = "notFacingWest";
	else console.log({ "error": "Not a valid simple conditional" });
};

var isSimpleConditional = function() {
	return 
	 helper.read("frontIsClear") ||
	 helper.read("leftIsClear") ||
	 helper.read("leftIsBlocked") ||
	 helper.read("rightIsClear") ||
	 helper.read("rightIsBlocked") ||
	 helper.read("nextToABeeper") ||
	 helper.read("notNextToABeeper") ||
	 helper.read("anyBeepersInBeeperBag") ||
	 helper.read("noBeepersInBeeperBag") ||
	 helper.read("facingNorth") ||
	 helper.read("facingSouth") ||
	 helper.read("facingEast") ||
	 helper.read("facingWest") ||
	 helper.read("notFacingNorth") ||
	 helper.read("notFacingSouth") ||
	 helper.read("notFacingEast") ||
	 helper.read("notFacingWest");
};

var conditional = function() {
	composedConditional();
	// TODO: Finish this (?)
};

var composedConditional = function() {
	orConditional();	
};

var orConditional = function() {
	if (helper.read('||')) {
		analyzer.require('||');
		interCode[interCodeIndex++] = 'OR';
		conditional();
	}
	andConditional();
};

var andConditional = function() {
	if (helper.read('&&')) {
		analyzer.require('&&');
		interCode[interCodeIndex++] = 'AND';
		conditional();
	}
	notConditional();
};

var notConditional = function() {
	if (helper.read('!')) {
		analyzer.require('!');
		interCode[interCodeIndex++] = 'NOT';
	}
	simpleConditional();
};

