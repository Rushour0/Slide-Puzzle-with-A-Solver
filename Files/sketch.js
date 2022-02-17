
function setup() {
  var is_height = true;
  var cnv;

  if (windowWidth > windowHeight) {
    is_height = true;
    cnv = createCanvas(windowHeight, windowHeight);
  } else {
    is_height = false;
    cnv = createCanvas(windowWidth, windowWidth);
  }

  if (is_height) {
    cnv.position(windowWidth / 2 - windowHeight / 2);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  var BLACK = color(0, 0, 0);
  var WHITE = color(255, 255, 255);
  var RED = color(255, 0, 0);
  var GREEN = color(0, 255, 0);
  var BLUE = color(0, 0, 255);
  var GREY = color(128, 128, 128);
  var PURPLE = color(128, 0, 128);
  var CYAN = color(0, 255, 255);
  var ORANGE = color(255, 140, 0);
  var CORAL = color(255, 127, 80);

  var BACKGROUND_COLOR = GREY
  var DEFAULT = CORAL;
  var SOLVED_COLOR = GREEN;

  class Box {
    constructor(x, y, row, col, cell_width, Text = null) {
      this.x = x;
      this.y = y;
      this.row = row;
      this.col = col
      this.cell_width = cell_width;
      this.color = DEFAULT;
      this.Text = Text;
      this.value = int(Text);

      noStroke();
      fill(this.color);
      square(this.x, this.y, this.cell_width, this.cell_width / 10);

      textSize(this.cell_width / 4);
      fill(BLACK);
      textAlign(CENTER, CENTER);
      text(this.Text, this.x + this.cell_width / 2, this.y + this.cell_width / 2);
    }
    clear(val = false, x = null, y = null, cell_width = null) {
      if (!val) {
        noStroke();
        fill(BACKGROUND_COLOR);
        square(this.x, this.y, this.cell_width, this.cell_width / 10);
      }
      else {
        noStroke();
        fill(BACKGROUND_COLOR);
        square(x, y, cell_width, this.cell_width / 10);
      }
    }
    change(x, y) {
      fill(this.color);
      this.x += x;
      this.y += y;
      square(this.x, this.y, this.cell_width, this.cell_width / 10);
      textSize(this.cell_width / 4);
      fill(BLACK);
      textAlign(CENTER, CENTER);
      text(this.Text, this.x + this.cell_width / 2, this.y + this.cell_width / 2);
    }
    async moveUp() {
      running = true;
      for (let i = 0; i < 10; i++) {
        this.clear();
        this.change(0, -this.cell_width / 10);
        await sleep(5);
      }
      running = false;

      this.row -= 1;
      boxes[this.row][this.col] = new Box(this.x, this.y, this.row, this.col, this.cell_width, this.Text);
      state[this.row][this.col] = this.value;
      boxes[this.row + 1][this.col] = null;
      state[this.row + 1][this.col] = null;

      this.clear(true, this.x, this.y + this.cell_width, this.cell_width);
      return true;
    }
    async moveDown() {
      running = true;
      for (let i = 0; i < 10; i++) {
        this.clear();
        this.change(0, this.cell_width / 10);
        await sleep(5);
      }
      running = false;

      this.row += 1;
      boxes[this.row][this.col] = new Box(this.x, this.y, this.row, this.col, this.cell_width, this.Text);
      state[this.row][this.col] = this.value;
      boxes[this.row - 1][this.col] = null;
      state[this.row - 1][this.col] = null;

      this.clear(true, this.x, this.y - this.cell_width, this.cell_width);
      return true;
    }
    async moveLeft() {
      running = true;
      for (let i = 0; i < 10; i++) {
        this.clear();
        this.change(-this.cell_width / 10, 0);
        await sleep(5);
      }
      running = false;

      this.col -= 1;
      boxes[this.row][this.col] = new Box(this.x, this.y, this.row, this.col, this.cell_width, this.Text);
      state[this.row][this.col] = this.value;
      boxes[this.row][this.col + 1] = null;
      state[this.row][this.col + 1] = null;

      this.clear(true, this.x + this.cell_width, this.y, this.cell_width);
      return true;
    }
    async moveRight() {
      running = true;
      for (let i = 0; i < 10; i++) {
        this.clear();
        this.change(this.cell_width / 10, 0);
        await sleep(5);
      }
      running = false;

      this.col += 1;
      boxes[this.row][this.col] = new Box(this.x, this.y, this.row, this.col, this.cell_width, this.Text);
      state[this.row][this.col] = this.value;
      boxes[this.row][this.col - 1] = null;
      state[this.row][this.col - 1] = null;

      this.clear(true, this.x - this.cell_width, this.y, this.cell_width);
      return true;
    }
    async clickMove() {
      if (this.row > 0 && boxes[this.row - 1][this.col] == null) return await this.moveUp();
      if (this.row < total_rows - 1 && boxes[this.row + 1][this.col] == null) return await this.moveDown();
      if (this.col > 0 && boxes[this.row][this.col - 1] == null) return await this.moveLeft();
      if (this.col < total_rows - 1 && boxes[this.row][this.col + 1] == null) return await this.moveRight();
      return false;
    }
  }
  cell_width = width / total_rows;

  background(BACKGROUND_COLOR);

  let row = 0;
  let col = 0;

  running = true;
  for (let y = 0; y < width; y += cell_width) {
    boxes[row] = [];
    solved_state[row] = [];
    col = 0;
    for (let x = 0; x < width; x += cell_width) {
      if (row == total_rows - 1 && col == total_rows - 1) boxes[row].push(null);
      else boxes[row].push(new Box(x, y, row, col, cell_width, str(row * total_rows + col + 1)));
      if (boxes[row][col] != null) solved_state[row].push(row * total_rows + col + 1);
      else solved_state[row].push(null);
      col += 1;
    }
    row += 1;
  }
  running = false;
  state = JSON.parse(JSON.stringify(solved_state));
}

function draw() {

}



async function keyPressed() {
  if (keyIsPressed) {
    if (keyIsDown(82)) {
      await AstarSolver(solved_state, JSON.parse(JSON.stringify(state)));
      return true;
    }
  }
}

async function mouseClicked() {
  if (!running) {
    let row = floor(mouseY / cell_width);
    let col = floor(mouseX / cell_width);
    try {
      if (mouseButton == LEFT) {
        let node = boxes[row][col];
        if (node == null) return;
        await node.clickMove();
        //console.log(boxes);
      }
    }
    catch (e) { }
  }
}

window.setup = setup;
window.draw = draw;