import { BotTask } from "../tasks/BotTask.js";
import { InitiativeAction } from "../tasks/ITaskParams.js";
import { packParams } from "../tasks/packParams.js";


export default function packInitiativeParams<T extends InitiativeAction>(tokenStackAction: T) {
  return packParams(BotTask.Initiative, { action: tokenStackAction });
}