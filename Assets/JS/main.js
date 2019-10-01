const API_ID = 'ddc29a7389a5d9bb3eef065635bab0cf'

let cities = localStorage.getItem('cities');

if (cities) {
    cities = JSON.parse(cities)
} else {
    cities = []
}

$(document).ready( () => {
    for (let i = 0; i < cities.length; i++) {
        let $btn = $('<div>');
        $btn.text(cities[i]);

        $btn.attr('class', 'city-btn')

        $("#cities").prepend($btn)
    }

    $('#search').on('submit', function () {
        event.preventDefault();
        let input = $('#weatherSearch').val()
        
        if (input) {
            let $btn = $('<button>')
            $btn.text(input)

            $btn.attr('class', 'btn btn-primary city-btn')
    
            $('#cities').prepend($btn)
    
            cities.push(input)
            localStorage.setItem('cities', JSON.stringify(cities))
        }
    })

    $(document).on('click', '.city-btn', function() {
        let city = $(this).text()
        let citySearch = ''
        
        city = city.split(" ");

        for (let i = 0; i < city.length; i++) {
            citySearch += city[i];

            if ( i < city.length - 1) {
                citySearch += '+'
            }
        }

        let weather = getWeather(citySearch);


        weather.then( function(response) {
            console.log(response)
            let dt = new Date();
            
            $('#currentCity').text(response.city.name)

            $('.date').each(function(i) {
                $(this).text(dt.getMonth() + "/" + dt.getDate() + i + "/" + dt.getFullYear())
            });

            $('.temp').each(function(i) {
                $(this).text(Math.floor(response.list[i].main.temp * 1.8 - 459.67) + "°F")
            })

            $('.humidity').each(function(i) {
                $(this).text(response.list[i].main.humidity)
            })
            
            $('.windSpeed').each(function(i) {
                $(this).text(response.list[i].wind.speed)
            })

            $(".icon").each(function(i) {
                $(this).attr('src', `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`)
            })


            getUV(response.city.coord.lat, response.city.coord.lon).then(function (response2) {
               console.log(response2)

               $('.uv').text(response2[0].value);
            });


        })
    })
})

function getWeather(city) {
    let queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${API_ID}`;

    return $.ajax({
        url: queryURL,
        method: "GET",
    })
}

function getUV(lat, lon) {
    let queryURL = `http://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&APPID=${API_ID}`;

    return $.ajax({
        url: queryURL,
        method: "GET",
    })
}