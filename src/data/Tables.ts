import { Collection } from "discord.js";
import _ from "lodash-es";
import YAML from "yamljs";
import type Bestiary from "./Bestiary.js";
import extractTables from "./extractTables.js";
import type ITableYaml from "./interfaces/ITableYaml.js";
import readYamlFilePaths from "./readYamlFilePaths.js";
import YAML_ROOT from "./YAML_ROOT.js";
import RollPlaceValues from "../modules/rolls/RollPlaceValues.js";
import Table from "../modules/tables/Table.js";
import TableDieType from "../modules/tables/TableDieType.js";

export default class Tables extends Collection<string, Table> {
  constructor(bestiary: Bestiary) {
    super();
    const tablesData = readYamlFilePaths(YAML_ROOT+"tables/").map(file => YAML.load(file as string) as Record<string, ITableYaml>)
      .reduce((obj1,obj2) => Object.assign(obj1, obj2));

    _.forEach(
      tablesData,
      (tableData, tableId) =>
        this.set(
          tableId,
          new Table(tableId, tableData.Table, () =>
            new RollPlaceValues(
              TableDieType[tableData.Roll]
            ).valueOf()
          )
        )
    );
    const mienTables = extractTables(bestiary);
    mienTables.forEach((value, key) => this.set(key, value));
  }
}
