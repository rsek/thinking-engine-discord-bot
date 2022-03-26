import getYamlFiles from "./getYamlFiles.js";
import ITableYaml from "./interfaces/ITableYaml.js";
import YAML from "yamljs";
import yamlRoot from "./yamlRoot.js";
import _ from "lodash";
import { Collection } from "discord.js";
import Table from "../modules/tables/Table.js";
import RollPlaceValues from "../modules/rolls/RollPlaceValues.js";
import TableDieType from "../modules/tables/TableDieType.js";

const tablesData = getYamlFiles(yamlRoot+"tables/").map(file => YAML.load(file as string) as Record<string,ITableYaml>)
  .reduce((obj1,obj2) => Object.assign(obj1, obj2));

const tables: Collection<string, Table> = new Collection(
  _.map(
    tablesData,
    (tableData, tableId) => [
      tableId,
      new Table(tableId,tableData.Table, () =>
        new RollPlaceValues(
          TableDieType[tableData.Roll]
        ).valueOf()
      )
    ])
);

export default tables;