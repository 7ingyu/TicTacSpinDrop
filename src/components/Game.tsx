import { useEffect, useState, useReducer } from 'react'
import gsap from 'gsap';
import Toggle from '@/components/Toggle'
import checkBoard from '@/utils/checkBoard'
import rotateBoard from '../utils/rotateBoard';
import gameProps from '@/types/playerData'
import { NotificationActionKind, NotificationState, notificationReducer } from '@/reducers/notifications';

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

  const [ notification, setNotification ]
    = useReducer<(state: NotificationState, action: NotificationActionKind) => NotificationState>(notificationReducer, { player, opponent, msg: '' });

  useEffect(() => {
    // Startup & connect to websocket
    if (import.meta.hot) {
      import.meta.hot.on('tictac:player-move', data => {
        console.log(data)
      })
    } else {
      console.error('no import.meta.hot')
    }
    if (player.symbol === x) {
      setNotification(NotificationActionKind.GO)
      setFreeze(false)
    } else {
      setNotification(NotificationActionKind.WAIT)
      setFreeze(true)
    }
  }, [player])

  const handleClick = (row: number, col: number) => {
    // console.log(row, col, 'clicked')
    setNotification(NotificationActionKind.TRANSITION)
    const newBoard = [...board]
    newBoard[row][col] = player.symbol
    if (rotate) {
      setFreeze(true)
    } else {
      setBoard(newBoard)
    }
    setStarted(true)
    setNotification(NotificationActionKind.TRANSITION)
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
        setNotification(NotificationActionKind.TIE)
      } else if (win) {
        setNotification(NotificationActionKind.WIN)
      } else if (lose) {
        setNotification(NotificationActionKind.LOSE)
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
      const tl = gsap.timeline()
      setTimeline(tl)
      tl.to('#board', {
        rotation: 90,
        duration: 0.5
      }).addLabel('rotate', 0).addLabel('drop', 0.5)
      const { newBoard, drops } = rotateBoard(board)
      drops.forEach(({row, col, distance}) => {
        tl.to(`#square-${row}-${col}>div`, {
          translateX: `${110 * distance}px`,
        }, 'drop')
      })
      tl.play().then(() => {
        setBoard(newBoard)
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
          {notification?.msg}
      </div>
    </>
  )
}

export default Game