var Promise = require('bluebird');
var http = require('http');
var url = 'http://api.openweathermap.org/data/2.5/weather?q=';
var id = '&appid='
var myAPIToken = '7e39edcee81697d3718dca8fac06d4ba';
var unit = '&units=imperial';
var mode = '&mode=html';



function getCity() {
    return new Promise(function(resolve) {
        http.get('http://freegeoip.net/json/', function(res) {
            res.setEncoding('utf8');
            res.on('data', function(data) {
                data = JSON.parse(data);
                resolve(data);
            });
        })

    });
}

getCity().then(function(data) {
    var city = data.city;
    var state = data.region_code;
    var temperatureString = '';
    var temperatureInDegrees = 0;

    function result() {
        return new Promise(function(resolve) {
            http.get(url + city + unit + id + myAPIToken, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(data) {
                    resolve(data);
                });
                res.on('error', console.error);
            });
        });
    }

    result().then(function(data) {
        data = JSON.parse(data);
       	temperatureString = JSON.stringify(data.main.temp);
        temperatureInDegrees = Math.floor(Number(temperatureString));

        var elem = document.querySelectorAll('#location,#temp');
        elem[0].innerHTML = 'Current Location:   ' + city + ', ' + state;
        elem[1].innerHTML = 'Current Temperature:   ' + temperatureInDegrees + '°F';
        console.log('Current Location: ' + city + ', ' + state)
        console.log('Current Temperature: ' + temperatureInDegrees + '°F');

    });
});
