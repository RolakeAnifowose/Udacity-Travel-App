import { getTripLength } from './getTripLength';

//Weatherbit API
const weatherUrl = 'https://api.weatherbit.io/v2.0/current?';
// const weatherUrl = 'http://api.weatherbit.io/v2.0/forecast/daily?';
const weatherAPI = '92010b4cd42d48db92d5475ca3a969d8';

//Pixabay API
const pixabyUrl = 'https://pixabay.com/api?';
const pixabyAPI = '16474757-58135d921de29d80734653c8b';

//Geonames API
const geonamesUsername = 'rolake'; 
const geonameUrl = 'http://api.geonames.org/postalCodeSearchJSON?';

document.getElementById('generate').addEventListener('click', handleSubmit);

//Function to add content
function handleSubmit(event) {
    event.preventDefault();
    const destination = document.getElementById('zip').value;
    const departureDate = document.getElementById('departureDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const tripLength = getTripLength(departureDate, returnDate);
    const daysAway = getDays(departureDate);

    getGeoLocation(geonameUrl, destination, geonamesUsername)
    .then(function(data){
        try{
            let geoData = data.postalCodes;
            
            // console.log(goeData);
            getWeather(weatherUrl, destination, weatherAPI, daysAway)
            .then(function(weatherData){
                console.log('Weather Response for ', destination)
                console.log("Weather data is" + JSON.stringify(weatherData));
                try{
                    const departureDate = document.getElementById('departureDate').value;
                    const returnDate = document.getElementById('returnDate').value;
                    document.getElementById('location').innerHTML = "Destination: "+ destination;
                    document.getElementById('tripLength').innerHTML = "Trip length: " + tripLength + " days";
                    document.getElementById('departure').innerHTML = "Departure date " + departureDate;
                    document.getElementById('return').innerHTML = "Return date " + returnDate;
                    document.getElementById('daysAway').innerHTML = "Your trip is " + daysAway + " days away";
                    document.getElementById('temp').innerHTML = "Temperature: Max temperature = " + weatherData.high + " &  Min temperature = " + weatherData.low; 

                    const tripData = {
                        destination: data.placeName,
                        country: data.countryCode,
                        latitude: data.lat,
                        longitude: data.lng,
                        departure: date
                    };
                    postData('http://localhost:8000/addWeather', tripData)
                } catch(error) {
                    console.log(error);
                }
            });
            getImage(pixabyUrl, destination, pixabyAPI)
                .then(function(imageReturned){
                    document.getElementById('image').src = imageReturned["hits"][0].webformatURL;
                });
    } catch(error){
        console.log('Error', error);
    }
    });
}

//Function to get location from Geonames API
const getGeoLocation = async (geonameUrl, destination, geonamesUsername) => {
    console.log('Calling Geonames API');
    const response = await fetch(`${geonameUrl}placename=${destination}&maxRows=1&username=${geonamesUsername}`) 
    try {
        const data = await response.json;
        JSON.stringify(data);
        return data;
    } catch(error) {
        console.log("Error", error);
    }
}

//Function to get weather data from Weatherbit API
const getWeather = async (weatherUrl, destination, weatherAPI, days) => {
    const response = await fetch(`${weatherUrl}&city=${destination}&key=${weatherAPI}`) 
    try {
        const weatherData = await response.json;
        const weatherPrediction = {};
        weatherPrediction["high"] = weatherData['data'][0].high_temp;
        weatherPrediction["low"] = weatherData['data'][0].low_temp;
        return weatherPrediction;
        // return weatherData;
    } catch(error) {
        console.log("Error", error);
    }
}

//Function to get image from Pixaby API
const getImage = async (pixabyUrl, destination, pixabyAPI) => {
    const response = await fetch(`${pixabyUrl}key=${pixabyAPI}&q=destination+${destination}&image_type=photo`) 
    try {
        const imageData = await response.json();
        console.log(imageData);
        return(imageData);
    } catch(error) {
        console.log("Error", error);
    }
}

//Function to calculate how many days way the trip is
function getDays(departureDate){
    let dateGoing = new Date(departureDate);
    let travelDate = dateGoing.getTime();
    let today = new Date();
    let todaysDate = today.getTime();
    let daysDifference = Math.abs(travelDate - todaysDate);
    const oneDay = 1000*60*60*24;
    const daysAway = Math.round(daysDifference/oneDay);
    return daysAway;
}

//Async POST
let postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "http://localhost:8000/"
        },
        body: JSON.stringify(data)
    }) 
    try{
        const newData = await response.json();
        return newData;
    }catch (error) {
        console.log("Error", error);
    }
}

export { handleSubmit }