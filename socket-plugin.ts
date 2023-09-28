export default function socketPlugin() {

  return {
    name: 'vite-tictactoe-socket-plugin',
    configureServer(server) {
      const x = '\u2573';
      const o = '\u25EF';

      const queue = []
      const players = {}

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
          console.log('match found')
          const opponent = queue.pop()
          client.send('tictac:player-match', {
            player: { name: newPlayer.name, symbol: o },
            opponent: {name: opponent.name, symbol: x }
          })
          opponent.client.send('tictac:player-match', {
            opponent: { name: newPlayer.name, symbol: o },
            player: {name: opponent.name, symbol: x }
          })
          players[newPlayer.name] = {
            ...newPlayer,
            opponent: opponent,
            symbol: o
          }
          players[opponent.name] = {
            ... opponent,
            opponent: newPlayer,
            symbol: x
          }
        } else {
          queue.push(newPlayer)
        }
      })

      server.ws.on('tictac:move', (data) => {
        console.log(data)
      })
    },
  }
}