import { getPlayers } from "."
import type { PrivateGameData, PublicGameData, MovedData } from "../../../types"

const clean = (gameData: PrivateGameData, session_id: string)
: [PublicGameData, PublicGameData] | [MovedData, MovedData] => {

  const { player_a, player_b, ...data } = gameData
  const [ player, opponent ] = getPlayers(gameData, session_id)

  // Pull out session_id info
  const {session_id: player_session_id, ...cleanPlayer} = player
  const {session_id: opponent_session_id, ...cleanOpponent} = opponent

  // Form clean data
  const playerRes = {...data, player, opponent: cleanOpponent}
  const opponentRes = {...data, player: opponent, opponent: cleanPlayer}

  return [
    playerRes,
    opponentRes
  ]
}

export default clean