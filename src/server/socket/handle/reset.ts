import type { Socket } from 'socket.io'
import type { PrivateGameData } from '../../../types'
import { games } from '../state'
import sendDataToPlayers from './sendDataToPlayers'

const reset = (socket: Socket) => {
  // console.log('socket rooms', socket.rooms)
  const game_id = [...socket.rooms][1]
  console.log(socket.id, '- reset game/room id', game_id)
  const game: PrivateGameData = games[game_id]

  if (!game) return

  game.board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  game.player_a.moves = 0
  game.player_b.moves = 0

  sendDataToPlayers('reset', game)
}

export default reset