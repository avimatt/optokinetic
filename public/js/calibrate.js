

function main() {
	// set up event listeners so when divs are clicked on they disappear
	$("#calibration-instructions").modal("show");
	$(".main-page").hide();

	$(".modal-open").click(function() {
		$("#calibration-instructions").modal("hide");
	})

	var counter = 0;
	$( ".cell" ).click(function() {
		$(this).hide();
		counter++;
		// check if all are gone
		if (counter === 9) {
			$(".calibration").hide();
			$(".main-page").show();
		}
	});
}


$(document).ready(function() {
	main();
})