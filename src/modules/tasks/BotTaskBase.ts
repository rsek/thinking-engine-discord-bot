import type { Interaction, Message } from "discord.js";
import type { BotTask, IBotTasksParams } from "./BotTask.js";
import type GameData from "../../data/GameData.js";

export default abstract class BotTaskBase<I extends Interaction, BT extends BotTask> {
  readonly interaction: I;
  readonly gameData: GameData;
  protected _params: IBotTasksParams[BT];
  constructor(interaction: I, params: IBotTasksParams[BT], gameData: GameData) {
    this.interaction = interaction;
    this._params = params;
    this.gameData = gameData;
  }
  public get params(): IBotTasksParams[BT] {
    return this._params;
  }
  public set params(value: IBotTasksParams[BT]) {
    this._params = value;
  }
  abstract run(): Promise<void> | Promise<Message<boolean>>;
}