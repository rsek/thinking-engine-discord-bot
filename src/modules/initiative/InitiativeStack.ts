import { ButtonBuilder } from "discord.js";
import _ from "lodash";
import weighted from "weighted";
import buildAddTokenMenu from "./buildAddTokenMenu.js";
import buildRemoveTokenMenu from "./buildRemoveTokenMenu.js";
import { NumericAttrHash, fieldsToNumericAttrHash, NumericAttrFieldData, numericAttrHashToFields, maxKeyName, currentKeyName } from "../ux/NumericAttrHash.js";
import { roundPattern, turnPattern } from "./InitiativeDisplay.js";
import { endOfRoundToken, enemyToken, henchmanToken, tokenFactionsLeft } from "./initiativeTokens.js";
import { IRendersButton, IRendersEmbed, IRendersMessage, IRendersSelectMenu } from "../attributes/IRenders.js";
import NumericAttribute from "../attributes/NumericAttribute.js";
import buildReturnTokenMenu from "./buildReturnTokenMenu.js";
import WithRequired from "../../types/WithRequired.js";
import WidgetOptions from "./WidgetOptions.js";
import InitiativeTask from "../../interactions/tasks/InitiativeTask.js";
import { WidgetType } from "../parseComponent/WidgetType.js";
import splitCamelCase from "../text/splitCamelCase.js";
import buildWidgetStub from "../rolls/buildWidgetStub.js";
import { APIEmbed } from "discord-api-types/v10";
import { ActionRowBuilder, EmbedBuilder, MessageActionRowComponentBuilder, SelectMenuBuilder } from "@discordjs/builders";
import { InitiativeAction } from "../parseComponent/ITaskParams.js";

enum TokenMenuType {
  Remove,
  Add,
  Return
}

export default class InitiativeStack implements IRendersMessage, IRendersEmbed, IRendersButton, IRendersSelectMenu {
  static fromEmbed(embed: APIEmbed, resetTokens: boolean = false) {
    // TODO: more robust typeguarding
    const title = embed.title ?? "";
    let round;
    let turn;
    if (embed.footer?.text) {
      const roundString = roundPattern.captures(embed.footer.text)?.counter;
      round = Number(roundString);
      const turnString = turnPattern.captures(embed.footer.text)?.counter;
      turn = Number(turnString);
    }
    const tokenHash = fieldsToNumericAttrHash(...embed.fields as NumericAttrFieldData[]);
    let stack = new InitiativeStack(title, round ?? 0, turn ?? 1, tokenHash);
    if (resetTokens === true) {
      stack = stack.shuffleTokens();
    }
    return stack;
  }
  title: string;
  private _round: number;
  private _turn: number;
  private _tokens: NumericAttrHash = { };
  constructor(title: string, round: number = 1, turn: number = 0, tokens?: NumericAttrHash | undefined) {
    this.title = title;
    this._round = round;
    this._turn = turn;
    if (tokens) {
      this.tokens = tokens;
    }
    if (!this.tokens[endOfRoundToken]) {
      this.addToken(endOfRoundToken);
    }
  }
  public get round(): number {
    return this._round;
  }
  public set round(value: number) {
    this._round = value;
  }
  public get turn(): number {
    return this._turn;
  }
  public set turn(value: number) {
    this._turn = value;
  }
  public get tokens(): NumericAttrHash {
    return this._tokens;
  }
  public set tokens(value: NumericAttrHash) {
    this._tokens = _.omitBy(value, (tokenValues) => tokenValues[maxKeyName] === 0);
  }
  addToken(token: string, amount: number = 1) {
    if (!this.tokens[token]) {
      this.tokens[token] = new NumericAttribute(token, amount, amount);
    } else {
      this.tokens[token][maxKeyName] += amount;
      this.tokens[token][currentKeyName] += amount;
    }
  }
  shuffleTokens() {
    this.tokens = _.mapValues(this.tokens, (value) => {
      value[currentKeyName] = value[maxKeyName];
      return value;
    });
    return this;
  }
  endRound() {
    // console.log("End of round. Resetting tokens and incrementing round counter.");
    this.tokens = this.shuffleTokens().tokens;
    this.round++;
    return this;
  }
  drawToken() {
    const currentWeights = _.mapValues(this.tokens, (value) => value[currentKeyName]);
    // console.log("tokens left:", this.tokens);
    const token: keyof typeof this.tokens = weighted.select(currentWeights);
    // console.log("drew token:", token);
    this._tokens[token][currentKeyName]--;
    // console.log("tokens left after decrement:", this.tokens);
    if (token === endOfRoundToken) {
      this.endRound();
    } else {
      this.turn++;
    }
    return { token, stack: this };
  }
  toSelectMenu(type: TokenMenuType): SelectMenuBuilder {
    const menu = new SelectMenuBuilder();
    switch (type) {
      case TokenMenuType.Remove:
        return buildRemoveTokenMenu(this.tokens);
        break;
      case TokenMenuType.Add:
        return buildAddTokenMenu();
        break;
      case TokenMenuType.Return:
        return buildReturnTokenMenu(this.tokens);
        break;
      default:
        break;
    }
    return menu;
  }
  toButton(): ButtonBuilder {
    const button = InitiativeTask.createButton(InitiativeAction.Draw);
    if (tokenFactionsLeft(this.tokens) < 2) {
      button.setDisabled(true);
    }
    return button;
  }
  toRoundString() {
    return InitiativeTask.roundString(this.turn, this.round);
  }
  toEmbed(): EmbedBuilder {
    const embedDescription = `${_.sum(Object.values(this.tokens).map(item => item[currentKeyName]))} tokens remain in the stack.`;
    const embed = buildWidgetStub(WidgetType.InitiativeStack, this.title)
      .setDescription(embedDescription)
      .setFooter({
        text: this.toRoundString()
      });
    const sortOrder = [ henchmanToken, enemyToken, endOfRoundToken ];
    embed.addFields(...numericAttrHashToFields(this.tokens,true).sort((fieldA,fieldB) => sortOrder.findIndex(item => item === fieldA.name) - sortOrder.findIndex(item => item === fieldB.name)));
    return embed;
  }
  toMessage() {
    const components: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [
      new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(this.toSelectMenu(TokenMenuType.Add)),
      new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(this.toSelectMenu(TokenMenuType.Remove)),
    ];
    if (_.some(this.tokens, (value) => value.current < value.max)) {
      components.push(new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(this.toSelectMenu(TokenMenuType.Return)));
    }
    components.push(
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents(this.toButton())
    );
    const message = {
      embeds: [
        this.toEmbed()
      ],
      components
    };

    return message as WithRequired<WidgetOptions, "embeds"|"components">;
  }
}

