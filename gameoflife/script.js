var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');


const my2DArray = [];
const columns = canvas.width / 10;
const rows = canvas.height / 10;

var tiles = [];
var aliveTiles = [];
var changedTiles = [];

console.log(canvas.width);
console.log(canvas.height);

class Tile
{
  constructor(x, y, isAlive)
  {
    this.x = x;
    this.y = y;
    this.isAlive = isAlive;
    this.neighbors = [];
    this.isChecked = false;
  }
}

for (let i = 0; i < columns; i++) 
{
    my2DArray[i] = [];
    for (let j = 0; j < rows; j++) 
    {
      my2DArray[i][j] = new Tile(i, j, Math.random() < 0.5);
      tiles.push(my2DArray[i][j]);
      if(my2DArray[i][j].isAlive)
      {
        drawPixel(i, j);
        aliveTiles.push(my2DArray[i][j]);
      }
    }
}
for (let i = 0; i < columns; i++) 
  {
      for (let j = 0; j < rows; j++) 
      {
        if(i - 1 >= 0)
        {
          //X00
          //X00
          //X00
          my2DArray[i][j].neighbors.push(my2DArray[i - 1][j]);
          
          if(j - 1 >= 0)
          {
            my2DArray[i][j].neighbors.push(my2DArray[i - 1][j - 1]);
          }
            
          if(j + 1 < rows)
          {
            my2DArray[i][j].neighbors.push(my2DArray[i - 1][j + 1]);
          }
            
        }
        if(i + 1 < columns)
        {
            //00X
            //00X
            //00X
            my2DArray[i][j].neighbors.push(my2DArray[i + 1][j]);
            
            if(j - 1 >= 0)
            {
              my2DArray[i][j].neighbors.push(my2DArray[i + 1][j - 1]);
            }
              
            if(j + 1 < rows)
            {
              my2DArray[i][j].neighbors.push(my2DArray[i + 1][j + 1]);
            }
              
        }
        if(j + 1 < rows){
          my2DArray[i][j].neighbors.push(my2DArray[i][j + 1]);
        }
        if(j - 1 >= 0){
          my2DArray[i][j].neighbors.push(my2DArray[i][j - 1]);
        } 

      }

      
  }


setInterval(gameLoop, 75);


function gameLoop()
{
  console.log("loop");
  for(const tile of aliveTiles){
    checkTile(tile);
  }

  for(const tile of changedTiles){
    if(!tile.isAlive){
      aliveTiles.push(tile);
      tile.isAlive = true;
      drawPixel(tile.x, tile.y, 'black');
    }
    else{
      aliveTiles.splice(aliveTiles.indexOf(tile), 1);
      tile.isAlive = false;
      drawPixel(tile.x, tile.y, 'white');

    }
  }
  for(const tile of tiles){
    tile.isChecked = false;
  }

  changedTiles = [];
  console.log(my2DArray[0][0].isAlive)
}

function checkTile(tile)
{
  var neighborCount = 0;

  for(const neighbor of tile.neighbors)
  {
    if(neighbor.isAlive){
      neighborCount++;
    }
    else if(!neighbor.isChecked && tile.isAlive){
      neighbor.isChecked = true;
      checkTile(neighbor);
    }
  }

  if(tile.isAlive){
    if(neighborCount < 2 ){
      changedTiles.push(tile);
    }
    else if(neighborCount > 3){
      changedTiles.push(tile);
    }
  }
  else{
    if(neighborCount == 3){
      changedTiles.push(tile);
    }
  }
}

function drawPixel(x, y, color)
{
  ctx.fillStyle = color;
  ctx.fillRect(x*10, y*10, 10, 10);
}



