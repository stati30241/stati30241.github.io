// Canvas and Canvas context
let canvas = document.getElementById("gameScreen");
let context = canvas.getContext("2d");

// Screen
const SCREEN_WIDTH = 750;
const SCREEN_HEIGHT = 500;

// Mouse pos
let xMousePos = 0;
let yMousePos = 0;

// Main game loop function
function main(timestamp) {
    // Handles input
    let rect = canvas.getBoundingClientRect();
    canvas.addEventListener("mousemove", event => {
        xMousePos = event.clientX - rect.left;
        yMousePos = event.clientY - rect.top;
    }, false);

    // Clears the canvas
    context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Renders the mandelbrot image
    context.drawImage(document.getElementById("image_mandelbrot"), 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    
    // Renders the axis
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, SCREEN_HEIGHT / 2);
    context.lineTo(SCREEN_WIDTH, SCREEN_HEIGHT / 2);
    context.moveTo(2 * SCREEN_WIDTH / 3, 0);
    context.lineTo(2 * SCREEN_WIDTH / 3, SCREEN_HEIGHT);
    context.stroke();

    // Renders the lines
    let f = SCREEN_HEIGHT / 2;
    let zr = 0.0;
    let zi = 0.0;
    let cr = xMousePos / f - 2.0;
    let ci = yMousePos / -f + 1.0;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(2 * SCREEN_WIDTH / 3, SCREEN_HEIGHT / 2);
    for (let i = 0; i < 25; ++i) {
        // Complex number math
        let temp = zr;
        zr = Math.pow(zr, 2) - Math.pow(zi, 2) + cr;
        zi = 2 * temp * zi + ci;

        let x = (zr + 2.0) * f;
        let y = (zi - 1.0) * -f;
        
        context.lineTo(x, y);
    }
    context.stroke();

    // Renders the text
    context.font = "25px Arial";
    context.fillStyle = "white";
    context.fillText("c = " + cr.toFixed(3) + " + " + ci.toFixed(3) + "i", 510, 480);

    requestAnimationFrame(main);
}

requestAnimationFrame(main);