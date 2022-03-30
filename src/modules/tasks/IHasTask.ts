import type { BotTask, IBotTasksParams } from "./BotTask.js";
import type PartialBy from "../../types/PartialBy.js";

export interface IHasTask<T extends BotTask> {
  packTaskParams(params: PartialBy<IBotTasksParams[T], string>): string;
}
