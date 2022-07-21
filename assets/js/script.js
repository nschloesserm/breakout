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
        ctx.beginPath()
        ctx.fillStyle = '#61abc0';
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
}

function play() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ball.draw();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    requestAnimationFrame(play);
}

play();