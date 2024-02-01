//board
let board;
let boardWidth = 750;
let boardHeight = 350;
let context;

// Déclaration des variables pour les fonds
let backgroundImg1 = new Image();
let backgroundImg2 = new Image();
backgroundImg1.src = "./img/background.png";
backgroundImg2.src = "./img/background.png";

let backgroundX1 = 0;
let backgroundX2 = boardWidth;
let backgroundSpeed = -2;

//squid
let squidWidth = 45;
let squidHeight = 65;
let squidX = 50;
let squidY = boardHeight - squidHeight;
let squidImg;
let runToggle = false;
let lastRunChangeTime = 0;
const animationInterval = 200;
let drawSquid = true;

let squid = {
    x: squidX,
    y: squidY,
    width: squidWidth,
    height: squidHeight
}
let squidRun1Img = new Image();
squidRun1Img.src = "./img/squid-run1.png";

let squidRun2Img = new Image();
squidRun2Img.src = "./img/squid-run2.png";

let squidDeadImg = new Image();
squidDeadImg.src = "./img/squid-dead.png"; // Assurez-vous que le chemin est correct


//algae
let algaeArray = [];

let algae1Width = 34;
let algae2Width = 69;
let algae3Width = 102;

let algaeHeight = 70;
let algaeX = 700;
let algaeY = boardHeight - algaeHeight;

let algae1Img = new Image();
algae1Img.src = "./img/algae1.png";

let algae2Img = new Image();
algae2Img.src = "./img/algae2.png";

let algae3Img = new Image();
algae3Img.src = "./img/algae3.png";

let algaeInterval;

//fish
const fishWidth = 50;
const fishHeight = 40;
const fishFlyHeight = [squidHeight, squidHeight + 30];
let fishArray = [];
let fishImg = new Image();
fishImg.src = "./img/fish.png";

//physics
let initialVelocityX = -6;
let finalVelocityX = -20;
let velocityX = initialVelocityX;

const speedIncreaseSettings = {
    'easy': 0.005,
    'medium': 0.007,
    'hard': 0.010
};
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let currentDifficulty = 'easy';
const difficultySettings = {
    'easy': 1000,
    'medium': 900,
    'hard': 800
};

//Soundeffect
let jumpSound = new Audio('./squid_jump.mp3');
let runSound1 = new Audio('./squid_run1.mp3');
let runSound2 = new Audio('./squid_run2.mp3');

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");
    const replayButton = document.getElementById("replayButton");

    replayButton.addEventListener("click", function() {
        resetGame();
        replayButton.blur();
    });

    squidImg = new Image();
    squidImg.src = "./img/squidRun1.png";
    squidImg.onload = function() {
        context.drawImage(squidImg, squid.x, squid.y, squid.width, squid.height);
    }

    const difficultyButton = document.getElementById("difficultyButton");
    difficultyButton.addEventListener("click", changeDifficulty);

    requestAnimationFrame(update);
    updateAlgaePlacement();
    document.addEventListener("keydown", moveSquid);
}

function changeDifficulty() {
    if (currentDifficulty === 'easy') {
        currentDifficulty = 'medium';
    } else if (currentDifficulty === 'medium') {
        currentDifficulty = 'hard';
    } else {
        currentDifficulty = 'easy';
    }

    difficultyButton.textContent = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    updateAlgaePlacement();
}

