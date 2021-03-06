import Map from './modules/map.js';
import Vector from './modules/vector.js';
import Player from './modules/player.js';
import Hotbar from './modules/hotbar.js';

// variables
const options = {
  fps: 120,
  tileSize: 60,
  chunkSize: 16,
  maxSpeed: 5,
  acceleration: 20
}
let viewDistance = null,
  velocity = new Vector(),
  offsetX = 0, // player position
  offsetY = 0, // player position
  movement = {up:false,down:false,right:false,left:false};

// canvas setup
const canvas = document.getElementById("canvas");
const rect = canvas.getBoundingClientRect();
canvas.width = Math.round(devicePixelRatio * rect.right) - Math.round (devicePixelRatio * rect.left);
canvas.height = Math.round(devicePixelRatio * rect.bottom) - Math.round (devicePixelRatio * rect.top);
const ctx = canvas.getContext("2d");
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

viewDistance = Math.ceil(canvas.width / 2 / options.chunkSize / options.tileSize + 1) + 1;

const map = new Map(options, viewDistance);
const player = new Player(options);
const hotbar = new Hotbar(ctx, options);
document.body.addEventListener("mousedown", (e) => {
  player.attack();
});

let loading;
// game loop
let lastFrame = Date.now();
setInterval(() => {
  // calculate frame time
  let dateNow = Date.now();
  let timeSinceLastFrame = dateNow - lastFrame;

  // draw frame
  draw();

  // move player
  calculateMovement(timeSinceLastFrame);

  // update frame time
  lastFrame = dateNow;
}, 1000/options.fps);


// draw
function draw () {
  map.draw(ctx, offsetX, offsetY);
  map.drawBlocks(ctx, offsetX, offsetY);
  player.draw(ctx, canvas, options.tileSize);
  hotbar.draw();
}


// movement
function calculateMovement (timeSinceLastFrame) {
  if (movement.up) {
    if (velocity.y < options.maxSpeed) velocity.y += options.maxSpeed/options.acceleration;
  } else {
    if (velocity.y > 0) velocity.y -= options.maxSpeed/options.acceleration;
  }
  if (movement.down) {
    if (velocity.y > -options.maxSpeed) velocity.y -= options.maxSpeed/options.acceleration;
  } else {
    if (velocity.y < 0) velocity.y += options.maxSpeed/options.acceleration;
  }
  if (movement.left) {
    if (velocity.x < options.maxSpeed) velocity.x += options.maxSpeed/options.acceleration;
  } else {
    if (velocity.x > 0) velocity.x -= options.maxSpeed/options.acceleration;
  }
  if (movement.right) {
    if (velocity.x > -options.maxSpeed) velocity.x -= options.maxSpeed/options.acceleration;
  } else {
    if (velocity.x < 0) velocity.x += options.maxSpeed/options.acceleration;
  }
  let collide = map.doesCollide(new Vector(
    offsetY + velocity.x,
    offsetX + velocity.y
  ), ctx);
  if (!collide.y) {
    offsetY += velocity.y;
  }
  if (!collide.x) {
    offsetX += velocity.x;
  }
}
document.body.addEventListener ("keydown", (e) => {
  if (e.key.toLowerCase() == "w" || e.key == "ArrowUp") movement.up = true;
  if (e.key.toLowerCase() == "a" || e.key == "ArrowLeft") movement.left = true;
  if (e.key.toLowerCase() == "s" || e.key == "ArrowDown") movement.down = true;
  if (e.key.toLowerCase() == "d" || e.key == "ArrowRight") movement.right = true;
});
document.body.addEventListener ("keyup", (e) => {
  if (e.key.toLowerCase() == "w" || e.key == "ArrowUp") movement.up = false;
  if (e.key.toLowerCase() == "a" || e.key == "ArrowLeft") movement.left = false;
  if (e.key.toLowerCase() == "s" || e.key == "ArrowDown") movement.down = false;
  if (e.key.toLowerCase() == "d" || e.key == "ArrowRight") movement.right = false;
});