import _ from "lodash";
import { BotTask, IBotTasksParams } from "./BotTask.js";
import rehydrateNumbers from "./rehydrateNumbers.js";

export function packParams<T extends BotTask>(
  task: T,
  params: IBotTasksParams[T]
) {
  // TODO:
  // throw if result exceeds 100 chars
  // exclude 'false' or default results? hmm

  const paramsObj = { [task]: params };
  // const serializedAsBuffer = encode(paramsObj);
  // return serializedAsBuffer.toString(encoding);
  return JSON.stringify(paramsObj);
}

export type TaskMissingParam<T extends BotTask = BotTask> = Record<T, keyof IBotTasksParams[T]>;

export function packMissingParam<T extends BotTask>(task: T, key: (keyof IBotTasksParams[T])) {
  const paramsObj = { [task]: key };
  // const serializedAsBuffer = encode(paramsObj);
  // return serializedAsBuffer.toString(encoding);
  return JSON.stringify(paramsObj);
}

export function unpackMissingParam<T extends BotTask = BotTask>(params: string) {
  console.log("incoming missing params", params);
  // const deserializedAsBuffer = Buffer.from(params, encoding);
  // const paramsObj = decode(deserializedAsBuffer) as TaskMissingParam<T>;
  const paramsObj = JSON.parse(params) as  TaskMissingParam<T>;
  return paramsObj;
}

// export function constructMissingParam(params: string, value: string) {
//   console.log("reconstructing params with value", params, value);
//   const missingParamData = unpackMissingParam(params);
//   let result: Partial<IBotTasksParams> = {}
//   _.forEach(missingParamData, (paramKey, taskIdString) => {
//     const taskId = taskIdString as BotTask;
//     result = Object.assign(result, ({[taskId]: { [paramKey]: value }}));
//   })
//   return result;
// }

export function packPartialParams<T extends BotTask = BotTask>(
  task: T,
  params: Partial<IBotTasksParams[T]>
) {
  const paramsObj = { [task]: params };

  // TODO:
  // throw if result exceeds 100 chars
  // exclude 'false' or default results? hmm

  // const serializedAsBuffer = encode(paramsObj);
  // return serializedAsBuffer.toString(encoding);
  return JSON.stringify(paramsObj);
}

export function unpackParams(params: string) {
  console.log("incoming params", params);
  // TODO:
  // throw if doesn't decode to json.
  // const deserializedAsBuffer = Buffer.from(params, encoding);
  // let paramsObj = decode(deserializedAsBuffer) as Record<string,string|number>;
  // let paramsObj = JSON.parse(params) as Record<string,string|number>;
  // paramsObj = rehydrateNumbers(paramsObj);
  const paramsObj = JSON.parse(params) as Partial<IBotTasksParams>;
  return paramsObj;
}