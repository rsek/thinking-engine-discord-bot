import { Collection } from "discord.js";
import type Skill from "../modules/PlayerCharacter/Skill.js";

export default class Skills extends Collection<string, Skill> {
  constructor() {
    super();
  }
}

