import Vector from './vector.js';
import Rock from './rock.js';

const player = new Image();
const hands = new Image();
const hand = new Image();
const rock = new Image();
player.src = "./assets/player.png";
hands.src = "./assets/hands.png";
hand.src = "./assets/hand.png";
rock.src = "./assets/rock.png";

const hotbar = [
  rock
];

let clientX,
  clientY;

export default class Player {
  constructor () {
    this.attacking;
    this.out = false;
    this.handsOffset = 0;
    this.entities = [];
  }

  draw (ctx, canvas, tileSize) {
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(-Math.atan2(clientX - window.innerWidth/2, clientY - window.innerHeight/2) + Math.PI);
    ctx.drawImage(player, -tileSize/2, -tileSize/2, tileSize, tileSize);
    ctx.drawImage(hand, -tileSize/2, -tileSize/2-this.handsOffset, tileSize/4, tileSize/4);
    ctx.drawImage(hand, tileSize/4, -tileSize/2-this.handsOffset, tileSize/4, tileSize/4);
    if(hotbar[0]) {
      ctx.drawImage(hotbar[0], tileSize/4, -tileSize/2-this.handsOffset-(tileSize/16), tileSize/4, tileSize/4);
    }
    if(this.attacking && !this.out) {
      if(this.handsOffset < 15) {
        this.handsOffset += 3;
      } else {
        this.out = true;
      }
    }
    if (this.attacking && this.out) {
      if (this.handsOffset > 0) {
        this.handsOffset -= 3;
      } else {
        this.attacking =  false;
        this.out = false;
      }
    }
    ctx.restore();
    this.entities.forEach((entity) => {
      entity.draw(ctx);
    });
  }

  attack () {
    if(!this.attacking) {
      this.attacking = true;
      this.entities.push(new Rock(-Math.atan2(clientX - window.innerWidth/2, clientY - window.innerHeight/2) + Math.PI, new Vector(window.innerWidth/2, window.innerHeight/2)));
    }
  }
}

document.body.addEventListener("mousemove", (e) => {
  clientX = e.clientX;
  clientY = e.clientY;
});