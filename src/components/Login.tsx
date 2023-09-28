interface LoginProps {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: () => void
}

function Login ({ name, setName, handleSubmit }: LoginProps) {
  return (
    <div id="nameinput">
      <label htmlFor="playername">Your Name: </label>
      <input
        type="text"
        id="playername"
        name="playername"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button id="namesubmit" onClick={handleSubmit}>Submit</button>
    </div>
  )
}

  export default Login


