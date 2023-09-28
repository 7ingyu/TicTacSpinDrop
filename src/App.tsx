import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import Login from '@/components/Login'
import Game from '@/components/Game'

const App = () => {

  const [ name, setName ] = useState<string>('a')
  const [ nameSaved, setNameSaved ] = useState<boolean>(true)

  return (
    <>
      <header>
        <h1>Tic Tac Toe</h1>
      </header>
      <main>
        {!nameSaved ? (
          <Login
            name={name}
            setName={setName}
            handleSubmit={() => setNameSaved(true)}
          />
        ) : (
          <Game name={name} />
        )}
      </main>
    </>
  )
}

export default App
