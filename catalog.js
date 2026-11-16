/* MOS-WWI25B_Gruppe_5 */

const gameList = document.querySelector("#game-list");

function renderGames(gameEntries) {
    gameList.replaceChildren();

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

renderGames(games);