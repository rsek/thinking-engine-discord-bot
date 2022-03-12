import { EmbedField, Embed } from "discord.js";
import { WidgetType } from "../parseComponent/WidgetType.js";
import buildWidgetStub from "./buildEmbedStub.js";
import Roll from "./Roll.js";

enum RollUnderOutcome {
  Failure,
  Success
}

// "Rolling Under is the throwing of 2d6 with the intention of scoring equal to or under a number. This will mainly be used in unopposed situations like climbing a wall or casting a Spell. Rolling two 6s always results in failure."

export default class RollUnder extends Roll {
  private _target: number;
  constructor(targetNumber: number, description?: string | undefined) {
    super({
      dice: [ 6, 6 ], modifier: 0, description
    });
    this._target = targetNumber;
  }
  get target(): number { return this._target;}
  isAutoFail(): boolean {
    return this.results.every(die => die === 6);
  }
  get outcome(): RollUnderOutcome {
    if (this.isAutoFail()) {
      return RollUnderOutcome.Failure;
    } else if (this.valueOf() <= this.target) {
      return RollUnderOutcome.Success;
    }
    return RollUnderOutcome.Failure;
  }
  // protected toTargetField(): EmbedField {
  //   return {
  //     name: "Target number",
  //     value: this.target.toString(),
  //     inline: true
  //   };
  // }

  // protected toOutcomeField(): EmbedField {
  //   return {
  //     name: "Outcome",
  //     value: RollUnderOutcome[this.outcome],
  //     inline: false
  //   };
  // }
  toEmbed() {
    const embed =
    // new Embed()
      buildWidgetStub(WidgetType.RollUnder, RollUnderOutcome[this.outcome], this.target.toString())
        .addFields(
          this.toResultField(),
        )
    ;
    if (this.description) {
      embed.setDescription(this.description);
    }
    if (this.isAutoFail()) {
      // TODO: page ref
      embed.setFooter({ text: "Rolling two 6s always results in failure." });
    }
    return embed;
  }
}