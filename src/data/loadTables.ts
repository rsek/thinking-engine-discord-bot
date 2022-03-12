import getYamlFiles from "./getYamlFiles.js";
import ITable from "./interfaces/ITable.js";
import YAML from "yamljs";
import yamlRoot from "./yamlRoot.js";
import _ from "lodash";
import Table from "../modules/tables/Table.js";
import { Collection } from "discord.js";

let tableData = getYamlFiles(yamlRoot+"tables/").map(file => YAML.load(file as string) as Record<string,ITable>)
  .reduce((obj1,obj2) => Object.assign(obj1, obj2));

tableData = _.mapValues(tableData, (data, id) => new Table(id, data));

const tables = new Collection(Object.entries(tableData as Record<string, Table>));

export default tables;