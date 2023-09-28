import { rotateBoard, checkBoard } from './src/utils'

export default function socketPlugin() {

  return {
    name: 'vite-tictactoe-socket-plugin',
    configureServer(server) {
      const x = '\u2573';
      const o = '\u25EF';

      const queue = []
      const players = {}
      const boards = {}

      // server.ws.on('connection', (data) => {
      //   console.log('connected')
      // })

      server.ws.on('tictac:new-player', ({ name }, client) => {
        console.log('new player', name)
        if (players[name]) {
          client.send('tictac:player-reg-fail', { error: 'User already exists. Please choose another name.' })
          return
        } else {
          client.send('tictac:player-reg-ok', { msg: 'User added' })
        }
        const newPlayer = { name, client }
        if (queue.length) {
          const opponent = queue.pop()
          console.log('match found', newPlayer.name + opponent.name)
          client.send('tictac:player-match', {
            player: { name: newPlayer.name, symbol: o },
            opponent: {name: opponent.name, symbol: x }
          })
          opponent.client.send('tictac:player-match', {
            opponent: { name: newPlayer.name, symbol: o },
            player: {name: opponent.name, symbol: x }
          })
          boards[newPlayer.name + opponent.name] = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
          ]
          players[newPlayer.name] = {
            ...newPlayer,
            opponent: opponent,
            symbol: o,
            game: newPlayer.name + opponent.name,
            moves: 0,
            wins: 0
          }
          players[opponent.name] = {
            ... opponent,
            opponent: newPlayer,
            symbol: x,
            game: newPlayer.name + opponent.name,
            moves: 0,
            wins: 0
          }
        } else {
          queue.push(newPlayer)
        }
      })

      server.ws.on('tictac:move', ({ name, symbol, square: [ row, col ], rotate }) => {
        players[name].moves ++
        const player = players[name]
        const opponent = players[player.opponent.name]
        const board = boards[player.game]
        // Invalid move if already have something at square or too many consecutive moves
        if (board[row][col] || Math.abs(opponent.moves - player.moves) >= 2) {
          players[name].moves --
          player.client.send('tictac:invalid-move', { board })
        } else {
          console.log(board)
          board[row][col] = symbol
          if (rotate) {
            const { newBoard } = rotateBoard(board)
            boards[player.game] = newBoard
            if (boards[player.game] != boards[opponent.game]) console.log('board mismatch!')
          }
          console.log('checkBoard', boards[player.game])
          let win, lose = false
          if (player.moves >= 3) {
            [win, lose] = checkBoard(boards[player.game], symbol)
            if (win) player.wins ++
            if (lose) opponent.wins ++
          }
          player.client.send('tictac:move-result', {
            board: boards[player.game],
            row, col, rotate,
            player_win: win,
            opponent_win: lose,
            player: { ...player, client: null },
            opponent: { ...opponent, client: null },
            next: opponent.name
          })
          opponent.client.send('tictac:opponent-move', {
            board: boards[player.game],
            row, col, rotate,
            player_win: lose,
            opponent_win: win,
            opponent: { ...player, opponent: null, client: null },
            player: { ...opponent, opponent: null, client: null },
            next: opponent.name
          })
        }
      })

      server.ws.on('tictac:reset', ({name: user}) => {
        const player = players[user]
        const opponent = player.opponent
        boards[player.game] = [
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ]
        player.moves = 0
        opponent.moves = 0
        const next = Math.random() >= 0.5 ? player.name : opponent.name
        player.client.send('tictac:new-game', {
          board: boards[player.game],
          player: { ...player, client: null },
          opponent: { ...opponent, client: null },
          next
        })
        opponent.client.send('tictac:new-game', {
          board: boards[player.game],
          opponent: { ...player, opponent: null, client: null },
          player: { ...opponent, opponent: null, client: null },
          next
        })
      })

      server.ws.on('tictac:disconnect', ({ name: user }) => {
        console.log(user, 'disconnected')
        const data = players[user]
        if (!data) return
        const { name, client } = data.opponent
        delete players[user]
        delete players[name]
        queue.push({ name, client })
        client.send('tictac:disconnected', { name: user })
      })
    },
  }
}