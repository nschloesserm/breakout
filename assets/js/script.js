const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


canvas.height = 600;
canvas.width = 600;

let speed = 3;
let life = 5;
let c = '#61abc0';

let ball = {
    x: canvas.width/2,
    y: canvas.height - 100,
    dx: speed,
    dy: -speed * Math.random() - 0.2,
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


let brick  = {
    height: 20,
    width: 60,
    x: 7.5,
    y: 20,}

function drawBrick() {
    ctx.beginPath();
    ctx.rect(brick.x, brick.y, brick.width, brick.height);
    ctx.fillStyle = '#61abc0';
    ctx.closePath();
    ctx.fill();
}

let brickTwo  = {
    height: 20,
    width: 60,
    x: canvas.width/8 + 7.5,
    y: 20,}

function drawBrickTwo() {
    ctx.beginPath();
    ctx.rect(brickTwo.x, brickTwo.y, brickTwo.width, brickTwo.height);
    ctx.fillStyle = '#61abc0';
    ctx.closePath();
    ctx.fill();
}

// function bricks() {
//     for (let i = 0; i < 8; i++) {
//         for (let j = 0; j < 8; j++) {
//             brick.x = j * canvas.width/8 + 7.5;
//             brick.y = i * canvas.height/18 + 20;
//             brick.draw();
//         }
//     }
// }

function collision() {
    if (ball.x < brick.x + brick.width 
        && ball.x + ball.radius  > brick.x  
        && ball.y < brick.x + brick.height
        && ball.radius + ball.y > brick.y - 10) {
        ball.dy *= -1;
        destroyBrick();
    }

    if (ball.x < brickTwo.x + brickTwo.width 
        && ball.x + ball.radius  > brickTwo.x  
        && ball.y < brickTwo.x + brickTwo.height 
        && ball.radius + ball.y > brickTwo.y - 10) {
        ball.dy *= -1;
        destroyBrickTwo()
    }
}

function destroyBrick() {
    brick.height = 0
    brick.width = 0
}

function destroyBrickTwo() {
    brickTwo.height = 0
    brickTwo.width = 0
}

function play() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ball.draw();
    paddle.draw();
    drawBrick();
    drawBrickTwo();
    collision();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (ball.y + ball.radius > canvas.height) {
        ball.x = canvas.width/2;
        ball.y = canvas.height - 100;
        ball.dy = -speed + 1;
    }

    if (ball.x >= paddle.x 
        && ball.x <= paddle.x + paddle.width 
        && ball.y + ball.radius >= canvas.height- 12 - paddle.height) {
        paddle.draw('#ddeff9');
        ball.dy *= -1.1;
    }

    requestAnimationFrame(play);
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
            case 'ArrowLeft' : paddle.x -= 15; break;
            case 'ArrowRight' : paddle.x += 15; break;
    }
})

function startGame() {
    play();
    document.getElementById('startButton').style.visibility = 'hidden';
}
