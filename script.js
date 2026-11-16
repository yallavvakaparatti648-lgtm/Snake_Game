
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

let snake;
let food;
let direction;
let score;
let game;
let gameOver;

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
    score = 0;
    gameOver = false;

    document.getElementById("score").innerText = score;

    createFood();
    drawGame();

    game = setInterval(moveSnake, 150);
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };

    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            createFood();
            return;
        }
    }
}

document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        event.preventDefault();
    }

    if (key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    }
    else if (key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }
    else if (key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    }
    else if (key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
});

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green";

        ctx.fillRect(
            snake[i].x,
            snake[i].y,
            box - 2,
            box - 2
        );
    }
}

function moveSnake() {
    if (gameOver) return;

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    let newHead = { x: headX, y: headY };

    // Check wall collision
    if (
        headX < 0 ||
        headY < 0 ||
        headX >= canvas.width ||
        headY >= canvas.height
    ) {
        endGame();
        return;
    }

    let ateFood = headX === food.x && headY === food.y;

    // Check collision with snake body
    let body = ateFood ? snake : snake.slice(0, -1);

    for (let part of body) {
        if (headX === part.x && headY === part.y) {
            endGame();
            return;
        }
    }

    snake.unshift(newHead);

    if (ateFood) {
        score += 10;
        document.getElementById("score").innerText = score;
        createFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function endGame() {
    clearInterval(game);
    gameOver = true;

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", 200, 200);
}

restartGame();
