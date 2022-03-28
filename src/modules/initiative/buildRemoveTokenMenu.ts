import _ from "lodash-es";
import { NumericAttrHash, currentKeyName } from "../attributes/NumericAttrConstants.js";
import { isPlayerToken } from "./initiativeTokens.js";
import numberEmoji from "../../constants/numberEmoji.js";
import getTaskMenuStub from "../tasks/getTaskMenuStub.js";
import { endOfRoundToken, pcTokenValue, henchmanToken, enemyToken, removeTokenMenuId } from "./InitiativeConstants.js";

// TODO: figure out how i'm handling/IDing the menu


/**
 * Generates a token removal menu from a set of tokens
 * @param tokens The tokens to include on the menu.
 * @returns A select menu builder.
 */
export default function buildRemoveTokenMenu(tokens: NumericAttrHash) {
  const menu = getTaskMenuStub(removeTokenMenuId)
    .setPlaceholder("Discard tokens...")
  ;
  _.forEach(tokens, (token) => {
    if (token.current > 0 && token.name !== endOfRoundToken) {
      switch (true) {
        case isPlayerToken(token.name): {
          menu.addOptions(
            token
              .toSelectMenuOption({ current: 0, max: -pcTokenValue })
              .setLabel(`Remove ${token.name} from initiative`)
              .setEmoji({ name: "👤" })
          );
          break;
        }
        case token.name === henchmanToken: {
          menu.addOptions(
            token
              .toSelectMenuOption({ current: 0, max: -1 })
              .setLabel("Remove 1 henchman token from initiative")
              .setEmoji({ name: "👥" })
          );
          break;
        }
        case token.name === enemyToken: {
          const enemyOptions = numberEmoji.slice(1, Math.min(6, token[currentKeyName])).map((emoji, index) => {
            const currentValue = index+1;
            return token
              .toSelectMenuOption({ current: 0, max: -currentValue })
              .setLabel(`Remove ${currentValue} enemy ${currentValue > 1 ? "tokens" : "token"} from the initiative`)
              .setEmoji({ name: emoji as string })
            ;
          });
          menu.addOptions(...enemyOptions);
          break;
        }
        default:
          break;
      }
    }
  });
  return menu;
}