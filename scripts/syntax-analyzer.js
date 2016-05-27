/* Syntax object calls parse to create intercode list */
syntax = {
    parse: function(tokens) {
        interCodeIndex = 0;
        interCode = [];
        errorList = [];
        helper.init(tokens);
        interCode[interCodeIndex++] = INTERCODE_KEYS.JMP;
        interCodeIndex++;
        program();
        if (interCode[interCode.length - 1] != INTERCODE_KEYS.TURN_OFF) {
            throwError(errors.missing_turnoff);
        }
        return interCode;
    }
};

var interCodeIndex; // intercode current index
var interCode;      // intercode list

/* Syntax errors */
var errors = {
    missing_right_brace: "Missing closing brace",
    missing_left_brace: "Missing opening brace",
    missing_left_parenthesis: "Missing opening parenthesis",
    missing_right_parenthesis: "Missing closing parenthesis",
    missing_turnoff: "Missing final turnoff() call",
    missing_class_program: "Missing class program signature",
    missing_program: "Missing program() call",
    missing_if_expression: "Missing if expression",
    missing_else_expression: "Missing else expression",
    missing_while_expression: "Missing while expression",
    missing_iterate_expression: "Missing iterate expression",
    missing_clone_expression: "Missing clone expression",
    bad_function_declaration_parenthesis : "Bad function declaration, missing parenthesis",
    bad_function_declaration_void : "Bad function declaration, missing void",
    bad_function_declaration_reserved : "Bad function declaration, reserved keyword for: ",
    bad_function_call_parenthesis: "Bad function call, missing parenthesis",
    not_found_function: "Not found function: ",
    not_valid_condition: 'Not a valid simple condition',
    invalid_iterate_argument: 'Invalid iterate argument',
    invalid_givebeeper_argument: "Invalid number of beepers"
};

/* Reserved keywords for karel language */
var reservedKeywords = {
  'if': true,
  'else': true,
  'iterate': true,
  'while': true,
  'clone': true,
  'class': true,
  'program': true,
  'void': true,
  'frontIsClear': true,
  'leftIsClear': true,
  'leftIsBlocked': true,
  'rightIsClear': true,
  'rightIsBlocked': true,
  'nextToABeeper': true,
  'notNextToABeeper': true,
  'anyBeepersInBeeperBag': true,
  'noBeepersInBeeperBag': true,
  'facingNorth': true,
  'facingSouth': true,
  'facingEast': true,
  'facingWest': true,
  'notFacingNorth': true,
  'notFacingSouth': true,
  'notFacingEast': true,
  'notFacingWest': true,
  'move': true,
  'pickbeeper': true,
  'turnleft': true,
  'putbeeper': true,
  'turnoff': true,
  'givebeeper': true,
	'nextToKarel':true,
	'notNextToKarel':true,
	'frontIsFull':true,
	'notFrontIsFull':true,
	'nextToSon':true ,
	'notNextToSon':true,
	'nextToFather':true ,
	'notNextToFather':true,
	'nextToDescendant':true,
	'notNextToDescendant':true
};

/* program asks for the main signature of the program,
    function declarations and main function */
var program = function() {
    if (helper.require('class') && helper.require('program')) {
        if (helper.require('{')) {
            functionsDeclarations();
            mainFunction();
            if (!helper.require('}')) {
                throwError(errors.missing_right_brace);
            }
        } else {
            throwError(errors.missing_left_brace);
        }
    } else {
        throwError(errors.missing_class_program);
    }
};

/* mainFunction asks for a main function and a body */
var mainFunction = function() {
    if (helper.require('program') && helper.require('(') && helper.require(')')) {
        if (helper.require('{')) {
            interCode[1] = interCodeIndex;
            body();
            if (!helper.require('}')) {
                throwError(errors.missing_right_brace);
            }
        } else {
            throwError(errors.missing_left_brace);
        }
    } else {
        throwError(errors.missing_program);
    }
};

/* functionsDeclarations reads all function declarations */
var functionsDeclarations = function() {
    while (helper.read('void')) {
        functionDeclaration();
    }
};

/* functionDeclaration read a function declaration by adding it to the
    symbol table and asking for a body */
var functionDeclaration = function() {
    if (helper.require('void')) {
        nameFunction();
        if (helper.require('(') && helper.require(')')) {
            if (helper.require('{')) {
                body();
                if (helper.require('}')) {
                    interCode[interCodeIndex++] = INTERCODE_KEYS.RET;
                } else {
                    throwError(errors.missing_right_brace);
                }
            } else {
                throwError(errors.missing_left_brace);
            }
        } else {
            throwError(errors.bad_function_declaration_parenthesis);
        }
    } else {
        throwError(errors.bad_function_declaration_void);
    }
};

