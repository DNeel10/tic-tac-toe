function gameBoard(){
  const columns = 3;
  const rows = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = []
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board

  const placeMark = (selection, player) => {

    const cell = board[selection[0]][selection[1]];

    if (cell.getValue()) return false;

    cell.addMark(player);
    return true;
  }

  const drawBoard = () => {
    const boardWithValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithValues);
  }

  const checkRowWin = () => {
    return board.some(row => row.every(cell => cell.getValue() !== null && cell.getValue() === row[0].getValue()))
  }

  const checkColWin = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[0][j].getValue()) {
          if ((board[0][j].getValue() === board[1][j].getValue()) && (board[0][j].getValue() === board[2][j].getValue())) {
            console.log('colWin')
            return true;
          }
        }
      }
    }
    return false
  }

  const checkDiagWin = () => {
    const size = board.length
    const mainValue = board[0][0].getValue()
    let mainWin = true

    if (mainValue) {
      for (let i = 1; i < size; i++) {
        if (board[i][i].getValue() !== mainValue) {
          mainWin = false;
          break
        }
      }
    } else {
      mainWin = false
    }

    const antiValue = board[0][size - 1].getValue() 
    let antiWin = true

    if (antiValue) {
      for (let i = 1; i < board.length; i++) {
        if (board[i][size - (i+1)].getValue() !== antiValue) {
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
      return player;
    }
    return false;    
  }

  const checkDraw = () => {
    const flatBoard = board.flat();
    const notNull = (el) => el.getValue() !== null;
    
    if (flatBoard.every(notNull)) {
      return 'Draw'
    }
    return false
  }

  return { getBoard, placeMark, drawBoard, checkWin, checkDraw};
}

function Cell() {
  let value = null;

  const addMark = (player) => {
    value = player.mark;
  }

  const getValue = () => {
    return value;
  }

  return { addMark, getValue }
}

function gameController(
    playerOne = 'Player 1', 
    playerTwo = 'Player 2'
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
      return null;
    }


    const winner = board.checkWin(getActivePlayer());
    const draw = board.checkDraw();

    if (winner) {
      return winner;
    } else if (draw) {
      return draw;
    }

    switchPlayerTurn();
    board.drawBoard();
    return null;
  }
  return { getActivePlayer, playRound, getBoard: board.getBoard }
}

function screenController() {
  const game = gameController();
  const boardDiv = document.querySelector(".board")
  const activePlayerDiv = document.querySelector(".activePlayer")
  const playerHeader = document.querySelector(".turn")

  const updateScreen = () => {
    boardDiv.textContent = '';
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    playerHeader.textContent = `${activePlayer.name}'s turn`

    

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add("cell");
        cellButton.dataset.cell = `${[i,j]}`;
        cellButton.textContent = cell.getValue();
        
        boardDiv.appendChild(cellButton);
      })
    })
  }

  function clickHandler(e) {

    const selectedCell = e.target.dataset.cell.split(',');
    if (!selectedCell) return;
    const result = game.playRound(selectedCell);


    updateScreen();

    if (result) {
      addReplayButton();
      if (result === 'Draw') {
        playerHeader.textContent = "Draw! Play Again?"
      } else {
        playerHeader.textContent = `${result.name} has won the game!`
      }

      boardDiv.removeEventListener('click', clickHandler);
    } 
  }

  const addReplayButton = () => {
    const replayButton = document.createElement('button');
    activePlayerDiv.appendChild(replayButton);
    replayButton.classList.add('btn')

    replayButton.textContent = "Restart"

    replayButton.addEventListener('click', () => {
      boardDiv.textContent = '';
      playerHeader.textContent = '';
      replayButton.remove();
      screenController();
    })
  }
  boardDiv.addEventListener("click", clickHandler);

  updateScreen();
}
screenController();