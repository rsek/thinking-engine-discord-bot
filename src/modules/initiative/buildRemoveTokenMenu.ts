import { MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import _ from "lodash";
import { incrementFieldId } from "../../functions/incrementField.js";
import {paramSeparator } from "../../functions/parseBotAction.js";
import { CurrentMaxHash, currentKeyName } from "./currentMax.js";
import { endOfRoundToken, isPlayerToken, pcTokenValue, henchmanToken, enemyToken } from "./initiativeTokens.js";
import numberEmoji from "./numberEmoji.js";

export const removeTokenMenuId = "removeTokenMenu";

export default function buildRemoveTokenMenu(tokens: CurrentMaxHash) {
  const newMenu = new MessageSelectMenu()
    .setCustomId(removeTokenMenuId)
    .setPlaceholder("Remove tokens...")
    .setMaxValues(1)
    .setMinValues(1)
  ;
  const tokenOptions: MessageSelectOptionData[] = [];
  _.forEach(tokens, (tokenValue, token) => {
    if (tokenValue.current > 0 && token != endOfRoundToken) {
      switch (true) {
        case isPlayerToken(token): {
          tokenOptions.push({
            default: false,
            label: `Remove ${token} from initiative`,
            value: `${incrementFieldId}:0${paramSeparator}-${pcTokenValue}${paramSeparator}${token}`,
            emoji: "👤"
          });
          break;
        }
        case token == henchmanToken: {
          tokenOptions.push({
            default: false,
            label: "Remove 1 henchman token",
            value: `${incrementFieldId}:0${paramSeparator}-1${paramSeparator}${henchmanToken}`,
            emoji: "👥"
          });
          break;
        }
        case token == enemyToken: {
          numberEmoji.slice(1,5).forEach((emoji,index) => {
            const currentValue = index+1;
            if (currentValue <= tokenValue[currentKeyName]) {
              tokenOptions.push({
                default: false,
                label: `Remove ${currentValue} enemy ${currentValue > 1 ? "tokens" : "token"}`,
                value: `${incrementFieldId}:0${paramSeparator}-${currentValue}${paramSeparator}${enemyToken}`,
                emoji
              });
            }
          });
          break;
        }
        default:
          break;
      }
    }
  });
  newMenu.addOptions(...tokenOptions);
  return newMenu;
}