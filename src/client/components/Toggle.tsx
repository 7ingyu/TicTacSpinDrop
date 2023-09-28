interface ToggleProps {
  label: string
  toggle: boolean
  setToggle: React.Dispatch<React.SetStateAction<boolean>>
  left?: string
  right?: string
}

const Toggle = ({ label, toggle, setToggle, left = '', right = '' }: ToggleProps) => (
  <div className="toggle-box">
    <label htmlFor={label.split(' ').join().toLowerCase() + '-toggle'}>{label}</label>
    <div
      className={`${toggle ? 'toggle--checked ' : ''}toggle`}
      onClick={() => setToggle(!toggle)}
    >
      <div className="toggle-container">
          <div className="toggle-check">
              <span>{left}</span>
          </div>
          <div className="toggle-uncheck">
              <span>{right}</span>
          </div>
      </div>
      <div className="toggle-circle"></div>
      <input id={label.split(' ').join().toLowerCase() + '-toggle'} className="toggle-input" type="checkbox" />
    </div>
  </div>
)

export default Toggle