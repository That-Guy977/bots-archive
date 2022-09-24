import fs from "node:fs/promises";

export default function fileExists(path: string): Promise<boolean> {
  return fs.access(path).then(() => true, () => false);
}
