// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio();
let speed = 10; // Slowing down the speed
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];

let food = { x: 6, y: 7 };
let gameStarted = false;
let currentUserName = "";

// Game Functions
function main(ctime) {
    if (!gameStarted) return;
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into the wall
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }

    return false;
}

function gameEngine() {
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over. Press any key to play again!");
        saveScore(currentUserName, score);
        updateScoreList();
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
        gameStarted = false;
        document.getElementById('task-input-container').style.display = 'flex';
    }

    // If you have eaten the food, increment the score and regenerate the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Score saving and displaying functions
function saveScore(name, score) {
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ name, score });
    localStorage.setItem("scores", JSON.stringify(scores));
}

function updateScoreList() {
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = "";

    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.forEach(({ name, score }) => {
        const li = document.createElement('li');
        li.innerText = `${name}: ${score}`;
        scoreList.appendChild(li);
    });
}

// Start game function
document.getElementById('start-game').addEventListener('click', () => {
    const nameInput = document.getElementById('name-input');
    currentUserName = nameInput.value.trim();

    if (currentUserName !== "") {
        gameStarted = true;
        document.getElementById('task-input-container').style.display = 'none';
        window.requestAnimationFrame(main);
        musicSound.play();
    } else {
        alert("Please enter your name before starting the game.");
    }
});

// Reset button functionality
document.getElementById('reset-game').addEventListener('click', () => {
    localStorage.removeItem("hiscore");
    localStorage.removeItem("scores");
    hiscoreval = 0;
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
    updateScoreList();
});

// Main logic starts here
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
}

window.addEventListener('keydown', e => {
    if (!gameStarted) return;
    inputDir = { x: 0, y: 1 }; // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});

// Update score list on page load
updateScoreList();
