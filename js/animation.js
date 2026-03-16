/**
 * @file animation.js
 * @author Matthew Kolesnik
 * @date March 14, 2026
 * @description Canvas splash screen animation for the Visual Memory Game.
 *              Draws an animated grid of flashing tiles, then calls onReady()
 *              to reveal the Start button.
 */

/**
 * Runs the splash screen animation on the introCanvas element.
 * Each tile in a 3x3 grid flashes once in a random order, then
 * the canvas fades out and onReady is called.
 *
 * @param {function} onReady - Callback invoked when the animation finishes
 *                             and the start button should be shown.
 */
function runSplashAnimation(onReady) {
    const canvas = document.getElementById("introCanvas");
    const ctx    = canvas.getContext("2d");

    canvas.width  = Math.min(window.innerWidth * 0.9, 400);
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
            tiles.push({
                x: GAP + c * (TILE_SIZE + GAP),
                y: GAP + r * (TILE_SIZE + GAP),
                lit: false
            });
        }
    }

    if (!ctx.roundRect) {
        ctx.roundRect = function (x, y, w, h, r) {
            const radius = Math.min(r, w / 2, h / 2);
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + w - radius, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
            ctx.lineTo(x + w, y + h - radius);
            ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
            ctx.lineTo(x + radius, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        };
    }

    /**
     * Clears the canvas and redraws all tiles at their current lit state.
     */
    function drawFrame() {
        ctx.fillStyle = BG_CLR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        tiles.forEach(function (tile) {
            ctx.fillStyle = tile.lit ? FLASH_CLR : TILE_CLR;
            const radius = TILE_SIZE * 0.1;
            ctx.beginPath();
            ctx.roundRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE, radius);
            ctx.fill();
        });
    }

    const sequence = tiles.map((_, i) => i).sort(() => Math.random() - 0.5);
    let   seqIndex = 0;
    const FLASH_MS = 250;
    const STEP_MS  = 350;

    /**
     * Advances the flash sequence by one tile. When all tiles have flashed,
     * fades the canvas out and calls onReady.
     */
    function flashNext() {
        if (seqIndex >= sequence.length) {
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

        setTimeout(function () {
            tiles[idx].lit = false;
            drawFrame();
            setTimeout(flashNext, STEP_MS - FLASH_MS);
        }, FLASH_MS);
    }

    drawFrame();
    setTimeout(flashNext, 500);
}