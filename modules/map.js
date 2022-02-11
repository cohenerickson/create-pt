import Tile from "./tile.js";
import Vector from "./vector.js";
import Structures from "./structures.js"

export default class Map {
  constructor (_options, viewDistance) {
    this.seed = _options.seed || Math.random();
    this.chunkSize = _options.chunkSize;
    this.tileSize = _options.tileSize;
    this.viewDistance = viewDistance;
    noise.seed(this.seed);


    this.chunks = [];
  }

  // generate new chunk
  generateChunk (x, y) {
    let wood = 0;
    let chunk = {
      x: x,
      y: y,
      terrain: [],
      blocks : []
    };
    for(let rowIndex = 0;rowIndex < this.chunkSize;rowIndex++) {
      let row = [];
      for(let colIndex = 0;colIndex < this.chunkSize;colIndex++) {
        let tile = new Tile(
          this.generateBlock(
            (x * this.chunkSize + colIndex),
            (y * this.chunkSize + rowIndex + 1)
          ),
          new Vector(
            x*this.chunkSize+colIndex,
            y*this.chunkSize+rowIndex
          )
        );
        row.push(tile);
      }
      chunk.terrain.push(row);
    }
    this.chunks.push(chunk);
    chunk = Structures.tree(chunk, x, y, this);
    return chunk;
  }

  // generate block at coords
  generateBlock (x, y) {
    noise.seed(this.seed);
    let simplex = noise.simplex2(x*0.05, y*0.05);
    noise.seed(this.seed + 1);
    let simplex2 = noise.simplex2(x*0.05, y*0.05);
    return (simplex+simplex2)/2;
  }

  // get chunk at chunk x and y position
  getChunkAt(x, y) {
    let chunk;
    for(let i = 0; i < this.chunks.length;i++) {
      if(this.chunks[i].x == x && this.chunks[i].y == y) {
        chunk = this.chunks[i];
      }
    }
    if(!chunk) chunk = this.generateChunk(x, y);
    return chunk;
  }

  draw (ctx, offsetX, offsetY) {
    // clear canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // get chunks near player
    let currentChunkX = Math.floor((-(offsetX) - canvas.width/2)/this.chunkSize/this.tileSize);
    let currentChunkY = Math.floor((-(offsetY) - canvas.height/2)/this.chunkSize/this.tileSize);
    //if(currentChunkX!==0 || currentChunkY!==0) return;
    // loop through all blocks
    for(let rowIndex = 0;rowIndex < this.viewDistance;rowIndex++) {
      for(let colIndex = 0;colIndex < this.viewDistance;colIndex++) {
        // calculate chunk x and y
        let x = currentChunkX + rowIndex;
        let y = currentChunkY + colIndex;
        // get the surounding chunk
        let chunk = this.getChunkAt(x, y);
        // draw the chunk on screen
        chunk.terrain.forEach((row) => {
          // loop through all tiles in the row
          row.forEach((tile) => {
            // draw tile
            ctx.fillStyle = tile.color;
            // for some reason having these lines compacted increases preformance
            ctx.fillRect(Math.round(tile.vector.x * this.tileSize + offsetX + canvas.width/2),Math.round(tile.vector.y * this.tileSize + offsetY + canvas.height/2),this.tileSize,this.tileSize);
          });
        });
      }
    }
    ctx.globalAlpha = 0.2;
    for(let rowIndex = 0;rowIndex < this.viewDistance;rowIndex++) {
      for(let colIndex = 0;colIndex < this.viewDistance;colIndex++) {
        // calculate chunk x and y
        let x = currentChunkX + rowIndex;
        let y = currentChunkY + colIndex;
        // get the surounding chunk
        let chunk = this.getChunkAt(x, y);
        // draw the chunk on screen
        chunk.terrain.forEach((row) => {
          // loop through all tiles in the row
          row.forEach((tile) => {
            // draw tile
            // for some reason having these lines compacted increases preformance
            ctx.drawImage(tile.texture,Math.round(tile.vector.x * this.tileSize + offsetX + canvas.width/2),Math.round(tile.vector.y * this.tileSize + offsetY + canvas.height/2),this.tileSize,this.tileSize);
          });
        });
      }
    }
  }

  drawBlocks (ctx, offsetX, offsetY) {
    ctx.globalAlpha = 1;
    // get chunks near player
    let currentChunkX = Math.floor((-(offsetX) - canvas.width/2)/this.chunkSize/this.tileSize);
    let currentChunkY = Math.floor((-(offsetY) - canvas.height/2)/this.chunkSize/this.tileSize);
    // loop through all blocks
    for(let rowIndex = 0;rowIndex < this.viewDistance;rowIndex++) {
      for(let colIndex = 0;colIndex < this.viewDistance;colIndex++) {
        // calculate chunk x and y
        let x = currentChunkX + rowIndex;
        let y = currentChunkY + colIndex;
        // get the surounding chunk
        let chunk = this.getChunkAt(x, y);
        // draw the chunk on screen
        chunk.blocks.forEach((row) => {
          // loop through all tiles in the row
          row.forEach((tile) => {
            // draw tile
            ctx.fillStyle = tile.color;
            // for some reason having these lines compacted increases preformance
            if (tile.vector) {
              ctx.drawImage(tile.texture,Math.round(tile.vector.x * this.tileSize + offsetX + canvas.width/2),Math.round(tile.vector.y * this.tileSize + offsetY + canvas.height/2),this.tileSize,this.tileSize);
            }
          });
        });
      }
    }
  }
}