// variable declaration
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const paddleHeight = grid * 5;
const maxPaddleY = canvas.height - grid - paddleHeight;

let paddleSpeed = 6;
let ballSpeed = 4;

// left paddle
const leftPaddle = {
    // start in the middle of the game on the left side.
    x: grid *2,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,

    // paddle velocity
    dy:0
};

// right paddle
const rightPaddle = {
    // start in the middle of the game on the left side.
    x: canvas.width - grid * 3,
    y: canvas.height / 2 - paddleHeight / 2,
    width: grid,
    height: paddleHeight,

    // paddle velocity
    dy:0
};

// the ball
// Start in the middle of the game as always
const ball = {
    x: canvas.width /2,
    y: canvas.height /2,
    width: grid,
    height: grid,

    // Resetting the ball position after each score, initially we will set it to false
    resetting: false,

    // ball velocity  (start going to the top-right corner of the screen)
    dx: ballSpeed,
    dy: -ballSpeed,
};

// AABB => Now we will check the collision betweenn two objects (the ball and paddle)
// this function will check out the collision between two objects
function collides(obj1, obj2){
    return obj1.x < obj2.x + obj2.width && 
           obj1.x + obj1.width > obj2.x && 
           obj1.y < obj2.y + obj2.height && 
           obj1.y + obj1.height > obj2.y; 
}
// Game loop
function loop(){
    requestAnimationFrame(loop);
    context.clearRect(0,0,canvas.width,canvas.height);
    // Move paddles by velocity
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
    // Preventing the paddles from going throught the walls
    if (leftPaddle.y < grid) {
        leftPaddle.y = grid;
    }
    else if (leftPaddle.y > maxPaddleY){
        leftPaddle.y = maxPaddleY;
    }
    if (rightPaddle.y < grid) {
        rightPaddle.y = grid;
    }
    else if (rightPaddle.y > maxPaddleY){
        rightPaddle.y = maxPaddleY;
    }
    
    // draw paddles
    context. fillStyle = 'white';
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    
    // Now, moving ball with velocity
    ball.x += ball.dx;
    ball.y += ball.dy;

    // preventing the ball from going through the walls by changing the velocity attributed to the ball 
    if (ball.y < grid) {
        ball.y = grid;
        ball.dy *= -1;
    }
    else if (ball.y + grid > canvas.height - grid){
        ball.y = canvas.height - grid * 2;
        ball.dy *= -1;
    }

    // reset ball if it goes past paddle (but only if we haven't already done so)
  if ((ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;

    // give some time for the player to recover before launching the ball again
    setTimeout(() => {
      ball.resetting = false;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
    }, 400);
  }

// Check to see if ball collides with paddle.
if (collides(ball, leftPaddle)) {
    ball.dx *= -1;
    // Move the ball next to the paddle otherwise the collision will happen again in the next frame.
    ball.x = leftPaddle.x + leftPaddle.width; 
}
else if (collides(ball, rightPaddle)){
    ball.dx *= -1;
    // Move the ball next to the paddle otherwise the collision will happen again in the next frame.
    ball.x = rightPaddle.x - ball.width; 
}

// draw ball
context.fillStyle = 'orange';  
context.fillRect(ball.x, ball.y, ball.width, ball.height);

  // draw walls
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  // draw dotted line down the middle
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
}

// Event listeners for keyboard
document.addEventListener('keydown', function(e){
    // Arrow up
    if (e.which === 38) {
        rightPaddle.dy = -paddleSpeed;
    }
    // Arrow down
    else if (e.which === 40) {
        rightPaddle.dy = paddleSpeed;
    }
    // "w" arrow key for left arrow up
    if (e.which === 87) {
        leftPaddle.dy = -paddleSpeed;
    }
    // "a" arrow key for left arrow down
    else if (e.which === 83) {
        leftPaddle.dy = paddleSpeed;
    }
});

// something wrong with the collision - fixed!
// it was during the checkin ig the ball collides with paddle, if they change x velocity, so x velocity should never be changed to y.

// the last thing remaining here is that we need to stop the paddle from continuing moving up or down.
document.addEventListener('keyup', function(e){
    if (e.which === 38 || e.which === 40) {
        rightPaddle.dy = 0 ;
    }
    if (e.which === 83 || e.which === 87) {
        leftPaddle.dy = 0 ;
    }
});
// Start the game
requestAnimationFrame(loop);




