import { Socket } from 'socket.io'
import { handleDisconnect, handleJoin, handleMove, handleReset } from './handle'

const setup = (socket: Socket) => {
  console.log('connected', socket.id)

  socket.on('join', (data) => handleJoin({...data, socket}))
  // emits 'new-game' upon success

  socket.on('move', (data) => handleMove({...data, socket}))
  // emits 'invalid-move' or 'moved'

  socket.on('reset', () => handleReset(socket))
  // emits 'new-game'

  socket.on('disconnect', () => handleDisconnect(socket))
  // emits 'opponent-disconnect'
}

export default setup