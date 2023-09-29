import { boardShape } from '../types'

export interface rotateReturn {
  newBoard: boardShape
  drops: {
    row: number
    col: number
    distance: number
  }[]
}

const rotateBoard = (board: boardShape) : rotateReturn => {
  // console.log('calculating rotate')
  const newBoard: boardShape = [
    [ board[2][0], board[1][0], board[0][0] ],
    [ board[2][1], board[1][1], board[0][1] ],
    [ board[2][2], board[1][2], board[0][2] ]
  ]
  const drops : {
    row: number
    col: number
    distance: number
  }[] = []

  // console.log('rotated', newBoard)
  // Drop squares
  let row: number = 2
  let col: number = 1
  for (let r = 1; r >= 0 ; r--) {
    for (let c = 0; c < 3; c++) {
      const content: string = newBoard[r][c]
      if (content) {
        let below: number = r + 1
        let distance: number = 0
        while (below <= 2) {
          if (newBoard[below][c]) break
          distance ++
          newBoard[below][c] = content
          newBoard[below - 1][c] = ''
          below ++
        }
        drops.push({ row, col, distance })
      }
      // Get next corresponding square on pg
      row --
      if (row < 0) {
      row = 2
      col --
      }
    }
  }

  // console.log('original', board)
  // console.log('rotated', newBoard)
  return { newBoard, drops }
}

export default rotateBoard