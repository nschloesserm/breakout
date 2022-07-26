const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


canvas.height = 600;
canvas.width = 600;

let speed = 3;
let life = 5;
let score = 0;
let c = '#61abc0';

let ball = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    dx: speed,
    dy: -speed * Math.random() - 1,
    radius: 8,
    draw: function () {
        ctx.beginPath();
        ctx.fillStyle = '#4285F4';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
}

let paddle = {
    height: 12,
    width: 100,
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    draw: function (c) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = c;
        ctx.closePath();
        ctx.fill();
    }
}

let bricks = [];

for (let i = 0; i < 8; i++) {
    bricks[i] = [];
    for (let j = 0; j < 8; j++) {
        bricks[i][j] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

function collision() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (bricks[i][j].status == 1) {
                if (ball.x > bricks[i][j].x &&
                    ball.x < bricks[i][j].x + canvas.width / 8 &&
                    ball.y > bricks[i][j].y &&
                    ball.y < bricks[i][j].y + 20) {
                    ball.dy *= -1;
                    bricks[i][j].status = 0;
                    score++;
                }
            }
        }
    }
}

function drawBricks() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (bricks[i][j].status == 1) {
                var brickX = (i * (canvas.width / 9 + 7.5)) + 7.5;
                var brickY = (j * 25) + 35;
                var brickColor = colorArray[i];
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, canvas.width / 9, 20);
                ctx.fillStyle = brickColor;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

var colorArray = ['#4285F4', '#DB4437', '#F4B400', '#4285F4', '#0F9D58', '#DB4437', '#4285F4', '#F4B400'];

function resetBall() {
    if (ball.y + ball.radius > canvas.height) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 100;
        ball.dy = -speed * Math.random() - 1;
    }
}

function drawScore() {
    ctx.font = '25px Arial';
    ctx.fillStyle = '#4285F4';
    ctx.fillText(`Score: ${score}`, 7.5, 22.5);
}

function drawLives() {
    ctx.font = '25px Arial';
    ctx.fillStyle = '#4285F4';
    ctx.fillText(`Life: ${life}`, canvas.width - 77.5, 22.5);
}

function decreaseLife() {
    if (ball.y + ball.radius > canvas.height) {
        life = life - 1;
    }
}

function drawGameOver() {
    ctx.font = '50px Arial';
    ctx.fillStyle = '#4285F4';
    ctx.fillText(`GAME OVER`, canvas.width / 4, canvas.height / 2);
    document.getElementById("startButton").innerHTML = "PLAY AGAIN?";
}

function drawCongrats() {
    ctx.font = '40px Arial';
    ctx.fillStyle = '#4285F4';
    ctx.fillText(`Congratulations! You Win!`, canvas.width / 8, canvas.height / 2);
    document.getElementById("startButton").innerHTML = "PLAY AGAIN?";
}

function play() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawScore();
    drawLives();
    drawBricks();
    ball.draw();
    paddle.draw();
    collision();
    decreaseLife();
    resetBall();


    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - 12 - paddle.height) {
        paddle.draw('#ddeff9');
        ball.dy *= -1.1;
    }

    if (life > 0 && score < 64) {
        requestAnimationFrame(play);
    } else if (score === 64) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawCongrats();
        document.getElementById('startButton').style.visibility = 'visible'
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawGameOver();
        document.getElementById('startButton').style.visibility = 'visible'
    }
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            paddle.x -= 15;
            break;
        case 'ArrowRight':
            paddle.x += 15;
            break;
    }
})

function drawTitle() {
    ctx.font = 'bold 80px serif';
    letterArray = ['B', 'R', 'E', 'A', 'K', 'O', 'U', 'T'];
    letterColorArray = ['#4285F4', '#DB4437', '#F4B400', '#4285F4', '#0F9D58', '#DB4437', '#4285F4', '#DB4437'];
    for (let l = 0; l < 8; l++) {
        ctx.fillStyle = letterColorArray[l];
        ctx.fillText(letterArray[l], 70 + l * 60, canvas.height / 4.5);
    }
}

function drawInstructions() {
    ctx.font = '22px serif';
    ctx.fillStyle = '#4285F4';
    var instructText = ['      Try and break all the bricks before you lose all your lives!',
        'Control the paddle with the left and right arrows on your keyboard.',
        '           Click on the start button bellow to begin the game!'
    ]
    for (let t = 0; t < 3; t++) {
        ctx.fillText(instructText[t], 5, canvas.height / 2.5 + t * 50)
    }
}

function startGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    life = 5;
    score = 0;
    for (let i = 0; i < 8; i++) {
        bricks[i] = [];
        for (let j = 0; j < 8; j++) {
            bricks[i][j] = {
                x: 0,
                y: 0,
                status: 1
            };
        }
    }
    paddle.x = canvas.width / 2 - 50;
    paddle.y = canvas.height - 30;
    resetBall();
    play();
    document.getElementById('startButton').style.visibility = 'hidden';
}

drawTitle()
drawInstructions();