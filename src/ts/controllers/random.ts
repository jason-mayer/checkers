import Board from "../board";
import Controller, { Difficulty } from "../controller";
import Team, { Move } from "../team";

export class RandomController implements Controller {
    name: string = "Random Moves";
    difficulty: Difficulty = Difficulty.veryEasy;
    description: string = "Plays random moves.";

    async pickMove(moves: Move[], _board: Board, _us: Team): Promise<number> {
        return Math.floor(Math.random() * moves.length)
    }
}