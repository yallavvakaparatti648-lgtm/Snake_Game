
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let food;
let direction;
let nextDirection;
let score;
let game;
let gameOver = false;

function restartGame() {
    clearInterval(game);

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    gameOver = false;

    document.getElementById("score").innerText = score;

    createFood();
    drawGame();

    game = setInterval(moveSnake, 150);
}

// Food generation
function createFood() {
    do {
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } while (
        snake.some(part =>
            part.x === food.x && part.y === food.y
        )
    );
}

// Keyboard controls
document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if ([
        "arrowup", "arrowdown",
        "arrowleft", "arrowright",
        "w", "a", "s", "d"
    ].includes(key)) {
        event.preventDefault();
    }

    if ((key === "arrowup" || key === "w") &&
        direction !== "DOWN") {
        nextDirection = "UP";
    }

    else if ((key === "arrowdown" || key === "s") &&
        direction !== "UP") {
        nextDirection = "DOWN";
    }

    else if ((key === "arrowleft" || key === "a") &&
        direction !== "RIGHT") {
        nextDirection = "LEFT";
    }

    else if ((key === "arrowright" || key === "d") &&
        direction !== "LEFT") {
        nextDirection = "RIGHT";
    }
});

// Draw game
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box - 2, box - 2);

    // Draw snake body
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";

        ctx.fillRect(
            part.x,
            part.y,
            box - 2,
            box - 2
        );
    });
}

// Move snake
function moveSnake() {
    if (gameOver) return;

    direction = nextDirection;

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    // Wall collision
    if (
        headX < 0 || headY < 0 ||
        headX >= canvas.width ||
        headY >= canvas.height
    ) {
        endGame();
        return;
    }

    const ateFood = headX === food.x && headY === food.y;

    // Body collision
    const body = ateFood ? snake : snake.slice(0, -1);

    if (body.some(part =>
        part.x === headX && part.y === headY
    )) {
        endGame();
        return;
    }

    snake.unshift({ x: headX, y: headY });

    if (ateFood) {
        score += 10;
        document.getElementById("score").innerText = score;
        createFood();
    } else {
        snake.pop();
    }

    drawGame();
}

// Game over
function endGame() {
    clearInterval(game);
    gameOver = true;

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", 200, 200);
}

restartGame();
