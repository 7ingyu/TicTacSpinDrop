import { handleQueue, sendDataToPlayers } from '.'
import { io } from '../../main'
import { x, o, queue, games, players } from '../state'
import { joinData, playerData, privateGameData } from '../../../types/socket'

const join = ({ name, game = '', socket }: joinData) => {

  // console.log(name, 'trying to join', game)
  const player_a: playerData = { name, socket: socket.id }

  try {
    // Error handling
    if (!queue.length) throw 'No other players available'
    const player_b = queue.pop()
    if (!player_b) throw 'No other players available'
    const socket_b = io.sockets.sockets.get(player_b?.socket || '')
    if (!socket_b) throw 'Queued player has disconnected'
    const num_games = Object.keys(games).length
    if (num_games > 100) throw 'Too many games going'

    // Determine room/game ID
    const game_id: string = game || socket.id
    const gameData: privateGameData = {
      id: game_id,
      next: x,
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      player_a: {
        ...player_a,
        symbol: o,
        wins: 0,
        moves: 0,
      },
      player_b: {
        ...player_b,
        symbol: x,
        wins: 0,
        moves: 0
      }
    }
    // Connect players to each other
    players[player_a.socket] = player_b
    players[player_b.socket] = player_a
    // Save game state
    games[game_id] = gameData
    // Join room
    socket.join(game_id)
    socket_b.join(game_id)

    // Emit data to both players
    sendDataToPlayers('new-game', gameData)
  } catch (e) {
    console.log(e)
    handleQueue({ name, socket })
  }
}

export default join