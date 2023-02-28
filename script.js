const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const HighscoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i")

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// Getting high score from the local Storage
let highScore = localStorage.getItem("high-score") || 0;
HighscoreElement.innerText = `HighScore: ${highScore}`


const changeFoodPosition = () => {
    //Passing a random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! press Ok to replay...");
    location.reload();
}


//change direction by arrw keys
const changeDirection = (e) => {
    //Changing velocity value based on key press
    if (e.key === 'ArrowUp' && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === 'ArrowDown' && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === 'ArrowLeft' && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === 'ArrowRight' && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
    
}

controls.forEach(key => {
    // Calling changeDirection on each key click and passing key dataset value as an object
    key.addEventListener( 'click',() => changeDirection({ key: key.dataset.key }) );
});

const initGame = () => {

    if (gameOver) return handleGameOver();

    //we creating food and insert in the playboard element
    let htmlMarkUp = `<div class="food" style="grid-area:${foodY} / ${foodX}"></div>`

    // Checking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();

        // Pushing food position to snake body array
        snakeBody.push([foodX, foodY]);
        score++;

        // set high score to score value if score is greater than high score...
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score",highScore);
        scoreElement.innerText = `Score: ${score}`;
        HighscoreElement.innerText = `HighScore: ${highScore}`
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // shifting forward the value of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    // setting first element of snake body to current snake position;
    snakeBody[0] = [snakeX, snakeY];


    //Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    //chacking if the snak's head is out of wall,if so setting gameOver to true;
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        //Adding a div for each part of the snake's body
        htmlMarkUp += `<div class="snake" style="grid-area:${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // Checking if the snake head hit the body,if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkUp;
}

changeFoodPosition();

setIntervalId = setInterval(initGame, 150);
document.addEventListener("keydown", changeDirection);