var nameFunction = function() {
    var name = helper.fetchToken();
    if (reservedKeywords.hasOwnProperty(name)) {
        throwError(errors.bad_function_declaration_reserved + name);
    } else {
        helper.addNewFunction(name, interCodeIndex);
    }
};

var callFunction = function() {
    nameOfFunction();
};

var nameOfFunction = function() {
    if (helper.read('move') ||
        helper.read('pickbeeper') || helper.read('turnleft') ||
        helper.read('putbeeper') || helper.read('turnoff') ||
        helper.read('clone') ||  helper.read('givebeeper')
      ) {
        officialFunction();
    } else {
        customerFunction();
    }
};
var parallelFunction = function(){
  if (helper.ifRead('givebeeper')) {
      if (helper.require('(')) {
        interCode[interCodeIndex++] = INTERCODE_KEYS.GIVE_BEEPER;
        var value = helper.fetchToken();
        if (Number.isInteger(parseInt(value)) && value != 0) {
            interCode[interCodeIndex++] = value;
            if (!helper.require(')')) {
                throwError(errors.bad_function_call_parenthesis);
            }
        }else {
          throwError(errors.invalid_givebeeper_argument);
        }
      } else {
          throwError(errors.bad_function_call_parenthesis);
      }
  }
  else if (helper.read('clone')) {
      cloneExpression();
  }
}
var normalFunction = function(){
  if (helper.ifRead('turnleft')) {
      interCode[interCodeIndex++] = INTERCODE_KEYS.TURN_LEFT;
  }
  else if (helper.ifRead('move')) {
      interCode[interCodeIndex++] = INTERCODE_KEYS.MOVE;
  }
  else if (helper.ifRead('pickbeeper')) {
      interCode[interCodeIndex++] = INTERCODE_KEYS.PICK_BEEPER;
  }
  else if (helper.ifRead('putbeeper')) {
      interCode[interCodeIndex++] = INTERCODE_KEYS.PUT_BEEPER;
  }
  else if (helper.ifRead('turnoff')) {
      interCode[interCodeIndex++] = INTERCODE_KEYS.TURN_OFF;
  }
  //parenthesis check, none have parameters
  if (helper.require('(')) {
      if (!helper.require(')')) {
          throwError(errors.bad_function_call_parenthesis);
      }
  } else {
      throwError(errors.bad_function_call_parenthesis);
  }
}
var officialFunction = function() {
  if (helper.read('clone') ||
      helper.read('givebeeper')) {
    parallelFunction();
  } else {
    normalFunction();
  }
};

var customerFunction = function () {
    var nameFunction = helper.fetchToken();
    var posFunctionInCodeInter = helper.findStartPointOfFunction(nameFunction);
    if (posFunctionInCodeInter !== '0xFF') {
        interCode[interCodeIndex++] = INTERCODE_KEYS.CALL;
        interCode[interCodeIndex++] = posFunctionInCodeInter;
        if (helper.require('(')) {
            if (!helper.require(')')) {
                throwError(errors.bad_function_call_parenthesis);
            }
        } else {
            throwError(errors.bad_function_call_parenthesis);
        }
    } else {
        throwError(errors.not_found_function + nameFunction);
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
        }
        else {
            callFunction();
        }
    }
};

var ifExpression = function() {
    var x_pos, y_pos;

    if (helper.require('if')) {
        interCode[interCodeIndex++] = INTERCODE_KEYS.IF;
        if (helper.require('(')) {
            conditional();

            if (helper.require(')')) {
                if (helper.require('{')) {
                    interCode[interCodeIndex++] = INTERCODE_KEYS.JMP;
                    x_pos = interCodeIndex;
                    interCodeIndex++;

                    body();

                    if (!helper.require('}')) {
                        throwError(errors.missing_right_brace);
                    }

                    if (helper.read('else')) {
                        interCode[interCodeIndex++] = INTERCODE_KEYS.JMP;
                        y_pos = interCodeIndex++;
                        interCode[x_pos] = interCodeIndex;

                        elseIf();

                        interCode[y_pos] = interCodeIndex;
                    }
                    else {
                        interCode[x_pos] = interCodeIndex;
                    }
                }
                else {
                    throwError(errors.missing_left_brace);
                }
            }
            else {
                throwError(errors.missing_right_parenthesis);
            }
        }
        else {
            throwError(errors.missing_left_parenthesis);
        }
    }
    else {
        throwError(errors.missing_if_expression);
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
                throwError(errors.missing_right_brace);
            }
        } else {
            throwError(errors.missing_left_brace);
        }
    } else {
        throwError(errors.missing_else_expression);
    }
};

