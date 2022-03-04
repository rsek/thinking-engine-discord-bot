import { MessageActionRow, MessageButton, MessageEmbed, MessageOptions } from "discord.js";
import _ from "lodash";
import weighted from "weighted";
import buildAddTokenMenu from "./buildAddTokenMenu.js";
import buildRemoveTokenMenu from "./buildRemoveTokenMenu.js";
import { CurrentMaxHash, fieldsToCurrentMaxHash, CurrentMaxFieldData, currentMaxHashToFields, maxKeyName, currentKeyName } from "./currentMax.js";
import { roundPattern, turnPattern, roundPrefix, turnPrefix } from "./InitiativeDisplay.js";
import { endOfRoundToken, tokenFactionsLeft } from "./initiativeTokens.js";


export default class InitiativeStack {
  static fromEmbed(embed: MessageEmbed, resetTokens: boolean = false) {
    // TODO: more robust typeguarding
    const title = embed.title;
    let round;
    let turn;
    if (embed.footer?.text) {
      const roundString = roundPattern.captures(embed.footer.text)?.counter;
      round = Number(roundString);
      const turnString = turnPattern.captures(embed.footer.text)?.counter;
      turn = Number(turnString);
    }
    const tokenHash = fieldsToCurrentMaxHash(...embed.fields as CurrentMaxFieldData[]);
    let stack = new InitiativeStack(title, round, turn, tokenHash);
    if (resetTokens === true) {
      stack = stack.shuffleTokens();
    }
    return stack;
  }
  title: string | null;
  private _round: number;
  private _turn: number;
  private _tokens: CurrentMaxHash = { };
  constructor(title: string | null, round: number = 1, turn: number = 1, tokens: CurrentMaxHash) {
    this.title = title;
    this._round = round;
    this._turn = turn;
    this.tokens = tokens;
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
  public get tokens(): CurrentMaxHash {
    return this._tokens;
  }
  public set tokens(value: CurrentMaxHash) {
    this._tokens = _.omitBy(value, (tokenValues, token) => tokenValues.max == 0);
  }
  addToken(token: string, amount: number = 1) {
    if (!this.tokens[token]) {
      this.tokens[token] = {
        [maxKeyName]: amount,
        [currentKeyName]: amount
      }
    } else {
      this.tokens[token].max += amount;
      this.tokens[token].current += amount;
    }
  }
  shuffleTokens() {
    this.tokens = _.mapValues(this.tokens, (value) => {
      value.current = value.max;
      return value;
    });
    return this;
  }
  endRound() {
    console.log("End of round. Resetting tokens and incrementing round counter.");
    this.tokens = this.shuffleTokens().tokens;
    this.round++;
    return this;
  }
  drawToken() {
    const currentWeights = _.mapValues(this._tokens, (value) => value.current);
    console.log("tokens left:", this.tokens);
    const token: keyof typeof this.tokens = weighted.select(currentWeights);
    console.log("drew token:", token);
    this._tokens[token].current--;
    console.log("tokens left after decrement:", this.tokens);
    if (token == endOfRoundToken) {
      this.endRound();
    } else {
      this.turn++;
    }
    return {token, stack: this};
  }
  getRemoveTokenMenu() {
    return buildRemoveTokenMenu(this.tokens);
  }
  getAddTokenMenu() {
    return buildAddTokenMenu();
  }
  getComponents(): MessageActionRow[] {
    const drawTokenButton = new MessageButton()
      .setCustomId("token-draw")
      .setLabel("Draw token")
      .setStyle("PRIMARY")
      ;
    if (tokenFactionsLeft(this.tokens) < 2) {
      drawTokenButton.setDisabled(true);
    }
    return [
      new MessageActionRow({components: [this.getAddTokenMenu()]}),
      new MessageActionRow({components: [this.getRemoveTokenMenu()]}),
      new MessageActionRow({components: [drawTokenButton]})
    ]
  }
  toEmbed(): MessageEmbed {
    const embed = new MessageEmbed()
      .setAuthor({name: "Initiative Stack"})
      ;
    if (this.title) {
      embed.setTitle(this.title);
    }
    embed.addFields(...currentMaxHashToFields(this.tokens,true));
    embed.setDescription(`${_.sum(Object.values(this.tokens).map(item => item.current))} tokens remain in the stack.`);
    embed.setFooter({
      text: `${roundPrefix}${this.round.toString()}, ${turnPrefix}${this.turn.toString()}`
    });
    return embed;
  }
  toMessage(): MessageOptions {
    return {
      embeds: [this.toEmbed()],
      components: this.getComponents()
    };
  }
}