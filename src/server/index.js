const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
var path = require('path');
const app = express();

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

console.log(__dirname);

app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

// designates what port the app will listen to for incoming requests
app.listen(8000, function () {
    console.log('Example app listening on port 8000!');
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse);
})

//JS object to hold weather data
let weatherData = {};

//Post route for weather data
app.post('/addWeather', addWeather) 

function addWeather(request, response) {
    let data = request.body;
    console.log(data);

    weatherData['destination'] = data.destination,
    weatherData['country'] = data.country;
    weatherData['latitude'] = data.latitude,
    weatherData['longitude'] = data.longitude,
    weatherData['departure'] = data.departureDate

    console.log(weatherData);
    alert(weatherData);
}