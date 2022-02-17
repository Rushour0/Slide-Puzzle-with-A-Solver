async function AstarSolver(start, end) {
  var t0 = performance.now();
  let count = 0;
  let open_nodes = new PriorityQueue();
  let open_nodes_track = new Set();
  running = true;
  open_nodes_track.add(start);
  open_nodes.push([0, count, start]);

  let parent_node = {};
  let g_score = {};
  let f_score = {};

  g_score[start] = 0;
  f_score[start] = h(start, end);

  while (!open_nodes.isEmpty()) {
    let current_state = open_nodes.pop()[2];
    open_nodes_track.delete(current_state);

    if (await checkSameState(current_state, end)) {
      await generatepath(parent_node, current_state, solved_state);
      console.log("REACHED");
      //console.log(current_state);
      running = false;
      var t1 = performance.now();
      console.log(t1 - t0);
      return true;
    }

    let current_neighbors = await getneighbors(current_state);

    for (let current_neighbor in current_neighbors) {
      let neighbor = current_neighbors[current_neighbor];
      let temp_g = g_score[current_state] + 1;

      if (await checkSameState(neighbor, end)) {
        parent_node[neighbor] = current_state;
        await generatepath(parent_node, neighbor, solved_state);
        console.log("REACHED");
        console.log(neighbor);
        running = false;
        var t1 = performance.now();
        console.log(t1 - t0);
        return true;
      }

      if (g_score[neighbor] == undefined) {
        g_score[neighbor] = Infinity;
        f_score[neighbor] = Infinity;
      }
      if (temp_g < g_score[neighbor]) {
        parent_node[neighbor] = current_state;
        g_score[neighbor] = temp_g;
        f_score[neighbor] = temp_g + h(neighbor, end);
        open_nodes.push([f_score[neighbor], count++, neighbor]);
        open_nodes_track.add(neighbor);
      }
    }
  }
  var t1 = performance.now();
  console.log(t1 - t0);
  running = false;
  return false;
}

async function generatepath(parent_node, start, end) {
  let moves = [];
  let this_state = start;
  let parent_state;
  console.log("STARTED");
  while (!(await checkSameState(this_state, end))) {
    parent_state = parent_node[this_state];
    await changeInNull(this_state, parent_state);
    this_state = parent_state;
    await sleep(150);
  }
  console.log("DONE");
}

async function changeInNull(this_state, next_state) {
  let this_state_null = await getNull(this_state);
  let next_state_null = await getNull(next_state);
  let vertical = this_state_null[0] - next_state_null[0];
  let horizontal = this_state_null[1] - next_state_null[1];
  //console.log("WAS CALLED");

  if (vertical == 1) await boxes[next_state_null[0]][next_state_null[1]].moveDown();
  if (vertical == -1) await boxes[next_state_null[0]][next_state_null[1]].moveUp();
  if (horizontal == 1)
    await boxes[next_state_null[0]][next_state_null[1]].moveRight();
  if (horizontal == -1)
    await boxes[next_state_null[0]][next_state_null[1]].moveLeft();
  await sleep(150);
  return true;
}

async function LinearConflict(current_state, final_state) {
  let score = 0;
  for (let i = 0; i < current_state.length; i++) {
    score += await SingleConflict(
      JSON.parse(JSON.stringify(current_state[i])),
      JSON.parse(JSON.stringify(final_state[i]))
    );
  }
  let current_columns = await getColumns(current_state);
  let final_columns = await getColumns(final_state);
  for (let i = 0; i < current_columns.length; i++) {
    score += await SingleConflict(
      JSON.parse(JSON.stringify(current_columns[i])),
      JSON.parse(JSON.stringify(final_columns[i]))
    );
  }
  return score;
}

async function SingleConflict(current_line, final_line) {
  let score = 0;
  var position = [];
  for (let i = 0; i < total_rows; i++) {
    if (final_line[i] in Object.values(current_line)) {
      position.push(i);
    }
  }
  for (let i = 0; i < position.length; i++) {
    for (let j = i + 1; j < position.length; j++) {
      if (position[j] < position[i]) {
        score += position[i] - position[j] + 2;
      }
    }
  }
  return score;
}
async function ManhattanMisplaced(current_state, final_state) {
  let manhattan_score = 0;
  let misplaced_tiles_score = 0;
  for (let i = 0; i < total_rows; i++) {
    for (let j = 0; j < total_rows; j++) {
      let check = final_state[i][j];
      for (let row = 0; row < total_rows; row++) {
        if (current_state[row].includes(check)) {
          col = current_state[row].indexOf(check);
          md = abs(i - row) + abs(j - col);
          manhattan_score += md;
          if (md != 0) misplaced_tiles_score++;

          break;
        }
      }
    }
  }
  return manhattan_score + misplaced_tiles_score;
}

async function h(current_state, final_state) {
  let score =
    await ManhattanMisplaced(current_state, final_state) +
    await LinearConflict(current_state, final_state);
  return score;
}
