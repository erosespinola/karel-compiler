var drawBeepers = function(n) {
	var beepersCode = '<br><br>';
	for (var i = 0; i < n; i++) {
		beepersCode += '<div class="input-group input-group-sm beeper-badge"> \
							<span class="input-group-addon" id="sizing-addon3"><i class="fa fa-circle beeper"></i></span> \
            				<input type="text" class="form-control" placeholder="0" aria-describedby="sizing-addon3"> \
            			</div>';
	};
	$('#beepers-column').html(beepersCode);
};