var whileExpression = function() {
    var end_position, start = interCodeIndex;

    if (helper.require('while')) {
        interCode[interCodeIndex++] = INTERCODE_KEYS.WHILE;

        if (helper.require('(')) {
            conditional();
            if (helper.require(')')) {

                interCode[interCodeIndex++] = INTERCODE_KEYS.JMP;
                end_position = interCodeIndex++;

                if (helper.require('{')) {
                    body();

                    if (helper.require('}')) {
                        interCode[interCodeIndex++] = INTERCODE_KEYS.JMP;
                        interCode[interCodeIndex++] = start;
                        interCode[end_position] = interCodeIndex;
                    } else {
                        throwError(errors.missing_right_brace);
                    }
                } else {
                    throwError(errors.missing_left_brace);
                }
            } else {
                throwError(errors.missing_right_parenthesis);
            }
        } else {
            throwError(errors.missing_left_parenthesis);
        }
    } else {
        throwError(errors.missing_while_expression);
    }
};

var cloneExpression = function() {
    if (helper.require('clone')) {
        if (helper.require('(')) {
            var nameFunction = helper.fetchToken();
            var posFunctionInCodeInter = helper.findStartPointOfFunction(nameFunction);
            if (posFunctionInCodeInter !== '0xFF') {
                interCode[interCodeIndex++] = INTERCODE_KEYS.CLONE;
                interCode[interCodeIndex++] = posFunctionInCodeInter;
            } else {
                throwError(errors.not_found_function + nameFunction);
            }
            if (!helper.require(')')) {
                throwError(errors.missing_right_parenthesis);
            }
        } else {
            throwError(errors.missing_left_parenthesis);
        }
    } else {
        throwError(errors.missing_clone_expression);
    }
};
//Adding support for multiple errors
var errorList = [];
var catchErrorToList = function(error){
  console.log(errorList);
  var errorObj = {error: error, line: helper.getCurrentToken()?helper.getCurrentTokenForError().line:1};
  errorList.push(errorObj);
  //throw if exceeding 3
  if(errorList.length > 3){
    throwErrorList();
  }
}
var throwErrorList = function(){
  var output = '';
  errorList.forEach(function(e, index){
    output+="Syntax Error: " + e.error + " at line " + e.line +'\n';
  });
  console.log('out:',output);
  $("#errors").text(output);
  throw new Error(errorList.join(':'));
}
var iterateExpression = function() {
    var start;

    if (!helper.ifRead('iterate')) {
      catchErrorToList(errors.missing_iterate_expression);
    }
    if (!helper.ifRead('(')) {
      catchErrorToList(errors.missing_left_parenthesis);
    }
    interCode[interCodeIndex++] = INTERCODE_KEYS.ITE;

    var value = helper.fetchToken();
    if (!Number.isInteger(parseInt(value))) {
      catchErrorToList(errors.invalid_iterate_argument);
    }
    interCode[interCodeIndex++] = value;
    if (!helper.ifRead(')')) {
      catchErrorToList(errors.missing_right_parenthesis);
    }
    if (!helper.ifRead('{')) {
      catchErrorToList(errors.missing_left_brace);
    }
    start = interCodeIndex;

    body();

    if (!helper.ifRead('}')) {
      catchErrorToList(errors.missing_right_brace);
    }
    interCode[interCodeIndex++] = INTERCODE_KEYS.DECJMP;
    interCode[interCodeIndex++] = start;
    if(errorList.length > 0){throwErrorList();}
};



var throwError = function(error) {
  //possible accumulated error catcthing
  if (errorList.length > 0){
    catchErrorToList(error);
    throwErrorList();
  }
    if (helper.getCurrentToken()) {
        $("#errors").text("Syntax Error: " + error + " at line " + helper.getCurrentTokenForError().line);
        throw new Error(error);
    } else {
        $("#errors").text("Syntax Error: " + errors.missing_class_program + " at line 1");
        throw new Error(error);
    }

};
var notCondition=function(){
	if (helper.ifRead('!')) {
        interCode[interCodeIndex++] = INTERCODE_KEYS.NOT;
    }
};

