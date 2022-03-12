import { BotTask } from "../parseComponent/BotTask.js";
import { packParams } from "../parseComponent/packParams.js";

export default interface IHasTask<T extends BotTask> {
  getTaskString<T>(...args: any[]): ReturnType<typeof packParams>
}