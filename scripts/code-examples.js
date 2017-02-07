function compile_example(editorSelector) {
    var code = ace.edit(editorSelector).getSession().getValue()
    editor.getSession().setValue(code, -1);
};

function setup_editor(id, code) {
	$.get(code, function(data) {
		var editor = ace.edit(id);
		editor.setTheme('ace/theme/monokai');
		editor.getSession().setOption("useWorker", false);
		editor.$blockScrolling = Infinity;
		editor.getSession().setMode('ace/mode/karel');
		editor.getSession().setValue(data, -1);
		console.log(editor);
		console.log(id, data);
	});
}

function setup_template(demo, i) {
	var template = document.querySelector('#demo-template');
	var title = template.content.querySelector('.demo-title');
	title.textContent = demo.title;

	var editor = template.content.querySelector('.demo-editor');
	editor.id = demo.id;

	var button = template.content.querySelector('.demo-button');

	var description = template.content.querySelector('.demo-description');
	while (description.hasChildNodes()) {
	    description.removeChild(description.lastChild);
	}

	return template;
}

function render_demos(container_id, demos) {
	var demoContainer = document.querySelector(container_id);

	demos.forEach(function(demo, i) {

		var template = setup_template(demo, i);
		template = document.importNode(template.content, true);

		// Event listener must be added on the template is part of the DOM.
		template.querySelector('.demo-button').addEventListener( 'click', function() {
			var currentEditor = ace.edit(demo.id);
			var code = currentEditor.getSession().getValue();
			editor.getSession().setValue(code, -1);
		});

		// Load description (async)
		var description = template.querySelector('.demo-description');
		$.get(demo.description, function(data) {
			var elements = $.parseHTML(data);
			elements.forEach(function(element, i) {
				description.append(element);
			});
		});

		demoContainer.appendChild(template);

		setup_editor(demo.id, demo.code);
	});
}

if ('content' in document.createElement('template')) {
	$.getJSON("demos/v1.0.json", function(demos) {
		render_demos('#demos10', demos);

	});

	$.getJSON("demos/v1.1.json", function(demos) {
		render_demos('#demos11', demos);

	});

	$.getJSON("demos/v1.2.json", function(demos) {
		render_demos('#demos12', demos);

	});

}