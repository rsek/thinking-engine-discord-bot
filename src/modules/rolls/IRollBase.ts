import type { BotTaskRoll, IBotTasksParams } from "../tasks/BotTask.js";
import type IHasTask from "../widgets/IHasTask";
import type { IRendersButton, IRendersMessage } from "../widgets/IRenders.js";

export interface IRollBaseConstructor<T extends BotTaskRoll> {
  new (params: IBotTasksParams[T], description?: string|undefined): IRollBase<T>;
}


export default interface IRollBase<T extends BotTaskRoll> extends IRendersMessage, IRendersButton, IHasTask<T> {
  botTask: T;
  toTaskParams(isReroll: boolean): IBotTasksParams[T];

}
