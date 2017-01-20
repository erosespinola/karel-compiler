var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.$blockScrolling = Infinity;
editor.getSession().setMode('ace/mode/karel');

var previousProgram = localStorage.getItem('karelProgram');

if (previousProgram) {
  editor.getSession().setValue(previousProgram, -1);
}