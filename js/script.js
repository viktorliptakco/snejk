//listeners
document.addEventListener('keydown', keyPush);

// canvas
const canvas = document.querySelector("canvas");
const title = document.querySelector("h1");
const ctx = canvas.getContext("2d");

//game
let gameIsRunning = true;

let fps = 5;
let score = 0;

const tileSize = 30;

canvas.width = tileSize * 13;
canvas.height = tileSize * 13;

const tileCountX = canvas.width / tileSize;
const tileCountY = canvas.height / tileSize;

//player
let snakeSpeed = tileSize;
let snakePosX = 0;
let snakePosY = canvas.width/2 - tileSize/2;

let velocityX = 1;
let velocityY = 0;

let tail = [];
let snakeLength = 3;

//food
let foodPosX = 0;
let foodPosY = 0;

//sounds
const gameopenerAudio = new Audio("../sounds/gameopener.mp3");
gameopenerAudio.volume = 0.2;

const eatAudio = new Audio("../sounds/point.mp3");
eatAudio.volume = 0.1;

const gameoverAudio = new Audio("../sounds/gameover.mp3");
gameoverAudio.volume = 0.2;

//loop
function gameLoop() { 
    if (gameIsRunning) {
    drawStaff();
    moveStaff();
    //requestAnimationFrame(gameLoop);
    setTimeout(gameLoop, 1000 / fps); //15 krat za sekundu
    }
};

resetFood();

gameLoop();

gameopenerAudio.play();


//hybeme hadom
function moveStaff() {
    snakePosX+= snakeSpeed * velocityX;
    snakePosY+= snakeSpeed * velocityY;

    //wall collision
    if (snakePosX > canvas.width - tileSize) {
        snakePosX = 0;
    }

    if (snakePosX < 0) {
        snakePosX = canvas.width;
    }

    if (snakePosY > canvas.height - tileSize) {
        snakePosY = 0;
    }

    if (snakePosY < 0 ) {
        snakePosY = canvas.height;
    }

    //GAME OVER
    tail.forEach( snakePart => {
        if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
            gameOver()
            gameoverAudio.play();
        }
    });

    //tail
    tail.push({ x: snakePosX, y: snakePosY });

    //forget earliest parts of snake
    tail = tail.slice(-1 * snakeLength);

    //food collision
    if (snakePosX === foodPosX && snakePosY === foodPosY) {
        //score++;
        title.textContent = ++score;
        snakeLength++;
        fps++;
        eatAudio.play();
        resetFood();
    }
}

//kreslime vsetko
function drawStaff() {
    //background
    rectangle('rgb(120, 120, 120)', 0, 0, canvas.width, canvas.height);

    //grid- kresli kocky, jej obsah je nizsie
    drawGrid();
    
    //kreslime jedlo
    rectangle('pink', foodPosX +1, foodPosY +1, tileSize -3, tileSize -3);

    //tail- chvostiiiik
    tail.forEach( snakePart =>
        rectangle('rgb(45, 45, 45)', snakePart.x +1, snakePart.y +1, tileSize -3, tileSize -3)
    );

    //kreslime hlavu hada
    rectangle('black', snakePosX +1, snakePosY +1, tileSize -3, tileSize -3);   
}

//basic funkcia na kreslenie do ktorej posielame hodnoty
function rectangle(color, x, y, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

//randomize food position
function resetFood() {
    if ( snakeLength === tileCountX * tileCountY ) {
        gameOver();
    }

    foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
    foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

    //zabrani dropnutiu jedla na hlavu
    if ( foodPosX === snakePosX && foodPosY === snakePosY ) {
        resetFood();
    }

    //zabrani dropnutiu jedla na telo
    if ( tail.some(snakePart => snakePart.x === foodPosX && snakePart.y === foodPosY )) {
        resetFood();
    }          
}

//na konci hry vytvori layout a vypise dosiahnute skore
function addScore () {
    const game = document.getElementById("canvas").getContext("2d");
    game.font = "60px tahoma";
    game.fillStyle = "pink";
    //game.textAlign = "center";
    //game.textBaseline = "middle";
    game.fillText(`Final score ${score}`, 20, 215);
}

function gameOver () {
    //title.innerHTML = `<strong> final score ${score} </strong>`;
    rectangle('rgb(0, 0, 0, 0.8)', 0, 0, canvas.width, canvas.height);
    addScore();
    gameIsRunning = false;
};

//keyboard
function keyPush(event) {
    //alert(event.key);
    switch(event.key) {
        case "ArrowUp":
            if (velocityY !== 1 ) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        
        case "ArrowDown":
            if (velocityY !== -1 ) {
                velocityX = 0;
                velocityY = 1;
            }
            break;

        case "ArrowLeft":
            if (velocityX !== 1 ) {
                velocityX = -1;
                velocityY = 0; 
            }
            break;

        case "ArrowRight":
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;

        default:
            //restart game
            if ( ! gameIsRunning ) location.reload();
            break;
    }
    
}

//buttons
function up() {
    if (velocityY !== 1 ) {
        velocityX = 0;
        velocityY = -1;
    }
}

function down() {
    if (velocityY !== -1 ) {
        velocityX = 0;
        velocityY = 1;
    }
}

function left() {
    if (velocityX !== 1 ) {
        velocityX = -1;
        velocityY = 0;
    }
}

function right() {
    if (velocityX !== -1 ) {
        velocityX = 1;
        velocityY = 0;
    }
}

function restart () {
    if ( ! gameIsRunning ) location.reload();
}

function drawGrid() {
    for (let i = 0; i < tileCountX; i++) {
        for (let j = 0; j < tileCountY; j++) {
            rectangle(
                    'rgb(100, 100, 100)',
                    tileSize * i, 
                    tileSize * j, 
                    tileSize- 1, 
                    tileSize -1
                    );
        }
    }
}