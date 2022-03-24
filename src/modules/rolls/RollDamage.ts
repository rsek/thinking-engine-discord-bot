import { EmbedField, InteractionReplyOptions, ActionRowBuilder, ButtonBuilder } from "discord.js";
import _ from "lodash";
import Armour from "../../constants/Armour.js";
import ReferenceTask from "../../interactions/tasks/ReferenceTask.js";
import DamageInfo from "../DamageRoll/DamageInfo.js";
import WidgetOptions from "../initiative/WidgetOptions.js";
import { WidgetType } from "../parseComponent/WidgetType.js";
import buildWidgetStub from "./buildWidgetStub.js";
import Roll from "./Roll.js";

export default class RollDamage extends Roll {
  static minRoll = 1;
  static maxRoll = 7;
  // alternately: mighty blow toggle via button?
  attack: DamageInfo;
  armour: Armour;
  isMightyBlow: boolean;
  shield: number;
  constructor(attack: DamageInfo, bonus: number, armour: Armour, shield: number, description?: string | undefined, isMightyBlow = false) {
    super({
      dice: [6], modifier: bonus, description
    });
    this.attack = attack;
    this.armour = armour;
    this.isMightyBlow = isMightyBlow;
    this.shield = shield;
  }
  get effectiveArmour() {
    if (this.attack["Ignore armour"] === -1) {
      // magic number for ignoring all armour
      return 0;
    }
    return Math.max(this.armour - this.attack["Ignore armour"], 0);
  }
  get effectiveDmgReduction() {
    return this.effectiveArmour + this.shield;
  }
  get damage() {
    return this.attack.Damage[this.damageColumnIndex];
  }
  toShieldField(): EmbedField {
    return {
      name: "Shield",
      value: `-${this.shield}`,
      inline: true
    };
  }
  toArmourField(): EmbedField {
    let armourValueString = `-${this.armour}`;
    if (this.armour !== this.effectiveArmour) {
      armourValueString = `~~${armourValueString}~~`;
      if (this.effectiveArmour === 0) {
        armourValueString += ` ${this.effectiveArmour}`;
      } else {
        armourValueString += ` -${this.effectiveArmour}`;
      }
    }
    return {
      name: Armour[this.armour],
      value: `${armourValueString}`,
      inline: true
    };
  }
  get damageColumnIndex() {
    return Math.min(this.total, RollDamage.maxRoll) - 1;
  }
  protected override toResultField(): EmbedField {
    return {
      name: "Result",
      value: this.toString(),
      inline: true,
    };
  }
  override get total() {
    const subTotal = super.total - this.effectiveDmgReduction;
    return Math.max(subTotal, RollDamage.minRoll);
  }
  private get isBottomedOut() {
    return this.total > super.total - this.effectiveDmgReduction;
  }
  toString(): string {
    let result = `[${this.results.join(", ")}]`;
    if (this.modifier > 0) {
      result += ` + ${this.modifier.toString()}`;
    }
    if (this.effectiveDmgReduction > 0) {
      result += ` - ${this.effectiveDmgReduction}`;
    }
    return result += ` = **${this.valueOf()}**`;
  }
  toDamageField(): EmbedField {
    let damageString = this.damage.toString();
    if (this.isMightyBlow) {
      damageString = `${damageString} × 2 = **${this.damage * 2}**`;
    }
    return {
      name: "Damage",
      value: damageString,
      inline: false
    };
  }
  override toModifierString() {
    let string = super.toModifierString();
    if (this.effectiveDmgReduction > 0) {
      string += ` - ${this.effectiveDmgReduction}`;
    }
    return string;
  }
  toEmbed() {
    const footerText: string[] = [];
    const embed = buildWidgetStub(WidgetType.DamageRoll, this.attack.Name, this.attack["Attack type"]);
    if (this.modifier > 0) {
      embed.addFields(this.toModifierField());
    }
    if (this.armour > 0) {
      embed.addFields(this.toArmourField());
    }
    if (this.shield > 0) {
      embed.addFields(this.toShieldField());
    }
    embed.addFields(
      this.toResultField(),
      this.toDamageField()
    );
    switch (true) {
      case (this.attack["Ignore armour"] === -1): // magic number for ignoring all armour
        footerText.push("This attack ignores armour.");
        break;
      case (this.attack["Ignore armour"] > 0):
        footerText.push(`This attack ignores ${this.attack["Ignore armour"]} armour.`);
        break;
      default:
        break;
    }
    if (this.isBottomedOut) {
      footerText.push("Damage rolls can't be reduced below 1.");
    }
    if (this.isMightyBlow) {
      footerText.push("When striking a Mighty Blow you double the amount of Stamina lost as a result of a Damage Roll.");
    }
    if (footerText.length) {
      embed.setFooter({ text: footerText.join("\n") });
    }
    return embed;
  }
  override toMessage(): WidgetOptions<InteractionReplyOptions> {
    return {
      embeds: [this.toEmbed()],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(ReferenceTask.createButton(this.attack.Source, true))
      ]
    };
  }
}