import { BotTask } from "../tasks/BotTask.js";
import type { InitiativeAction } from "../tasks/ITaskParams.js";
import { packTaskParams } from "../tasks/packTaskParams.js";


export default function packInitiativeParams<T extends InitiativeAction>(tokenStackAction: T) {
  return packTaskParams(BotTask.Initiative, { action: tokenStackAction });
}