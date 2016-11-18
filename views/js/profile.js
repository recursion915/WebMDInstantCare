function getURLParameter(sParam) {
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

var user_id = getURLParameter('user_id');
console.log(user_id);
$(document).ready(function() {
    // get insurance list from server
  $.ajax({
                             url: "/get_insurances/",
                             type: "GET",
                             dataType : "json",
                             success: function( data ) {
                            //  console.log("You received some data!", data);
                             for(var i = 0; i < data.length; i++){
                                $('#insurancename select').append('<option>'+data[i]+'</option>');
                             }
                             },

              });

    // get basic user information from server
    $.ajax({
                              url: "/get_user/",
                              type: "GET",
                              dataType : "json",
                              data:{
                                    user_id: user_id,
                              },
                              success: function( data ) {
                              console.log("You received some data!", data.first_name);
                                $('#firstname input').val(data.first_name);
                                $('#lastname input').val(data.last_name);
                                $('#emailaddress input').val(data.email_address);
                                $('#insurancename select').val(data.insurance_name);
                                $('#insurancenumber input').val(data.insurance_number);
                                $('#groupnumber input').val(data.group_number);
                              },

            });
      $("#save").click(function(){
            $.ajax({
                    url: "/update_user",
                    type: "POST",
                    data:{
                        user_id: user_id,
                        first_name: $('#firstname input').val(),
                        last_name: $('#lastname input').val(),
                        email_address: $('#emailaddress input').val(),
                        insurance_name: $('#insurancename select').val(),
                        insurance_number: $('#insurancenumber input').val(),
                        group_number: $('#groupnumber input').val(),
                    },
                    success: function(){
                        window.location = "explore.html?user_id=" + user_id;
                    },

            })

      });


});
