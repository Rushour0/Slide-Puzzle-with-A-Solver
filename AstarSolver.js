function AstarSolver(start,end)
{
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

  while (!open_nodes.isEmpty())
  {
    let current_state = open_nodes.pop()[2];
    open_nodes_track.delete(current_state);

    if (checkSameState(current_state,end))
    {
      generatepath(parent_node, current_state, solved_state);
      console.log("REACHED");
      console.log(current_state);
      running = false;
      return true;
    }

    let current_neighbors = getneighbors(current_state);

    for (let current_neighbor in current_neighbors) 
    {
      let neighbor = current_neighbors[current_neighbor];
      let temp_g = g_score[current_state] + 1;

      if (g_score[neighbor] == undefined)
      {
        g_score[neighbor] = Infinity;
        f_score[neighbor] = Infinity;
      }
      if (temp_g < g_score[neighbor])
      {
        parent_node[neighbor] = current_state;
        g_score[neighbor] = temp_g;
        f_score[neighbor] = temp_g + h(neighbor, end);
        open_nodes.push([f_score[neighbor], count++, neighbor]);
        open_nodes_track.add(neighbor);
      }
    }      
  }
  running = false;
  return false;
}

async function generatepath(parent_node, start, end)
{
  let moves = [];
  let this_state = start;
  let parent_state;
  console.log("STARTED")
  while (!checkSameState(this_state,end))
  {
    parent_state = parent_node[this_state];
    console.log(parent_state);
    changeInNull(this_state,parent_state);
    this_state = parent_state;
    await sleep(100);
  }
  console.log("DONE")
}

async function changeInNull(this_state,next_state)
{
  let this_state_null = getNull(this_state);
  let next_state_null = getNull(next_state);
  let vertical = this_state_null[0]-next_state_null[0];
  let horizontal = this_state_null[1]-next_state_null[1];
  console.log("WAS CALLED");
  console.log(this_state_null);
  console.log(next_state_null);
  console.log(vertical,horizontal);
  if (vertical == 1)boxes[next_state_null[0]][next_state_null[1]].moveDown();
  if (vertical == -1)boxes[next_state_null[0]][next_state_null[1]].moveUp();
  if (horizontal == 1)boxes[next_state_null[0]][next_state_null[1]].moveRight();
  if (horizontal == -1)boxes[next_state_null[0]][next_state_null[1]].moveLeft();
  await sleep(100);
  return true;
}

function h(current_state,final_state)
{
  let score = 0;
  for(let i = 0;i<total_rows;i++)
  {
    for (let j = 0;j<total_rows;j++)
    {
      let check = final_state[i][j];
      for(let row = 0;row<total_rows;row++)
      {
        if (current_state[row].includes(check))
        {
          col = current_state[row].indexOf(check);
          score+=abs(i-row)+abs(j-col);
          break;
        }
      }
    }
  }
  return score;
}