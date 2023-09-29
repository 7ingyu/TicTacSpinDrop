import { queue } from '../state'
import type { JoinData, PlayerData } from '../../../types'

const handleQueue = ({ name, socket }: JoinData) => {
  const player_a: PlayerData = { name, socket: socket.id }
  if (queue.length > 10) {
    // Ask client to try against later if too many in queue
    socket.emit('server-overload')
    console.log('QUEUE LENGTH OVER 10')
  } else {
    // Add player to queue
    queue.push(player_a)
  }
}

export default handleQueue