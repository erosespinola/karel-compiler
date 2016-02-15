# karel-compiler

A Karel compiler based on the following grammar rules:

<program> ::= "class" "program" "{" <functions declarations> <main function> "}"

<main function> ::= "program" "(" ")" "{" <body> "}"

<functions declarations> ::= <function declaration>*

<function declaration> := "void" <name function> "(" ")" "{" <body> "}"

/<name function> ::= pending

<call function> ::= <name of function> "(" ")"

<name of function> ::= <official function> | <customer function>

<official function> ::=
    "turnleft" |
    "move" |
    "pickbeeper" |
    "putbeeper" |
    "turnoff"

/<customer function> ::= pending

<body> ::= <expressions>

<expressions> ::= <expression> <expressions prima>

<expressions prima> ::= <expression> <expressions prima>

<expression> ::= <if expression> | <while expression> | <iterate expression> | <clone expression> | <call function>

<if expression> ::= "if" "(" <conditional> ")" "{" "}"
----------------------------------------

<expression> ::= <call function> |
  <if expression> |
  <while expression> |
  <iterate expression> |
  <clone expression>

<clone expression> ::= "clone" "(" <customer function> ")"





<customer function> ::= <string without spaces>

<if expression> ::= "if" ( <conditional> ) "{" <body> "}" [ <elseif> ]
<elseif> ::= "else" "{" <body> "}"

<while expression> ::= "while" "(" <conditional> ")" "{" <body> "}"

<iterate expression> ::= "iterate" "(" <number> ")" "{" <body> "}"

<conditional> ::= <simple condition> | <composed condition>

<simple condition> ::=
  "frontIsClear"
  | "frontIsBlocked"
  | "leftIsClear"
  | "leftIsBlocked"
  | "rightIsClear"
  | "rightIsBlocked"
  | "nextToABeeper"
  | "notNextToABeeper"
  | "anyBeepersInBeeperBag"
  | "noBeepersInBeeperBag"
  | "facingNorth"
  | "facingSouth"
  | "facingEast"
  | "facingWest"
  | "notFacingNorth"
  | "notFacingSouth"
  | "notFacingEast"
  | "notFacingWest"
  | "karelInCell"

<composed condition> ::=   <simple condition> [ <or condition> ]

<or condition> ::=
    "||" <simple condition> |
    [ <and condition> ]

<and condition> ::=     
    "&&" <simple condition> |
    [ <not condition> ]

<not condition> ::=
  "!" <simple condition> |
  <simple condition>
