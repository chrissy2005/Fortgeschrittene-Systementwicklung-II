/* MOS-WWI25B_Gruppe_5 */

const gameList = document.querySelector("#game-list");
const yearFilter = document.querySelector("#year-filter");
const searchInput = document.querySelector("#game-search");

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

function getFilteredGames(){
    const searchTerm = searchInput.value.trim().toLocaleLowerCase("de");
    const selectedYear = yearFilter.value;
    return games.filter((game) => {
        const matchesTitle = game.title.toLocaleLowerCase("de").includes(searchTerm);

        const matchesYear = selectedYear === "" || String(game.year) === selectedYear;

        return matchesTitle && matchesYear;
    });
}

function updateGameList(){
    renderGames(getFilteredGames());
}

yearFilter.addEventListener("change", updateGameList);
searchInput.addEventListener("input", updateGameList);

updateGameList();