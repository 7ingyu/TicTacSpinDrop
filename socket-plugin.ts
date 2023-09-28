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
            game: boards[newPlayer.name + opponent.name]
          }
          players[opponent.name] = {
            ... opponent,
            opponent: newPlayer,
            symbol: x,
            game: boards[newPlayer.name + opponent.name]
          }
        } else {
          queue.push(newPlayer)
        }
      })

      server.ws.on('tictac:move', (data) => {
        console.log(data)
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