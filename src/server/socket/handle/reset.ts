import { Socket } from 'socket.io'
import { io } from '../../main'
import { games } from '../state'

const reset = (socket: Socket) => {
  const game_id = [...socket.rooms][1]
  const game = games[game_id]
  game.board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]
  game.player_a.moves = 0
  game.player_b.moves = 0
  io.to(game_id).emit('new-game', game)
}

export default reset