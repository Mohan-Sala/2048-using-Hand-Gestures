class Game2048 {
    constructor(size = 4) {
        this.size = size;
        this.grid = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('2048-best-score') || 0;
        this.won = false;
        this.over = false;
        
        // Listeners for UI updates
        this.onMove = null;
        this.onScoreUpdate = null;
        this.onGameOver = null;
        this.onWin = null;
        
        this.init();
    }

    init() {
        // Create empty grid
        this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
        this.score = 0;
        this.won = false;
        this.over = false;
        
        // Add two random tiles
        this.addRandomTile();
        this.addRandomTile();
    }

    getEmptyCells() {
        const cells = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) {
                    cells.push({ r, c });
                }
            }
        }
        return cells;
    }

    addRandomTile() {
        const emptyCells = this.getEmptyCells();
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90% chance of 2, 10% chance of 4
            const value = Math.random() < 0.9 ? 2 : 4;
            this.grid[randomCell.r][randomCell.c] = value;
            return { r: randomCell.r, c: randomCell.c, value };
        }
        return null;
    }

    // Move logic core function
    slide(row) {
        // Remove zeros
        let arr = row.filter(val => val !== 0);
        // Merge
        let addedScore = 0;
        let mergedIndices = [];
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                addedScore += arr[i];
                if (arr[i] === 2048 && !this.won) {
                    this.won = true;
                    if (this.onWin) this.onWin();
                }
                mergedIndices.push(i);
                arr.splice(i + 1, 1);
            }
        }
        // Add zeros back
        while (arr.length < this.size) {
            arr.push(0);
        }
        return { row: arr, score: addedScore, mergedIndices };
    }

    updateScore(val) {
        if (val > 0) {
            this.score += val;
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('2048-best-score', this.bestScore);
            }
            if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.bestScore, val);
        }
    }

    // Action Move Left
    moveLeft() {
        let moved = false;
        let movements = [];
        
        for (let r = 0; r < this.size; r++) {
            let originalRow = [...this.grid[r]];
            let { row, score, mergedIndices } = this.slide(this.grid[r]);
            
            // Check if changed
            if (originalRow.join(',') !== row.join(',')) {
                moved = true;
                this.grid[r] = row;
                this.updateScore(score);
            }
        }
        return moved;
    }

    // Action Move Right
    moveRight() {
        let moved = false;
        for (let r = 0; r < this.size; r++) {
            let originalRow = [...this.grid[r]];
            // Reverse, slide, reverse back
            let reversed = [...this.grid[r]].reverse();
            let { row, score } = this.slide(reversed);
            row.reverse();
            
            if (originalRow.join(',') !== row.join(',')) {
                moved = true;
                this.grid[r] = row;
                this.updateScore(score);
            }
        }
        return moved;
    }

    // Action Move Up
    moveUp() {
        let moved = false;
        for (let c = 0; c < this.size; c++) {
            let col = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
            let originalCol = [...col];
            let { row, score } = this.slide(col);
            
            if (originalCol.join(',') !== row.join(',')) {
                moved = true;
                for (let r = 0; r < this.size; r++) {
                    this.grid[r][c] = row[r];
                }
                this.updateScore(score);
            }
        }
        return moved;
    }

    // Action Move Down
    moveDown() {
        let moved = false;
        for (let c = 0; c < this.size; c++) {
            let col = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
            let originalCol = [...col];
            col.reverse();
            let { row, score } = this.slide(col);
            row.reverse();
            
            if (originalCol.join(',') !== row.join(',')) {
                moved = true;
                for (let r = 0; r < this.size; r++) {
                    this.grid[r][c] = row[r];
                }
                this.updateScore(score);
            }
        }
        return moved;
    }

    checkGameOver() {
        // Any empty cells?
        if (this.getEmptyCells().length > 0) return false;
        
        // Any possible merges horizontally?
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size - 1; c++) {
                if (this.grid[r][c] === this.grid[r][c + 1]) return false;
            }
        }
        
        // Any possible merges vertically?
        for (let c = 0; c < this.size; c++) {
            for (let r = 0; r < this.size - 1; r++) {
                if (this.grid[r][c] === this.grid[r + 1][c]) return false;
            }
        }
        
        return true;
    }

    move(direction) {
        if (this.over) return false;
        
        let moved = false;
        switch (direction) {
            case 'left': moved = this.moveLeft(); break;
            case 'right': moved = this.moveRight(); break;
            case 'up': moved = this.moveUp(); break;
            case 'down': moved = this.moveDown(); break;
        }

        if (moved) {
            this.addRandomTile();
            if (this.checkGameOver()) {
                this.over = true;
                if (this.onGameOver) this.onGameOver();
            }
            if (this.onMove) this.onMove();
            return true;
        }
        return false;
    }
}
