import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { InteractionReplyOptions } from "discord.js";
import RollBase from "./RollBase.js";
import ColorTheme from "../../constants/ColorTheme.js";
import { BotTask } from "../tasks/BotTask.js";
import type { IRollUnderTaskParams } from "../tasks/ITaskParams.js";
import { packTaskParams } from "../tasks/packTaskParams.js";
import buildWidgetStub from "../widgets/buildWidgetStub.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";
import { WidgetType } from "../widgets/WidgetType.js";

enum RollUnderOutcome {
  Failure,
  Success
}

// "Rolling Under is the throwing of 2d6 with the intention of scoring equal to or under a number. This will mainly be used in unopposed situations like climbing a wall or casting a Spell. Rolling two 6s always results in failure."

export default class RollUnder extends RollBase<IRollUnderTaskParams> {
  private _target: number;
  constructor(target: number, description?: string | undefined) {
    super({
      dice: [ 6, 6 ], modifier: 0, description
    });
    this._target = target;
  }
  toButton(isReroll: boolean = false): ButtonBuilder {
    return new ButtonBuilder()
      .setLabel(`Roll under ${this._target}`)
      .setEmoji({ name: "🎲" })
      .setStyle(ButtonStyle.Primary)
      .setCustomId(
        packTaskParams(
          BotTask.RollUnder,
          this.toParams(isReroll)
        )
      );
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
  // toButton(isReroll?: boolean): ButtonBuilder {

  // }
  toParams(isReroll: boolean = false): IRollUnderTaskParams {
    return {
      isReroll,
      target: this._target
    };
  }
  toEmbed() {
    const color = this.outcome === RollUnderOutcome.Failure ? ColorTheme.Danger : ColorTheme.Primary;
    const embed =
      buildWidgetStub(WidgetType.RollUnder, RollUnderOutcome[this.outcome],
        // this.target.toString()
      )
        .setColor(color)
        .addFields(
          {
            name: "Target",
            value: this.target.toString(),
            inline: true
          },
          this.toResultField(),
          this.toTotalField()
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
  toMessage(): WidgetOptions<InteractionReplyOptions> {
    const message = super.toMessage();
    return message;
  }
}