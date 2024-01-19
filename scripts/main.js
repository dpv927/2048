// Game HTML board
var htmlBoard = document.getElementById('board');

// Utility Buttons
var newGameButton  = document.getElementById('new-game');
var undoMoveButton = document.getElementById('undo-move');

// Score Buttons
var scoreLabel     = document.getElementById('score');
var bestScoreLabel = document.getElementById('best-score');

// Game Variables and utils
var score = 0;
var bestScore = 0;
var undoEnabled = false;
var inputFunc;
var basics = [2,4];
var boardCpy = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];
var board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

// Game colors
var piecesBg = {
       0: "#d6cdc4",
       2: "#eee4da",
       4: "#eee2ce",
       8: "#f3b27e", 
      16: "#f6976b",
      32: "#f77e68",
      64: "#f76147",
     128: "#efcf6a",
     256: "#edcc61",
     512: "#eed278",
    1024: "#eecf6a",
    2048: "#eecd5f",
    else: "#3c3a33",
};
var piecesFg = {
    dark:  "#776e65",
    light: "#f9f6f2",
};
var fontSizes = {
    big: '35px',
    medium: '30px',
    small: '20px',
    extra_small: '15px', 
    super_small: '10px',
};

/////////////////////////////////////// Functions

function setup() {
    // Place two values in the board
    // both must be in random positions
    var i, j;
    i = Math.floor(Math.random()*4);
    j = Math.floor(Math.random()*4);
    board[i][j] = basics[Math.floor(Math.random()*2)];

    do {
        i = Math.floor(Math.random()*4);
        j = Math.floor(Math.random()*4);
        if(board[i][j] === 0) break;  
    } while(true);
    board[i][j] = basics[Math.floor(Math.random()*2)];
}

function placeRandomValue() {
    var i, j;
    do {
        i = Math.floor(Math.random()*4);
        j = Math.floor(Math.random()*4);
        if(board[i][j] === 0) break;  
    } while(true);
    board[i][j] = basics[Math.floor(Math.random()*2)];
}

function renderGame() {
    var boardCell;
    var cellValue;

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            // Update the cell styles and content
            boardCell = htmlBoard.rows[i].cells[j];
            cellValue = board[i][j];

            boardCell.style.backgroundColor = (cellValue <= 2048)? 
                piecesBg[cellValue] : piecesBg.else;
            boardCell.style.color = (cellValue > 4)? piecesFg.light :
                piecesFg.dark;
            boardCell.innerHTML = (cellValue === 0)? '' : cellValue;

            // Update the score boards 
            scoreLabel.innerHTML = score;
            if(score > bestScore) {
                bestScoreLabel.innerHTML = score;
                bestScore = score;
            }

            // Check if the number fits in the board
            if(cellValue <= 8) boardCell.style.fontSize = fontSizes.big;
            else if(cellValue < 131072) boardCell.style.fontSize = fontSizes.medium;
            else if(cellValue < 268435456) boardCell.style.fontSize = fontSizes.small;
            else if(cellValue < 137438953472) boardCell.style.fontSize = fontSizes.extra_small;
            else boardCell.style.fontSize = fontSizes.super_small;

            // Check if the score fits in the scoreBoard
            if(score <= 4) scoreLabel.style.fontSize = fontSizes.big;
            else if(score < 131072) scoreLabel.style.fontSize = fontSizes.medium;
            else if(score < 268435456) scoreLabel.style.fontSize = fontSizes.small;
            else if(score < 137438953472) scoreLabel.style.fontSize = fontSizes.extra_small;
            else scoreLabel.style.fontSize = scoreLabel.super_small;

            // Check if the best score fits in the scoreBoard
            if(bestScore <= 4) bestScoreLabel.style.fontSize = fontSizes.big;
            else if(bestScore < 131072) bestScoreLabel.style.fontSize = fontSizes.medium;
            else if(bestScore < 268435456) bestScoreLabel.style.fontSize = fontSizes.small;
            else if(bestScore < 137438953472) bestScoreLabel.style.fontSize = fontSizes.extra_small;
            else bestScoreLabel.style.fontSize = bestScoreLabel.super_small;
        }
    }
}

