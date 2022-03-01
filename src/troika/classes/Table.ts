import { MessageEmbed } from "discord.js";
import _ from "lodash";
import ITable, { TableType } from "../data/interfaces/ITable.js";

export default class Table implements ITable {
  Name: string;
  Type: TableType;
  Table: Record<number, string> | string[];
  constructor(name: string, table: ITable) {
    this.Name = name;
    this.Type = table.Type;
    this.Table = table.Table;
  }
  toEmbed() {
    let titleString = this.Name;
    let descriptionString: string;
    if (Array.isArray(this.Table)) {
      descriptionString = _.sample(this.Table) as string;
    } else {
      const randomKey = Number(_.sample(Object.keys(this.Table)));
      descriptionString = this.Table[randomKey];
      titleString += ` [${randomKey}]`;
    }
    const embed = new MessageEmbed()
      .setAuthor({name: "Table Roll"})
      .setTitle(titleString)
      .setDescription(descriptionString)
    ;
    return embed;
  }
}