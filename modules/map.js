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

  // collition calculations
  // credit to barkai lazimy
  // also kinda broken rn
  doesCollide (vector, ctx) {
  //   //console.log(vector);
  //   let currentChunkX = Math.floor((-(vector.x) - canvas.width/2)/this.chunkSize/this.tileSize);
  //   let currentChunkY = Math.floor((-(vector.y) - canvas.height/2)/this.chunkSize/this.tileSize);

  //   // console.log(new Vector(
  //   //   currentChunkX,
  //   //   currentChunkY
  //   // ));

  //   let tileX = -vector.x;
  //   let tileY = -vector.y;
    
  //   //ctx.fillStyle = "black";
  //   //ctx.fillRect(tileX, tileY, this.tileSize, this.tileSize);

  //   let chunk = this.getChunkAt(currentChunkX, currentChunkY);
    
  //   var vissibleX = canvas.width / this.tileSize;
  //   var vissibleY = canvas.height / this.tileSize;

  //   // brr
  //   // var tileOfset = new Vector(
  //   //   vector.x / this.tileSize % window.innerWidth,
  //   //   vector.y / this.tileSize % window.innerHeight
  //   // );

  //   var pos = new Vector();
  //   pos.y = -Math.round(vector.x / this.tileSize)%16;
  //   pos.x = -Math.round(vector.y / this.tileSize)%16;

  //   var tilePos = new Vector(Math.round(pos.x), Math.round(pos.y));
  //   var tile = chunk.terrain[tilePos.y][tilePos.x];
	// console.log(tile);

  //   ctx.fillStyle = 'rgb(0,1,0,0.2)';
  //   ctx.fillRect(
  //     Math.round(pos.x * this.tileSize + (vector.y + this.tileSize) + canvas.width / 2) - this.tileSize * 1.5,
  //     Math.round(pos.y * this.tileSize + (vector.x + this.tileSize) + canvas.height / 2) - this.tileSize * 1.5,
  //     this.tileSize,
  //     this.tileSize
  //   );

    return new Vector();
  }

  // needs testing
  // getPlayerPosition (vector) {
  //   let position = new Vector();

  //   // yeet
  //   positon.x = Math.floor(vector.x/this.tileSize);
  //   position.y = Math.floor(vector.y/this.tileSize);

  //   return position;
  // }
}