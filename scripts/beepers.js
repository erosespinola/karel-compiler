var drawBeepers = function(n) {
	var beepersCode = '<br><br>';
	for (var i = 0; i < n; i++) {
		beepersCode += '<div class="chip beeper-badge"> \
							<i class="fa fa-circle beeper"></i> \
							0 \
						</div>';
	};

	$('#beepers-column').html(beepersCode);
};