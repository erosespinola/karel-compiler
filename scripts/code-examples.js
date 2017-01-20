function compile_example(editorSelector) {
    var code = ace.edit(editorSelector).getSession().getValue()
    editor.getSession().setValue(code, -1);
};

function setup_editor(id, code) {
	console.log(id);
	var editor = ace.edit(id);
	editor.setTheme('ace/theme/monokai');
	editor.$blockScrolling = Infinity;
	editor.getSession().setMode('ace/mode/karel');
	editor.getSession().setValue(code, -1);
}

function setup_template(demo, i) {
	var demoTemplate = document.querySelector('#demo-template');
	var title = demoTemplate.content.querySelector('.demo-title');
	title.textContent = demo.title;

	var editor = demoTemplate.content.querySelector('.demo-editor');
	editor.id = demo.id;

	var button = demoTemplate.content.querySelector('.demo-button');

	var description = demoTemplate.content.querySelector('.demo-description');
	while (description.hasChildNodes()) {
	    description.removeChild(description.lastChild);
	}
	var elements = $.parseHTML(demo.description);
	elements.forEach(function(element, i) {
		description.append(element);
	});

	return demoTemplate;
}

if ('content' in document.createElement('template')) {
	$.getJSON("examples/examples.json", function(demos) {
		var demoContainer = document.querySelector('#demos');
		console.log(demoContainer);

		demos.forEach(function(demo, i) {
			var element = setup_template(demo, i);
			element = document.importNode(element.content, true);

			// Event listener must be added on the template is part of the DOM.
			element.querySelector('.demo-button').addEventListener( 'click', function() {
				editor.getSession().setValue(demo.code, -1);
			});

			demoContainer.appendChild(element);

			setup_editor(demo.id, demo.code);
		});
			
	});
		
}