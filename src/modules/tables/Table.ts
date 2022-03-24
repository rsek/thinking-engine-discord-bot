import { ButtonStyle,  Collection, InteractionReplyOptions, EmbedBuilder, ButtonBuilder } from "discord.js";
import _ from "lodash";
import { TypedRegEx } from "typed-regex";
import ITable from "../../data/interfaces/ITable.js";
import joinToMaxLength from "../text/joinToMaxLength.js";
import { RefType, WidgetType } from "../parseComponent/WidgetType.js";
import RollTableTask from "../../interactions/tasks/RollTableTask.js";
import ManageMessageTask from "../../interactions/tasks/ManageMessageTask.js";
import GameObject from "../inventory/GameObject.js";
import DiceExpression from "../rolls/diceExpression.js";
import Roll from "../rolls/Roll.js";
import ItemIn from "../../types/ItemIn.js";
import WidgetOptions from "../initiative/WidgetOptions.js";
import { ManageMessageAction } from "../parseComponent/ITaskParams.js";
import { ActionRowBuilder } from "@discordjs/builders";
import buildWidgetStub from "../rolls/buildWidgetStub.js";
import RollPlaceValues from "../rolls/RollPlaceValues.js";
import TableDieType from "./TableDieType.js";

export default class Table extends GameObject implements ITable {
  readonly Roll: keyof typeof TableDieType;
  readonly Type: RefType.Table = RefType.Table;
  readonly WidgetTypes: [ WidgetType.Table, WidgetType.TableRoll ] = [ WidgetType.Table, WidgetType.TableRoll ];
  Table: Collection<number, string>;
  constructor(id: string, data: ITable) {
    super(id);
    if (data.Roll && typeof data.Table === "object") {
      this.Roll = data.Roll;
      const entries = Object.entries(data.Table as Record<number, string>).map(row => [ Number(row[0]), row[1] ] as [number, string]);
      this.Table = new Collection(entries);
    } else {
      throw new RangeError();
    }
  }
  override toMessage<T extends ItemIn<this["WidgetTypes"]>>(type: T, ephemeral?: boolean): WidgetOptions<InteractionReplyOptions> {
    switch (type) {
      case WidgetType.Table:
        return this.toPreviewMessage(ephemeral);
        break;
      case WidgetType.TableRoll:
        return this.toRollMessage(ephemeral);
        break;
      default:
        throw new RangeError();
        break;
    }
  }
  private toPreviewEmbeds() {
    const tableRows = this.Table
      .map((rowText, rowNumber) => `\`${rowNumber.toString().padStart(3, " ")}.\` ${rowText}`);
    const splitTables = joinToMaxLength("\n", 2000, ...tableRows);
    let embeds = splitTables.map((tablePart) => {
      const embed = super.toEmbed()
        .setDescription(tablePart);
      return embed;
    });
    if (embeds.length > 1) {
      embeds = embeds.map((embed) => {
        const floor = TypedRegEx("` *(?<rowNumber>[0-9]+)`").captures(embed.data.description as string)?.rowNumber as string;
        const ceiling = TypedRegEx("` *(?<rowNumber>[0-9]+)`.*$").captures(embed.data.description as string)?.rowNumber as string;
        if (floor === ceiling) {
          embed.setTitle(embed.data.title as string + ` (${ceiling})`);
        } else {
          embed.setTitle(embed.data.title as string + ` (${floor}-${ceiling})`);
        }
        return embed;
      });
    }
    return embeds;
  }
  roll() {
    console.log(this);
    const dieType = TableDieType[this.Roll];
    const roll = new RollPlaceValues(dieType);
    // console.log(roll);
    return {
      roll,
      row: this.Table.get(roll.valueOf())
    };
  }
  toRollEmbed() {
    const embed = buildWidgetStub(WidgetType.TableRoll, this.Name ?? this.$id);
    const result = this.roll();
    embed.addFields({
      name: result.roll.toString(),
      value: result.row ?? "`Error: Unknown row!`"
    });

    return embed;
  }
  getRollButton(label = "Roll on table") {
    return RollTableTask.toButton(this.$id, label);
  }

  private toPreviewMessage(ephemeral: boolean = true) {
    return {
      ephemeral,
      embeds: this.toPreviewEmbeds(),
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            ManageMessageTask.createButton(ManageMessageAction.Reveal),
            this.getRollButton()
          )
      ],
    };
  }
  private toRollMessage(ephemeral: boolean = false) {
    return {
      ephemeral,
      embeds: [this.toRollEmbed()],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          ManageMessageTask.createButton(ManageMessageAction.Delete),
          this.getRollButton("Roll again").setStyle(ButtonStyle.Secondary),
        )
      ]
    };
  }
}
