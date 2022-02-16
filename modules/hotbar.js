let sprites = {hotbar:{},health:{}};
sprites.hotbar.active = new Image();
sprites.hotbar.inactive = new Image();
sprites.health.full = new Image();
sprites.health.half = new Image();
sprites.health.none = new Image();
sprites.hotbar.active.src = "./assets/hotbar-active.png";
sprites.hotbar.inactive.src = "./assets/hotbar-normal.png";
sprites.health.full.src = "./assets/health-full.png";
sprites.health.half.src = "./assets/health-half.png";
sprites.health.none.src = "./assets/health-none.png";

export default class Hotbar {
  constructor (ctx, options) {
    this.options = options;
    this.ctx = ctx;
    this.position = 0;
    this.slots = 5;
    document.addEventListener("mousewheel", (e) => {
      if(e.wheelDeltaY > 0) {
        this.position++;
        if(this.position > this.slots) this.position = 0;
      } else {
        this.position--;
        if(this.position < 0) this.position = this.slots;
      }
    });
  }

  draw () {
    this.drawHotbar();
  }

  drawHotbar () {
    for(let i = 0;i < this.slots;i++) {
      let asset = sprites.hotbar.inactive;
      if(i === this.position) asset = sprites.hotbar.active;
      this.ctx.drawImage(
        asset,
        this.options.tileSize*i+10,
        window.innerHeight - this.options.tileSize-10,
        this.options.tileSize,
        this.options.tileSize
      );
    }
  }

  drawHealth () {

  }
}