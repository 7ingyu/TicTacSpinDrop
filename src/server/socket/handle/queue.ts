import { queue } from '../state'
import type { JoinData, PlayerData } from '../../../types'
import { io } from '../../main'

const handleQueue = ({ name, socket }: JoinData) => {

  const session_id = typeof socket === "string" ? socket : socket.request.session.id

  const player_a: Omit<PlayerData, "game_id"> = { name, session_id }
  if (queue.length > 10) {
    // Ask client to try against later if too many in queue
    io.sockets.to(session_id).emit('server-overload')
    console.log('QUEUE LENGTH OVER 10')
  } else {
    // Add player to queue
    queue.push(player_a)
  }
}

export default handleQueue