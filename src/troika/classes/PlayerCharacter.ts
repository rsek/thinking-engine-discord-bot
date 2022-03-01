import baselinePossessions from "../constants/baselinePossessions.js";
import AdvancedSkill from "./AdvancedSkill.js";
import Roll from "./Roll.js";
import Item from "./Item.js";
import Attribute from "./Attribute.js";
import { MessageEmbed, MessageEmbedOptions } from "discord.js";

export default class PlayerCharacter {
  Name: string;
  "Advanced skills": AdvancedSkill[];
  Possessions: Item[];
  Skill: Attribute;
  Stamina: Attribute;
  Luck: Attribute;
  constructor(
    name: string,
// posessions
// template
    skill: number = new Roll("1d3+3").valueOf(),
    stamina: number = new Roll("2d6+12").valueOf(),
    luck: number = new Roll("1d6+6").valueOf()
    ) {
    this.Name = name;
    this.Skill = new Attribute("Skill", skill);
    this.Stamina = new Attribute("Stamina", stamina);
    this.Luck = new Attribute("Luck", luck);
    this.Possessions = baselinePossessions;
  }
  toEmbed(): MessageEmbed {
    let options: MessageEmbedOptions = {
      author: { name: "Player Character" },
      title: this.Name
    };
    let embed = new MessageEmbed(options
    )
      .addFields(
          [this.Skill, this.Stamina, this.Luck].map(item => item.toEmbedField(true)))
    ;
    return embed;
  }
}