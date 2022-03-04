import { table } from "console";
import { InteractionReplyOptions, MessageActionRow, MessageEmbed, MessagePayload, ReplyMessageOptions } from "discord.js";
import _ from "lodash";
import { TypedRegEx } from "typed-regex";
import botEmbedType from "../constants/embedType.js";
import ITable, { TableType } from "../data/interfaces/ITable.js";
import joinToMaxLength from "../functions/joinToMaxLength.js";
import dismissMessageButton from "../interactions/components/dismissMessageButton.js";
import revealMessageButton from "../interactions/components/revealMessageButton.js";
import tableRollButton from "../interactions/components/tableRollButton.js";

export default class Table implements ITable {
  Name: string;
  Type: TableType;
  Table: Record<number, string> | string[];
  constructor(name: string, table: ITable) {
    this.Name = name;
    this.Type = table.Type;
    this.Table = table.Table;
  }
  toPreviewEmbeds() {
    let table2dArray: [`${number}`, string][] = [];
    let tableRows: string[] = [];
    if (Array.isArray(this.Table)) {
      table2dArray = this.Table.map((row,index) => [(index+1).toString() as `${number}`, row]);

    } else {
      table2dArray = _.map(this.Table, (row, key) => [key as `${number}`, row]);
    }
    tableRows = table2dArray.map(row => `\`${row[0].padStart(3, " ")}\` ${row[1]}`);
    const splitTables = joinToMaxLength("\n", 2000, ...tableRows);
    let embeds = splitTables.map((tablePart) => new MessageEmbed()
      .setAuthor({name: botEmbedType.Table})
      .setTitle(this.Name)
      .setDescription(tablePart)
    );
    if (embeds.length > 1) {
      embeds = embeds.map((embed) => {
        const floor = TypedRegEx("` *(?<rowNumber>[0-9]+)`").captures(embed.description as string)?.rowNumber as string;
        const ceiling = TypedRegEx("` *(?<rowNumber>[0-9]+)`.*$").captures(embed.description as string)?.rowNumber as string;
        if (floor == ceiling) {
          embed.title += ` (${ceiling})`;
        } else {
          embed.title += ` (${floor}-${ceiling})`;
        }
        return embed;
      });
    }
    return embeds;
  }
  toRollEmbed() {
    const embed = new MessageEmbed()
      .setAuthor({name: botEmbedType.TableRoll})
      .setTitle(this.Name)
    ;
    if (Array.isArray(this.Table)) {
      embed.setDescription(_.sample(this.Table) as string);
    } else {
      const randomKey = Number(_.sample(Object.keys(this.Table)));
      embed.addFields({
        name: randomKey.toString(),
        value: this.Table[randomKey]
      });
    }
    return embed;
  }
  getRollButton(label = "Roll on table") {
    return tableRollButton(this.Name, label);
  }
  toPreviewMessage(): InteractionReplyOptions {
    return {
      embeds: this.toPreviewEmbeds(),
      components: [
        new MessageActionRow({components: [
          revealMessageButton,
          tableRollButton(this.Name),
        ]})
      ],
      ephemeral: true
    };
  }
  toRollMessage(): InteractionReplyOptions {
    return {
      embeds: [this.toRollEmbed()],
      components: [
        new MessageActionRow({components: [
          dismissMessageButton,
          tableRollButton(this.Name, "Roll again").setStyle("SECONDARY"),
        ]})
      ]
    }
  }
}
