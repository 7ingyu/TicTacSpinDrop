import playerDataShape from "../types/playerData";

enum NotificationActionKind {
  GO = 'go',
  WAIT = 'wait',
  WIN = 'win',
  LOSE = 'lose',
  TIE = 'tie',
  TRANSITION = 'transition'
}

// An interface for our state
export interface NotificationState extends playerDataShape {
  msg: string;
}

const notificationReducer
  = (state: NotificationState, action: NotificationActionKind)
  : NotificationState => {
  // console.log(action)
  switch (action) {
    case NotificationActionKind.GO:
      return {...state, msg: "Your turn!"}
    case NotificationActionKind.WAIT:
      return {...state, msg: `${state.opponent?.name || 'Opponent'}'s turn: Please wait.`}
    case NotificationActionKind.WIN:
      return {...state, msg: 'You win!'}
    case NotificationActionKind.LOSE:
      return {...state, msg: 'You lose.'}
    case NotificationActionKind.TIE:
      return {...state, msg: "It's a tie!"}
    case NotificationActionKind.TRANSITION:
      return {...state, msg: ''}
  }
}

export { NotificationActionKind, notificationReducer }