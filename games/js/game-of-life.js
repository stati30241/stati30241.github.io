/*
THIS GAME IS NOT FINSIHED YET I WILL WORK ON IT LATER
*/


// Canvas and Canvas context
let canvas = document.getElementById("gameScreen");
let context = canvas.getContext("2d");

// Screen
const SCREEN_WIDTH = 625;
const SCREEN_HEIGHT = 625;
const GRID_SIZE = 25;

// Cells
let cells = [];
for (let i = 0; i < SCREEN_WIDTH / GRID_SIZE; ++i) {
    let row = [];
    for (let j = 0; j < SCREEN_HEIGHT / GRID_SIZE; ++j) {
        row.push(0);
    }
    cells.push(row);
}

// ...
let lastTime = 0.0;
let timer = 0.0;
const tickSpeed = 100;
let playing = false;

// Draws the grid onto the canvas
function drawGrid() {
    context.fillStyle = "#212121";
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    for (let i = 0; i < SCREEN_WIDTH; i += GRID_SIZE) {
        for (let j = 0; j < SCREEN_HEIGHT; j += GRID_SIZE) {
            if (cells[i / GRID_SIZE][j / GRID_SIZE] == 0) context.fillStyle = "#4b4b4b";
            else context.fillStyle = "#c8e62d";
            context.fillRect(i + 1, j + 1, GRID_SIZE - 2, GRID_SIZE - 2);
        }
    }
}

function calculateNeighbors(posI, posJ) {
    let neighbors = 0;
    let im = (posI - 1) % GRID_SIZE;
	let ip = (posI + 1) % GRID_SIZE;
	let jm = (posJ - 1) % GRID_SIZE;
	let jp = (posJ + 1) % GRID_SIZE;
    let n = [(im, jm), (im, posJ), (im, jp), (posI, jm), (posI, jp), (ip, jm), (ip, posJ), (ip, jp)];
    for (let i = 0; i < n.length; ++i) {
        if (n[i][0] < 0 || n[i][0] >= 25 || n[i][1] < 0 || n[i][1] >= 25) {
            continue;
        }
        if (cells[n[i][0], n[i][1]] == 1) neighbors++; 
    }

    return neighbors;
}


// Simulates a generation based on conway's game of life
function doGeneration() {
    let cellsCopy = cells;
    for (let i = 0; i < SCREEN_WIDTH / GRID_SIZE; ++i) {
        for (let j = 0; j < SCREEN_HEIGHT / GRID_SIZE; ++j) {
            let neighbors = calculateNeighbors(i, j);
            console.log(neighbors);
            if (neighbors < 2) cellsCopy[i][j] = 0;
            if (neighbors == 3) cellsCopy[i][j] = 1;
            if (neighbors > 3) cellsCopy[i][j] = 0;
        }
    }

    cells = cellsCopy;
}

// Main game loop
function main(timestamp) {
    // Handles mouse input
    let rect = canvas.getBoundingClientRect();
    canvas.addEventListener("contextmenu", e => e.preventDefault()); // Prevents the little window from popping up when right clicking
    canvas.addEventListener("mousedown", event => {
        // TODO: Fix the scrolling issue
        let xMousePos = event.clientX - canvas.offsetLeft;
        let yMousePos = event.clientY -  event.offsetY;

        let cellX = Math.trunc(xMousePos / GRID_SIZE);
        let cellY = Math.trunc(yMousePos / GRID_SIZE);

        console.log(event.offsetY);
        
        if (event.button == 0) cells[cellX][cellY] = 1;
        else if (event.button == 2) cells[cellX][cellY] = 0;
    });

    document.addEventListener("keydown", event => {
        switch (event.key) {
        case "w":
            playing = true;
            break;
        }
    });

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timer += deltaTime;
    if (timer >= tickSpeed) {
        if (playing) doGeneration();
        timer = 0;
    }

    // Drawing onto the canvas
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    drawGrid();

    requestAnimationFrame(main);
}

requestAnimationFrame(main);