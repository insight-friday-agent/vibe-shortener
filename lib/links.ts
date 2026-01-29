import { readFile } from "node:fs/promises";
import { join } from "node:path";

import YAML from "yaml";

export type ShortLink = {
  code: string;
  target: string;
  title?: string;
  author?: string;
  created_at?: string;
};

const dataPath = join(process.cwd(), "data", "links.yaml");

export async function getLinks(): Promise<ShortLink[]> {
  try {
    const raw = await readFile(dataPath, "utf8");
    const parsed = YAML.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }
  throw new Error("data/links.yaml must be a YAML list of link entries");
}

export async function getLink(code: string): Promise<ShortLink | undefined> {
  const links = await getLinks();
  return links.find((link) => link.code === code);
}
