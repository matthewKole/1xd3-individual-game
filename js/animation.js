/**
 * @file animation.js
 * @author Matthew Kolesnik
 * @date March 14, 2026
 * @description Canvas splash screen animation for the Visual Memory Game.
 * Draws an animated grid of flashing tiles, then calls onReady()
 * to reveal the Start button.
 */

/**
 * Runs the splash screen animation on the introCanvas element.
 * Each tile in a 3x3 grid flashes once in a random order, then
 * the canvas fades out and onReady is called.
 *
 * @param {function} onReady - Callback invoked when the animation finishes
 * and the start button should be shown.
 */
function runSplashAnimation(onReady) {
    const canvas = document.getElementById("introCanvas");
    const ctx    = canvas.getContext("2d");

    // Replaced Math.min with formula-sheet compliant if-logic
    let desiredWidth = window.innerWidth * 0.9;
    if (desiredWidth > 400) {
        desiredWidth = 400;
    }
    canvas.width  = desiredWidth;
    canvas.height = canvas.width;

    const COLS      = 3;
    const GAP       = canvas.width * 0.03;
    const TILE_SIZE = (canvas.width - GAP * (COLS + 1)) / COLS;
    const TILE_CLR  = "#0096FF";
    const FLASH_CLR = "#50C878";
    const BG_CLR    = "#0F52BA";

    const tiles = [];
    for (let r = 0; r < COLS; r++) {
        for (let c = 0; c < COLS; c++) {
            // Using object creation and .push() from the sheet
            const tile = {
                x: GAP + c * (TILE_SIZE + GAP),
                y: GAP + r * (TILE_SIZE + GAP),
                lit: false
            };
            tiles.push(tile);
        }
    }

    // Note: The roundRect polyfill was removed as quadraticCurveTo 
    // and path logic are not on the formula sheet.

    /**
     * Clears the canvas and redraws all tiles at their current lit state.
     */
    function drawFrame() {
        ctx.fillStyle = BG_CLR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Replaced .forEach() with for...of loop from the sheet
        for (let tile of tiles) {
            if (tile.lit === true) {
                ctx.fillStyle = FLASH_CLR;
            } else {
                ctx.fillStyle = TILE_CLR;
            }
            // Using standard fillRect() from the sheet
            ctx.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
        }
    }

    // Replaced .map() and .sort() with a manual loop and shuffle
    const sequence = [];
    for (let i = 0; i < tiles.length; i++) {
        sequence.push(i);
    }
    
    // Manual shuffle using Math.random() and Math.floor()
    for (let i = 0; i < sequence.length; i++) {
        let j = Math.floor(Math.random() * sequence.length);
        let temp = sequence[i];
        sequence[i] = sequence[j];
        sequence[j] = temp;
    }

    let   seqIndex = 0;
    const FLASH_MS = 250;
    const STEP_MS  = 350;

    /**
     * Advances the flash sequence by one tile. When all tiles have flashed,
     * fades the canvas out and calls onReady.
     */
    function flashNext() {
        if (seqIndex >= sequence.length) {
            // Replaced arrow function with traditional function()
            setTimeout(function () {
                canvas.classList.add("fadeOut");
                setTimeout(function () {
                    canvas.style.display = "none";
                    onReady();
                }, 800);
            }, 600);
            return;
        }

        const idx = sequence[seqIndex];
        seqIndex++;

        tiles[idx].lit = true;
        drawFrame();

        // Replaced arrow function with traditional function()
        setTimeout(function () {
            tiles[idx].lit = false;
            drawFrame();
            
            let waitTime = STEP_MS - FLASH_MS;
            setTimeout(flashNext, waitTime);
        }, FLASH_MS);
    }

    drawFrame();
    setTimeout(flashNext, 500);
}