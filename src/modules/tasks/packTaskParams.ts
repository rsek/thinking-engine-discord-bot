import type { BotTask, IBotTasksParams } from "./BotTask.js";

/**
 * It takes a task and its parameters and packs them into a JSON string.
 * @param {T} task - The name of the task to run.
 * @param params - The task parameters to be packed.
 * @returns A stringified object with the task name as the key and the parameters as the value.
 */
export function packTaskParams<T extends BotTask>(
  task: T,
  params: IBotTasksParams[T]
) {
  const paramsObj = { [task]: params };
  return JSON.stringify(paramsObj);
}

export type OmittedTaskParam<T extends BotTask = BotTask> = Record<T, keyof IBotTasksParams[T]>;

export function packOmittedParam<T extends BotTask>(task: T, key: (keyof IBotTasksParams[T])) {
  const paramsObj = { [task]: key };
  return JSON.stringify(paramsObj);
}

export function unpackOmittedParam<T extends BotTask = BotTask>(params: string) {
  const paramsObj = JSON.parse(params) as  OmittedTaskParam<T>;
  return paramsObj;
}

export function packPartialTaskParams<T extends BotTask = BotTask>(
  task: T,
  params: Partial<IBotTasksParams[T]>
) {
  const paramsObj = { [task]: params };
  return JSON.stringify(paramsObj);
}

/**
 * It unpacks the task parameters from the packed version that is stored in a message component.
 * @param packedTaskParams - The packed task parameters.
 * @returns The `unpackTaskParams` function returns a `Partial<IBotTasksParams>` object.
 */
export function unpackTaskParams(packedTaskParams: ReturnType<typeof packTaskParams>) {
  const params = JSON.parse(packedTaskParams) as Partial<IBotTasksParams>;
  return params;
}