// Importeer code die data kan ophalen.
import * as highscoreManager from './highscoreManager.js';

// Begin de applicatie zodra de pagina is geladen.
window.load = init();

function init() {
    // haal leaderboard data op
    const leaderboard = highscoreManager.getHighscoreList();

    // Geef resultaten leaderboard weer in console. 
    // (Klik met de rechtermuis knop op de pagina in de browser > inspecteren / inspect element)
    console.log(leaderboard);

    // Koppel de tbody (tabel) uit de leaderboard.html pagina aan een JavaScript variabele.
    // Dit kunnen we doen met het "id" (in html id="voorbeeld")
    const tableBody = document.getElementById("leaderboard");

    // Maak html waar we data in kunnen stoppen die we opgeslagen hebben in de variabele "leaderboard"
    // We lopen door alle resultaten van onze leaderboard variabele (array) 
    // en we maken voor elk resultaat een rij in de tabel
    let html = '';
    leaderboard.forEach(speler => {
        console.log(speler.playerName);
        console.log(speler)
        // @TODO: Maak een tabel rij met de juiste variabele
        /*
        Tabel rij referentie HTML code, zo wordt eentabel gevuld met rijen.
        Dit kun je ook in leaderboard.html zien:
        <tr>
            <th></th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        Als we in onze browser nu in onze browser console kijken zien we onze data.
        Hier zien we de volgende variabelen terug komen;
            - playerName
            - misses
            - score
            - accuracyRating
            - totalScore
        
        We voegen nu de variabelen ook toe aan onze HTML.
        Dit doen we als volgt;
        <tr>
            <th>${speler.voorbeeld}</th>
            <td>${speler.voorbeeld}</td>
            <td>${speler.voorbeeld}</td>
            <td>${speler.voorbeeld}</td>
            <td>${speler.voorbeeld}</td>
        </tr>
        */
        html += `
            <tr>
                <th>${speler.playerName}</th>
                <td>${speler.misses}</td>
                <td>${speler.score}</td>
                <td>${speler.accuracyRating}%</td>
                <td>${speler.totalScore}</td>
            </tr>
        `
    });

    tableBody.innerHTML = html;
}