$('#navbar-location').click(function (e) {
    e.preventDefault()
})
var units = 'Imperial';
var latUser
var lonUser;

// //get location 5 days event listener
let button = document.getElementById("get-location");

//on click get locations and start fetch
button.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        latUser = parseFloat(lat.toFixed(2));
        lonUser = parseFloat(long.toFixed(2));

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latUser}&lon=${lonUser}&units=${units}&appid=${OWM_KEY}`)
            // after response
            .then(response => response.json())

            .then(data => fiveDayForecast(data))
    });
})

//5 day forecast function
function fiveDayForecast(data) {
    $('#weather').fadeIn();
    let html = "";
    let iconcode;
    let currentMain;
    let days;
    let dailyTemp;
    let currentDescription;
    let humidity;
    let windSpeed;
    let pressure;
    let tempNight;
    let dt;
    let date;
    let allDates;
    let place = data.timezone;

    html += `
        <h6 class="span-card">${place} </h6>
        <ul class="card" data-effect="fadeIn"> `
    //iterate
    for (let i = 0; i < 5; i++) {
        iconcode = data.daily[i].weather[0].icon;
        currentMain = data.daily[i].weather[0].main;
        days = data.daily[i];
        dailyTemp = data.daily[i].temp.day;
        currentDescription = data.daily[i].weather[0].description;
        humidity = data.daily[i].humidity;
        windSpeed = data.daily[i].wind_speed;
        pressure = data.daily[i].pressure;
        tempNight = data.daily[i].temp.night;
        dt = data.daily[i].dt;
        date = new Date(dt * 1000);
        allDates = date.toDateString();

        html += `
        <li class="card-body my-0 py-0 px-0 m-4">
        <p>${allDates}</p>
        <p> day ${dailyTemp}${'&#8457'} / night ${tempNight}${'&#8457'}</p>
            <img href="#" class="card-img-top" src="http://openweathermap.org/img/wn/${iconcode}@2x.png"></img>
             <p class="bottom">${currentMain}</p>
            <p class="bottom d-none d-sm-block">Description: ${currentDescription}</p>
            <p class="bottom">Humidity: ${humidity}</p>
            <p class="bottom">Wind: ${windSpeed}</p>
            <p class="bottom">Pressure: ${pressure}</p>
            </li> `
    }
    html += '<span class="pull-right clickable close-icon mr-4"><i class="fa fa-times"></i></span></ul>'
    $('#weather').html(html)
    $(".close-icon").click(function() {
        $(this).closest('#weather').fadeOut();
    })
}


//1 day forecast listener
let btn2 = document.getElementById('get-location-oneday')
//get location one day
btn2.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        latUser = parseFloat(lat.toFixed(2));
        lonUser = parseFloat(long.toFixed(2));
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latUser}&lon=${lonUser}&units=${units}&appid=${OWM_KEY}`)
    // after response
    .then(response => response.json())
    .then(data => sanitizeData(data))
    .then(data => oneDayForecast(data))
    });
});
//sanitize data
function sanitizeData(data) {
    return {
        placed: data.timezone,
        manDescription: data.current.weather[0].main,
        currentDayDescription: data.current.weather[0].description,
        currentDayIcon: data.current.weather[0].icon,
        userLan: data.lat,
        userLon: data.lon,
        currentTemp: data.current.temp,
        dt: data.current.dt,
        wind: data.current.wind_speed,
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        currentMain: data.current.weather[0].main,
        feelsLike: data.current.feels_like,
    }

}
//one day forecasr
//language: HTML
    function oneDayForecast(forecast) {
    $('#weather').fadeIn();
    let date = new Date(`${forecast.dt}` * 1000);
    let allDates = date.toDateString();
    $('#weather').html(
        `
        <h6 class="span-card">${forecast.placed} </h6>
      <div class="card mt-4 one-day" data-effect="fadeIn">
          <h3 class="ml-4 text-center">` + allDates + `</h3> 
        <div class="card">
          <img src="http://openweathermap.org/img/wn/${forecast.currentDayIcon}@2x.png" alt="image">
         
           <p>${forecast.currentMain}</p>
            <p>Temperature: ${forecast.currentTemp}${'&#8457'}</p>        
            <p>Feels like: ${forecast.feelsLike}${'&#8457'}</p>
               <p>description: ${forecast.currentDayDescription}</p> 
            <p>Humidity: ${forecast.humidity}</p>
            <p>Wind speed: ${forecast.wind}</p>
            <p>Pressure: ${forecast.pressure}</p>
        </div>
        <span class="pull-right clickable close-icon mr-4" data-effect="fadeOut"><i class="fa fa-times"></i></span>
        </div>
      </div>`
    );
    $(".close-icon").click(function() {
        $(this).closest('#weather').fadeOut();
    })
};


