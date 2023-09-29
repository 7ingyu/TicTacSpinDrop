import express, { Express } from "express"
import ViteExpress from "vite-express"
import { Server } from 'socket.io'
import setupSocket from './socket'

const app: Express = express()

ViteExpress.config({
  mode: process.env.NODE_ENV == 'production' ? 'production' : 'development'
})

// app.get("/hello", (_, res: Response) => {
//   res.send("Hello Vite + React + TypeScript!")
// })

const server = app.listen(3000, "0.0.0.0", () =>
  console.log("Server is listening...")
);

ViteExpress.bind(app, server);

export const io = new Server(server)

io.on('connection', setupSocket)
