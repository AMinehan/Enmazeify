// KEY:
// 1, 5: north
// 2, 6: east
// 3, 7: south
// 4, 8: west

//make the board into a maze!
var makeMaze = function(n){
  var board = makeBoard(n);
  board[0][0] = 1;
  var nextMoves = [[0,1], [1,0]];
  var next

  var chain = [false, [0,0]];
  pathFinder(board, chain, nextMoves);

  while(nextMoves.length > 0) {
    next = Math.floor(Math.random() * nextMoves.length);
    findStep(board, nextMoves[next], nextMoves);
    if(next === nextMoves.length - 1){
      nextMoves.pop();
    } else {
      nextMoves[next] = nextMoves.pop();
    }
  }

  //  2*****************************************************
  // console.log(board);

  return makeWalls(board);
}

//make a board!
var makeBoard = function(n){
  var board = [];
  for (i = 0; i < n; i++){
    board.push([]);
    for (j = 0; j < n; j++){
      board[i].push(0);
    }
  }

  //  1*****************************************************
  // console.log(board);

  return board;
}

//find a random path to near the end
var pathFinder = function(board, chain, nextMoves){
  var paths = [];
  var point;
  while (chain[chain.length - 1][0] < board.length * .75 || chain[chain.length - 1][1] < board.length * .75 ){
    point = chain[chain.length - 1];
    paths = [];
    if (point[0] < board.length - 1 && board[point[0] + 1][point[1]] === 0){
      paths.push([5, [point[0] + 1, point[1]]]);
    }
    if (point[0] > 0 && board[point[0] - 1][point[1]] === 0){
      paths.push([7, [point[0] - 1, point[1]]]);
    }
    if (point[1] < board.length - 1 && board[point[0]][point[1] + 1] === 0){
      paths.push([8, [point[0], point[1] + 1]]);
    }
    if (point[1] > 0 && board[point[0]][point[1] - 1] === 0){
      paths.push([6, [point[0], point[1] - 1]]);
    }
    if (paths.length === 0){
      chain.pop();
    } else {
      paths = paths[Math.floor(Math.random() * paths.length)];
      board[paths[1][0]][paths[1][1]] = paths[0];
      chain.push(paths[1]);
    }
    if (point[0] < board.length -1){
      nextMoves.push([point[0] + 1, point[1]])
    }
    if (point[0] > 0){
      nextMoves.push([point[0] - 1, point[1]])
    }
    if (point[1] < board.length -1){
      nextMoves.push([point[0], point[1] + 1])
    }
    if (point[1] > 0){
      nextMoves.push([point[0], point[1] - 1])
    }
  }
}

//Fill out values on the board: find potential moves, pick one at random

//[[1, 4, 4]
// [1, 1, 1]
// [1, 4, 1]]
var findStep = function(board, point, nextMoves){
  if (board[point[0]][point[1]] !== 0){
    return;
  }
  var paths = [];
  if (point[0] < board.length - 1 && board[point[0] + 1][point[1]] !== 0){
    paths.push(3);
  } else if (point[0] < board.length - 1){
    nextStep(board, [point[0] + 1, point[1]], nextMoves);
  }
  if (point[0] > 0 && board[point[0] - 1][point[1]] !== 0){
    paths.push(1);
  } else if (point[0] > 0) {
    nextStep(board, [point[0] - 1, point[1]], nextMoves);
  }
  if (point[1] < board.length - 1 && board[point[0]][point[1] + 1] !== 0){
    paths.push(2);
  } else if (point[1] < board.length - 1){
    nextStep(board, [point[0], point[1] + 1], nextMoves);
  }
  if (point[1] > 0 && board[point[0]][point[1] - 1] !== 0){
    paths.push(4);
  } else if (point[1] > 0) {
    nextStep(board, [point[0], point[1] - 1], nextMoves);
  }

  board[point[0]][point[1]] = paths[Math.floor(Math.random() * paths.length)];
}

