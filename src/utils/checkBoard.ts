const checkBoard = (board: string[][], symbol: string) => {
  console.log('checking score')
  const winCombos = [
    // Columns
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];

  const result = [false, false]
  const flat = board.flat()
  console.log(flat)
  for (const combo of winCombos) {
    let win = true
    let lose = true
    for (const square of combo) {
      console.log(square)
      if (flat[square] !== symbol) win = false
      if (flat[square] === symbol) lose = false
      if (!flat[square]) win = lose = false
    }
    if (win) result[0] = true
    if (lose) result[1] = true
    console.log(result)
    if (result[0] && result[1]) return result
  }
  return result
}

export default checkBoard