import express, { Express, Response } from "express"
import ViteExpress from "vite-express"
// import { createServer } from 'node:http'
import { Server } from 'socket.io'
import setupSocket from './socket'

const app: Express = express()
// const server = createServer(app)

app.get("/hello", (_, res: Response) => {
  res.send("Hello Vite + React + TypeScript!")
})

const server = ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
)

export const io = new Server(server)

io.on('connection', setupSocket)
