import { Socket } from 'socket.io';
import { boardShape } from '.';

export interface joinData {
  name: string
  socket: Socket
  game?: string
}

export interface playerData {
  name: string
  socket: string
}

export interface playerState extends playerData {
  symbol: string
  wins: number
  moves: number
}

export type publicPlayer = Omit<playerState, 'socket'>

export interface gameData {
  row?: number
  col?: number
  rotate?: boolean
  id: string
  next: string
  board: boardShape
}

export interface privateGameData extends gameData {
  player_a: playerState
  player_b: playerState
}

export interface publicGameData extends gameData {
  player: playerState
  opponent: publicPlayer
}

export interface movedData extends publicGameData {
  row: number
  col: number
  rotate: boolean
}

export interface moveData {
  game_id: string
  player_id: string
  row: number
  col: number
  rotate: boolean
}