interface rotateReturn {
  newBoard: string[][]
  drops: {
    row: number
    col: number
    distance: number
  }[]
}

const rotateBoard = (board: string[][]) : rotateReturn => {
  const newBoard = [
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
  let row = 2
  let col = 1
  for (let r = 1; r >= 0 ; r--) {
    for (let c = 0; c < 3; c++) {
      const content = newBoard[r][c]
      if (content) {
        let below = r + 1
        let distance = 0
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

  return { newBoard, drops }
}

export default rotateBoard

// const squares = Array.from(document.querySelectorAll('[id^="square"]'))
// // Corresponding square in newBoard
// let row = 2
// let col = 0
// squares.reverse().forEach(({ id, textContent }) => {
//   // console.log(id, textContent)
//   const content = newBoard[row][col]
//   if (textContent) {
//     let below = row + 1
//     let drops = 0
//     while (below <= 2) {
//       if (newBoard[below][col]) break
//       // console.log('checking', below, col)
//       drops ++
//       newBoard[below][col] = content
//       newBoard[below - 1][col] = ''
//       below ++
//     }
//     // console.log(drops, 'drops')
//     // console.log(newBoard)
//     tl.to(`#${id}>div`, {
//       translateX: `${110 * drops}px`,
//     }, 'drop')
//   }
//   // Get next corresponding newBoard square
//   row --
//   if (row < 0) {
//     row = 2
//     col ++
//   }
// })
// tl.play().then(() => {
//   // console.log('fin')
//   setBoard(newBoard)
//   setFreeze(false)
// })