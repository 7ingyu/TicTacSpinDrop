import { useEffect, useState } from 'react'
import { Login, Game } from '@/client/components'
import { playerDataShape, publicGameData } from '@/types'
import { socket } from '@/client/socket';

const App = () => {

  const [ name, setName ] = useState<string>('')
  const [ nameSaved, setNameSaved ] = useState<boolean>(false)
  const [ playerId, setPlayerId ] = useState<string>('')
  const [ gameData, setGameData ] = useState<publicGameData | null>(null)

  useEffect(() => {
    const onConnect = () => {
      // console.log('socket connected')
      if (!playerId) {
        setPlayerId(socket.id)
      }
      socket.emit('join', { name })
    }
    const onNewGame = (data: publicGameData) => {
      // console.log('newGame')
      setGameData(data)
    }
    const onOpponentDisconnect = (data: playerDataShape) => {
      // console.log(data)
      setGameData(null)
    }
    const onDisconnect = (reason: string) => {
      // console.log('disconnect:', reason)
      // console.log('app reset')
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        setNameSaved(false)
        setGameData(null)
      }
    }

    socket.on('connect', onConnect)
    socket.on('new-game', onNewGame)
    socket.on('opponent-disconnect', onOpponentDisconnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('new-game', onNewGame)
      socket.off('opponent-disconnect', onOpponentDisconnect)
      socket.off('disconnect', onDisconnect)

    };
  }, [nameSaved, name])


  return (
    <>
      <header>
        <h1>Tic Tac Toe</h1>
      </header>
      <main>
        {!nameSaved && <Login
          name={name}
          setName={setName}
          handleSubmit={() => setNameSaved(true)}
        />}
        {!gameData && !!nameSaved && (
          <div>Finding match...</div>
        )}
        {!!gameData && !!nameSaved && <Game { ...gameData} playerId={playerId} />}
      </main>
    </>
  )
}

export default App
