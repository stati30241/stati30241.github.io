// Canvas and Canvas context
let canvas = document.getElementById("gameScreen");
let context = canvas.getContext("2d");

// Screen
const SCREEN_WIDTH = 625;
const SCREEN_HEIGHT = 625;

// Game
let lastTime = 0.0;
let timer = 0.0;
const tickSpeed = 100;
let gameOver = false;

// Vector
class vec2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Snake and food
const pixelSize = 25;
let snake = [ new vec2d(125, 325), new vec2d(100, 325), new vec2d(75, 325) ];
let snakeDir = 0;
let food = new vec2d(325, 325);
let score = 0;

// Generates food
function generateFood() {
    while (true) {
        food.x = Math.floor(Math.random() * 25 ) * 25;
        food.y = Math.floor(Math.random() * 25 ) * 25;

        if (!(food.x == snake[0].x && food.y == snake[0].y)) return;
    }
}

// The tick function that executes every tick
function tick(deltaTime) {
    // Updates the snake's body
    for (let i = snake.length - 1; i > 0; --i) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }

    // Updates the snake's head
    switch (snakeDir) {
    case 0:
        snake[0].x += pixelSize;
        break;
    case 1:
        snake[0].y += pixelSize;
        break;
    case 2:
        snake[0].x -= pixelSize;
        break;
    case 3:
        snake[0].y -= pixelSize;
    }

    // Wraps the snake around if it goes out of bounds
    if (snake[0].x < 0) snake[0].x = SCREEN_WIDTH - pixelSize;
    if (snake[0].y < 0) snake[0].y = SCREEN_HEIGHT - pixelSize;
    snake[0].x %= SCREEN_WIDTH;
    snake[0].y %= SCREEN_HEIGHT;

    // Checks for collision with itself
    for (let i = 1; i < snake.length; ++i) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) gameOver = true;
    }

    // Checks for collision with the food
    if (snake[0].x == food.x && snake[0].y == food.y) {
        generateFood();
        snake.push(new vec2d(snake[snake.length - 1].x, snake[snake.length - 1].y));
        score++;
    }
}

// Main game loop
function main(timestamp) {
    if (gameOver) {
        // Handles input
        document.addEventListener("keydown", event => {
            if (gameOver) {
                gameOver = false;
                snake = [ new vec2d(125, 325), new vec2d(100, 325), new vec2d(75, 325) ];
                snakeDir = 0;
                score = 0;
                food = new vec2d(325, 325);
            }
        });

        // Clears the window
        context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        // Renders the text
        context.font = "30px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText("Press any key to replay", SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    } else {
        // Handles input
        document.addEventListener("keydown", event => {
            switch (event.key) {
            case "w":
                if (snakeDir != 1) snakeDir = 3;
                break;
            case "a":
                if (snakeDir != 0) snakeDir = 2;
                break;
            case "s":
                if (snakeDir != 3) snakeDir = 1;
                break;
            case "d":
                if (snakeDir != 2) snakeDir = 0;
                break;
            }
        });

        // Calculates the elapsed time between frames
        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Update
        timer += deltaTime;
        if (timer >= tickSpeed) {
            tick();
            timer = 0.0;
        }

        // Clears the screen
        context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        // Render the snake and the food
        context.fillStyle = "#51c83c";
        for (const snakeCell of snake) {
            context.fillRect(snakeCell.x, snakeCell.y, pixelSize, pixelSize);
        }
        context.fillStyle = "#be0f2c";
        context.fillRect(food.x, food.y, pixelSize, pixelSize);

        // Renders the score text
        context.font = "20px Arial";
        context.fillStyle = "white";
        context.fillText("Score: " + score, 530, 35);
    }

    requestAnimationFrame(main);
}

requestAnimationFrame(main);
