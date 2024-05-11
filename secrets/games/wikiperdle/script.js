// List of game articles (Replace this array with the data from your .txt file)
const gameArticles = [
    "Facebook",
    "United States",
    "Donald Trump",
    "Wikipedia",
    "Elizabeth II",
    "Google",
    "India",
    "Barack Obama",
    "Bible",
    "Cristiano Ronaldo",
    "World War II",
    "United Kingdom",
    "Michael Jackson",
    "Elon Musk",
    "Cleopatra",
    "Lady Gaga",
    "Adolf Hitler",
    "Eminem",
    "Lionel Messi",
    "Game of Thrones",
    "World War I",
    "The Beatles",
    "Justin Bieber",
    "Canada",
    "Freddie Mercury",
    "Kim Kardashian",
    "Johnny Depp",
    "Steve Jobs",
    "Dwayne Johnson",
    "Michael Jordan",
    "Australia",
    "The Big Bang Theory",
    "Taylor Swift",
    "Stephen Hawking",
    "China",
    "Malware",
    "Russia",
    "New York City",
    "Japan",
    "Kanye West",
    "Abraham Lincoln",
    "LeBron James",
    "Darth Vader",
    "Star Wars",
    "Miley Cyrus",
    "Germany",
    "Leonardo DiCaprio",
    "Kobe Bryant",
    "Selena Gomez",
    "Joe Biden",
    "Tom Cruise",
    "Rihanna",
    "Albert Einstein",
    "Academy Awards",
    "Prince Philip",
    "Harry Potter",
    "Elvis Presley",
    "The Walking Dead ",
    "Scarlett Johansson",
    "Lil Wayne",
    "Tupac Shakur",
    "Angelina Jolie",
    "Queen Victoria",
    "Jeffrey Dahmer",
    "John F. Kennedy",
    "COVID-19",
    "Marilyn Monroe",
    "Keanu Reeves",
    "Arnold Schwarzenegger",
    "How I Met Your Mother",
    "Chernobyl disaster",
    "France",
    "Ariana Grande",
    "Jennifer Aniston",
    "Breaking Bad",
    "Muhammad Ali",
    "Will Smith",
    "Ted Bundy",
    "Pablo Escobar",
    "Mila Kunis",
    "Vietnam War",
    "Mark Zuckerberg",
    "Manchester United F.C.",
    "William Shakespeare",
    "Titanic",
    "Tom Brady",
    "Jay-Z",
    "Singapore",
    "Earth",
    "Bill Gates",
    "Winston Churchill",
    "Bruce Lee",
    "Nicki Minaj",
    "Israel",
    "John Cena",
    "Charles Manson",
    "Ryan Reynolds",
    "Brad Pitt",
    "Vladimir Putin",
    "Earth",
    "Sun",
    "Moon",
    "Black hole",
    "Mars",
    "Solar System",
    "Pluto",
    "Big Bang",
    "Milky Way",
    "Saturn",
    "Universe",
    "Dark matter",
    "Galaxy",
    "Jupiter",
    "Venus",
    "Supernovae",
    "Andromeda Galaxy",
    "Neptune",
    "Uranus",
    "Solar eclipse",
    "Lunar eclipse",
    "Dark energy",
    "Halley's Comet",
    "Event horizon",
    "Eclipse",
    "Sirius",
    "Winter solstice",
    "Alpha Centauri",
    "Mount Everest",
    "Bermuda Triangle",
    "Africa",
    "Hurricane Katrina",
    "North America",
    "Earthquake",
    "Climate change",
    "Continent",
    "Antarctica",
    "Asia",
    "Tsunami",
    "Volcano",
    "South America",
    "Grand Canyon",
    "Canary Islands",
    "Himalayas",
    "Yellowstone",
    "Americas",
    "Nile",
    "Crimea",
    "Mississippi",
    "Ocean",
    "Pacific Ocean",
    "Balkans",
    "Lightning",
    "Ice Age",
    "Atlantic Ocean",
    "Amazon River",
    "Ganges",
    "Palau",
    "Long Island",
    "Cat",
    "Dog",
    "Animal",
    "Lion",
    "Coronavirus",
    "Tiger",
    "Human",
    "Dinosaur",
    "Elephant",
    "Virus",
    "Horse",
    "Photosynthesis",
    "Evolution",
    "Apple",
    "Bird",
    "Mammal",
    "Potato",
    "Polar bear",
    "Shark",
    "Snake",
    "Spider",
    "Rabbit",
    "Platypus",
    "Dolphin",
    "Tyrannosaurus",
    "Cougar",
    "Jaguar",
    "Chicken",
    "Maize",
    "Cattle",
    "Dodo",
    "Tomato",
    "Cheetah",
    "Giraffe",
    "Bear",
    "Raccoon",
    "Octopus"
];

// Function to fetch and parse XML data from a Wikipedia article
async function fetchArticleData(articleTitle) {
    const response = await fetch(`https://en.wikipedia.org/wiki/${articleTitle}`);
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    return xmlDoc;
}

// Function to extract links from XML data
function extractLinks(xmlDoc) {
    const linkElements = xmlDoc.querySelectorAll('a');
    const links = [];
    linkElements.forEach(linkElement => {
        const href = linkElement.getAttribute('href');
        if (href && href.startsWith('/wiki/') && !href.includes(':')) {
            links.push(href);
        }
    });
    return links;
}

// Function to handle player guesses
function guess() {
    const playerGuess = document.getElementById('guess-input').value.trim().toLowerCase();
    const answer = gameArticles[Math.floor(Math.random() * gameArticles.length)];
    fetchArticleData(answer).then(xmlDoc => {
        const articleList = extractLinks(xmlDoc);
        if (articleList.some(link => link.toLowerCase().includes(playerGuess))) {
            displayMessage(`Correct! You guessed "${playerGuess}"!`);
        } else {
            displayMessage(`Wrong guess! The correct answer was "${answer}".`);
        }
    }).catch(error => {
        console.error('Error fetching article data:', error);
        displayMessage(`Error: Unable to fetch article data. Please try again.`);
    });
}

// Function to display messages to the player
function displayMessage(message) {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
}

// Event listener for the guess button
document.getElementById('guess-button').addEventListener('click', guess);

// Event listener for pressing Enter in the guess input field
document.getElementById('guess-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        guess();
    }
});

// Initial message
displayMessage(`Guess the topic of a random Wikipedia article.`);
