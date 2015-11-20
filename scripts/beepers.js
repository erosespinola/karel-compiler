var colors = ['#84FD45', '#00FFED', '#00A6FB', '#FF0026', '#FF9120', '#FFEA35', '#fff', '#000'];

var openModal = function() {
	 $('#modal1').openModal();
};

var saveBeepers = function() {
	world.karel[0].beepers = $('#beepers_amount').val();
	drawBeepers(1, world.karel[0])
};

var drawBeepers = function(n) {
	var beepersCode = '<br><br>';

	beepersCode += '<div class="chip beeper-badge"> \
						<a href="#" onclick="openModal()" class="waves-effect waves-light modal-trigger"><i class="fa fa-pencil" style="margin-right: 3px;"> </a></i> \
						<i class="fa fa-circle" style="color: ' + colors[0] +'"></i> \
						<pre class="beeper" id="karel_0">' + world.karel[0].beepers + '</pre> \
					</div>';

	for (var i = 1; i < n; i++) {
		beepersCode += '<div class="chip beeper-badge"> \
							<i class="fa fa-circle" style="color: ' + colors[i % 8] +'"></i> \
							<pre class="beeper" id="karel_' + i + '">' + world.karel[0].beepers + '</pre> \
						</div>';
	};

	$('#beepers-column').html(beepersCode);
	// $('.modal-trigger').leanModal();
};