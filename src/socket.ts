import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@types/sockets'
import { io, Socket } from 'socket.io-client'

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL);