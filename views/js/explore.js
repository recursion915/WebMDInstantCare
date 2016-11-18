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

var user_id = GetURLParameter('user_id');
var care_type = GetURLParameter('care_type');
if (care_type == null) care_type = 'medical';

$(document).ready(function() {
                  
                  $('.caretypetab').click(function(){
                                          $('.caretypetab').removeClass('current');
                                          $(this).addClass('current');
                                          });
                  var START_LAT = 40.741077;
                  var START_LONG = -74.002160;
                  var ZOOM = 15;
                  
                  var patientImage = {
                  url: 'images/you.png',
                  scaledSize : new google.maps.Size(32, 32),
                  };
                  var myLatlng = new google.maps.LatLng(START_LAT, START_LONG);
                  var myOptions = {
                  zoom: ZOOM,
                  center: myLatlng,
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  }
                  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions)
                  infowindow = new google.maps.InfoWindow();
                  var marker = new google.maps.Marker({
                                                      position: myLatlng,
                                                      icon:patientImage,
                                                      // new google.maps.Size(21,34),
                                                      });
                  marker.setMap(map);
                  markDoctors();
                  function markDoctors() {
                  $.get('/get_user?user_id=' + user_id, {}, function(res,resp) {
                        var insur = res.insurance_name;
                        $.get('/find_doctors?user_id=' + user_id + '&care_type=' + care_type + '&user_insurance=' + insur, {}, function(res,resp) {
                              
                              for (var i = 0; i < res.length; i++) {
                              $.get('/get_doctor?doctor_id=' + res[i], {}, function(res,resp) {
                                    var doc = res;
                                    console.log(res);
                                    $.get('/get_clinic?clinic_id=' + res.clinic_id, {}, function(res,resp) {
                                          console.log(res);
                                          var image = 'images/hosp.png';
                                          var marker = new google.maps.Marker({
                                                                              position: new google.maps.LatLng(res.lat, res.long),
//                                                                              label:String(doc.doctor_id),
                                                                              icon:image,
                                                                               animation: google.maps.Animation.BOUNCE,
                                                                              map:map
                                                                              });
                                          google.maps.event.addListener(marker, 'click', function() {
                                                                        infowindow.setContent('<div>' + '<img src=' + doc.image_url + 'height=42 width=42>' +
                                                                                              '<strong>' + doc.first_name + ' ' + doc.last_name + '</strong><br>' +
                                                                                              'Rating: ' + JSON.stringify(doc.ratings.yelp) + '<br></div>');
                                                                        infowindow.open(map, this);
                                                                        });
                                          }, "json");
                                    }, "json");
                              }
                              }, "json");
                        }, "json");
                  }
                  
                  
                  $("#book1").click(function(){
                                    $.ajax({
                                           url: "/add_appointment",
                                           type: "POST",
                                           data:{
                                           user_id: user_id,
                                           doctor_id:1
                                           },
                                           success: function(){
                                           window.location = "confirmation.html?doctor_id=" + 1;
                                           },
                                           })
                                    });
                  $("#book2").click(function(){
                                    $.ajax({
                                           url: "/add_appointment",
                                           type: "POST",
                                           data:{
                                           user_id: user_id,
                                           doctor_id:2
                                           },
                                           success: function(){
                                           window.location = "confirmation.html?doctor_id=" + 2;
                                           },
                                           })
                                    });
                  $("#book3").click(function(){
                                    $.ajax({
                                           url: "/add_appointment",
                                           type: "POST",
                                           data:{
                                           user_id: user_id,
                                           doctor_id:3
                                           },
                                           success: function(){
                                           window.location = "confirmation.html?doctor_id=" + 3;
                                           },
                                           })
                                    });
                  
                  });
                  $("#profile").click(function(){
                       window.location = "profile.html?user_id=" + user_id; 
                    });  
