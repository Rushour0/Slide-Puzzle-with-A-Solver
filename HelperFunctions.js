function getneighbors(current_state)
{
  
  let temp_state = JSON.parse(JSON.stringify(current_state));
  let row;
  let col;

  for(row = 0;row<total_rows;row++)
  {
    if (temp_state[row].includes(null))
    {
      col = temp_state[row].indexOf(null);
      break;
    }
  }

  let neighbors = [];

  if (row>0)
  {
    temp_state[row][col] = temp_state[row-1][col];
    temp_state[row-1][col] = null;
    neighbors.push(JSON.parse(JSON.stringify(temp_state)));
  }
  temp_state = JSON.parse(JSON.stringify(current_state));
  if (row<total_rows-1)
  {
    temp_state[row][col] = temp_state[row+1][col];
    temp_state[row+1][col] = null;
    neighbors.push(JSON.parse(JSON.stringify(temp_state)));
  }
  temp_state = JSON.parse(JSON.stringify(current_state));
  if (col>0)
  {
    temp_state[row][col] = temp_state[row][col-1];
    temp_state[row][col-1] = null;
    neighbors.push(JSON.parse(JSON.stringify(temp_state)));
  }
  temp_state = JSON.parse(JSON.stringify(current_state));
  if (col<total_rows-1)
  {
    temp_state[row][col] = temp_state[row][col+1];
    temp_state[row][col+1] = null;
    neighbors.push(JSON.parse(JSON.stringify(temp_state)));
  }

  return neighbors;
}

function getNull(my_state)
{
  let row;
  let col;
  for(row = 0;row<total_rows;row++)
  {
    if (my_state[row].includes(null))
    {
      col = my_state[row].indexOf(null);
      break;
    }
  }
  return [row,col];
}

function checkSameState(state1,state2)
{
  for (var i = 0; i < state1.length; i++)
  for (var j = 0; j < state1.length; j++)
  if (state1[i][j] != state2[i][j])return false;
  return true;
}

function getColumns(current_state)
{
  let all_col = [];
  let temp_col = [];
  for(let i = 0;i<current_state.length;i++)
  {
    temp_col = [];
    for(let j = 0;j<current_state[i].length;j++)
    {
      temp_col.push(current_state[i][j]);
    }
    all_col.push(temp_col);
  }
  return JSON.parse(JSON.stringify(all_col));
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
