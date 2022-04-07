import { BotTask } from "../tasks/BotTask.js";
import type { InitiativeAction } from "../tasks/ITaskParams.js";
import { packTaskParams } from "../tasks/packTaskParams.js";

/**
 * Shorthand for packing initiative task parameters.
 * @param initiativeAction The initiative action to pack parameters for.
 * @returns The packed task string.
 */
export default function packInitiativeParams<T extends InitiativeAction>(initiativeAction: T) {
  return packTaskParams(BotTask.Initiative, { action: initiativeAction });
}