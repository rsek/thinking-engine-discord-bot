import type { ButtonBuilder, EmbedField, InteractionReplyOptions } from "discord.js";
import _ from "lodash-es";
import type IRollBase from "./IRollBase.js";
import OpponentRoll from "./OpponentRoll.js";
import { BotTask } from "../tasks/BotTask.js";
import type { IRollVersusTaskParams } from "../tasks/ITaskParams.js";
import buildWidgetStub from "../widgets/buildWidgetStub.js";
import type IHasWidget from "../widgets/IHasWidget.js";
import type { IRendersEmbed } from "../widgets/IRenders.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";
import { WidgetType } from "../widgets/WidgetType.js";

export interface IRollVersus {
  opponents: Record<string, OpponentRoll>;
  description?: string | undefined;
  getWinner: () => OpponentRoll | null | undefined;
  isTied: () => boolean;
  toResultField: () => EmbedField;
}

export default class RollVersus implements IRollBase<BotTask.RollVersus>, IHasWidget<WidgetType.RollVersus>, IRollVersus, IRendersEmbed {
  opponents: Record<string, OpponentRoll> = {};
  description?: string | undefined;
  title: string;
  readonly botTask = BotTask.RollVersus;
  readonly widgetType = WidgetType.RollVersus;
  constructor(opponent1bonus: number, opponent2bonus: number, opponent1name="Player", opponent2name = "Opponent", description?: string, title?: string) {
    if (opponent1name === opponent2name) {
      opponent1name += " 1";
      opponent2name += " 2";
    }
    this.opponents[opponent1name] = new OpponentRoll(opponent1name, opponent1bonus);
    this.opponents[opponent2name] = new OpponentRoll(opponent2name, opponent2bonus);

    this.description = description;
    this.title = title ?? Object.keys(this.opponents).join(" vs. ");
  }


  toTaskParams(isReroll: boolean): IRollVersusTaskParams {
    throw new Error("Method not implemented.");
  }
  toMessage(...args: any[]): WidgetOptions<InteractionReplyOptions> {
    throw new Error("Method not implemented.");
  }
  toButton(...args: any[]): ButtonBuilder {
    throw new Error("Method not implemented.");
  }
  packTaskParams(...args: Parameters<this["toTaskParams"]>): string {
    throw new Error("Method not implemented.");
  }

  getWinner() {
    if (this.isTied() === true) {
      return null;
    } else {
      return _.reduce(this.opponents, (prev,curr) => prev > curr ? prev : curr);
    }
  }
  isTied(): boolean {
    const opponents = Object.values(this.opponents).map(item => item.valueOf()) as [number, number];
    return _.isEqual(...opponents);
  }
  toResultField() {
    let value;
    if (this.getWinner() !== null) {
      value = this.getWinner()?.name;
      value += " wins";
    } else { value = "Tie";}
    const field: EmbedField = {
      name: "Result",
      value: value as string,
      inline: false
    };
    return field;
  }
  toEmbed() {
    const embed = buildWidgetStub(
      WidgetType.RollVersus,
      this.title
    )
      .addFields(
        ..._.map(this.opponents, (opponent) => opponent.toField()),
        this.toResultField()
      )
      ;
    if (this.description) {
      embed.setDescription(this.description);
    }
    return embed;
  }
}