syntax = {
    parse: function(tokens) {
        interCodeIndex = 0;
        interCode = [];

        helper.setTokens(tokens);
        interCode[interCodeIndex++] = INTERCODE_KEYS.JMP;
        interCodeIndex++;
        program();
        if (interCode[interCode.length - 1] != INTERCODE_KEYS.TURN_OFF) {
            console.log('missing turnoff');
            // die();
        }
        /*return _.map(interCode, function(d, i) {
            return [i, d];
        });*/
        return interCode;
    }
};

var interCodeIndex;
var interCode;

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
    bad_function_declaration_parenthesis : "Bad function declaration, missing parenthesis",
    bad_function_declaration_void : "Bad function declaration, missing void",
    bad_function_declaration_reserved : "Bad function declaration, reserved keyword for: ",
    bad_function_call_parenthesis: "Bad function call, missing parenthesis",
    not_found_function: "Not found function: ",
};

var reservedKeywords = {
    'if': true,
    'else': true,
    'iterate': true,
    'while': true,
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
    'turnoff': true
};

/* Program */
var program = function() {
    if (helper.require('class') && helper.require('program')) {
        if (helper.require('{')) {
            functionsDeclarations();
            mainFunction();
            if (!helper.require('}')) {
                console.log(errors.missing_right_brace);
                process.exit(0);
            } 
        } else {
            console.log(errors.missing_left_brace);
            process.exit(0);
        }
    } else {
        console.log(errors.missing_class_program);
        process.exit(0);
    }
};

var mainFunction = function() {
    if (helper.require('program') && helper.require('(') && helper.require(')')) {
        if (helper.require('{')) {
            interCode[1] = interCodeIndex;
            body();
            if (!helper.require('}')) {
                console.log(errors.missing_right_brace);
                process.exit(0);
            }
        } else {
            console.log(errors.missing_left_brace);
            process.exit(0);
        }
    } else {
        console.log(errors.missing_program);
        process.exit(0);
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
                    interCode[interCodeIndex++] = INTERCODE_KEYS.RET;
                } else {
                    console.log(errors.missing_right_brace);
                    process.exit(0);
                }
            } else {
                console.log(errors.missing_left_brace);
                process.exit(0);
            }
        } else {
            console.log(errors.bad_function_declaration_parenthesis);
            process.exit(0);
        }
    } else {
        console.log(errors.bad_function_declaration_void);
        process.exit(0);
    }
};

var nameFunction = function() {
    var name = helper.fetchToken();
    if (reservedKeywords.hasOwnProperty(name)) {
        console.log(errors.bad_function_declaration_reserved + name);
        process.exit(0);
    } else {
        helper.addNewFunction(name, interCodeIndex);
    }
};

var callFunction = function() {
    nameOfFunction();
    if (helper.require('(')) {
        if (!helper.require(')')) {
            console.log(errors.bad_function_call_parenthesis);
            process.exit(0);
        }    
    } else {
        console.log(errors.bad_function_call_parenthesis);
        process.exit(0);
    }  
};

var nameOfFunction = function() {
    if (helper.read('move') ||
        helper.read('pickbeeper') || helper.read('turnleft') ||
        helper.read('putbeeper') || helper.read('turnoff')) {
        officialFunction();
    } else {
        customerFunction();
    }
};

var officialFunction = function() {
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
};
    
var customerFunction = function () {
    var nameFunction = helper.fetchToken();
    var posFunctionInCodeInter = helper.findStartPointOfFunction(nameFunction);
    if (posFunctionInCodeInter !== '0xFF') {
        interCode[interCodeIndex++] = INTERCODE_KEYS.CALL;
        interCode[interCodeIndex++] = posFunctionInCodeInter;
    } else {
        console.log(errors.not_found_function + nameFunction);
        process.exit(0);
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
    var x_pos, y_pos;

    if (helper.require('if')) {
        if (helper.require('(')) {
            conditional();
            if (helper.require(')')) {
                if (helper.require('{')) {
                    interCode[interCodeIndex++] = INTERCODE_KEYS.JMP;
                    x_pos = interCodeIndex;
                    interCodeIndex++;

                    body();

                    if (!helper.require('}')) {
                        console.log(errors.missing_right_brace);
                        process.exit(0);
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
                    console.log(errors.missing_left_brace);
                    process.exit(0);
                }
            }
            else {
                console.log(errors.missing_right_parenthesis);
                process.exit(0);
            }
        }
        else {
            console.log(errors.missing_left_parenthesis);
            process.exit(0);
        }
    }
    else {
        console.log(errors.missing_if_expression);
        process.exit(0);
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
                console.log(errors.missing_right_brace);
                process.exit(0);
            }
        } else {
            console.log(errors.missing_left_brace);
            process.exit(0);
        }
    } else {
        console.log(errors.missing_else_expression);
        process.exit(0);
    }
};

