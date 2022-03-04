import { EmbedField, MessageEmbed } from "discord.js";
import Roll from "./Roll.js";

// "Rolling Under is the throwing of 2d6 with the intention of scoring equal to or under a number. This will mainly be used in unopposed situations like climbing a wall or casting a Spell. Rolling two 6s always results in failure."

export default class RollUnder extends Roll {
  private _target: number;
  constructor(targetNumber: number, description?: string| undefined) {
    super(2,6,0,description);
    this._target = targetNumber;
  }


  get target(): number { return this._target}
  isAutoFail(): boolean {
    return this.dice.every(die => die == 6);
  }
  isSuccess(this: RollUnder): boolean {
    if (this.isAutoFail()) {
      return false;
    }
    else if (this.valueOf() <= this.target) {
      return true;
    }
    return false;
  }

  toRollField(): EmbedField {
    return {
      name: "Roll",
      value: this.toString(),
      inline: true
    };
  }
  toTargetField(): EmbedField {
    return {
      name: "Target number",
      value: this.target.toString(),
      inline: true
    };
  }
  toResultField(): EmbedField {
    return {
      name: "Result",
      value: this.isSuccess() ? "Success" : "Failure",
      inline: false
    };
  }
  toEmbed() {
    const embed = new MessageEmbed()
      .setTitle("Roll Under")
      .addFields(
        this.toRollField(),
        this.toTargetField(),
        this.toResultField()
      )
    ;
    if (this.description) {
      embed.setDescription(this.description);
    }
    if (this.isAutoFail()) {
      embed.setFooter({text: "Rolling two 6s always results in failure."});
    }
    return embed;
  }
}