import type { PathLike } from "fs";
import { readdirSync } from "fs";

/**
 * It reads all the files in a directory and returns the paths of the files that end with `.yaml` or
 * `.yml`.
 * @param {PathLike} path - The path to the directory that contains the YAML files.
 * @returns An array of file paths.
 */
export default function readYamlFilePaths(path: PathLike): PathLike[] {
  return readdirSync(path).filter(file => file.match(/^.*\.y(a)?ml/))
    .map(file => `${path.toString()}${file}`) as PathLike[];
}