var whileExpression = function() {
    var end_position, start = interCodeIndex;

    if (helper.require('while')) {
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
                        console.log(errors.missing_right_brace);
                        process.exit(0);
                    }
                } else {
                    console.log(errors.missing_left_brace);
                    process.exit(0);
                }
            } else {
                console.log(errors.missing_right_parenthesis);
                process.exit(0);
            }
        } else {
            console.log(errors.missing_left_parenthesis);
            process.exit(0);
        }
    } else {
        console.log(errors.missing_while_expression);
        process.exit(0);
    }
};

iterateCounters = 0;
var iterateExpression = function() {
    var start, iterateCounter = iterateCounters++;

    if (helper.require('iterate')) {
        if (helper.require('(')) {
            
            // *******************************************
            // WARNING: does not actually validate numbers
            // *******************************************

            interCode[interCodeIndex++] = INTERCODE_KEYS.ITE;
            interCode[interCodeIndex++] = iterateCounter;
            interCode[interCodeIndex++] = helper.fetchToken();

            if (helper.require(')')) {
                if (helper.require('{')) {
                    start = interCodeIndex;

                    body();

                    if (helper.require('}')) {
                        interCode[interCodeIndex++] = INTERCODE_KEYS.DECJMP;
                        interCode[interCodeIndex++] = iterateCounter;
                        interCode[interCodeIndex++] = start;
                    } else {
                        console.log(errors.missing_right_brace);
                        process.exit(0);
                    }
                } else {
                    console.log(errors.missing_left_brace);
                    process.exit(0);
                }
            } else {
                console.log(errors.missing_right_parenthesis);
                process.exit(0);
            }
        } else {
            console.log(errors.missing_left_parenthesis);
            process.exit(0);
        }
    } else {
        console.log(errors.missing_iterate_expression);
        process.exit(0);
    }
};

var number = function() {

}

/* Conditionals */
// var isSimpleConditional = function() {
//     return 
//      helper.read('frontIsClear') ||
//      helper.read('leftIsClear') ||
//      helper.read('leftIsBlocked') ||
//      helper.read('rightIsClear') ||
//      helper.read('rightIsBlocked') ||
//      helper.read('nextToABeeper') ||
//      helper.read('notNextToABeeper') ||
//      helper.read('anyBeepersInBeeperBag') ||
//      helper.read('noBeepersInBeeperBag') ||
//      helper.read('facingNorth') ||
//      helper.read('facingSouth') ||
//      helper.read('facingEast') ||
//      helper.read('facingWest') ||
//      helper.read('notFacingNorth') ||
//      helper.read('notFacingSouth') ||
//      helper.read('notFacingEast') ||
//      helper.read('notFacingWest');
// };

var simpleConditional = function() {
    if (helper.ifRead('!')) {
        interCode[interCodeIndex++] = INTERCODE_KEYS.NOT;
    }

    if (helper.ifRead('frontIsClear')) interCode[interCodeIndex++] = INTERCODE_KEYS.FRONT_IS_CLEAR;
    else if (helper.ifRead('frontIsBlocked')) interCode[interCodeIndex++] = INTERCODE_KEYS.FRONT_IS_BLOCKED;
    else if (helper.ifRead('leftIsClear')) interCode[interCodeIndex++] = INTERCODE_KEYS.leftIsClear;
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
    else console.log({ 'error': 'Not a valid simple conditional' });
};

var conditional = function() {
    // FIXME: Will crash on EOF
    var ahead_token = helper.lookAhead(1).text;

    if (ahead_token === '&&' || ahead_token === '||') {
        composedConditional();
    } else {
        simpleConditional();
    }
};

var composedConditional = function() {
    // FIXME: Will crash on EOF
    var ahead_token = helper.lookAhead(1).text;

    if (ahead_token === '||') {
        interCode[interCodeIndex++] = INTERCODE_KEYS.OR;
        simpleConditional();
        helper.require('||');
        simpleConditional();
    } else if (ahead_token === '&&') {
        interCode[interCodeIndex++] = INTERCODE_KEYS.AND;
        simpleConditional();
        helper.require('&&');
        simpleConditional();
    }
};

