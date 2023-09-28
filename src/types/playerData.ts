export default interface playerDataShape {
  player: {
    name: string
    symbol: string
  } | null
  opponent: {
    name: string
    symbol: string
  } | null
}