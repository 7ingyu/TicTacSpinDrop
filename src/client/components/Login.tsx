import { useEffect, useState } from "react"
import { socket } from '@/client/socket';

interface LoginProps {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: () => void
}

function Login ({ name, setName, handleSubmit }: LoginProps) {

  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')

  useEffect(() => {
    // const onRegSuccess = (_, res) => {
    //   console.log('reg success')
    //   handleSubmit()
    //   setLoading(false)
    //   res("ack")
    // }
    // const onRegFail = ({ error }) => {
    //   setError(error)
    //   setLoading(false)
    // }
    const onConnect = () => {
      console.log('reg success')
      handleSubmit()
      setLoading(false)
    }
    // socket.on('reg-success', onRegSuccess)
    // socket.on('reg-fail', onRegFail)
    socket.on('connect', onConnect)

    return () => {
      // socket.off('reg-success', onRegSuccess)
      // socket.off('reg-fail', onRegFail)
      socket.off('connect', onConnect)
    };
  }, [handleSubmit])

  const handleEnter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('connecting...')
    socket.connect()
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