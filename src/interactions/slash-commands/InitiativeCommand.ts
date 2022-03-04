import "reflect-metadata";
import { ButtonComponent, Discord, SelectMenuComponent, Slash, SlashOption} from "discordx";
import { ButtonInteraction, CommandInteraction, InteractionReplyOptions, Message, MessageActionRow, MessageEditOptions, MessageEmbed, SelectMenuInteraction } from "discord.js";
import InitiativeStack from "../../modules/initiative/InitiativeStack.js";
import _ from "lodash";
import {  } from "../components/incrementFieldOption.js";
import botEmbedType from "../../constants/embedType.js";
import { endOfRoundToken, enemyToken, henchmanToken } from "../../modules/initiative/initiativeTokens.js";
import { currentKeyName, CurrentMaxHash, maxKeyName } from "../../modules/initiative/currentMax.js";
import { pcTokenValue } from "../../modules/initiative/initiativeTokens.js";
import parseBotAction from "../../functions/parseBotAction.js";
import incrementField, { incrementFieldId } from "../../functions/incrementField.js";
import { addTokenMenuId } from "../../modules/initiative/buildAddTokenMenu.js";
import { removeTokenMenuId } from "../../modules/initiative/buildRemoveTokenMenu.js";


// TODO: descriptions for options
@Discord()
export default abstract class InitiativeCommand {
  @Slash("initiative", {description: "Create an interactive initiative token stack."})
  async Initiative(
    @SlashOption("title", { type: "STRING"})
      title: string,
    @SlashOption("enemy-tokens", {
      type: "INTEGER",
      minValue: 1
    })
      enemyTokens: number,
    @SlashOption("character1", {type: "STRING"})
      character1: string,
    @SlashOption("character2", {type: "STRING", required: false})
      character2: string = "",
    @SlashOption("character3", {type: "STRING", required: false})
    character3: string = "",
    @SlashOption("character4", {type: "STRING", required: false})
    character4: string = "",
    @SlashOption("character5", {type: "STRING", required: false})
    character5: string = "",
    @SlashOption("character6", {type: "STRING", required: false})
    character6: string = "",
    @SlashOption("character7", {type: "STRING", required: false})
    character7: string = "",
    @SlashOption("character8", {type: "STRING", required: false})
    character8: string = "",
    @SlashOption("henchman-tokens", {type: "INTEGER",minValue: 0, required: false})
    henchmanTokens: number = 0,
    interaction: CommandInteraction
  ): Promise<void> {
    const tokens: CurrentMaxHash = { };
    const characters = _.compact([character1, character2, character3, character4, character5, character6, character7, character8]);
    characters.forEach(character => tokens[character] = {[currentKeyName]: pcTokenValue, [maxKeyName]: pcTokenValue});
    if (henchmanTokens > 0) {
      tokens[henchmanToken] = {
        [currentKeyName]: henchmanTokens,
        [maxKeyName]: henchmanTokens
      };
    }
    tokens[enemyToken] = {
      [currentKeyName]: enemyTokens,
      [maxKeyName]: enemyTokens
    }
    // end of round as added by constructor
    const initiative = new InitiativeStack(title, 1, 1, tokens);
    await interaction.reply(initiative.toMessage());
  }
  @ButtonComponent("token-draw")
  async drawToken(interaction: ButtonInteraction) {
    const msg = interaction.message as Message;
    const embeds = msg.embeds;
    const targetIndex = embeds.findIndex(embed => embed.author?.name == botEmbedType.InitiativeStack);
    const targetEmbed = embeds[targetIndex];
    const stack = InitiativeStack.fromEmbed(targetEmbed);
    const draw = stack.drawToken();
    const newToken = draw.token;
    const newStack = draw.stack;
    let followUpMsg = newToken ? `Drew initiative token: **${newToken}**` : "Error: no tokens to draw!";
    if (newToken == endOfRoundToken) {
      followUpMsg += `\n\nTokens have been reshuffled. Round ${newStack.round} begins.`
    } else {
      followUpMsg += ` Turn ${newStack.turn} begins.`
    }
    await interaction.update(newStack.toMessage());
    await interaction.followUp(followUpMsg);
  }
  @SelectMenuComponent(new RegExp(`(${removeTokenMenuId}|${addTokenMenuId})`))
  async initiativeTokenMenu(interaction: SelectMenuInteraction) {
    const value = interaction.values[0];
    console.log("recevied value", value);
    const actionData = parseBotAction(value);
    const msg = interaction.message as Message;
    const embeds = msg.embeds;
    const targetIndex = embeds.findIndex(embed => embed.author?.name == botEmbedType.InitiativeStack);
    const targetEmbed = embeds[targetIndex];
    // TODO: revisit when doing arbitrary round/turn counters. this will probably mean using a InitiativeStack.fromMessage() method so that
    switch (actionData.action) {
      case incrementFieldId :{
        // TODO: genericize parsing this to a function
        const incrementCurrent = Number(actionData.params?.[0]);
        const incrementMax = Number(actionData.params?.[1]);
        const fieldName = actionData.params?.[2] as string;
        const newEmbed = incrementField(targetEmbed, fieldName, incrementCurrent, incrementMax, true);
        console.log("regenerated embed", newEmbed)
        // the menu needs to be updated too, so we just regenerate the whole message
        const newStack = InitiativeStack.fromEmbed(newEmbed);
        await interaction.update(newStack.toMessage());
        break;
      }
      default:
        break;
    }

    return;
  }
}