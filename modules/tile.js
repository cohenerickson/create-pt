import Vector from './vector.js';

let count = 0;
function handleImgLoad () {
  count++;
  if (count >= 20) {
    document.getElementById("canvas").style.display = "block";
  }
}

// tile map
const Tiles = new Array(20);
for(let i = 0;i < Tiles.length;i++) {
  Tiles[i] = new Image();
  Tiles[i].onload = handleImgLoad();
  Tiles[i].src = `./assets/noise${i+1}.png`;
}

// new tile class
export default class Tile {
  constructor (_int, _pos) {
    let tile = this.toTile(_int);
    if(!tile) return;
    this.color = tile.color;
    this.texture = tile.texture
    this.name = tile.name;
    this.collidable = tile.collidable;
    this.vector = new Vector(_pos.x, _pos.y);
  }

  // turn number from noise function into a tile object
  toTile(int) {
    if(int < -0.5) return new Water();
    else if(int < -0.4) return new Sand();
    else if(int < -0.39) return new Dirt();
    else if(int < 0.3) return new Grass();
    else if(int < 0.8) return new Stone();
    else if(int <= 1) return new Snow();
  }
}

class Water {
  constructor () {
    this.color = "#3780e6";
    this.texture = Tiles[Math.floor(Math.random() * Tiles.length)];
    this.name = "Water";
    this.collidable = false;
  }
}

class Sand {
  constructor () {
    this.color = "#fffa54";
    this.texture = Tiles[Math.floor(Math.random() * Tiles.length)];
    this.name = "Sand";
    this.collidable = false;
  }
}

class Dirt {
  constructor () {
    this.color = "#69461f";
    this.texture = Tiles[Math.floor(Math.random() * Tiles.length)];
    this.name = "Dirt";
    this.collidable = false;
  }
}

class Grass {
  constructor () {
    this.color = "#2dd100";
    this.texture = Tiles[Math.floor(Math.random() * Tiles.length)];
    this.name = "Grass";
    this.collidable = false;
  }
}

class Stone {
  constructor () {
    this.color = "gray";
    this.texture = Tiles[Math.floor(Math.random() * Tiles.length)];
    this.name = "stone";
    this.collidable = false;
  }
}

class Snow {
  constructor () {
    this.color = "white";
    this.texture = Tiles[Math.floor(Math.random() * Tiles.length)];
    this.name = "snow";
    this.collidable = false;
  }
}