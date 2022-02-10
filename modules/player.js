import Vector from './vector.js';

const player = new Image();
const hand = new Image();
player.src = "./assets/player.png";
hand.src = "./assets/hands.png";


let clientX,
  clientY;

export default class Player {
  constructor () {
    this.attacking;
    this.out = false;
    this.handOffset = 0;
  }

  draw (ctx, canvas, tileSize) {
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(-Math.atan2(clientX - window.innerWidth/2, clientY - window.innerHeight/2) + Math.PI);
    ctx.drawImage(player, -tileSize/2, -tileSize/2, tileSize, tileSize);
    ctx.drawImage(hand, -tileSize/2, -tileSize/2-this.handOffset, tileSize, tileSize/4);
    if(this.attacking && !this.out) {
      if(this.handOffset < 15) {
        this.handOffset += 3;
      } else {
        this.out = true;
      }
    }
    if(this.attacking && this.out) {
      if(this.handOffset > 0) {
        this.handOffset -= 3;
      } else {
        this.attacking =  false;
        this.out = false;
      }
    }
    ctx.restore();
  }

  attack () {
    if(!this.attacking) {
      this.attacking = true;
    }
  }
}

document.body.addEventListener("mousemove", (e) => {
  clientX = e.clientX;
  clientY = e.clientY;
});