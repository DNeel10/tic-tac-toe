function gameBoard(){
  const columns = 3;
  const rows = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < columns; j++) {
      board[i].push([]);
    }
  }
1
  const getBoard = () => board

  const placeMark = (selection, player) => {
    if (!board[selection[0]][selection[1]]) return false;

    board[selection[0]][selection[1]] = player.mark;
    return true;
  }

  const drawBoard = () => {
    const boardWithValues = board.map((row) => row.map((space) => space))
    console.log(boardWithValues);
  }

  const checkRowWin = () => {
    return board.some(row => row.every(value => value === row[0]))
  }

  const checkColWin = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if ((board[0][j] === board[1][j]) && (board[0][j] === board[2][j])) {
          return true;
        }
      }
    }
    return false
  }

  const checkDiagWin = () => {
    const size = board.length
    const mainValue = board[0][0]
    let mainWin = true

    if (mainValue) {
      for (let i = 1; i < size; i++) {
        if (board[i][i] !== mainValue) {
          mainWin = false;
          break
        }
      }
    } else {
      mainWin = false
    }

    const antiValue = board[0][size - 1]
    let antiWin = true

    if (antiValue) {
      for (let i = 1; i < board.length; i++) {
        if (board[i][size - (i+1)] !== antiValue) {
          antiWin = false;
          break;
        }
      }
    } else {
      antiWin = false;
    }
    return mainWin || antiWin;
  }

  const checkWin = (player) => {
    const rowWin = checkRowWin();
    const colWin = checkColWin();
    const diagWin = checkDiagWin();
    
    if (rowWin || colWin || diagWin) {
      console.log(`${player.name} has won the game`)
      return true;
    }
    return false;    
  }

  return { getBoard, placeMark, drawBoard, checkWin};
}

function gameController(
    playerOne = 'Player One', 
    playerTwo = 'Player two'
  ) {
  const board = gameBoard();

  const players = [
    {
      name: playerOne,
      mark: 'X'
    },
    {
      name: playerTwo,
      mark: 'O'
    }
  ]

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => {
    return activePlayer;
  }

  const playRound = (selection) => {
    const successfulMove = board.placeMark(selection, getActivePlayer());

    if (!successfulMove) {
      console.log('Try again');
      return;
    }


    board.checkWin(getActivePlayer());

    switchPlayerTurn();
    board.drawBoard();
  }
  return { getActivePlayer, playRound }
}

function screenController() {
  
}