import { randomBytes } from 'crypto'
import { handleQueue, sendDataToPlayers } from '.'
import { io } from '../../main'
import { x, o, queue, games, players } from '../state'
import type { JoinData, PlayerData, PrivateGameData } from '../../../types'

const join = async ({ name, game = '', socket }: JoinData) => {

  const session_id = typeof socket === "string" ? socket : socket.request.session.id

  console.log(session_id, '-', name, 'trying to join', game)
  const player_a: Omit<PlayerData, 'game_id'>
    = { name, session_id }

  try {
    // Error handling
    if (!queue.length) throw 'No other players available'
    let player_b = queue.pop()
    console.log('popped', player_b)
    let room_b = await io.sockets.in(player_b.session_id).fetchSockets()
    while (queue.length && (!player_b || !room_b.length || player_b.session_id === session_id)) {
      player_b = queue.pop()
      room_b = player_b ? await io.sockets.in(player_b.session_id).fetchSockets() : []
      if (!!player_b && !room_b.length) console.log `Queued player ${player_b?.session_id} has disconnected`
    }
    if (!player_b && !queue.length) throw 'No other players available'
    const num_games = Object.keys(games).length
    if (num_games > 100) throw 'Too many games going'

    // Determine game ID
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
        game_id: game_id
      },
      player_b: {
        ...player_b,
        symbol: x,
        wins: 0,
        moves: 0,
        game_id: game_id
      }
    }
    // Connect players to each other
    players[player_a.session_id] = {...player_b, game_id: game_id}
    players[player_b.session_id] = {...player_a, game_id: game_id}
    // Save game state
    games[game_id] = gameData

    // Emit data to both players
    console.log(`game ${game_id}`, player_a.session_id, '-', 'matched with', player_b.session_id)
    sendDataToPlayers('new-game', gameData)
  } catch (e) {
    console.log('session', session_id, '-', e)
    handleQueue({ name, socket })
  }
}

export default join