import { Socket } from 'socket.io'
import { handleJoin } from '.'
import { io } from '../../main'
import { games, players } from '../state'

const disconnect = (socket: Socket) => {
  // Disconnect opponent
  const player_b = players[socket.id]
  if (!player_b) return
  const socket_b = io.sockets.sockets.get(player_b.socket)
  const game_id = [...socket.rooms][1]
  // Clean up state
  delete players[socket.id]
  delete players[player_b.socket]
  delete games[game_id]
  // Notify opponent of disconnect
  // and add to que
  if (!socket_b) return
  socket_b.leave(game_id)
  socket_b.emit('opponent-disconnect')
  handleJoin({name: player_b.name, socket: socket_b})
}

export default disconnect