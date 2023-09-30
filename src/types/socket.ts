import type { SessionSocket, GameBoard } from './index'

export interface JoinData {
  name: string
  socket: SessionSocket | string
  game?: string
}

export interface PlayerData {
  name: string
  session_id: string
  game_id: string
}

export interface PlayerState extends PlayerData {
  symbol: string
  wins: number
  moves: number
}

export type PublicPlayer = Omit<PlayerState, 'session_id'>

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