import { Collection } from "discord.js";
import _ from "lodash";
import YAML from "yamljs";
import getYamlFiles from "./getYamlFiles.js";
import yamlRoot from "./yamlRoot.js";
import Spell from "../modules/reference/Spell.js";
import type ISpell from "./interfaces/ISpell.js";

export default class Spells extends Collection<string, Spell> {
  constructor() {
    super();
    const spellYaml = getYamlFiles(yamlRoot+"spells/").map(file => YAML.load(file as string) as Record<string, ISpell>)
      .reduce((obj1,obj2) => Object.assign(obj1, obj2));
    _.forEach(spellYaml, (data, id) => this.set(id, new Spell(id, data)));
  }
}

