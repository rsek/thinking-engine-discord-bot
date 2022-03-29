import Table from "../modules/tables/Table.js";
import { Collection } from "discord.js";
import _ from "lodash-es";
import YAML from "yamljs";
import RollPlaceValues from "../modules/rolls/RollPlaceValues.js";
import TableDieType from "../modules/tables/TableDieType.js";
import type Bestiary from "./Bestiary.js";
import getTables from "./getTables.js";
import getYamlFiles from "./getYamlFiles.js";
import type ITableYaml from "./interfaces/ITableYaml.js";
import yamlRoot from "./yamlRoot.js";

export default class Tables extends Collection<string, Table> {
  constructor(bestiary: Bestiary) {
    super();
    const tablesData = getYamlFiles(yamlRoot+"tables/").map(file => YAML.load(file as string) as Record<string, ITableYaml>)
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
    const mienTables = getTables(bestiary);
    mienTables.forEach((value, key) => this.set(key, value));
  }
}
