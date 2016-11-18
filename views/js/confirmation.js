function GetURLParameter(sParam) {
	var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
	return null;
}
var doc_id = GetURLParameter('doctor_id');
$(document).ready(function() {
    markDest();
	function markDest() {
		$.get('/get_doctor?doctor_id=' + doc_id, {}, function(res,resp) {
            console.log(res);
            var doc = res;

            $("#doc_img").html("<img src=" + doc.image_url + " style=width:80px height:80px>");
            $("#doc_name").html(doc.first_name + " " + doc.last_name);
            $.get('/get_clinic?clinic_id=' + res.clinic_id, {}, function(res,resp) {
                console.log(res);
                $("#cli_name").html(res.clinic_name);
                $("#cli_addr").html(res.address);
            }, "json");
	  	}, "json");
	}
    // $("#uber").click(function(){
    //             window.location = "uber://";
    //             console.log("I am sending you to uber");
    //
    // });


});