//push possible next moves to the nextMoves array
var nextStep = function(board, point, nextMoves){
  nextMoves.push(point);
  //experiment to prioritize the edges of the map so the solution stops going directly from the top left to the bottom right
  if (.65 > point[1] / board.length && point[1] / board.length > .35){return}
  if (.65 > point[0] / board.length && point[0] / board.length > .35){return}
  if (point[0] / board.length < .25) {
    nextMoves = nextMoves.concat([point, point, point, point, point, point, point, point, point, point, point]);
  }
  if (point[1] / board.length < .25) {
    nextMoves = nextMoves.concat([point, point, point, point, point, point, point, point, point, point, point]);
  }
  if (point[0] / board.length > .75) {
    nextMoves = nextMoves.concat([point, point, point, point, point, point, point, point, point, point, point]);
  }
  if (point[1] / board.length > .75) {
    nextMoves = nextMoves.concat([point, point, point, point, point, point, point, point, point, point, point]);
  }

}

//make the raw maze into something that can be displayed
var makeWalls = function(board){
  var result = [];
  var template = ['','']
  var key = {'1111': '╬', '1101': '╩', '1011': '╣', '0111': '╦', '1110': '╠', '0110': '╔', '0011': '╗', '1001': '╝', '1100': '╚', '1010': '║', '1000': '║', '0010': '║', '0101': '═', '0100': '═', '0001': '═' };

  //Make a basic board, something that will end up looking like this:
  // 0 0═0
  // ║1║4║
  // 0═0═0
  // ║1║1║
  // 0═0 0
  for (var i = 0; i < board.length; i ++){
    template[0] += '0═'
    template[1] += '║ '
  }
  template[0] += '0';
  template[1] += '║';
  for (var i = 0; i < board.length; i++){
    result.push(template[0]);
    result.push('║' + board[i].join('║') + '║');
  }
  result.push(template[0]);
  for (var i = 0; i < result.length; i++){
    result[i] = result[i].split('');
  }
  result[result.length - 1][result.length - 2] = ' ';

  //  3*****************************************************
  // console.log(result.map(function(a){return a.join('')}));

  //remove walls and numbers from the board, should look like this:
  // 0 0═0
  // ║   ║
  // 0 0 0
  // ║ ║ ║
  // 0═0 0

  for (var i = 0; i < result.length; i++){
    for (var j = 0; j < result.length; j++){
      if (result[i][j] === '1' || result[i][j] === '5'){
        result[i - 1][j] = ' ';
        result[i][j] = ' ';
      }
      if (result[i][j] === '2' || result[i][j] === '6'){
        result[i][j + 1] = ' ';
        result[i][j] = ' ';
      }
      if (result[i][j] === '3' || result[i][j] === '7'){
        result[i + 1][j] = ' ';
        result[i][j] = ' ';
      }
      if (result[i][j] === '4' || result[i][j] === '8'){
        result[i][j - 1] = ' ';
        result[i][j] = ' ';
      }

    }
  }

  //  4*****************************************************
  // console.log(result.map(function(a){return a.join('')}));

  //fill in corners, should look like this:
  // ║ ══╗
  // ║   ║
  // ║ ║ ║
  // ║ ║ ║
  // ╚═╝ ║

  var temp = []
  for (var i = 0; i < result.length; i++){
    for (var j = 0; j < result.length; j++){
      temp = ['0','0','0','0']
      if (result[i][j] === '0'){
        if (j < result.length - 1 && result[i][j + 1] !== ' '){
          temp[1] = '1';
        }
        if (i > 0 && result[i - 1][j] !== ' '){
          temp[0] = '1';
        }
        if (i < result.length - 1 && result[i + 1][j] !== ' '){
          temp[2] = '1';
        }
        if (j > 0 && result[i][j - 1] !== ' '){
          temp[3] = '1';
        }
        result[i][j] = key[temp.join('')];
      }
    }
  }
  //  5*****************************************************
  // console.log(result.map(function(a){return a.join('')}));

  //pad out horizontally, should look like this:
  // ║   ════╗
  // ║       ║
  // ║   ║   ║
  // ║   ║   ║
  // ╚═══╝   ║
  for (var i = result.length - 1; i >= 0; i--){
    for (var j = result.length - 2; j > 0; j -= 2){
      result[i].splice(j, 0, result[i][j] + result[i][j]);
    }
  }

  //stringify!
  for (var i = 0; i < result.length; i++){
    result[i] = result[i].join('');
  }
  //  6*****************************************************
  console.log(result);
  return result;
}

makeMaze(200);

module.exports = makeMaze;