const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.height = 600;
canvas.width = 600;

let speed = 3;

let ball = {
    x: canvas.width/2,
    y: canvas.height - 100,
    dx: speed,
    dy: -speed + 1,
    radius: 7,
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
    draw: function() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#61abc0';
        ctx.closePath();
        ctx.fill();
    }
}

window.addEventListener('keydown', (event) => {
    switch (event.key) {
            case 'ArrowLeft' : paddle.x -= 15; break;
            case 'ArrowRight' : paddle.x += 15; break;
    }
})

function play() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ball.draw();
    paddle.draw();

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

    if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.width && ball.y + ball.radius >= canvas.height- 12 - paddle.height) {
        ball.dy *= -1.08;
    }

    requestAnimationFrame(play);
}

function startGame() {
    play();

    document.getElementById('startButton').style.visibility = 'hidden';
}
