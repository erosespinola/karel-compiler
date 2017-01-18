function compile_example(editorSelector) {
    var code = ace.edit(editorSelector).getSession().getValue()
    editor.getSession().setValue(code, -1);
};

var example1 = ace.edit('example1');
example1.setTheme('ace/theme/monokai');
example1.$blockScrolling = Infinity;
example1.getSession().setMode('ace/mode/karel');
example1.getSession().setValue("class program {\r\n\
    program() {\r\n\
        turnoff()\r\n\
    }\r\n\
}", -1);