import { randomBytes } from 'crypto'
import { handleQueue, sendDataToPlayers } from '.'
import { io } from '../../main'
import { x, o, queue, games, players } from '../state'
import type { JoinData, PlayerData, PrivateGameData } from '../../../types'

const join = ({ name, game = '', socket }: JoinData) => {

  console.log(socket.id, '-', name, 'trying to join', game)
  const player_a: PlayerData = { name, socket: socket.id }

  try {
    // Error handling
    if (!queue.length) throw 'No other players available'
    let player_b = queue.pop()
    let socket_b = io.sockets.sockets.get(player_b?.socket || '')
    while (queue.length && (!player_b || !socket_b)) {
      player_b = queue.pop()
      socket_b = io.sockets.sockets.get(player_b?.socket || '')
      if (!!player_b && !socket_b) console.log `Queued player ${player_b?.socket} has disconnected`
    }
    if (!player_b && !queue.length) throw 'No other players available'
    const num_games = Object.keys(games).length
    if (num_games > 100) throw 'Too many games going'

    // Determine room/game ID
    let game_id: string = game || randomBytes(10).toString("base64")
    if (game_id === game && games[game_id]) {
      throw 'Game already in session'
    }
    while (games[game_id]) {
      game_id = randomBytes(10).toString("base64")
    }
    const gameData: PrivateGameData = {
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
    console.log(socket.id, '-', 'matched with', socket_b.id)
    sendDataToPlayers('new-game', gameData)
  } catch (e) {
    console.log(socket.id, '-', e)
    handleQueue({ name, socket })
  }
}

export default join