import type { PrivateGameData } from "../../../types"

const getPlayers = (gameData: PrivateGameData, player_session_id: string) => {
  const { player_a, player_b } = gameData
  const player = player_a.session_id === player_session_id ? player_a : player_b
  const opponent = player_a.session_id === player_session_id ? player_b : player_a

  return [
    player,
    opponent
  ]
}

export default getPlayers