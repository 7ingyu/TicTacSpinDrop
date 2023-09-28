import { useEffect, useState } from "react"

interface LoginProps {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: () => void
}

function Login ({ name, setName, handleSubmit }: LoginProps) {

  const [ loading, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('tictac:player-reg-ok', ({ msg }) => {
        console.log(msg)
        handleSubmit()
      })
      import.meta.hot.on('tictac:player-reg-fail', ({ error }) => {
        setError(error)
      })
      setLoading(false)
    }
  }, [handleSubmit])

  const handleEnter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!import.meta.hot) return
    import.meta.hot.send('tictac:new-player', { name })
    setLoading(true)
  }

  return (
    <form id="nameinput" onSubmit={handleEnter}>
      <label htmlFor="playername">Your Name: </label>
      <input
        type="text"
        id="playername"
        name="playername"
        value={name}
        onChange={e => setName(e.target.value)}
        aria-invalid={!!error}
        aria-describedby="playername-input"
      />
      <button id="namesubmit" disabled={loading}>Submit</button>
      <div id="playername-input">{error}</div>
    </form>
  )
}

  export default Login


