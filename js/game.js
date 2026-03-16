/**
 * @file game.js
 * @author Your Name
 * @date January 1, 2026
 * @description Model for the Visual Memory Game.
 *              The MemoryGame class tracks all game state including level,
 *              lives, grid contents, and pattern data.
 * @course CS 1XD3, McMaster University, 2026
 */

class MemoryGame {

    /**
     * Creates a new MemoryGame instance at level 1 with 3 lives
     * and a 3x3 grid filled with zeros.
     */
    constructor() {
        this.level = 1;
        this.lives = 3;
        this.correctGuesses = 0;
        this.gridSize = 3;
        this.tilesInPattern = this.level;

        this.grid = [];
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Array(this.gridSize).fill(0);
        }
    }

    /**
     * Generates a new pattern for the current level by randomly placing
     * active tiles on the grid. Resets the grid before placing tiles.
     * Stores the tile count in tilesInPattern, capped at total grid cells.
     */
    generatePattern() {
        this.grid = [];
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Array(this.gridSize).fill(0);
        }

        const totalCells = this.gridSize * this.gridSize;
        this.tilesInPattern = Math.min(this.level, totalCells);

        for (let i = 0; i < this.tilesInPattern; i++) {
            let randomNumX = Math.floor(Math.random() * this.gridSize);
            let randomNumY = Math.floor(Math.random() * this.gridSize);

            if (this.grid[randomNumX][randomNumY] === 1) {
                i--;
            } else {
                this.grid[randomNumX][randomNumY] = 1;
            }
        }
    }

    /**
     * Checks a player's tile selection against the pattern.
     * Marks a correct guess with 2 so it cannot be selected again.
     *
     * @param {number} x - Row index of the selected tile.
     * @param {number} y - Column index of the selected tile.
     * @returns {string} "correct" if the tile is part of the pattern,
     *                   "next level" if this guess completes the pattern,
     *                   "already guessed" if the tile was already selected,
     *                   "wrong" if the tile is not part of the pattern.
     */
    checkInput(x, y) {
        if (this.grid[x][y] === 1) {
            this.grid[x][y] = 2;
            this.correctGuesses++;
            if (this.correctGuesses === this.tilesInPattern) {
                return "next level";
            }
            return "correct";
        } else if (this.grid[x][y] === 2) {
            return "already guessed";
        } else {
            return "wrong";
        }
    }

    /**
     * Advances the game to the next level, incrementing the level counter,
     * updating the grid size, and resetting the correct guess count.
     */
    nextLevel() {
        this.level++;
        this.gridSize = this.getGridSize();
        this.correctGuesses = 0;
    }

    /**
     * Decrements the player's life count by one.
     *
     * @returns {string} "game over" if no lives remain, "continue" otherwise.
     */
    loseLife() {
        this.lives--;

        if (this.lives > 0) {
            return "continue";
        } else {
            return "game over";
        }
    }

    /**
     * Returns the grid size appropriate for the current level.
     * Grid size increases every three levels, up to a maximum of 8.
     *
     * @returns {number} The grid dimension (number of tiles per side).
     */
    getGridSize() {
        if (this.level <= 3)  return 3;
        if (this.level <= 6)  return 4;
        if (this.level <= 9)  return 5;
        if (this.level <= 12) return 6;
        if (this.level <= 15) return 7;
        if (this.level <= 18) return 8;
        return 8;
    }

    /**
     * Resets the current round after a wrong guess by restoring
     * all correctly guessed tiles (value 2) back to active (value 1)
     * and clearing the correct guess counter.
     */
    resetRound() {
        this.correctGuesses = 0;
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 2) this.grid[i][j] = 1;
            }
        }
    }
}