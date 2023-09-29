import { PublicGameData } from "@/types";

enum NotificationActionKind {
  GO = 'go',
  WAIT = 'wait',
  WIN = 'win',
  LOSE = 'lose',
  TIE = 'tie',
  TRANSITION = 'transition',
  NEW = 'new'
}

export interface NotificationActionShape {
  type: NotificationActionKind
  next?: string | undefined
}

export interface NotificationState extends Omit<PublicGameData, 'id' | 'next' | 'board'> {
  msg: string;
}

const notificationReducer
  = (state: NotificationState, action: NotificationActionShape )
  : NotificationState => {

  switch (action.type) {
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
    case NotificationActionKind.NEW:
      return {...state, msg: `New game! It's ${action.next === state.player?.symbol
        ? 'your turn!'
        : (state.opponent?.name || 'Opponent') + '\'s turn.'
      }`}
    default:
      return state
  }
}

export { NotificationActionKind, notificationReducer }