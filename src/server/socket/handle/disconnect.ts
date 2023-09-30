import { handleJoin } from '.'
import { SessionSocket } from '../../../types'
import { io } from '../../main'
import { games, players } from '../state'

const disconnect = async (socket: SessionSocket) => {
  console.log(socket.request.session.id, 'disconnected')
  // Check if socket disconnect cleared room
  const room_a = await io.sockets.in(socket.request.session.id).fetchSockets()
  if (room_a.length) return

  // Get opponent
  const player_b = players[socket.request.session.id]
  if (!player_b) return

  console.log(`reassigning ${player_b.session_id}`)

  // Clean up state
  delete players[socket.id]
  delete players[player_b.session_id]
  delete games[player_b.game_id]

  // Notify opponent of disconnect
  // and add to queue
  io.sockets.to(player_b.session_id).emit('opponent-disconnect')
  const room_b = await io.sockets.in(player_b.session_id).fetchSockets()
  handleJoin({name: player_b.name, socket: player_b.session_id})
}

export default disconnect