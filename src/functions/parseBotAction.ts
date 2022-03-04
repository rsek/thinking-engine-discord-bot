// parses a custom id or other component value in to a bot action

import _ from "lodash";
import { TypedRegEx } from "typed-regex";

export const actionSeparator = ":";
export const paramSeparator = "|";
export const paramSeparatorEscaped = _.escapeRegExp(paramSeparator);
export const botActionPattern = TypedRegEx(`^(?<action>([^(${actionSeparator})]+)):?(?<params>.*)?$`);

export interface BotActionOptions {
  action: string,
  [key: string]: string | number,
}

function botActionRegexString(options: BotActionOptions) {
  let actionString = `^(?<action>${options.action})`;
  if (Object.keys(options).length > 1) {
    actionString += ":";
    const paramsStrings: string[] = [];
    _.forEach(options, (value,key) => {
      if (key != "action")
      {
        const regexByType = typeof value == "string" ? ".+" : "[0-9]+";
        const newString = `(?<${key}>${regexByType})`;
        paramsStrings.push(newString);
      }
    });
    actionString += paramsStrings.join(_.escapeRegExp(paramSeparator));
  }
  actionString += "$";
  return actionString;
}

export function botActionRegex(options: BotActionOptions) {
  return new RegExp(botActionRegexString(options))
}

export function botActionRegexTyped(options: BotActionOptions) {
  return TypedRegEx(botActionRegexString(options))
}

export default function parseBotAction(customId: string) {
  if (!botActionPattern.isMatch(customId)) {
    throw new RangeError(`Unable to parse bot action from customId: ${customId}`);
  }
  const capture = botActionPattern.captures(customId);
  const result = {
    action: capture?.action,
    params: undefined as string[] | undefined,
  };
  if (capture?.params) {
    result.params = capture.params.split(paramSeparator);
  }
  return result;
}