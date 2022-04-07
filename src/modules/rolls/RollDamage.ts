import type { ButtonBuilder, EmbedField, InteractionReplyOptions } from "discord.js";
import { ActionRowBuilder } from "discord.js";
import RollBase from "./RollBase.js";
import type GameData from "../../data/GameData.js";
import ReferenceTask from "../../interactions/tasks/ReferenceTask.js";
import type DamageTable from "../reference/DamageTable.js";
import { BotTask } from "../tasks/BotTask.js";
import type { IRollDamageTaskParams } from "../tasks/ITaskParams.js";
import buildWidgetStub from "../widgets/buildWidgetStub.js";
import type WidgetOptions from "../widgets/WidgetOptions.js";
import { RefType, WidgetType } from "../widgets/WidgetType.js";

export default class RollDamage extends RollBase<BotTask.RollDamage> {
  static minRoll = 1;
  static maxRoll = 7;
  readonly widgetType = WidgetType.DamageRoll;
  readonly botTask = BotTask.RollDamage;
  results!: number[];
  private readonly gameData: GameData;
  dice = [6];
  constructor(params: IRollDamageTaskParams,  gameData: GameData, description?: string | undefined) {
    super({ params, description });
    this.gameData = gameData;
    if (!this.gameData[RefType.DamageTable].has(this.params.id)) {
      throw new RangeError(`Damage Table with ID \`${this.params.id}\` not found.`);
    }
    this.roll();
  }
  get modifiers() {
    return [ ...(this.params.mods ?? [] ), -this.effectiveArmour, -this.shield ];
  }
  get shield() {
    return this.params.shield ?? 0;
  }
  get isMightyBlow() {
    return this.params.mightyBlow ?? false;
  }
  get armour() {
    return this.params.armour ?? 0;
  }
  get attack() {
    // the constructor throws if this doesn't exist, so it should generally be safe.
    return this.gameData[RefType.DamageTable].get(this.params.id) as DamageTable;
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
      name: "Armour",
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
  // toString(): string {
  //   let result = `[${this.results.join(", ")}]`;
  //   if (this.modifier > 0) {
  //     result += ` + ${this.modifier.toString()}`;
  //   }
  //   if (this.effectiveDmgReduction > 0) {
  //     result += ` - ${this.effectiveDmgReduction}`;
  //   }
  //   return result += ` = **${this.valueOf()}**`;
  // }
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
  toEmbed() {
    const footerText: string[] = [];
    const embed = buildWidgetStub(WidgetType.DamageRoll, this.attack.Name, this.attack["Attack type"]);
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