import Vector from './vector.js';

export default class Rock {
  constructor (rotation, vector = new Vector()) {
    this.x = vector.x;
    this.y = vector.y;
    this.velocity = new Vector(0, 10);
    this.rotation = rotation;
    this.asset = new Image();
    this.asset.src = "./assets/rock.png"
  }

  draw (ctx) {
    ctx.save();
    ctx.rotate(this.rotation-Math.PI);

    ctx.drawImage(this.asset, this.x, this.y, 60/4, 60/4);

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    ctx.restore();
  }
}