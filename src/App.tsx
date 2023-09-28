import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import Login from '@/components/Login'
import Game from '@/components/Game'
import playerDataShape from '@/types/playerData'

const App = () => {

  const [ name, setName ] = useState<string>('')
  const [ nameSaved, setNameSaved ] = useState<boolean>(false)
  const [ playerData, setPlayerData ] = useState<playerDataShape | null>(null)

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('tictac:player-match', (data) => {
        console.log('match found')
        setPlayerData(data)
      })
      import.meta.hot.on('tictac:disconnected', (data) => {
        console.log(data)
        setPlayerData(null)
      })
    }
    if (nameSaved) {
      window.onbeforeunload = () => {
        console.log('disconnect')
        if (import.meta.hot) {
          import.meta.hot.send('tictac:disconnect', { name })
        }
        return null
      }
    }
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
        {!playerData && !!nameSaved && (
          <div>Finding match...</div>
        )}
        {!!playerData && !!nameSaved && <Game {...playerData} />}
      </main>
    </>
  )
}

export default App
