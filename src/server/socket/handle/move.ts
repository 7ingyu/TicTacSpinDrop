import { Socket } from "socket.io"
import { checkBoard, rotateBoard } from "../../../utils"
import { moveData } from "../../../types/socket"
import { games } from "../state"
import { boardShape } from "@/types"
import { getPlayers, sendDataToPlayers } from "."

interface MoveArgs extends moveData {
  socket: Socket
}

const move = ({ game_id, row, col, rotate, player_id, socket }: MoveArgs) => {
  // console.log('new-move', game_id, row, col, rotate, player_id)
  // Get saved data
  const gameData = games[game_id]
  console.log('in-memory', gameData)
  const { board, next } = gameData
  const [player, opponent] = getPlayers(gameData, player_id)
  const symbol = player.symbol

  // Update move count
  player.moves ++

  // Update board
  let newBoard: boardShape = [... board]
  if (!newBoard[row][col] && Math.abs(player.moves - opponent.moves) < 2 || symbol !== next) {
    newBoard[row][col] = symbol
  } else {
    // Report invalid if already something at that square
    // Or if too many moves
    player.moves --
    socket.emit('invalid-move', { ...games[game_id] })
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
    console.log('win-lose', win, lose)
    if (win) player.wins ++
    if (lose) opponent.wins ++
  }

  // Update game stat
  gameData.board = newBoard
  gameData.next = opponent.symbol
  console.log('new-data', gameData)

  sendDataToPlayers('moved', {...gameData, row, col, rotate})
}

export default move