import type { PrivateGameData, SessionSocket } from '../../../types'
import { games, players } from '../state'
import sendDataToPlayers from './sendDataToPlayers'

const reset = (socket: SessionSocket) => {
  // console.log('socket rooms', socket.rooms)
  const session_id = socket.request.session.id
  const player = players[session_id]
  console.log(session_id, '- reset game/room id', player.game_id)
  const game: PrivateGameData = games[player.game_id]

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