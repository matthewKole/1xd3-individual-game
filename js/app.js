/**
 * @file app.js
 * @author Matthew Kolesnik
 * @date March 14, 2026
 * @description Controller for the Visual Memory Game.
 *              Handles all DOM manipulation, screen transitions,
 *              and wires up the MemoryGame model (game.js) to the view.
 *              All code runs inside a DOMContentLoaded event listener.
 */

document.addEventListener("DOMContentLoaded", function () {

    let game = new MemoryGame();
    let playerCanClick = false;

    /**
     * Rebuilds the tile grid from scratch based on game.gridSize.
     * Attaches a click listener to every tile.
     */
    function renderGrid() {
        const gridContainer = document.getElementById("gridContainer");
        gridContainer.innerHTML = "";
        document.documentElement.style.setProperty("--grid-size", game.gridSize);

        for (let ctr = 0; ctr < game.gridSize; ctr++) {
            for (let j = 0; j < game.gridSize; j++) {
                const tile = document.createElement("button");
                tile.classList.add("tile");
                tile.dataset.x = ctr;
                tile.dataset.y = j;
                gridContainer.appendChild(tile);

                tile.addEventListener("click", () => {
                    if (!playerCanClick) return;

                    const x      = parseInt(tile.dataset.x, 10);
                    const y      = parseInt(tile.dataset.y, 10);
                    const result = game.checkInput(x, y);

                    if (result === "correct") {
                        tile.classList.add("active");

                    } else if (result === "wrong") {
                        tile.classList.add("wrongTile");
                        playerCanClick = false;

                        const gameOver = game.loseLife();
                        updateHeader();

                        if (gameOver === "game over") {
                            saveGameResult(game.level);
                            showResultsScreen(game.level);

                        } else {
                            const gameScreen = document.getElementById("game");
                            gameScreen.style.backgroundColor = "var(--continueScreenColour)";

                            setTimeout(() => {
                                gameScreen.style.backgroundColor = "var(--backgroundColour)";
                                game.resetRound();
                                renderGrid();
                                flashPattern(false);
                            }, 1000);
                        }

                    } else if (result === "next level") {
                        playerCanClick = false;
                        game.nextLevel();
                        updateHeader();
                        renderGrid();
                        flashPattern(true);
                    }
                });
            }
        }
    }

    /**
     * Highlights the pattern tiles briefly so the player can memorise them.
     *
     * @param {boolean} shouldGenerate - If true, generates a new pattern first.
     *                                   If false, re-flashes the existing pattern.
     */
    function flashPattern(shouldGenerate = true) {
        if (shouldGenerate) game.generatePattern();
        playerCanClick = false;

        for (let i = 0; i < game.gridSize; i++) {
            for (let j = 0; j < game.gridSize; j++) {
                if (game.grid[i][j] === 1) {
                    const tile = document.querySelector(
                        `.tile[data-x="${i}"][data-y="${j}"]`
                    );
                    if (!tile) continue;
                    tile.classList.add("active");
                    setTimeout(() => {
                        tile.classList.remove("active");
                    }, 2000);
                }
            }
        }

        setTimeout(() => {
            playerCanClick = true;
        }, 2100);
    }

    /**
     * Updates the level and lives displays in the game header.
     */
    function updateHeader() {
        document.getElementById("levelDisplay").textContent = game.level;
        document.getElementById("livesDisplay").textContent = game.lives;
    }

    /**
     * Starts a fresh round by updating the header, rebuilding the grid,
     * and flashing the pattern.
     */
    function startRound() {
        updateHeader();
        renderGrid();
        flashPattern(true);
    }

    /**
     * Saves the result of a finished game to localStorage.
     * Keeps the 10 most recent games and tracks the best score.
     *
     * @param {number} levelReached - The level the player reached.
     */
    function saveGameResult(levelReached) {
        try {
            const best = parseInt(localStorage.getItem("bestScore") || "0", 10);
            if (levelReached > best) {
                localStorage.setItem("bestScore", String(levelReached));
            }
            const history = JSON.parse(localStorage.getItem("gameHistory") || "[]");
            history.unshift({ level: levelReached, date: new Date().toISOString() });
            localStorage.setItem("gameHistory", JSON.stringify(history.slice(0, 10)));
        } catch (e) {
            // Storage unavailable — game continues without saving.
        }
    }

    /**
     * Shows the results screen with level reached, best score, and game history.
     *
     * @param {number} levelReached - The level the player reached.
     */
    function showResultsScreen(levelReached) {
        document.getElementById("levelReached").textContent = levelReached;

        let bestScore = "0";
        try {
            bestScore = localStorage.getItem("bestScore") || "0";
        } catch (e) { /* storage unavailable */ }
        document.getElementById("bestScore").textContent = bestScore;

        const list = document.getElementById("gameHistoryList");
        list.innerHTML = "";

        let history = [];
        try {
            history = JSON.parse(localStorage.getItem("gameHistory") || "[]");
        } catch (e) {
            // History unreadable — show empty list.
        }

        history.forEach(function (entry) {
            const li = document.createElement("li");
            li.textContent =
                "Level " + entry.level +
                " — " + new Date(entry.date).toLocaleDateString();
            list.appendChild(li);
        });

        document.getElementById("game").classList.add("gameHidden");
        document.getElementById("resultsScreen").classList.remove("resultsHidden");
    }

    /**
     * Hides the splash and results screens and shows the game screen.
     */
    function showGameScreen() {
        document.getElementById("splashScreen").classList.add("animationHidden");
        document.getElementById("resultsScreen").classList.add("resultsHidden");
        document.getElementById("game").classList.remove("gameHidden");
    }

    /**
     * Shows the help modal overlay.
     */
    function showHelpModal() {
        document.getElementById("helpModal").classList.remove("helpModalHidden");
    }

    /**
     * Hides the help modal overlay.
     */
    function hideHelpModal() {
        document.getElementById("helpModal").classList.add("helpModalHidden");
    }

    document.getElementById("splashScreen").classList.remove("animationHidden");

    runSplashAnimation(function () {
        document.getElementById("splashStartContent").classList.add("visible");
    });

    document.getElementById("startBtn").addEventListener("click", function () {
        showGameScreen();
        startRound();
    });

    document.getElementById("tryAgainBtn").addEventListener("click", function () {
        game = new MemoryGame();
        showGameScreen();
        startRound();
    });

    document.getElementById("helpBtn").addEventListener("click", showHelpModal);
    document.getElementById("helpCloseBtn").addEventListener("click", hideHelpModal);

});