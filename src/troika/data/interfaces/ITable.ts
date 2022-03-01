
export default interface ITable {
  Type: TableType;
  Table: Record<number, string> | string[];
}

export enum TableType {
  d6 = "d6",
  d66 = "d66",
  List = "List"
}