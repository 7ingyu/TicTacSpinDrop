import { useEffect, useState } from 'react'
import gsap from 'gsap';
import Toggle from '@/components/Toggle'
import checkBoard from '@/utils/checkBoard'
import gameProps from '@/types/playerData'

function Game ({ player, opponent }: gameProps)  {
  const x = '\u2573';
  const o = '\u25EF';

  const [ board, setBoard ] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ])
  const [ rotate, setRotate ] = useState<boolean>(false)
  const [ score, setScore ] = useState<number[]>([0, 0])
  const [ started, setStarted ] = useState<boolean>(false)
  const [ freeze, setFreeze ] = useState<boolean>(true)
  const [ timeline, setTimeline ] = useState<gsap.core.Timeline | null>(null)
  const [ notification, setNotification ] = useState<string>('')

  useEffect(() => {
    // Startup & connect to websocket
    if (import.meta.hot) {
      import.meta.hot.on('tictac:player-move', data => {
        console.log(data)
      })
    } else {
      console.error('no import.meta.hot')
    }

  }, [])

  const handleClick = (row: number, col: number) => {
    console.log(row, col, 'clicked')
    const newBoard = [...board]
    newBoard[row][col] = player.symbol
    if (rotate) {
      setFreeze(true)
    } else {
      setBoard(newBoard)
    }
    setStarted(true)
    setNotification('')
  }

  const handleReset = () => {
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ])
    setFreeze(false)
    setStarted(false)
    setNotification('Your turn!')
  }


  useEffect(() => {
    if (!freeze && started) {
      console.log('timeline revert')
      timeline?.revert()
      const [ win, lose ] = checkBoard(board, player.symbol)
      if (win && lose) {
        setNotification("It's a tie!")
      } else if (win) {
        setNotification('You win!')
      } else if (lose) {
        setNotification('You lose.')
      }
      if (win || lose) {
        setScore(s => [s[0] + Number(win), s[1] + Number(lose)])
        setFreeze(true)
        setStarted(false)
      }
      setTimeline(null)
    }
  }, [board, freeze, timeline, player, started])

  useEffect(() => {
    const handleRotate = async () => {
      const newBoard = [
        [ board[2][0], board[1][0], board[0][0] ],
        [ board[2][1], board[1][1], board[0][1] ],
        [ board[2][2], board[1][2], board[0][2] ]
      ]
      const tl = gsap.timeline()
      setTimeline(tl)
      tl.to('#board', {
        rotation: 90,
        duration: 0.5
      }).addLabel('rotate', 0).addLabel('drop', 0.5)
      // console.log('rotated', newBoard)
      // Drop squares
      const squares = Array.from(document.querySelectorAll('[id^="square"]'))
      // Corresponding square in newBoard
      let row = 2
      let col = 0
      squares.reverse().forEach(({ id, textContent }) => {
        // console.log(id, textContent)
        const content = newBoard[row][col]
        tl.to(`#${id}>div`, {
          rotate: -90,
        }, 'rotate')
        if (textContent) {
          let below = row + 1
          let drops = 0
          while (below <= 2) {
            if (newBoard[below][col]) break
            // console.log('checking', below, col)
            drops ++
            newBoard[below][col] = content
            newBoard[below - 1][col] = ''
            below ++
          }
          // console.log(drops, 'drops')
          // console.log(newBoard)
          tl.to(`#${id}>div`, {
            translateX: `${110 * drops}px`,
          }, 'drop')
        }
        // Get next corresponding newBoard square
        row --
        if (row < 0) {
          row = 2
          col ++
        }
      })
      tl.play().then(() => {
        // console.log('fin')
        setBoard(newBoard)
        setFreeze(false)
      })
    }
    if (freeze && rotate && started) handleRotate()
  }, [board, freeze, rotate, started])

  return (
    <>
      <div id="controls">
        <Toggle
          label="Rotation Drop"
          toggle={rotate}
          setToggle={setRotate}
        />
        <button className="buttons" onClick={handleReset}>
          {freeze ? 'New Game' : 'Reset Game'}
        </button>
      </div>

      <div id="tally">
        <div>Games won by {player.name} ({player.symbol}): {score[0]}</div>
        <div>Games won by {opponent.name} ({opponent.symbol}): {score[1]}</div>
      </div>

      <div id='board'>
        {board.map((row: string[], r: number) => row.map((str, c) => (
          <div
            id={`square-${r}-${c}`}
            key={`square-${r}-${c}`}
            onClick={!freeze ? () => handleClick(r, c) : () => {}}
          >
            <div className="textbox">
              {str}
            </div>
          </div>
        )))}
      </div>

      <div id="notifications">
          {notification}
      </div>
    </>
  )
}

export default Game