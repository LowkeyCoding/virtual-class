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