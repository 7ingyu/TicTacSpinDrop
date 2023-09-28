let x = '&#9587;';
let o = '&#9711;';

window.onload = function() {
  // *********************************************************** //
  // STATE VARIABLES
  // *********************************************************** //
  var turn = 1;
  var player = 1;
  var plays = {
    1: {},
    2: {}
  }
  var wins = {
    1: 0,
    2: 0
  }
  var winner = 1;
  var alreadyPlayed = {};
  var playerNames = {
    1: '',
    2: ''
  };
  var toggle = false;

  // *********************************************************** //
  // GAMEPLAY FUNCTIONS
  // *********************************************************** //
  var gameWon = (player) => {
    var winCombos = [
      // Columns
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      // Rows
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      // Diagonals
      [1, 5, 9],
      [3, 5, 7]
    ];

    for (let i = 0; i < winCombos.length; i++) {
      let found = false;
      for (let j = 0; j < 3; j++) {
        if (plays[player][winCombos[i][j]]) {
          found = true;
        } else {
          found = false;
          j = 3;
        }
      }
      if (found) {
        winner = player;
        wins[player]++;
        updateTally();
        return found;
      }
    }

    return false;
  };

  var play = (divNum) => {
    plays[player][divNum] = true;
    alreadyPlayed[divNum] = true;
    console.log(`On turn ${turn}, ${playerNames[player]} selected square ${divNum}`);
    if (toggle) {
      renderBoard();
      turnBoard();
    } else {
      setupGame();
      renderBoard();
      endTurn();
    }

  };

  var endTurn = () => {
    if (gameWon(player)) {
      if (gameWon(player === 1 ? 2 : 1)) {
        document.getElementById('notifications').innerHTML = `It's a double win!`;
      } else {
        document.getElementById('notifications').innerHTML = `${playerNames[player]} won!`;
      }
      freezeGame();
    } else if (gameWon(player === 1 ? 2 : 1)) {
      document.getElementById('notifications').innerHTML = `${playerNames[player === 1 ? 2 : 1]} won!`;
    } else {
      turn++
      if (turn === 10) {
        console.log(`All squares filled. Game ends in a tie. Please reset.`);
        document.getElementById('notifications').innerHTML = `<i>All squares filled. Game ends in a tie. Please reset.</i>`;
        freezeGame();
      } else {
        player = (player === 1) ? 2 : 1;
        notifications.innerHTML = `Turn ${turn}: ${playerNames[player]}'s turn`
        console.log(`It is now turn ${turn}, ${playerNames[player]}'s turn`);
      }
    }
  }

  var turnBoard = () => {
    let newSquare = {
      1: 7,
      2: 4,
      3: 1,
      4: 8,
      5: 5,
      6: 2,
      7: 9,
      8: 6,
      9: 3
    };
    let container = document.getElementById('container');
    container.setAttribute('style', 'transition: transform 1s; transform: rotate(90deg)');

    for (let player = 1; player <= 2; player++) {
      let temp = {};
      for (let square in plays[player]) {
        temp[newSquare[square]] = true;
      }
      plays[player] = temp;
    }

    let newPlays = {};
    for (let num in alreadyPlayed) {
      newPlays[newSquare[num]] = true;
    }
    alreadyPlayed = newPlays;

    setTimeout(() => {
      renderBoard();
      dropPieces();
    }, 1100);
  };

  var dropPieces = () => {
    let temp = {};
    let temp2 = {};

    for (let index = 1; index < 3; index++) {
      temp[index] = {};
    }

    for (let i = 3; i < 10; i += 3) {
      let defined = 0;
      let translate = 110;

      var checkVal = (currSquare, startSquare, availableSquare) => {
        if (currSquare < startSquare - 2) {
          return;
        } else {
          let sqDiff = availableSquare - currSquare;
          if (alreadyPlayed[currSquare] !== undefined) {
            if (plays[1][currSquare] !== undefined) {
              temp[1][availableSquare] = true
            } else {
              temp[2][availableSquare] = true
            }
            temp2[availableSquare] = true;
            let div = document.getElementById(`text${currSquare}`);
            div.setAttribute('style', `transition: transform 1s; transform: translateY(${sqDiff * translate}px)`);
            checkVal(currSquare - 1, startSquare, availableSquare - 1);
          } else {
            checkVal(currSquare - 1, startSquare, availableSquare);
          }
        }
      };

        checkVal(i, i, i);
    }
    plays = temp;
    alreadyPlayed = temp2;

    setTimeout(() => {
      setupGame();
      renderBoard();
      endTurn();
    }, 1100);
  };

  // *********************************************************** //
  // GAME SETUP / DISPLAY
  // *********************************************************** //
  var initialize = () => {
    // Add difficulty toggle
    let toggle = document.createElement('button');
    toggle.setAttribute('id', 'toggle');
    toggle.setAttribute('class', 'buttons');
    toggle.innerHTML = 'Rotation Drop Now Off';
    top.appendChild(toggle);

    // Add event listener to toggle button
    document.getElementById('toggle').addEventListener('click', handleDifficultyToggle);

    // Add reset button
    let resetButton = document.createElement('button');
    resetButton.setAttribute('id', 'reset');
    resetButton.setAttribute('class', 'buttons');
    resetButton.innerHTML = 'Reset Game';
    top.appendChild(resetButton);

    // Add event listener to reset button
    document.getElementById('reset').addEventListener('click', function(event) {
      event.preventDefault();
      resetGame(winner);
    })

    // Add tally div
    let tally = document.createElement('tally');
    tally.setAttribute('id', 'tally');
    document.body.appendChild(tally);

    // Add container div
    let container = document.createElement('container');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    // Add notifications div
    let notifications = document.createElement('notifications');
    notifications.setAttribute('id', 'notifications');
    notifications.innerHTML = `Turn ${turn}: ${playerNames[player]}'s turn`
    document.body.appendChild(notifications);

    // Write tally
    updateTally();

    // Start game setup
    setupGame();
  };

  var updateTally = () => {
    let div = document.getElementById('tally')
    div.innerHTML = `&nbsp;Games won by ${playerNames[1]} (${x}): ${wins[1]} <br>
      &nbsp;Games won by ${playerNames[2]} (${o}): ${wins[2]}<br>`;
  };

  var setupGame = () => {
    let container = document.getElementById('container');

    container.replaceChildren();

    for (let i = 0; i < 9; i++) {
      let child = document.createElement('div');
      container.appendChild(child);
      child.setAttribute('id', i + 1);
      child.addEventListener('click', handleClick);
      let textBox = document.createElement('div');
      textBox.setAttribute('id', `text${i + 1}`);
      textBox.setAttribute('class', 'textbox');
      child.appendChild(textBox);
    }
  };

  var resetGame = (winner) => {
    turn = 1;
    player = winner;
    plays = {
      1: [],
      2: [],
    };
    alreadyPlayed = {};

    setupGame();
  };

  var freezeGame = () => {
    for (let i = 0; i < 9; i++) {
      let div = document.getElementById(i + 1);
      div.removeEventListener('click', handleClick);
    }
  };

  var renderBoard = () => {
    let container = document.getElementById('container');
    container.setAttribute('style', 'transition: transform 0s; transform: rotate(0deg)');

    for (let i = 1; i <= 9; i++) {
      let div = document.getElementById(`text${i}`);
      div.innerHTML = '';
    }

    let mark = x;
    for (let player = 1; player <= 2; player++) {
      for (let square in plays[player]) {
        if (player === 1) {
          mark = x;
        } else {
          mark = o;
        }
        let div = document.getElementById(`text${square}`);
        div.innerHTML = mark;
      }
    }
  }

  // *********************************************************** //
  // EVENT HANDLERS
  // *********************************************************** //

  var handleClick = (event) => {
    // Get target of event
    let div = Number(event.target.getAttribute('id').slice(-1));
    // If not in object of alreadyPlayed squares
    if (alreadyPlayed[div] === undefined) {
      // Empty notifications div
      document.getElementById('notifications').innerHTML = '';
      // Play that square
      freezeGame();
      play(div);
    } else {
      // If square already in play,
      // Add notification requesting a different square
      document.getElementById('notifications').innerHTML = '<i>Please select another square</i>';
    }
  };

  var handleSubmit = (event) => {
    let label = document.querySelector('label');
    let input = document.getElementById('playername');
    let submit = document.querySelector('button');
    let newName = input.value;

    if (playerNames[1] === '') {
      if (newName === '') {
        playerNames[1] = 'Player One';
      } else {
        playerNames[1] = newName.toString();
      }
      label.innerHTML = `Please tell me who is playing as ${o}: <br>`;
      input.value = '';
    } else if (playerNames[2] === '') {
      if (newName == '') {
        playerNames[2] = 'Player Two';
      } else {
        playerNames[2] = newName.toString();
      }
      label.remove();
      input.remove();
      submit.remove();
      initialize();
    } else {
      console.error('Error getting player names');
      console.log('Using default player names');
      playerOne = 'Player One';
      playerTwo = 'Player Two';
      label.remove();
      input.remove();
      submit.remove();
      initialize();
    }
  }

  var handleEnter = (event) => {
    if (event.code === 'Enter') {
      handleSubmit(event);
    }
  }

  var handleDifficultyToggle = (event) => {
    toggle = !toggle;
    if (toggle) {
      event.target.innerHTML = 'Rotation-Drop Now On';
    } else {
      event.target.innerHTML = 'Rotation-Drop Now Off';
    }
  };

  // *********************************************************** //
  // INITIALIZATION
  // *********************************************************** //

  // Add top div
  let top = document.createElement('div');
  top.setAttribute('id', 'top');
  top.innerHTML = '<h1>Tic Tac Toe<br></h1>';
  document.body.appendChild(top);

  // Add player name input
  let inputDiv = document.createElement('div');
  inputDiv.setAttribute('id', 'nameinput');

  let label = document.createElement('label');
  label.setAttribute('for', 'playername');
  label.innerHTML = `Please tell me who is playing as ${x}: <br>`;

  let input = document.createElement('input')
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'playername');
  input.setAttribute('name', 'playername');
  input.addEventListener('keypress', handleEnter);

  let submit = document.createElement('button');
  submit.setAttribute('id', 'namesubmit');
  submit.innerHTML = 'Submit';
  submit.addEventListener('click', handleSubmit);

  inputDiv.appendChild(label);
  inputDiv.appendChild(input);
  inputDiv.appendChild(submit);
  document.body.appendChild(inputDiv);
};
