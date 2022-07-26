const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


canvas.height = 600;
canvas.width = 600;

let speed = 3;
let life = 5;
let score = 0;
let c = '#61abc0';

// draws game ball and establishs a random direction

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

//Draws Paddle

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

//creates a two dimensional array for the bricks to "live" in and establishes brick status to 1

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

// changes brick status to 0, increases score, and reverses direction if ball collides with brick

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

//draws brick if status = 1 

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

//resets ball position to start point and sends in random direction

function resetBall() {
    if (ball.y + ball.radius > canvas.height) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 100;
        ball.dy = -speed * Math.random() - 1;
    }
}

//draws current score

function drawScore() {
    ctx.font = '25px Arial';
    ctx.fillStyle = '#4285F4';
    ctx.fillText(`Score: ${score}`, 7.5, 22.5);
}

//draws current life

function drawLives() {
    ctx.font = '25px Arial';
    ctx.fillStyle = '#4285F4';
    ctx.fillText(`Life: ${life}`, canvas.width - 77.5, 22.5);
}

//decreases life if ball intersects with bottom of canvas

function decreaseLife() {
    if (ball.y + ball.radius > canvas.height) {
        life = life - 1;
    }
}

//draws game over and changes button text to "PLAY AGAIN?"

function drawGameOver() {
    ctx.font = '50px Arial';
    ctx.fillStyle = '#4285F4';
    ctx.fillText(`GAME OVER`, canvas.width / 4, canvas.height / 2);
    document.getElementById("startButton").innerHTML = "PLAY AGAIN?";
}

//Draws win after score reaches 64 and changes button text to "PLAY AGAIN?"

function drawCongrats() {
    ctx.font = '40px Arial';
    ctx.fillStyle = '#4285F4';
    ctx.fillText(`Congratulations! You Win!`, canvas.width / 8, canvas.height / 2);
    document.getElementById("startButton").innerHTML = "PLAY AGAIN?";
}

//Play function of entire game started with startGame function

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

    //moves the x and y axis of ball by adding the corisponding dx and dy. Makes ball move!

    ball.x += ball.dx;
    ball.y += ball.dy;

    //next two if statements reverse ball direction if ball x intersects left or right canvas wall or if y axis of ball intersects 0 or top of canvas

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
    }

    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    //next if statement reverses direction of ball if intersects paddle, and briefly changes color for effect

    if (ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width &&
        ball.y + ball.radius >= canvas.height - 12 - paddle.height) {
        paddle.draw('#ddeff9');
        ball.dy *= -1.1;
    }

    //if life is greater than 0 and if the score is less than 64 the play function starts again, but if score equals 64 than the game is won or if life equals 0 the gamae is lost

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

//event listener for the left/right arrow key. When pressed the paddle moves 15 px left or right along the x axis

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

//draws game title and assigns a color to each letter of title

function drawTitle() {
    ctx.font = 'bold 80px serif';
    letterArray = ['B', 'R', 'E', 'A', 'K', 'O', 'U', 'T'];
    letterColorArray = ['#4285F4', '#DB4437', '#F4B400', '#4285F4', '#0F9D58', '#DB4437', '#4285F4', '#DB4437'];
    for (let l = 0; l < 8; l++) {
        ctx.fillStyle = letterColorArray[l];
        ctx.fillText(letterArray[l], 70 + l * 60, canvas.height / 4.5);
    }
}

//draws game instructions

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

//when button is clicked this function starts, clears the canvas, resets the lives, resets the score, resets the brick array, and resets the paddle, then hides the buttons
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