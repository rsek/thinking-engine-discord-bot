import _ from "lodash-es";

export default function enumToRecord(enumeration: object) {
  return _.pickBy(enumeration, (value, key) => typeof value === "number" && typeof key === "string") as Record<string, number>;
}
