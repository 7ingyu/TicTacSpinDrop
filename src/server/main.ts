import express, { type Express } from "express"
import session from "express-session"
import ViteExpress from "vite-express"
import { Server } from 'socket.io'
import setupSocket from './socket'

const app: Express = express()

// Session setup
const sess = {
  secret: process.env.SECRET || 'tea and jellyfish',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 60000 }
}
if (process.env.NODE_ENV == 'production') {
  console.log('in production environment')
  app.set('trust proxy', 1)
  sess.cookie.secure = true
}
const sessionMiddleware = session(sess)
app.use(sessionMiddleware)

ViteExpress.config({
  mode: process.env.NODE_ENV == 'production' ? 'production' : 'development'
})

// app.get("/hello", (_, res: Response) => {
//   res.send("Hello Vite + React + TypeScript!")
// })

const server = app.listen(Number(process.env.PORT) || 3000, () =>
  console.log("Server is listening at", Number(process.env.PORT) || 3000)
);

ViteExpress.bind(app, server);

// Socket Setup
export const io = new Server(server)
io.engine.use(sessionMiddleware);
io.on('connection', setupSocket)
