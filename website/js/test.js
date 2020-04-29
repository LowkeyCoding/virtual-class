var numberGuess = () => {
    // initialize the needed variables;
	let secretNumber;
	let numberIn;
	let trialNumber = 0;
    let done = false;
    // math.random generates a random number between 0 and 1, where 1 is excluded and 0 is included. By multiplying by a 100 i gives a number between 0 and 99.
    // The number is rounded to ensure it's a valid integer.
	secretNumber = Math.round(Math.random()*100)
	while(!done) {
        // increments the amount of guesses needed to guess the secret number
        ++trialNumber;
        // Gets the user input and ensures it is a vaild integer.
        numberIn = parseInt(window.prompt("Enter your guess (between 0 and 99):","0-99"));
        // Checks wheter the current input is the secrect number
		if(numberIn == secretNumber){
			console.log("Congratulation"); done = true;
        } 
        // Gives a hint on wheter the secrect number is higher or lower than the current guess
        else
            numberIn < secretNumber ? console.log("Try higher") : console.log("Try lower"); 
    }
    // Outputs the amount of trials it took to guess the secret number.
    console.log("You got it in " + trialNumber + " trials");
}
// OUTPUT
// IN: numberGuess()    OUT: You got it in 7 trials
// IN: 50               OUT: Try lower 
// IN: 25               OUT: Try higher
// IN: 35               OUT: Try lower
// IN: 30               OUT: Try higher
// IN: 32               OUT: Try higher
// IN: 33               OUT: Try higher
// IN: 34               OUT: Congratulation
// IN: NULL             OUT: You got it in 7 trials
// API URL
var dataURL ='https://cors.walsted.dev/https://opendata.ecdc.europa.eu/covid19/casedistribution/json/';
// Copi af data
var globalData;

var getJSON = (url, callback) => {
    // start request object
    var xhr = new XMLHttpRequest();
    // Definere request typen "GET"
    xhr.open('GET', url, true);
    // Definer den forventer type "JSON"
    xhr.responseType = 'json';
    // Definer hvordan request dataen skal håndteres når den modtages
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) { // status 200 = OK
            callback(null, xhr.response); // kør callback funktionen
        } else {
            callback(status, xhr.response); // kør callback funktionen
        }
    };
    // send requesten
    xhr.send();
};

// fÃ¥ data og tegn graf
getJSON( dataURL, (err, data) => {
  if (err !== null) {
    alert('Something went wrong: ' + err);
  } else {
    // Set globalData til resposen data
    globalData = data;

    // Sortere og filtrere data
    var dkData = GetCountryData("Denmark", data);
    var dates = GetDates(dkData);
    var deaths = GetDeaths(dkData);
    var cases = GetCases(dkData);

    // Konfiguere graf
    config = {
        type: 'line',
        options: {
          title: {
            display: true,
            text: 'Corona tilfÃ¦lde i Danmark'
          }
        },
        data:{
            labels:dates,
            datasets:[
                {
                  data: deaths,
                  label: "DÃ¸dsfald",
                  borderColor: "#FF0000",
                  fill: false
                },
                {
                  data: cases,
                  label: "Smittede",
                  borderColor: "#FFFF00",
                  fill: false
                }
            ]
        }
    };
    // Lav Graf
    new Chart(document.getElementById('canvas'), config);
  }
});

// FÃ¥ datoer fra datasÃ¦t
function GetDates(data){
    return Object.values(data).map(a => a.dateRep);
}
// FÃ¥ antal dÃ¸de fra datasÃ¦t
function GetDeaths(data){
    return Object.values(data).map(a => a.deaths);
}
// FÃ¥ antal smittede fra datasÃ¦t
function GetCases(data){
  return Object.values(data).map(a => a.cases);
}
// FÃ¥ data fra specifikt land fra datasÃ¦t
function GetCountryData(name, data){
  var values = Object.values(data)[0].filter(x=>x.countriesAndTerritories===name).reverse();
  // Fjern unÃ¸dvendig data
  for (i = 0; i < values.length; i++){
    if(values[i].cases != 0 || values[i].deaths != 0)
        return values.slice(i);
  }
  return values;
}