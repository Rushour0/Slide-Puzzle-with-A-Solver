function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var boxes = [];
var total_rows = 3;
var cell_width;
var running = false;
var solved_state = [];
var state = [];
