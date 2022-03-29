import _ from "lodash-es";

/**
 * It takes an object and returns a record.
 * @param {object} enumeration - the enumeration object to convert to a record
 * @returns A record of the enumeration.
 */
export default function enumToRecord(enumeration: object) {
  return _.pickBy(enumeration, (value, key) => typeof value === "number" && typeof key === "string") as Record<string, number>;
}
