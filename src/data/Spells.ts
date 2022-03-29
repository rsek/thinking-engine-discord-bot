import { Collection } from "discord.js";
import _ from "lodash";
import YAML from "yamljs";
import type ISpell from "./interfaces/ISpell.js";
import readYamlFilePaths from "./readYamlFilePaths.js";
import YAML_ROOT from "./YAML_ROOT.js";
import Spell from "../modules/reference/Spell.js";

export default class Spells extends Collection<string, Spell> {
  constructor() {
    super();
    const spellYaml = readYamlFilePaths(YAML_ROOT+"spells/").map(file => YAML.load(file as string) as Record<string, ISpell>)
      .reduce((obj1,obj2) => Object.assign(obj1, obj2));
    _.forEach(spellYaml, (data, id) => this.set(id, new Spell(id, data)));
  }
}

