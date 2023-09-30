import { io } from '../../main'
import { clean } from '.'
import type { PrivateGameData } from '../../../types'

const sendDataToPlayers = (event: string, gameData: PrivateGameData) => {
  // console.log('cleaning', gameData)
  const { player_a, player_b } = gameData
  const [ res_a, res_b ] = clean(gameData, player_a.session_id)

  // console.log('sending', res_a, 'to', socket_a?.id)
  // console.log('sending', res_b, 'to', socket_b?.id)
  console.log(gameData.id, ':', gameData.board)
  io.sockets.to(player_a.session_id).emit(event, res_a)
  io.sockets.to(player_b.session_id).emit(event, res_b)
}

export default sendDataToPlayers