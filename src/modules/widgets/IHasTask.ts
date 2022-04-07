import type { IBotTasksParams } from "../tasks/BotTask.js";
import type { BotTask } from "../tasks/BotTask.js";
import type { packTaskParams } from "../tasks/packTaskParams.js";


export default interface IHasTask<T extends BotTask> {
  botTask: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toTaskParams(...args: any[]): IBotTasksParams[T];
  packTaskParams(...args: Parameters<this["toTaskParams"]>): ReturnType<typeof packTaskParams>;
}
