import { io } from '../../main'
import { clean } from '.'
import { privateGameData } from '../../../types'

const sendDataToPlayers = (event: string, gameData: privateGameData) => {
  const { player_a, player_b } = gameData
  const [ res_a, res_b ] = clean(gameData, player_a.socket)
  const socket_a = io.sockets.sockets.get(player_a.socket)
  const socket_b = io.sockets.sockets.get(player_b.socket)
  socket_a?.emit(event, res_a)
  socket_b?.emit(event, res_b)
}

export default sendDataToPlayers