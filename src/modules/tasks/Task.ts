import type { Interaction, Message } from "discord.js";
import type { IBotTasksParams } from "./BotTask.js";
import type GameData from "../../data/GameData.js";
import type ValueOf from "../../types/ValueOf.js";

export default abstract class Task<I extends Interaction, P extends ValueOf<IBotTasksParams>> {
  readonly interaction: I;
  readonly gameData: GameData;
  private _params: P;
  constructor(interaction: I, params: P, gameData: GameData) {
    this.interaction = interaction;
    this._params = params;
    this.gameData = gameData;
  }
  public get params(): P {
    return this._params;
  }
  public set params(value: P) {
    this._params = value;
  }

  abstract run(): Promise<void> | Promise<Message<boolean>>;
}