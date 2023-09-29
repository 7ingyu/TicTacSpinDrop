import { privateGameData } from "../../../types"

const clean = (gameData: privateGameData, player_id: string) => {
  const { id, next, board, player_a, player_b } = gameData
  const player = player_a.socket === player_id ? player_a : player_b
  const opponent = player_a.socket === player_id ? player_b : player_a
  const data = {
    id, next, board
  }

  return [
    {...data, player, opponent: {...opponent, socket: null}},
    {...data, player: opponent, opponent: {...player, socket: null}}
  ]
}

export default clean