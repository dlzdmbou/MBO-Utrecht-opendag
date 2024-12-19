// Utility function to manage cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

// Highscore list setup
const MAX_HIGHSCORES = 20;

// Retrieve the highscore list
export function getHighscoreList() {
    const cookie = getCookie('highscores');
    return cookie ? JSON.parse(cookie) : [];
}

// Save the highscore list
function saveHighscoreList(highscores) {
    setCookie('highscores', JSON.stringify(highscores), 365); // 1 year
}

// Add a new score to the highscore list
export function addHighscore(playerName, score, misses, accuracyRating, totalScore) {
    const highscores = getHighscoreList();

    // Create a new entry
    if (playerName === '') {
        playerName = '???';
    }
    const newEntry = { playerName, score, misses, accuracyRating, totalScore };

    // Add and sort the list
    highscores.push(newEntry);
    highscores.sort((a, b) => b.totalScore - a.totalScore); // Descending order by totalScore

    // Limit to the top MAX_HIGHSCORES entries
    if (highscores.length > MAX_HIGHSCORES) {
        highscores.pop();
    }

    // Save back to the cookie
    saveHighscoreList(highscores);
}

// Check if a score qualifies for the highscore list
export function qualifiesForHighscore(score, misses, accuracyRating, totalScore) {
    const highscores = getHighscoreList();

    // Check if the list has room or the new score beats the lowest
    return highscores.length < MAX_HIGHSCORES || totalScore > highscores[highscores.length - 1].totalScore;
}

// Clear the highscore list
export function clearHighscores() {
    setCookie('highscores', JSON.stringify([]), 365); // Save an empty array in the cookie
}
