console.log("script.js is running correctly!");

// 1. Game Initialization
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- UI Elements ---
const startScreen = document.getElementById('start-screen');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const vsComputerButton = document.getElementById('vs-computer-button');
const vsPlayerButton = document.getElementById('vs-player-button');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// --- Game State Variables ---
const winningScore = 5;
let gameOver = false;
let gameInterval;
let gameMode; // 'pvc' (Player vs Computer) or 'pvp' (Player vs Player)

// 2. Game Objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: '#fff'
};

const player1 = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    name: "Player 1",
    color: '#fff'
};

const player2 = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    name: "Player 2",
    velocityY: 0, // For keyboard movement
    speed: 8,
    color: '#fff'
};

const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    width: 2,
    height: 10,
    color: '#fff'
};

// 3. Drawing Functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color, size = '75px') {
    ctx.fillStyle = color;
    ctx.font = `${size} fantasy`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// 4. Game Logic & Controls

// --- Player 1 (Mouse) ---
canvas.addEventListener('mousemove', movePaddle1);
function movePaddle1(evt) {
    let rect = canvas.getBoundingClientRect();
    player1.y = evt.clientY - rect.top - player1.height / 2;
}

// --- Player 2 (Keyboard) ---
document.addEventListener('keydown', (e) => {
    if (gameMode === 'pvp') {
        if (e.key === "ArrowUp") player2.velocityY = -player2.speed;
        else if (e.key === "ArrowDown") player2.velocityY = player2.speed;
    }
});
document.addEventListener('keyup', (e) => {
    if (gameMode === 'pvp') {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") player2.velocityY = 0;
    }
});

function movePaddle2_pvp() {
    player2.y += player2.velocityY;
    if (player2.y < 0) player2.y = 0;
    if (player2.y + player2.height > canvas.height) player2.y = canvas.height - player2.height;
}

// --- Computer AI ---
function movePaddle2_pvc() {
    player2.y += (ball.y - (player2.y + player2.height / 2)) * 0.1;
}

// --- Game State Control ---
vsComputerButton.addEventListener('click', () => { gameMode = 'pvc'; startGame(); });
vsPlayerButton.addEventListener('click', () => { gameMode = 'pvp'; startGame(); });

function startGame() {
    player1.name = player1NameInput.value || "Player 1";
    if (gameMode === 'pvc') {
        player2.name = "Computer";
    } else {
        player2.name = player2NameInput.value || "Player 2";
    }
    
    startScreen.style.display = 'none';
    resetGame();
    if(gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 1000 / 60);
}

canvas.addEventListener('mousedown', () => { if (gameOver) resetGame(); });

function resetGame() {
    player1.score = 0;
    player2.score = 0;
    resetBall();
    gameOver = false;
}

function collision(b, p) {
    p.top = p.y; p.bottom = p.y + p.height; p.left = p.x; p.right = p.x + p.width;
    b.top = b.y - b.radius; b.bottom = b.y + b.radius; b.left = b.x - b.radius; b.right = b.x + b.radius;
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetBall() {
    ball.x = canvas.width / 2; ball.y = canvas.height / 2; ball.speed = 7;
    ball.velocityX = -ball.velocityX; ball.velocityY = 5;
}

function update() {
    if (gameOver) return;

    if (gameMode === 'pvc') movePaddle2_pvc();
    else movePaddle2_pvp();

    ball.x += ball.velocityX; ball.y += ball.velocityY;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) ball.velocityY = -ball.velocityY;
    
    let player_who_scored = null;
    if (ball.x - ball.radius < 0) { player2.score++; player_who_scored = player2; }
    else if (ball.x + ball.radius > canvas.width) { player1.score++; player_who_scored = player1; }

    if(player_who_scored){
        if(player_who_scored.score >= winningScore) gameOver = true;
        resetBall();
    }

    let paddle = (ball.x < canvas.width / 2) ? player1 : player2;
    if (collision(ball, paddle)) {
        let collidePoint = (ball.y - (paddle.y + paddle.height / 2));
        collidePoint = collidePoint / (paddle.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.2;
    }
}

// 5. Render Loop
function render() {
    drawRect(0, 0, canvas.width, canvas.height, '#000');

    if (gameOver) {
        let winnerName = (player1.score >= winningScore) ? player1.name : player2.name;
        drawText(`${winnerName} Wins!`, canvas.width / 2, canvas.height / 2 - 30, '#fff', '60px');
        drawText("Click to Restart", canvas.width / 2, canvas.height / 2 + 30, '#fff', '40px');
        return;
    }

    drawText(player1.score, canvas.width / 4, canvas.height / 5, '#fff');
    drawText(player2.score, 3 * canvas.width / 4, canvas.height / 5, '#fff');
    drawNet();
    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function gameLoop() { update(); render(); }

// Initial render to show the board
render();
console.log("Game initialized. Waiting for user to start.");