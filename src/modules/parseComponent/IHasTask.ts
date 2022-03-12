import PartialBy from "../../types/PartialBy.js";
import { BotTask, IBotTasksParams } from "./BotTask.js";

export interface IHasTask<T extends BotTask> {
  getTaskString(params: PartialBy<IBotTasksParams[T], string>): string;
}
