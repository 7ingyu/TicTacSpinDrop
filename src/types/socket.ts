import type { Socket } from 'socket.io';
import type { GameBoard } from './index';

export interface JoinData {
  name: string
  socket: Socket
  game?: string
}

export interface PlayerData {
  name: string
  socket: string
}

export interface PlayerState extends PlayerData {
  symbol: string
  wins: number
  moves: number
}

export type PublicPlayer = Omit<PlayerState, 'socket'>

export interface GameData {
  row?: number
  col?: number
  rotate?: boolean
  id: string
  next: string
  board: GameBoard
}

export interface PrivateGameData extends GameData {
  player_a: PlayerState
  player_b: PlayerState
}

export interface PublicGameData extends GameData {
  player: PlayerState
  opponent: PublicPlayer
}

export interface MovedData extends PublicGameData {
  row: number
  col: number
  rotate: boolean
}

export interface MoveData {
  game_id: string
  player_id: string
  row: number
  col: number
  rotate: boolean
}