function enableUserInput() {
    // The website must be able to register movement
    // keys to move the values from the board
    return new Promise(function(resolve) {
        document.addEventListener('keydown', inputFunc = function keyPress(event){
            applyUserInput(event.key);
            disableUserInput();
            resolve();
        });
    });
}

function disableUserInput() {
    // We must delete the key register when we are
    // processing other stuff
    document.removeEventListener('keydown', inputFunc);
}

function applyUserInput(key) {
    const arrangeToRight = function(array) {
        var j = 3, k = 0;
        do {
            if(array[j] == 0) {
                array.splice(j, 1);
                array.unshift(0);
            } else j--;
            k++;
        } while(k <= 4);
    }

    const mergeToRight = function(array) {
        var merged = false;

        for(var j = 2; j >= 0; j--){
            if(merged) { 
                merged = false;
                continue;
            }
            if(array[j] === array[j+1]) {
                score += array[j];
                array[j+1] = array[j]*2;
                array[j] = 0;
                merged = true;
            }
        }
    }

    const arrangeToLeft = function(array) {
        var j = 0, k =0;
        do {
            if(array[j] == 0) {
                array.splice(j, 1);
                array.push(0);
            } else j++;
            k++;
        } while(k <= 4);
    }

    const mergeToLeft = function(array) {
        var merged = false;

        for(var j = 1; j <= 3; j++){
            if(merged) { 
                merged = false;
                continue;
            }
            if(array[j] === array[j-1]) {
                score += array[j];
                array[j-1] = array[j]*2;
                array[j] = 0;
                merged = true;
            }
        }
    }

    if(key == 'ArrowRight') {
        board.forEach(row => {
            arrangeToRight(row);
            mergeToRight(row);
            arrangeToRight(row);
        });
    } else if(key == 'ArrowLeft') { 
        board.forEach(row => {
            arrangeToLeft(row);
            mergeToLeft(row);
            arrangeToLeft(row);
        });
    } else if(key == 'ArrowUp') {
        for(i = 0; i < 4; i++) {
            var rowCopy = [0,0,0,0];

            for(var j = 0; j <4; j++) 
                rowCopy[j] = board[j][i];
            
            arrangeToLeft(rowCopy);
            mergeToLeft(rowCopy);
            arrangeToLeft(rowCopy);
           
            for(var j = 0; j <4; j++) 
                board[j][i] = rowCopy[j];
        }
    } else if(key == 'ArrowDown') {
        for(i = 0; i < 4; i++) {
            rowCopy = [0,0,0,0];

            for(var j = 0; j < 4; j++)
                rowCopy[j] = board[j][i]; 

            arrangeToRight(rowCopy);
            mergeToRight(rowCopy);
            arrangeToRight(rowCopy);
            
            for(var j = 0; j < 4; j++)
                board[j][i] = rowCopy[j]; 
        }
    }
}

function gameContinues() {
    // See if there is some gap or 
    // any other possible move
    var value;
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            value = board[i][j];
            if(value == 0) 
                return true;
            if((i > 0 && value === board[i-1][j]) || 
               (i < 3 && value === board[i+1][j]) ||
               (j > 0 && value === board[i][j-1]) ||
               (j < 3 && value === board[i][j+1]))
                return true;
        }
    }
    return false;
}

function makeGameBackup() {
    for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++)
            boardCpy[i][j] = board[i][j];
}

function userMoved() {
    for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++)
            if(boardCpy[i][j] != board[i][j])
                return true;
    return false;
}

function gameEnded() {
    alert('You lose! Your score: ' + score);
}

async function gameLoop() {
    setup();
    renderGame();

    while(gameContinues()) {
        makeGameBackup();
        await enableUserInput();

        if(userMoved()) { 
            placeRandomValue(); 
            renderGame();
        }
    }
    renderGame();
    gameEnded();
}

// Init main loop
gameLoop();