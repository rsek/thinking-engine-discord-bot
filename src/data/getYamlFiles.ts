import type { PathLike } from "fs";
import { readdirSync } from "fs";

export default function getYamlFiles(path: PathLike): PathLike[] {
  return readdirSync(path).filter(file => file.match(/^.*\.y(a)?ml/))
    .map(file => `${path.toString()}${file}`) as PathLike[];
}
