import Tile from "./tile.js";
import Vector from "./vector.js"

const Structures = {
  tree: tree
}

function tree(chunk, x, y, This) {
  let row = Math.floor(Math.random() * This.chunkSize);
  let col = Math.floor(Math.random() * This.chunkSize);
  if (chunk.terrain[row][col].name === "grass") {
    chunk.blocks = new Array(This.chunkSize);
    for(let i = 0;i < This.chunkSize;i++) {
      chunk.blocks[i] = new Array(This.chunkSize);
    }
    chunk.blocks[row][col] = new Tile(
      "wood",
      new Vector(
        x*This.chunkSize+col,
        y*This.chunkSize+row
      )
    );
  }
  for(let i = -1;i < 2;i++) {
    try {
      chunk.blocks[row-1][col+i] = new Tile(
        "leaf",
        new Vector(
          x*This.chunkSize+col-1,
          y*This.chunkSize+row+i
        )
      );
    } catch {}
  }
  for(let i = -1;i < 2;i++) {
    try {
      if(i===0) continue;
      chunk.blocks[row][col+i] = new Tile(
        "leaf",
        new Vector(
          x*This.chunkSize+col,
          y*This.chunkSize+row+i
        )
      );
    } catch {}
  }
  for(let i = -1;i < 2;i++) {
    try {
      chunk.blocks[row+1][col+i] = new Tile(
        "leaf",
        new Vector(
          x*This.chunkSize+col+1,
          y*This.chunkSize+row+i
        )
      );
    } catch {}
  }
  return chunk;
}

export default Structures;