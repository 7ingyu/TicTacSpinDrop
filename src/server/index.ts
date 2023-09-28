import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
} from '@/types/sockets'
import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

export const app = express()
const server = createServer(app)
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server)

// app.get('/vanilla', ((_, res) =>
//   res.sendFile(new URL('+/index.html', import.meta.url).pathname)
// ))

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

// const socket: Socket<ServerToClientEvents, ClientToServerEvents<true>>
//   = ioc("http://localhost:3000");

// socket.timeout(100).emit("hello", 123, (err, arg) => {
//   // arg is properly inferred as a string
// });
// // io.listen(4000)