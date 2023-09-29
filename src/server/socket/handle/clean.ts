import type { PrivateGameData, PublicGameData, MovedData } from "../../../types"

const clean = (gameData: PrivateGameData, player_id: string)
: [PublicGameData, PublicGameData] | [MovedData, MovedData] => {
  const { player_a, player_b, ...data } = gameData
  const player = player_a.socket === player_id ? player_a : player_b
  const opponent = player_a.socket === player_id ? player_b : player_a

  const {socket: player_socket, ...cleanPlayer} = player
  const {socket: opponent_socket, ...cleanOpponent} = opponent
  const playerRes = {...data, player, opponent: cleanOpponent}
  const opponentRes = {...data, player: opponent, opponent: cleanPlayer}

  return [
    playerRes,
    opponentRes
  ]
}

export default clean