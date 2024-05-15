var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var slider = document.getElementById('delaySlider');


const tileArray = [];
const columns = canvas.width / 10;
const rows = canvas.height / 10;

const colors = ['#ed2626', '#faf32a', '#18e815', '#20e6df', '#8d32e3', '#ed34a6']
var liveTileColor = colors[0];
var nextColorIndex = 1;
const colorTransitionTime = 5000; // 5 seconds
const colorIntervalTime = 50; 

var tiles = [];
var aliveTiles = [];
var changedTiles = [];

console.log(canvas.width);
console.log(canvas.height);

class Tile {
    constructor(x, y, isAlive) {
        this.x = x;
        this.y = y;
        this.isAlive = isAlive;
        this.neighbors = [];
        this.isChecked = false;
    }
}

function setup() {
    for (let i = 0; i < columns; i++) {
        tileArray[i] = [];
        for (let j = 0; j < rows; j++) {
            tileArray[i][j] = new Tile(i, j, Math.random() < 0.20);
            tiles.push(tileArray[i][j]);
            if (tileArray[i][j].isAlive) {
                drawPixel(i, j, liveTileColor);
                aliveTiles.push(tileArray[i][j]);
            }
        }
    }
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (i - 1 >= 0) {
                tileArray[i][j].neighbors.push(tileArray[i - 1][j]);

                if (j - 1 >= 0) {
                    tileArray[i][j].neighbors.push(tileArray[i - 1][j - 1]);
                }

                if (j + 1 < rows) {
                    tileArray[i][j].neighbors.push(tileArray[i - 1][j + 1]);
                }

            }
            if (i + 1 < columns) {
                tileArray[i][j].neighbors.push(tileArray[i + 1][j]);

                if (j - 1 >= 0) {
                    tileArray[i][j].neighbors.push(tileArray[i + 1][j - 1]);
                }

                if (j + 1 < rows) {
                    tileArray[i][j].neighbors.push(tileArray[i + 1][j + 1]);
                }

            }
            if (j + 1 < rows) {
                tileArray[i][j].neighbors.push(tileArray[i][j + 1]);
            }
            if (j - 1 >= 0) {
                tileArray[i][j].neighbors.push(tileArray[i][j - 1]);
            }

        }


    }
}

function gameLoop() {
    for (const tile of aliveTiles) {
        checkTile(tile);
    }

    for (const tile of changedTiles) {
        if (!tile.isAlive) {
            aliveTiles.push(tile);
            tile.isAlive = true;
            drawPixel(tile.x, tile.y, liveTileColor);
        } else {
            aliveTiles.splice(aliveTiles.indexOf(tile), 1);
            tile.isAlive = false;
            drawPixel(tile.x, tile.y, '#0d0d0d');

        }
    }
    for (const tile of tiles) {
        tile.isChecked = false;
        if(tile.isAlive)
            drawPixel(tile.x, tile.y, liveTileColor);
    }

    changedTiles = [];
}

function checkTile(tile) {
    var neighborCount = 0;

    for (const neighbor of tile.neighbors) {
        if (neighbor.isAlive) {
            neighborCount++;
        } else if (!neighbor.isChecked && tile.isAlive) {
            neighbor.isChecked = true;
            checkTile(neighbor);
        }
    }

    if (tile.isAlive) {
        if (neighborCount < 2) {
            changedTiles.push(tile);
        } else if (neighborCount > 3) {
            changedTiles.push(tile);
        }
    } else {
        if (neighborCount == 3) {
            changedTiles.push(tile);
        }
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function colorLoop(){
    var currentColor = hexToRgb(liveTileColor);
    var targetColor = hexToRgb(colors[nextColorIndex]);

    var colorIncrement = {
        r: (targetColor.r - currentColor.r) / (colorTransitionTime / colorIntervalTime),
        g: (targetColor.g - currentColor.g) / (colorTransitionTime / colorIntervalTime),
        b: (targetColor.b - currentColor.b) / (colorTransitionTime / colorIntervalTime)
    };

    currentColor.r += colorIncrement.r;
    currentColor.g += colorIncrement.g;
    currentColor.b += colorIncrement.b;

    liveTileColor = rgbToHex(Math.round(currentColor.r), Math.round(currentColor.g), Math.round(currentColor.b));
    console.log(liveTileColor);
}

function setNextColorIndex(){
    if(nextColorIndex == colors.length - 1){
        nextColorIndex = 0;
    }
    else{
        nextColorIndex++;
    }
}

function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * 10, y * 10, 10, 10);
}

setup();
var interval = setInterval(gameLoop, slider.value);
setInterval(colorLoop, colorIntervalTime);
setInterval(setNextColorIndex, colorTransitionTime);

slider.addEventListener('input', function() {
    clearInterval(interval);
    interval = setInterval(gameLoop, slider.value)
  });