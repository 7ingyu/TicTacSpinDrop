import { queue } from '../state'

import { joinData, playerData } from '../../../types/socket'

const handleQueue = ({ name, socket }: joinData) => {
  const player_a: playerData = { name, socket: socket.id }
  if (queue.length > 10) {
    // Ask client to try against later if too many in queue
    // TO DO: some way to clean queue occasionally
    socket.emit('server-overload')
  } else {
    // Add player to queue
    queue.push(player_a)
  }
}

export default handleQueue