/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useReducer } from 'react'
import gsap from 'gsap';
import Toggle from '@/components/Toggle'
import checkBoard from '@/utils/checkBoard'
import rotateBoard from '../utils/rotateBoard';
import gameProps from '@/types/playerData'
import { NotificationActionKind, NotificationState, NotificationActionShape, notificationReducer } from '@/reducers/notifications';

interface serverResultShape {
  board: string[][]
  row: number | null
  col: number | null
  rotate: boolean | null
  player_win: boolean | null
  opponent_win: boolean | null
  opponent: {
    name: string
    symbol: string
    moves: number
    wins: number
  }
  player: {
    name: string
    symbol: string
    moves: number
    wins: number
  }
  next: string
}

function Game ({ player, opponent }: gameProps)  {
  const x = '\u2573';
  const o = '\u25EF';

  const [ board, setBoard ] = useState<string[][]>([
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ])
  const [ rotate, setRotate ] = useState<boolean>(false)
  const [ rotating, setRotating ] = useState<boolean>(false)
  const [ currentMove, setCurrentMove ] = useState<number[] | null>(null)
  const [ timeline, setTimeline ] = useState<gsap.core.Timeline | null>(null)
  const [ score, setScore ] = useState<number[]>([0, 0])
  const [ started, setStarted ] = useState<boolean>(false)
  const [ freeze, setFreeze ] = useState<boolean>(true)
  const [ isTurn, setIsTurn ] = useState<boolean>(false)
  const [ waitingForResults, setWaitingForResults ] = useState<boolean>(false)
  const [ serverResult, setServerResult ] = useState<serverResultShape | null>(null)

  const [ notification, setNotification ]
    = useReducer<(state: NotificationState, action: NotificationActionShape) => NotificationState>(notificationReducer, { player, opponent, msg: '' });

  useEffect(() => {
    // Startup & connect to websocket
    if (import.meta.hot) {
      import.meta.hot.on('tictac:move-result', (data: serverResultShape) => {
        console.log('got move results')
        setWaitingForResults(false)
        setServerResult(data)
      })
      import.meta.hot.on('tictac:opponent-move', (data: serverResultShape) => {
        console.log('opponent moved')
        const { row, col, rotate: rotatedMove } = data
        setServerResult(data)
        if (row && col) setCurrentMove([row, col])
        setRotate(rotatedMove || false)
      })
      import.meta.hot.on('tictac:new-game', (data: serverResultShape) => {
        console.log('resetting')
        setServerResult(data)
        setBoard(data.board)
        setNotification({type: NotificationActionKind.NEW, next: data.next})
        setIsTurn(data.next === player.name)
        setFreeze(data.next !== player.name)
      })
    } else {
      console.error('no import.meta.hot')
    }
    if (player.symbol === x) {
      setNotification({type: NotificationActionKind.GO})
      setIsTurn(true)
      setFreeze(false)
    } else {
      setNotification({type: NotificationActionKind.WAIT})
      setIsTurn(false)
      setFreeze(true)
    }
  }, [player])

  const handleClick = (row: number, col: number) => {
    setCurrentMove([row, col])
    // console.log(row, col, 'clicked')
  }

  const endMove = () => {
    console.log('ending move')
    setTimeline(null)
    setNotification({type: isTurn ? NotificationActionKind.WAIT: NotificationActionKind.GO})
    setStarted(true)
    setCurrentMove(null)
    setRotating(false)
  }

  useEffect(() => {
    if (currentMove) {
      const [row, col] = currentMove
      setNotification({type: NotificationActionKind.TRANSITION})
      const newBoard = [...board]
      newBoard[row][col] = isTurn ? player.symbol: opponent.symbol
      if (isTurn && import.meta.hot) {
        import.meta.hot.send('tictac:move', {
          ... player,
          square: [row, col],
          rotate
        })
        setWaitingForResults(true)
      }
      if (!rotate) {
        setBoard(newBoard)
        endMove()
      } else {
        setRotating(true)
      }
    }
  }, [currentMove])

  const handleReset = () => {
    console.log('reset req')
    if (import.meta.hot) {
      import.meta.hot.send('tictac:reset', player)
    }
    setServerResult(null)
  }

  useEffect(() => {
    // Animate Rotation
    if (rotating) {
      console.log('animting rotate')
      const tl = gsap.timeline()
      tl.to('#board', {
        rotation: 90,
        duration: 0.5
      }).addLabel('rotate', 0).addLabel('drop', 0.5)
      const { newBoard, drops } = rotateBoard(board)
      drops.forEach(({row, col, distance}) => {
        tl.to(`#square-${row}-${col}>div`, {
          rotation: -90,
        }, 'rotate')
        tl.to(`#square-${row}-${col}>div`, {
          translateX: `${110 * distance}px`,
        }, 'drop')
      })
      tl.play().then(() => {
        setBoard(newBoard)
        endMove()
        setTimeline(tl)
      })
    }
  }, [rotating])

  useEffect(() => {
    const checkAgainstServer = () => {
      if (!serverResult) return
      console.log('checking against server data')
      console.log('server', serverResult.board)
      console.log('local', board)
      setScore([serverResult.player.wins, serverResult.opponent.wins])
      if (JSON.stringify(serverResult.board) !== JSON.stringify(board)) {
        console.log('board mismatch!')
        setBoard(serverResult.board)
      }
      setFreeze(serverResult.next !== player.name)
      setIsTurn(serverResult.next === player.name)
      if (serverResult.player_win || serverResult.opponent_win) {
        setFreeze(true)
        setStarted(false)
        if (serverResult.player_win && serverResult.opponent_win) {
          setNotification({type: NotificationActionKind.TIE})
        } else if (serverResult.player_win) {
          setNotification({type: NotificationActionKind.WIN})
        } else if (serverResult.opponent_win) {
          setNotification({type: NotificationActionKind.LOSE})
        }
      }
    }
    if (serverResult && !rotating && !waitingForResults && !currentMove) checkAgainstServer()
    if (timeline) {
      console.log('revert')
      timeline.revert()
    }
  }, [rotating, serverResult, board, waitingForResults, currentMove, timeline])

  return (
    <>
      <div id="controls">
        <Toggle
          label="Rotation Drop"
          toggle={rotate}
          setToggle={setRotate}
        />
        <button className="buttons" onClick={handleReset}>
          {started ? 'Reset Game' : 'New Game'}
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