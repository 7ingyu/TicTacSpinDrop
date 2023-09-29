import { playerData, privateGameData } from "../../types/socket";

const x = '\u2573';
const o = '\u25EF';

const queue: { name: string, socket: string }[] = []
const players: { [key: string]: playerData } = {}
const games: { [key: string]: privateGameData } = {}

export { x, o, queue, players, games }