//------------constants
const COLORS = {
    '0': 'white',
    '1': 'purple',
    '-1': 'orange'
}


//------------state variables
let board;
let turn;
let winner;


//------------cached elements
const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const markerEls = [...document.querySelectorAll('#markers > div')];


//------------event listeners
document.getElementById('markers').addEventListener('click', handleDrop);
playAgainBtn.addEventListener('click', init);


//------------functions
init();

// Initialize all state, then call render()
function init() {

    //to visualize the board's mapping to the DOM,
    //rotate the board array 90 degrees countr-clockwise
    board = [
        [0, 0, 0, 0, 0, 0], //col 0
        [0, 0, 0, 0, 0, 0], //col 1
        [0, 0, 0, 0, 0, 0], //col 2
        [0, 0, 0, 0, 0, 0], //col 3
        [0, 0, 0, 0, 0, 0], //col 4
        [0, 0, 0, 0, 0, 0], //col 5
        [0, 0, 0, 0, 0, 0], //col 6
    ];
    turn = 1;
    winner = null;
    render();
}

//in response to user interaction, update all impacted state
//then call render()
function handleDrop(e) {
    const colIdx = markerEls.indexOf(e.target);
    //guards...
    if (colIdx === -1) return;
    const colArr = board[colIdx];
    //find index or first 0 in colArr
    const rowIdx = colArr.indexOf(0);
    //update board state with the cur player value
    colArr[rowIdx] = turn;
    //switch player turn
    turn *= -1;
    //check for winner
    winner = getWinner(colIdx, rowIdx);
    render();
}

//check for winner, return value of winner (null, 1/-1, "T")
function getWinner(colIdx, rowIdx) {
    return checkVerticalWin(colIdx, rowIdx) ||
        checkHorizontalWin(colIdx, rowIdx) ||
        checkDiagonalWinNESW(colIdx, rowIdx) ||
        checkDiagonalWinNWSE(colIdx, rowIdx);
}

function checkDiagonalWinNWSE(colIdx, rowIdx) {
    const adjCountNW = countAdjacent(colIdx, rowIdx, -1, 1);
    const adjCountSE = countAdjacent(colIdx, rowIdx, 1, -1);
    return (adjCountNW+adjCountSE) >= 3 ? board[colIdx][rowIdx] : null;
}

function checkDiagonalWinNESW(colIdx, rowIdx) {
    const adjCountNE = countAdjacent(colIdx, rowIdx, 1, 1);
    const adjCountSW = countAdjacent(colIdx, rowIdx, -1, -1);
    return (adjCountNE+adjCountSW) >= 3 ? board[colIdx][rowIdx] : null;
}

function checkHorizontalWin(colIdx, rowIdx) {
    const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0);
    const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0);
    return (adjCountLeft+adjCountRight) >= 3 ? board[colIdx][rowIdx] : null;
}

function checkVerticalWin(colIdx, rowIdx) {
    return countAdjacent(colIdx, rowIdx, 0, -1) === 3 ? board[colIdx][rowIdx] : null;
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    const player = board[colIdx][rowIdx];
    //track count of adjacent cells with same player values
    let count = 0; 
    //initialize new coordinates
    colIdx += colOffset;
    rowIdx += rowOffset;

    while (
        //ensure colIdx is within bounds
        board[colIdx] !== undefined && 
        board[colIdx][rowIdx] !== undefined &&
        board[colIdx][rowIdx] === player
    ){
        count++;
        colIdx += colOffset;
        rowIdx += rowOffset;
    }
    return count;
}

//visualize all state in the DOM
function render() {
    renderBoard();
    renderMessage();
    //hide/show UI elements (controls)
    renderControls();
}

function renderBoard() {
    board.forEach((colArr, colIdx) => {
        colArr.forEach((cellVal, rowIdx) => {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cellVal];
        });
    });
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = "It's a Tie!!!";
    } else if (winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins!`;
    } else {
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`;
    }
}

function renderControls() {
    // Ternary expression is go to when you want 1 of 2 values returned
    // <cond exp ? <truthy exp> : <falsy exp>
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
    //hide/show according to if col is full
    markerEls.forEach((markerEl, colIdx) => {
        const hideMarker = !board[colIdx].includes(0) || winner;
        markerEl.style.visibility = hideMarker ? 'hidden' : 'visible';
    });
}