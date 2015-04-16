// Does this ++++browser support geolocation?
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}
else{
    showError("Your browser does not support Geolocation!");
}

function locationSuccess(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    var geoAPI = 'api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon;

    
    // Issue a cross-domain AJAX request (CORS) to the GEO service.
    // Not supported in Opera and IE.
    $.getJSON(geoAPI, function(r){

        if(r.ResultSet.Found == 1){
            console.log("Found data");

            //results = r.ResultSet.Results;
            //city = results[0].city;
            //code = results[0].statecode || results[0].countrycode;

            //// This is the city identifier for the weather API
            //woeid = results[0].woeid;

            //// Make a weather API request (it is JSONP, so CORS is not an issue):
            //$.getJSON(weatherYQL.replace('WID',woeid), function(r){

            //    if(r.query.count == 1){

            //        // Create the weather items in the #scroller UL

            //        var item = r.query.results.channel.item.condition;
            //        addWeather(item.code, "Now", item.text + ' <b>'+item.temp+'°'+DEG+'</b>');

            //        for (var i=0;i<2;i++){
            //            item = r.query.results.channel.item.forecast[i];
            //            addWeather(
            //                item.code,
            //                item.day +' <b>'+item.date.replace('\d+$','')+'</b>',
            //                item.text + ' <b>'+item.low+'°'+DEG+' / '+item.high+'°'+DEG+'</b>'
            //            );
            //        }

            //        // Add the location to the page
            //        location.html(city+', <b>'+code+'</b>');

            //        weatherDiv.addClass('loaded');

            //        // Set the slider to the first slide
            //        showSlide(0);

                }
                else {
                    showError("Error retrieving weather data!");
                }
            });

        }

    //}).error(function(){
    //    showError("Your browser does not support CORS requests!");
    //});

   

    // We will make further requests to Yahoo's APIs here

    //function addWeather(code, day, condition){

    //    var markup = '<li>'+
    //        '<img src="assets/img/icons/'+ weatherIconMap[code] +'.png" />'+
    //        ' <p class="day">'+ day +'</p> <p class="cond">'+ condition +
    //        '</p></li>';

    //    scroller.append(markup);
    //}

//function locationError(error){
//    switch(error.code) {
//        case error.TIMEOUT:
//            showError("A timeout occured! Please try again!");
//            break;
//        case error.POSITION_UNAVAILABLE:
//            showError('We can\'t detect your location. Sorry!');
//            break;
//        case error.PERMISSION_DENIED:
//            showError('Please allow geolocation access for this to work.');
//            break;
//        case error.UNKNOWN_ERROR:
//            showError('An unknown error occured!');
//            break;
//    }

//}

function showError(msg){
 //   weatherDiv.addClass('error').html(msg);
}

/* Handling the previous / next arrows */

//var currentSlide = 0;
//weatherDiv.find('a.previous').click(function(e){
//    e.preventDefault();
//    showSlide(currentSlide-1);
//});

//weatherDiv.find('a.next').click(function(e){
//    e.preventDefault();
//    showSlide(currentSlide+1);
//});

//function showSlide(i){
//    var items = scroller.find('li');

//    // Exit if the requested item does not exist,
//    // or the scroller is currently being animated
//    if (i >= items.length || i < 0 || scroller.is(':animated')){
//        return false;
//    }

//    // The first/last classes hide the left/right arrow with CSS
//    weatherDiv.removeClass('first last');

//    if(i == 0){
//        weatherDiv.addClass('first');
//    }
//    else if (i == items.length-1){
//        weatherDiv.addClass('last');
//    }

//    scroller.animate({left:(-i*100)+'%'}, function(){
//        currentSlide = i;
//    });
//}