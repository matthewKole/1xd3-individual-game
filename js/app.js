const game = new MemoryGame ();
let playerCanClick = false;

renderGrid();
flashPattern();

function renderGrid() {
        const gridContainer = document.getElementById("gridContainer");
        gridContainer.innerHTML = "";

        for (let ctr = 0; ctr < game.gridSize; ctr++){
            for (let j = 0; j < game.gridSize; j++){
                const tile = document.createElement("button");
                tile.classList.add("tile");
                tile.dataset.x = ctr;
                tile.dataset.y = j;
                gridContainer.appendChild(tile);
            }
        }
}

function flashPattern(){
    game.generatePattern();
    playerCanClick = false;

    for (let i = 0; i < game.gridSize; i++){
        for (let j = 0; j < game.gridSize; j++){
            const tile = document.querySelector(`.tile[data-x="${i}"][data-y="${j}"]`);
            if (game.grid[i][j] == 1){
                tile.classList.add("active");
                setTimeout(() => {
                    tile.classList.remove("active");
                }, 2000);
            }
        }
    }

    playerCanClick = true;
}

function handleTileClick(){
    tile.addEventListener("click", () => {
        if (playerCanClick){
            const x = parseInt(tile.dataset.x);
            const y = parseInt(tile.dataset.y);
            let result = game.checkInput(x, y);

            if (result == "correct"){
                tile.classList.add("active");
            }
            else if (result == "wrong"){
                tile.classList.add("wrongTile");
            }
            else{
                game.nextLevel();
                renderGrid();
                flashPattern();
            }
        }
    });
}