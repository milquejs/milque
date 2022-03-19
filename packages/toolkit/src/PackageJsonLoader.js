import fs from 'fs/promises';

export async function loadPackageJson(inputPath = 'package.json') {
  return JSON.parse(await (await fs.readFile(inputPath)).toString());
}
