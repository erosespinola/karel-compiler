var colors = ['#84FD45', '#00FFED', '#00A6FB', '#FF0026', '#FF9120', '#FFEA35', '#fff', '#000'];

var openModal = function() {
	 $('#modal1').modal();
};

var saveBeepers = function() {
	world.karel[0].beepers = $('#beepers_amount').val();
	drawBeepers(world.karel);
};

var drawBeepers = function(karels) {
	var beepersCode = '<br><br>';

	_.each(karels, function(k, i) {
		if (i == 0) {
			beepersCode += '<div class="chip beeper-badge"> \
						<a href="#modal1" onclick="openModal()" class="waves-effect waves-light modal-trigger"><i class="fa fa-pencil" style="margin-right: 3px;"> </a></i> \
						<i class="fa fa-circle" style="color: ' + colors[0] +'"></i> \
						<pre class="beeper" id="karel_0">' + k.beepers + '</pre> \
					</div>';
			return;
		} 

		beepersCode += '<div class="chip beeper-badge"> \
							<i class="fa fa-circle" style="color: ' + colors[i % 8] +'"></i> \
							<pre class="beeper" id="karel_' + k.id + '">' + k.beepers + '</pre> \
						</div>';
	})


	$('#beepers-column').html(beepersCode);
};