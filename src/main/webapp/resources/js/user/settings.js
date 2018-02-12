$(function() {
	$("#confirmPasswordButton").on('click', function() {
		var oldpassword = $("#oldpasswordInput").val();
		var newpassword = $("#newpasswordInput").val();
		var confirmpassword = $("#confirmpasswordInput").val();
		if (newpassword.localeCompare(confirmpassword) == 0) {
			alert(oldpassword + "," + newpassword + "," + confirmpassword);
			var passwordsetting = oldpassword + ";" + newpassword;

			$.ajax({
				type : "POST",
				url : "/settings/password",
				data : {
					passwords : passwordsetting
				},
				success : function(response) {
					if (response.redirect == "settings")
						window.location = "settings";
					else if (response.redirect == "index")
						alert("ok");
				}
			});
		} else {

			$("#passwordErrorMessage").addClass("visible");
		}
	});

	$("#confirmAddressButton").on('click', function() {
		var inputMap = $("#maps-autocomplete-input").getPlace();
		var address = inputMap.val();
		var lat = inputMap.geometry.location.lat();
		var long = inputMap.geometry.location.lng();

		// send lat and long
		$.ajax({
			type : "POST",
			url : "/settings/address",
			data : {
				address : address

			},
			success : function(response) {
				window.location = "settings"
			}
		});

	});
});