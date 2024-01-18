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
var userMoved = false;
var basics = [2,4];
var inputFunc;
var boardCpy;
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
    big: '30px',
    medium: '25px',
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
            bestScoreLabel.innerHTML = bestScore;

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
    var mergedElement;
    var rowCopy = null;

    if(key === 'ArrowRight') {
        for(var i = 0; i < 4; i++) {
            rowCopy = board[i].slice();

            // Rearrange row empty slots
            for(var j = 0; j < 4; j++){
                if(rowCopy[j] == 0) {
                    rowCopy.splice(j,1);
                    rowCopy.unshift(0);
                }
            }

            // Merge pair of elements
            mergedElement = false;
            for(var j = 2; j >= 0; j--){
                if(mergedElement) { 
                    mergedElement = false;
                    continue;
                }
                if(rowCopy[j] === rowCopy[j+1]) {
                    rowCopy[j+1] = rowCopy[j]*2;
                    rowCopy[j] = 0;
                    mergedElement = true;
                }
            }

            // Rearrange empty slots
            for(var j = 0; j < 4; j++){
                if(rowCopy[j] == 0) {
                    rowCopy.splice(j,1);
                    rowCopy.unshift(0);
                }
            }
            board[i] = rowCopy.slice();
        }
    } else if(key == 'ArrowLeft') { 
        alert('izquierda');

    } else if(key == 'ArrowUp') {
        alert('arriba');

    } else if(key == 'ArrowDown') {
        alert('abajo');

    } else return;
    userMoved = true;
}

function gameContinues() {
    board.forEach(row => {
        row.forEach(element => {
            if(element === 0)
                return true;
        });
    });    
    return false;
}

async function gameLoop() {
    setup();
    renderGame();
    await enableUserInput();
    renderGame();
    console.log('Después de la escucha de teclas');
}

// Init main loop
gameLoop();