// Canvas and Canvas context
let canvas = document.getElementById("gameScreen");
let context = canvas.getContext("2d");

// Screen
const SCREEN_WIDTH = 750;
const SCREEN_HEIGHT = 500;

context.drawImage(document.getElementById("image_mandelbrot"), 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);