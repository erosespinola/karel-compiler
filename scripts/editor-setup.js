var editor = ace.edit('editor');
editor.setTheme('ace/theme/monokai');
editor.getSession().setOption("useWorker", false);
editor.$blockScrolling = Infinity;
editor.getSession().setMode('ace/mode/karel');

var previousProgram = localStorage.getItem('karelProgram');

if (previousProgram) {
  editor.getSession().setValue(previousProgram, -1);
} else {
	$.get("demos/default/demo.kl", function(data) {
		editor.getSession().setValue(data, -1)
	});
	
}