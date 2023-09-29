import { Socket } from 'socket.io'
import { games } from '../state'
import sendDataToPlayers from './sendDataToPlayers'
import { privateGameData } from '../../../types'

const reset = (socket: Socket) => {
  // console.log('socket rooms', socket.rooms)
  const game_id = [...socket.rooms][1]
  // console.log('game/room id', game_id)
  const game: privateGameData = games[game_id]

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