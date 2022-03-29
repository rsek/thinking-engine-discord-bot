import type { BotTask } from "../tasks/BotTask.js";
import type { packParams } from "../tasks/packParams.js";

export default interface IHasTask<T extends BotTask> {
  getTaskString<T>(...args: any[]): ReturnType<typeof packParams>
}