var simpleConditional = function() {

    notCondition();

    if (helper.ifRead('frontIsClear')) interCode[interCodeIndex++] = INTERCODE_KEYS.FRONT_IS_CLEAR;
    else if (helper.ifRead('frontIsBlocked')) interCode[interCodeIndex++] = INTERCODE_KEYS.FRONT_IS_BLOCKED;
    else if (helper.ifRead('leftIsClear')) interCode[interCodeIndex++] = INTERCODE_KEYS.LEFT_IS_CLEAR;
    else if (helper.ifRead('leftIsBlocked')) interCode[interCodeIndex++] = INTERCODE_KEYS.LEFT_IS_BLOCKED;
    else if (helper.ifRead('rightIsClear')) interCode[interCodeIndex++] = INTERCODE_KEYS.RIGHT_IS_CLEAR;
    else if (helper.ifRead('rightIsBlocked')) interCode[interCodeIndex++] = INTERCODE_KEYS.RIGHT_IS_BLOCKED;
    else if (helper.ifRead('nextToABeeper')) interCode[interCodeIndex++] = INTERCODE_KEYS.NEXT_TO_A_BEEPER;
    else if (helper.ifRead('notNextToABeeper')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_NEXT_TO_A_BEEPER;
    else if (helper.ifRead('anyBeepersInBeeperBag')) interCode[interCodeIndex++] = INTERCODE_KEYS.ANY_BEEPERS_IN_BEEPER_BAG;
    else if (helper.ifRead('noBeepersInBeeperBag')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_ANY_BEEPERS_IN_BEEPER_BAG;
    else if (helper.ifRead('facingNorth')) interCode[interCodeIndex++] = INTERCODE_KEYS.FACING_NORTH;
    else if (helper.ifRead('facingSouth')) interCode[interCodeIndex++] = INTERCODE_KEYS.FACING_SOUTH;
    else if (helper.ifRead('facingEast')) interCode[interCodeIndex++] = INTERCODE_KEYS.FACING_EAST;
    else if (helper.ifRead('facingWest')) interCode[interCodeIndex++] = INTERCODE_KEYS.FACING_WEST;
    else if (helper.ifRead('notFacingNorth')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_FACING_NORTH;
    else if (helper.ifRead('notFacingSouth')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_FACING_SOUTH;
    else if (helper.ifRead('notFacingEast')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_FACING_EAST;
    else if (helper.ifRead('notFacingWest')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_FACING_WEST;
	else if (helper.ifRead('nextToKarel')) interCode[interCodeIndex++] = INTERCODE_KEYS.NEXT_TO_KAREL;
    else if (helper.ifRead('notNextToKarel')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_NEXT_TO_KAREL;
	else if (helper.ifRead('frontIsFull')) interCode[interCodeIndex++] = INTERCODE_KEYS.FRONT_IS_FULL;
	else if (helper.ifRead('notFrontIsFull')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_FRONT_IS_FULL;
	else if (helper.ifRead('nextToSon')) interCode[interCodeIndex++] = INTERCODE_KEYS.NEXT_TO_SON;
	else if (helper.ifRead('notNextToSon')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_NEXT_TO_SON;
	else if (helper.ifRead('nextToFather')) interCode[interCodeIndex++] = INTERCODE_KEYS.NEXT_TO_FATHER;
	else if (helper.ifRead('notNextToFather')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_NEXT_TO_FATHER;
	else if (helper.ifRead('nextToDescendant')) interCode[interCodeIndex++] = INTERCODE_KEYS.NEXT_TO_DESCENDANT;
	else if (helper.ifRead('notNextToDescendant')) interCode[interCodeIndex++] = INTERCODE_KEYS.NOT_NEXT_TO_DESCENDANT;


    else throwError(errors.not_valid_condition);
};

var conditional = function() {
    var ahead_token = helper.lookAhead(1).text;
    if (ahead_token === '&&' || ahead_token === '||') {
        composedConditional();
    } else {
        simpleConditional();
    }
};

var orCondition = function() {
    var ahead_token = helper.lookAhead(1).text;
    console.log("Entre al or " + ahead_token);

    if (helper.ifRead('||')) {
        interCode[interCodeIndex++] = INTERCODE_KEYS.OR;
		console.log("Entre al consumo or ");
		simpleConditional();


    } else  {
        andCondition();
    }
};

var andCondition= function(){
	if (helper.ifRead('&&')){
	 console.log("Entre al andCondition ");
	interCode[interCodeIndex++] = INTERCODE_KEYS.AND;
	simpleConditional();
    }
};

var composedConditional= function(){

	simpleConditional();
	composedConditionalPrima();

};

var composedConditionalPrima=function(){
	var ahead_token = helper.lookAhead(0).text;
	console.log("hola " , helper.getCurrentToken());
	if(!(helper.read(')'))){
	orCondition();
	composedConditionalPrima();
	}

};
