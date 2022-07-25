const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


canvas.height = 600;
canvas.width = 600;

let speed = 3;
let life = 5;
let score = 0;
let c = '#61abc0';

let ball = {
    x: canvas.width/2,
    y: canvas.height - 100,
    dx: speed,
    dy: -speed * Math.random() - 1,
    radius: 8,
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = '#61abc0';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
}

let paddle = {
    height: 12,
    width: 100,
    x: canvas.width/2 - 50,
    y: canvas.height - 30,
    draw: function(c) {
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
        bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}

function collision() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (bricks[i][j].status == 1) {
                if (ball.x > bricks[i][j].x && 
                    ball.x < bricks[i][j].x + canvas.width/8 && 
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
                var brickX = (i * (canvas.width/9 + 7.5)) + 7.5;
                var brickY = (j * 25) + 35;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, canvas.width/9, 20);
                ctx.fillStyle = '#61abc0';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height - 100;
    ball.dy = -speed * Math.random() - 1;
}

function drawScore() {
    ctx.font = '25px Arial';
    ctx.fillStyle = '#61abc0';
    ctx.fillText(`Score: ${score}`, 7.5, 22.5);
  }

  function drawLives() {
    ctx.font = '25px Arial';
    ctx.fillStyle = '#61abc0';
    ctx.fillText(`Life: ${life}`, canvas.width - 77.5, 22.5);
  }

  function decreaseLife() {
    if (ball.y + ball.radius > canvas.height) {
        life = life - 1;
        resetBall();
    }
  }

  function drawGameOver() {
    ctx.font = '50px Arial';
    ctx.fillStyle = '#61abc0';
    ctx.fillText(`GAME OVER`, canvas.width/4, canvas.height/2);
  }

  function drawCongrats() {
    ctx.font = '40px Arial';
    ctx.fillStyle = '#61abc0';
    ctx.fillText(`Congratulations! You Win!`, canvas.width/8, canvas.height/2);
  }

function play() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawScore();
    drawLives();
    drawBricks();
    ball.draw();
    paddle.draw();
    collision();
    decreaseLife();
    

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (ball.x >= paddle.x 
        && ball.x <= paddle.x + paddle.width 
        && ball.y + ball.radius >= canvas.height- 12 - paddle.height) {
        paddle.draw('#ddeff9');
        ball.dy *= -1.1;
    }

    if (life > 0 && score < 64) {
    requestAnimationFrame(play);
    } else  if (score === 64) {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        drawCongrats();
        document.getElementById('startButton').style.visibility = 'visible'
    } else {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        drawGameOver();
        document.getElementById('startButton').style.visibility = 'visible'
    }
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
            case 'ArrowLeft' : paddle.x -= 15; break;
            case 'ArrowRight' : paddle.x += 15; break;
    }
})

function startGame() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    life = 5;
    score = 0;
    for (let i = 0; i < 8; i++) {
        bricks[i] = [];
        for (let j = 0; j < 8; j++) {
            bricks[i][j] = { x: 0, y: 0, status: 1 };
        }
    }
    play();
    document.getElementById('startButton').style.visibility = 'hidden';
}
