// //MAP
mapboxgl.accessToken = MAP_KEY
let startLan = 41.09
let startLon = -85.13
let map = initMap(startLon, startLan);
let marker;
let popup;

const coordinates = document.getElementById('coordinates');
addGeo();
setGeocoderEventListener();
getWeatherClick();

function initMap(lon, lat) {
    mapboxgl.accessToken = MAP_KEY;
    return new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 5,
        center: [lon, lat]
    });

}

function getMarker(coordinates) {
    return new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map)
}

function getPopup(description, coordinates) {
    return new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<p>${description}</p>`)
}

function addGeo() {
    geocoder = new MapboxGeocoder({
        accessToken: MAP_KEY,
        mapboxgl: mapboxgl,
        marker: false,
    });
    map.addControl(geocoder);
}

function setGeocoderEventListener() {
    geocoder.on("result", function (e) {
        if (marker) {
            marker.remove();
        }
        if (popup) {
            popup.remove();
        }
        marker = getMarker(e.result.geometry.coordinates);
        popup = getPopup(e.result.place_name, e.result.geometry.coordinates);
        marker.setPopup(popup)
        const cityNameText = e.result.text;
        const longitude = e.result.geometry.coordinates[0];
        const latitude = e.result.geometry.coordinates[1];

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${units}&appid=${OWM_KEY}`)
            // after response
            .then(response => response.json())
            .then(data => fiveDayForecastMap(data))
    });
}

function fiveDayForecastMap(data) {
    $('#weather-map').fadeIn();
    let name = data.timezone;
    html = "";
    html += `<h6 class="span-card">${name} </h6><ul class="card">`
    //iterate
    for (let i = 0; i < 5; i++) {
        let iconcode = data.daily[i].weather[0].icon;
        let currentMain = data.daily[i].weather[0].main;
        let days = data.daily[i];
        let dailyTemp = data.daily[i].temp.day;
        let currentDescription = data.daily[i].weather[0].description;
        let humidity = data.daily[i].humidity;
        let windSpeed = data.daily[i].wind_speed;
        let pressure = data.daily[i].pressure;
        let tempNight = data.daily[i].temp.night;
        let dt = data.daily[i].dt;
        let date = new Date(dt * 1000);
        let allDates = date.toDateString();

        html += `
        <li class="card-body my-0 py-0 px-0 m-4">
        <p>${allDates}</p>
        <p> day ${dailyTemp}${'&#8457'} / night ${tempNight}${'&#8457'}</p>
            <img href="#" class="card-img-top" src="http://openweathermap.org/img/wn/${iconcode}@2x.png"></img>
             <p class="bottom">${currentMain}</p>
            <p class="d-none d-sm-block">Description: ${currentDescription}</p>
            <p class="bottom">Humidity: ${humidity}</p>
            <p class="bottom">Wind: ${windSpeed}</p>
            <p class="bottom">Pressure: ${pressure}</p>
            </li> `
    }
    html += '<span class="pull-right clickable close-icon mr-4" data-effect="fadeOut"><i class="fa fa-times"></i></span></ul>'
    $('#weather-map').html(html)
    $(".close-icon").click(function () {
        $(this).closest('#weather-map').fadeOut();
    })
}

function getWeatherClick() {
    map.on('dblclick', function (e) {
        let onClickLng = e.lngLat.lng;
        let onClickLat = e.lngLat.lat;
        if (marker) {
            marker.remove();
        }
        marker = getMarker([onClickLng, onClickLat])

        marker.setDraggable(true)

        marker.on('dragend', onDragEnd);
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${onClickLat}&lon=${onClickLng}&units=${units}&appid=${OWM_KEY}`)
            // after response
            .then(response => response.json())
            .then(data => fiveDayForecastMap(data))
    })
}

function onDragEnd() {
    const lngLat = marker.getLngLat();
    // coordinates.style.display = 'block';
    // coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    let latitudeDrag = `${lngLat.lat}`;
    let longitudeDrag = `${lngLat.lng}`;
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitudeDrag}&lon=${longitudeDrag}&units=${units}&appid=${OWM_KEY}`)
        // after response
        .then(response => response.json())
        .then(data => fiveDayForecastMap(data))
}


$('#directions').click(function (e) {

    map.addControl(
        new MapboxDirections({
            accessToken: mapboxgl.accessToken
        }),
        'top-right'
    );

    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }))


    if (marker) {
        marker.remove()
    }
})

$( "#directions" ).hover(function() {
    $( this ).fadeOut( 100 );
    $( this ).fadeIn( 500 );
});



