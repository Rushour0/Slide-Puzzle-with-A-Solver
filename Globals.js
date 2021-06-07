function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var boxes = [];
var cell_width;
var total_rows;
var running = false;
var solved_state = [];
var state = [];
