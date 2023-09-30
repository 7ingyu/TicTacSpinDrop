import { Socket } from "socket.io"
import { checkBoard, rotateBoard } from "../../../utils"
import { games } from "../state"
import { getPlayers, sendDataToPlayers } from "."
import type { GameBoard, MoveData, SessionSocket } from "../../../types"
import { io } from "../../main"
interface MoveArgs extends MoveData {
  socket: SessionSocket
}

const move = ({ game_id, row, col, rotate, socket }: MoveArgs) => {
  // Get saved data
  const gameData = games[game_id]
  // console.log('in-memory', gameData)
  const { board, next } = gameData
  const [player, opponent] = getPlayers(gameData, socket.request.session.id)
  const symbol = player.symbol
  console.log(socket.request.session.id, `- new-move: game ${game_id} (row ${row} col ${col} rotate ${rotate} ${symbol})`)

  // Update move count
  player.moves ++

  // Update board
  let newBoard: GameBoard = [... board]
  if (!newBoard[row][col] && Math.abs(player.moves - opponent.moves) < 2 || symbol !== next) {
    newBoard[row][col] = symbol
  } else {
    // Report invalid if already something at that square
    // Or if too many moves
    player.moves --
    console.log(socket.id, '- invalid-move')
    io.sockets.to(socket.request.session.id).emit('invalid-move', { ...games[game_id] })
    return
  }

  // Calculate rotation
  if (rotate) {
    newBoard = rotateBoard(newBoard).newBoard
  }

  // Check for win
  let win, lose = false
  if (player.moves >= 3 || opponent.moves >= 3) {
    [ win, lose ] = checkBoard(newBoard, symbol)
    // console.log('win-lose', win, lose)
    if (win) player.wins ++
    if (lose) opponent.wins ++
  }

  // Update game stat
  gameData.board = newBoard
  gameData.next = opponent.symbol
  // console.log('new-data', gameData)

  sendDataToPlayers('moved', {...gameData, row, col, rotate})
}

export default move