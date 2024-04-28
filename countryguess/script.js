// Function to parse the CSV-like text data into an array of objects
function parseCountryData(csvText) {
    const lines = csvText.split('\n');
    const countryData = [];

    lines.forEach(line => {
        const data = line.split(',');
        if (data.length === 8) { // Expecting 8 fields per line
            const country = {
                name: data[0],
                population: data[1],
                area: data[2],
                government: data[3],
                currency: data[4],
                capital: data[5],
                countryCode: data[6], // Unused field
                continent: data[7]
            };
            countryData.push(country);
        }
    });

    return countryData;
}

// Function to retrieve country data by name
function getCountryData(countryName, countryData) {
    return countryData.find(country => country.name.toLowerCase() === countryName.toLowerCase());
}

// Load country data from the provided text file
function loadCountryData(callback) {
    fetch('stats.csv')
        .then(response => response.text())
        .then(csvText => {
            const countryData = parseCountryData(csvText);
            callback(countryData);
        })
        .catch(error => console.error('Error loading country data:', error));
}

// Variables to store country data and game state
let countryData;
let correctCountry;
let comparisonCountry;
let guessCount = 0;
const guesses = [];

// Choose a random country and comparison country
function chooseRandomCountries() {
    correctCountry = countryData[Math.floor(Math.random() * countryData.length)];
    do {
        comparisonCountry = countryData[Math.floor(Math.random() * countryData.length)];
    } while (comparisonCountry === correctCountry);
}

// Generate hint based on the current guess count
function generateHint() {
    guessCount++;
    let hint = "";
    switch (guessCount) {
        case 1:
            hint = `Population: ${correctCountry.population}`;
            break;
        case 2:
            hint = `Area: ${correctCountry.area}, which is ${getComparisonAreaRatio()} times the size of ${comparisonCountry.name}`;
            break;
        case 3:
            hint = `The country is located in ${correctCountry.continent}`;
            break;
        case 4:
            hint = `The type of government is: ${correctCountry.government}`;
            break;
        case 5:
            hint = `Currency: ${correctCountry.currency}`;
            break;
        case 6:
            hint = `Capital city: ${correctCountry.capital}`;
            break;
        default:
            hint = "";
    }
    return hint;
}

// Calculate area ratio between the correct country and comparison country
function getComparisonAreaRatio() {
    //return parseFloat(correctCountry.area.replace(/\s/g, '')) / parseFloat(comparisonCountry.area.replace(/\s/g, ''));
    const ratio = parseFloat(correctCountry.area.replace(/\s/g, '')) / parseFloat(comparisonCountry.area.replace(/\s/g, ''));
    return ratio.toFixed(2);
}

// Play the game
function playGame(guess) {
    const guessedCountry = countryData.find(country => country.name.toLowerCase() === guess.toLowerCase());
    guesses.push(guess);
    
    if (guessedCountry) {
        if (guessedCountry.name.toLowerCase() === correctCountry.name.toLowerCase()) {
            return `Correct! You guessed ${guess}!`;
        } else {
            return `Wrong guess! Here's a hint: ${generateHint()}`;
        }
    } else {
        return `Invalid country name. Please enter a valid country name.`;
    }
}

function updateGuessesContainer() {
    const guessesContainer = document.getElementById('guesses-container');
    guessesContainer.innerHTML = `<p>Previous guesses: ${guesses.join(', \n ')}</p>`;
}

// Event listener for the submit button
document.getElementById('submit-button').addEventListener('click', function() {
    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value.trim();
    
    if (guess) {
        const resultMessage = playGame(guess);
        document.getElementById('message-container').textContent = resultMessage;
        updateGuessesContainer();
        guessInput.value = '';
    } else {
        document.getElementById('message-container').textContent = "Please enter a country name. ";
    }
});

// Event listener for replay button
document.getElementById('play-again-button').addEventListener('click', function() {
    window.location.reload(); // play again = reload page lol
});

// Allow press Enter key to guess
document.getElementById('guess-input').addEventListener('keypress', function(event){
    if (event.key === 'Enter') {
        document.getElementById('submit-button').click();
    }
});

// Load country data and start the game
loadCountryData(data => {
    countryData = data;
    chooseRandomCountries();
});