function updateAlgaePlacement() {
    clearInterval(algaeInterval);
    algaeInterval = setInterval(placeAlgae, difficultySettings[currentDifficulty]);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
         // Afficher le score final sans incrémenter
         context.fillStyle = "black";
         context.font = "20px courier";
         context.fillText("Score: " + score, 5, 20);
        if (drawSquid) {
            squidImg.src = "./img/squid-dead.png";
            squidImg.onload = function() {
                context.drawImage(squidImg, squid.x, squid.y, squid.width, squid.height);
            };
            drawSquid = false;
        }
        document.getElementById("difficultyButton").disabled = false;
        return;
    }

    backgroundX1 += backgroundSpeed;
    backgroundX2 += backgroundSpeed;

    if (backgroundX1 <= -boardWidth) {
        backgroundX1 = boardWidth;
    }
    if (backgroundX2 <= -boardWidth) {
        backgroundX2 = boardWidth;
    }

    context.clearRect(0, 0, board.width, board.height);
    context.drawImage(backgroundImg1, backgroundX1, 0, boardWidth, boardHeight);
    context.drawImage(backgroundImg2, backgroundX2, 0, boardWidth, boardHeight);

    

    if (drawSquid) {
        velocityY += gravity;
        squid.y = Math.min(squid.y + velocityY, squidY);
        let currentTime = Date.now();
        if (currentTime - lastRunChangeTime >= animationInterval) {
            lastRunChangeTime = currentTime;
            runToggle = !runToggle;
        }

        if (runToggle) {
            runSound1.play();
        } else {
            runSound2.play();
        }

        let squidImgToDraw = runToggle ? squidRun1Img : squidRun2Img;
        context.drawImage(squidImgToDraw, squid.x, squid.y, squid.width, squid.height);
    }

    for (let i = 0; i < fishArray.length; i++) {
        let fish = fishArray[i];
        fish.x += velocityX;
        context.drawImage(fish.img, fish.x, fish.y, fish.width, fish.height);

        if (detectCollision(squid, fish)) {
            gameOver = true;
            drawSquid = false;
            return;
        }
    }

    let currentSpeedIncreaseFactor = speedIncreaseSettings[currentDifficulty];
    if (velocityX > finalVelocityX) {
        velocityX -= currentSpeedIncreaseFactor;
    }

    for (let i = 0; i < algaeArray.length; i++) {
        let algae = algaeArray[i];
        algae.x += velocityX;
        context.drawImage(algae.img, algae.x, algae.y, algae.width, algae.height);

        if (detectCollision(squid, algae)) {
            gameOver = true;
            drawSquid = false;
            return;
        }
    }

    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText("Score: " + score, 5, 20);
    
}

function moveSquid(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
            return;
        }
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && squid.y == squidY) {
        velocityY = -10;
        jumpSound.play();
    }
}

function placeAlgae() {
    if (gameOver) {
        return;
    }

    let algae = {
        img: null,
        x: algaeX,
        y: algaeY,
        width: null,
        height: algaeHeight
    }

    let placeAlgaeChance = Math.random();
    if (placeAlgaeChance > .90) {
        algae.img = algae3Img;
        algae.width = algae3Width;
        algaeArray.push(algae);
    }
    else if (placeAlgaeChance > .70) {
        algae.img = algae2Img;
        algae.width = algae2Width;
        algaeArray.push(algae);
    }
    else if (placeAlgaeChance > .50) {
        algae.img = algae1Img;
        algae.width = algae1Width;
        algaeArray.push(algae);
    }
    if (Math.random() < 0.05) {
        placefish();
    }

    if (algaeArray.length > 5) {
        algaeArray.shift();
    }
}

function placefish() {
    if (gameOver) {
        return;
    }

    let fishY = fishFlyHeight[Math.floor(Math.random() * fishFlyHeight.length)];
    let fish = {
        img: fishImg,
        x: boardWidth,
        y: fishY,
        width: fishWidth,
        height: fishHeight
    }

    fishArray.push(fish);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function resetGame() {
    gameOver = false;
    runToggle = false;
    drawSquid = true;
    score = 0;
    velocityY = 0;
    squid.y = squidY;
    algaeArray = [];
    fishArray = [];
    context.clearRect(0, 0, board.width, board.height);
    velocityX = initialVelocityX;
    squidImg.src = "./img/squid.png";
    squidImg.onload = function() {
        context.drawImage(squidImg, squid.x, squid.y, squid.width, squid.height);
    }
    document.getElementById("difficultyButton").disabled = true;
}

