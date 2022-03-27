import { BotTask, IBotTasksParams } from "./BotTask.js";

export function packParams<T extends BotTask>(
  task: T,
  params: IBotTasksParams[T]
) {
  const paramsObj = { [task]: params };
  return JSON.stringify(paramsObj);
}

export type TaskMissingParam<T extends BotTask = BotTask> = Record<T, keyof IBotTasksParams[T]>;

export function packMissingParam<T extends BotTask>(task: T, key: (keyof IBotTasksParams[T])) {
  const paramsObj = { [task]: key };
  return JSON.stringify(paramsObj);
}

export function unpackMissingParam<T extends BotTask = BotTask>(params: string) {
  const paramsObj = JSON.parse(params) as  TaskMissingParam<T>;
  return paramsObj;
}

export function packPartialParams<T extends BotTask = BotTask>(
  task: T,
  params: Partial<IBotTasksParams[T]>
) {
  const paramsObj = { [task]: params };
  return JSON.stringify(paramsObj);
}

export function unpackParams(params: string) {
  const paramsObj = JSON.parse(params) as Partial<IBotTasksParams>;
  return paramsObj;
}