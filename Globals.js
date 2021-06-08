function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var boxes = [];
var total_rows = 4;
var cell_width;
var worstCase4 = [13, 4, 11, 2, 9, 12, 15, 1, 6, 3, 8, 7, 14, 10, 5];
var worstCase4x = [13, 4, 11, 2, 9, 12, 15, 1, 6, 3, 8, 7, 14, 10, 5];
var running = false;
var solved_state = [];
var state = [];
