/* MOS-WWI25B_Gruppe_5 */

const gameList = document.querySelector("#game-list");
const yearFilter = document.querySelector("#year-filter");

function renderGames(gameEntries) {
    gameList.replaceChildren();

    if(gameEntries.length === 0){
        const message = document.createElement("p");
        message.textContent = "Keine Spiele für diese Auswahl gefunden.";
        gameList.append(message);
        return;
    }

    gameEntries.forEach((game) => {
        const card = document.createElement("article");
        card.className = "game-card";

        const title = document.createElement("h3");
        title.textContent = game.title;

        const year = document.createElement("p");
        year.textContent = `Erscheinungsjahr: ${game.year}`;

        card.append(title, year);
        gameList.append(card);
    });
}

function getGamesForSelectedYear(){
    const selectedYear = yearFilter.value;
    return games.filter((game) => {
        return selectedYear === "" || String(game.year) === selectedYear;
    });
}

function updateGameList(){
    renderGames(getGamesForSelectedYear());
}

yearFilter.addEventListener("change", updateGameList);

renderGames(games);