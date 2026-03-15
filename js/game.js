class MemoryGame {

    constructor(){
        this.level = 1;
        this.lives = 3;
        this.pattern = [];
        this.correctGuesses = 0;
        this.gridSize = 3;
        
        //Fills grid as a square based on gridsize with 0's
        this.grid = [];
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Array(this.gridSize).fill(0);
        }

    }

    generatePattern(){

        this.grid = [];
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = new Array(this.gridSize).fill(0);
        }

        for(let i = 0; i < this.level; i++){
            let randomNumX = Math.floor(Math.random() * this.gridSize);
            let randomNumY = Math.floor(Math.random() * this.gridSize);
            
            if (this.grid[randomNumX][randomNumY] == 1){
                i--;
            }
            else{
                this.grid[randomNumX][randomNumY] = 1;
            }
        }
    }

    checkInput(x, y){
        if (this.grid[x][y] == 1){
            this.grid[x][y] = 2;
            this.correctGuesses++;
            if (this.correctGuesses == this.level){
                return "next level";
            }
            return "correct";
        }
        else if (this.grid[x][y] == 2){
            return "already guessed";
        }
        else{
            return "wrong";
        }
    }

    nextLevel(){
        this.level++;
        this.gridSize = this.getGridSize();
        this.correctGuesses = 0;
    }

    loseLife(){
        this.lives--;

        if (this.lives == 0){
            return "game over"
        }
    }

    getGridSize() {
        if (this.level <= 3) return 3;
        if (this.level <= 6) return 4;
        if (this.level <= 9) return 5;
        if (this.level <= 12) return 6;
        if (this.level <= 15) return 7;
    }
}