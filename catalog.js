/* MOS-WWI25B_Gruppe_5 */

const STORAGE_KEY = "retro-game-library-user-games";
const FAVORITES_STORAGE_KEY = "retro-game-library-favorites";

const gameList = document.querySelector("#game-list");
const yearFilter = document.querySelector("#year-filter");
const searchInput = document.querySelector("#game-search");
const favoritesOnly = document.querySelector("#favorites-only");
const resultStatus = document.querySelector("#result-status");

const newGameForm = document.querySelector("#new-game-form");
const newGameTitle = document.querySelector("#new-game-title");
const newGameYear = document.querySelector("#new-game-year");
const newGameStatus = document.querySelector("#form-status");

let userGames = loadUserGames();
let favoriteIds = loadFavoriteIds();

function loadFavoriteIds() {
    try {
        const savedIds = JSON.parse(
            localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]"
        );

        if (!Array.isArray(savedIds)) {
            return [];
        }

        return savedIds.filter(Number.isInteger);
    } catch {
        resultStatus.textContent =
            "Gespeicherte Favoriten konnten nicht geladen werden.";
        return [];
    }
}

function loadUserGames(){
    try {
        const savedGames = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        
        if(!Array.isArray(savedGames)){
            return [];
        }

        return savedGames.filter(isValidGame);
    } catch {
        return [];
    }
}

function isValidGame(game) {
    return (game !== null && 
        typeof game === "object" &&
        Number.isInteger(game.id) &&
        typeof game.title === "string" &&
        game.title.trim().length > 0 &&
        Number.isInteger(game.year) &&
        game.year >= 1990 &&
        game.year <= 2000
    );
}

function saveUserGames(){
    try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userGames));
        return true;
    } catch {
        return false;
    }
}

function toggleFavorite(gameId) {
    if (favoriteIds.includes(gameId)) {
        favoriteIds = favoriteIds.filter((id) => id !== gameId);
    } else {
        favoriteIds.push(gameId);
    }

    try {
        localStorage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify(favoriteIds)
        );

        resultStatus.textContent = "";
    } catch {
        resultStatus.textContent =
            "Die Favoritenauswahl gilt für diese Sitzung, konnte aber nicht dauerhaft gespeichert werden.";
    }

    updateGameList();
}

function getAllGames(){
    return [...games, ...userGames];
}

function getNextGameId(){
    const ids = getAllGames().map((game) => Number(game.id)).filter(Number.isInteger);

    return Math.max(0, ...ids) + 1;
}

function handleNewGameSubmit(event){
    event.preventDefault();
    if(!newGameForm.reportValidity()){
        return;
    }

    const title = newGameTitle.value.trim();
    const year = newGameYear.valueAsNumber;

    if(title.length === 0 || !Number.isInteger(year) || year < 1990 || year > 2000){
        newGameStatus.textContent = "Bitte einen Titel und ein gültiges Jahr von 1990 bis 2000 eingeben.";
        return;
    }

    userGames.push({id: getNextGameId(), title, year});
    
    const wasSaved = saveUserGames();

    newGameForm.reset();
    searchInput.value = "";
    yearFilter.value = "";
    favoritesOnly.checked = false;

    updateGameList();

    newGameStatus.textContent = wasSaved 
        ? `"${title}" wurde hinzugefügt und gespeichert.`
        : `"${title}" wurde hinzugefügt, konnte aber nicht dauerhaft gespeichert.`;
}

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

        const favoriteButton = document.createElement("button");
        favoriteButton.type = "button";

        const isFavorite = favoriteIds.includes(game.id);

        favoriteButton.textContent = isFavorite
            ? "Favorit entfernen"
            : "Als Favorit speichern";

        favoriteButton.addEventListener("click", () => {
            toggleFavorite(game.id);
        });

        card.append(title, year, favoriteButton);
        gameList.append(card);
    });
}

function getFilteredGames(){
    const searchTerm = searchInput.value.trim().toLocaleLowerCase("de");
    const selectedYear = yearFilter.value;
    return getAllGames().filter((game) => {
        const matchesTitle = game.title.toLocaleLowerCase("de").includes(searchTerm);

        const matchesYear = selectedYear === "" || String(game.year) === selectedYear;

        const matchesFavorites =
            !favoritesOnly.checked || favoriteIds.includes(game.id);

        return matchesTitle && matchesYear &&matchesFavorites;
    });
}

function updateGameList(){
    renderGames(getFilteredGames());
}

yearFilter.addEventListener("change", updateGameList);
searchInput.addEventListener("input", updateGameList);
favoritesOnly.addEventListener("change", updateGameList);
newGameForm.addEventListener("submit", handleNewGameSubmit);

updateGameList();