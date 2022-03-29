import type Skill from "./Skill.js";
import NumericAttribute from "../attributes/NumericAttribute.js";
import Roll from "../rolls/Roll.js";
import buildWidgetStub from "../widgets/buildWidgetStub.js";
import type { IRendersEmbed } from "../widgets/IRenders.js";
import { WidgetType } from "../widgets/WidgetType.js";


// could skills be managed the same way?
// things what need to happen:
// plus/minus skill/stamina/luck
// +1, +5? how is the number being set?


// rest button to recover stamina automatically?
// skills need to be marked. how? emoji check mark
// advancing skills sounds like it could be a matter of picking up to 3 from the menu.

// roll Skill
// roll Luck (as in: test your luck)

// footer in versus rolls, reminding ppl to test their luck.

// more page refs would be good.

// pc can be initialized with random or manually-set attributes.


export default class PlayerCharacter implements IRendersEmbed {
  Name: string;
  "Advanced skills": Skill[];
  // Possessions: Item[];
  Skill: NumericAttribute;
  Stamina: NumericAttribute;
  Luck: NumericAttribute;
  constructor(
    name: string,
    skill: number = new Roll({ dice: "1d3+3" }).valueOf(),
    stamina: number = new Roll({ dice: "2d6+12" }).valueOf(),
    luck: number = new Roll({ dice: "1d6+6" }).valueOf(),
  ) {
    this.Name = name;
    this.Skill = new NumericAttribute("Skill", skill);
    this.Stamina = new NumericAttribute("Stamina", stamina);
    this.Luck = new NumericAttribute("Luck", luck);
    // this.Possessions = baselinePossessions;
  }
  toEmbed() {
    const embed = buildWidgetStub(WidgetType.PlayerCharacter, this.Name);
    return embed;
  }
}