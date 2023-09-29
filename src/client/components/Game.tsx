import { useEffect, useState, useReducer } from 'react'
import gsap from 'gsap';
import { Toggle } from '@/client/components'
import { rotateBoard } from '@/utils';
import { publicGameData, movedData, boardShape, moveData } from '@/types'
import {
  NotificationActionKind,
  NotificationState,
  NotificationActionShape,
  notificationReducer
} from '@/client/reducers/notifications';
import { socket } from '@/client/socket';

interface gameProps extends publicGameData {
  playerId: string
}

function Game ({ id, next: first, board, player, opponent, playerId }: gameProps)  {

  const [ displayBoard, setDisplayBoard ] = useState<boardShape>(board)
  const [ rotate, setRotate ] = useState<boolean>(false)
  const [ rotating, setRotating ] = useState<boolean>(false)
  const [ timeline, setTimeline ] = useState<gsap.core.Timeline | null>(null)
  const [ score, setScore ] = useState<number[]>([player.wins, opponent.wins])
  const [ started, setStarted ] = useState<boolean>(false)
  const [ freeze, setFreeze ] = useState<boolean>(true)
  const [ isTurn, setIsTurn ] = useState<boolean>(first === player.symbol)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ moved, setMoved ] = useState<publicGameData>({
    id, next: first, board, player, opponent
  })

  const [ notification, setNotification ]
    = useReducer<(
      state: NotificationState,
      action: NotificationActionShape
    ) => NotificationState>(notificationReducer, { player, opponent, msg: '' });

  const handleClick = (row: number, col: number) => {
    const body: moveData = {
      row, col, rotate, game_id: id, player_id: playerId
    }
    socket.emit('move', body)
    setIsLoading(true)
    setFreeze(true)
    console.log(row, col, 'clicked')
  }

  const handleReset = () => {
    console.log('reset req')
    socket.emit('reset')
    setFreeze(true)
  }

  const endMove = () => {
    console.log('ending move')

    // Straighten out drop rotation
    timeline?.revert()

    // Check winnings and record score
    let win, lose = false
    const [ currentPlayerScore, currentOppScore ] = score
    if (moved.player.wins > currentPlayerScore) win = true
    if (moved.opponent.wins > currentOppScore) lose = true
    if (win && lose) {
      setNotification({type: NotificationActionKind.TIE})
    } else if (win) {
      setNotification({type: NotificationActionKind.WIN})
    } else if (lose) {
      setNotification({type: NotificationActionKind.LOSE})
    }
    setScore([moved.player.wins, moved.opponent.wins])

    // Freeze if game over
    setFreeze(win || lose ? true : !isTurn)

    // Setup for next move
    setTimeline(null)
    setNotification({type: isTurn ? NotificationActionKind.GO : NotificationActionKind.WAIT})
    setStarted(true)
    setRotating(false)
  }

  useEffect(() => {
    // Start game
    if (player.symbol === first) {
      setNotification({type: NotificationActionKind.GO})
      setIsTurn(true)
      setFreeze(false)
    } else {
      setNotification({type: NotificationActionKind.WAIT})
      setIsTurn(false)
      setFreeze(true)
    }

    const onMoved = (data: movedData) => {
      console.log('onMoved')
      // If opponent just moved
      if (data.next === player.symbol) {
        setFreeze(true)
        setRotate(rotate)
        setIsTurn(true)
      } else {
        setIsTurn(false)
      }
      setMoved(data)
      setIsLoading(false)
    }

    socket.on('moved', onMoved)

    return () => {
      socket.off('moved', onMoved)
    }
  }, [id])

  useEffect(() => {
    if (moved.row && moved.col) {
      setNotification({type: NotificationActionKind.TRANSITION})
      if (!moved.rotate) {
        // No rotation = no animation
        setDisplayBoard(moved.board)
        endMove()
      } else {
        // trigger rotation
        setRotating(true)
      }
    }
  }, [moved])

  useEffect(() => {
    // Animate Rotation
    if (rotating) {
      console.log('animating rotate')

      // Create timeline
      const tl = gsap.timeline()
      // Add board rotation to tl
      tl.to('#board', {
        rotation: 90,
        duration: 0.5
      }).addLabel('rotate', 0).addLabel('drop', 0.5)

      // Calculate drops and add to tl
      const { drops } = rotateBoard(displayBoard)
      drops.forEach(({row, col, distance}) => {
        // Add initial square rotation for smoother transition
        tl.to(`#square-${row}-${col}>div`, {
          rotation: -90,
        }, 'rotate')
        // Add square drops to tl
        tl.to(`#square-${row}-${col}>div`, {
          translateX: `${110 * distance}px`,
        }, 'drop')
      })

      // Trigger animation
      tl.play().then(() => {
        setDisplayBoard(moved.board)
        endMove()
        setTimeline(tl)
      })
    }
  }, [rotating])

  return (
    <div id="game" className={isLoading ? 'loading' : ''}>
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
        <div>Games won by {player?.name || "you"} ({player.symbol}): {score[0]}</div>
        <div>Games won by {opponent.name || "your opponent"} ({opponent.symbol}): {score[1]}</div>
      </div>

      <div id='board'>
        {displayBoard.map((row: string[], r: number) => row.map((str, c) => (
          <button
            id={`square-${r}-${c}`}
            key={`square-${r}-${c}`}
            className='board-square'
            disabled={freeze}
            onClick={!freeze ? () => handleClick(r, c) : () => {}}
          >
            <div className="textbox">
              {str}
            </div>
          </button>
        )))}
        <div id="loading-overlay"><div className="spinner" /></div>
      </div>

      <div id="notifications">
          {notification?.msg}
      </div>
    </div>
  )
}

export default Game