import fs from 'fs-extra';
import path from 'path';

const CHALL_DIR = process.argv[2]; // e.g., ./challenges/my-challenge/code
const OUTPUT_FILE = path.join(CHALL_DIR, 'structure.json');

if (!CHALL_DIR) {
  console.error('❌ Please provide the path to the challenge directory as an argument.');
  process.exit(1);
}

async function walkDirectory(dir: string, basePath: string = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const structure: any[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/');
    const id = relativePath.replace(/\//g, '-');

    if (entry.isDirectory()) {
      const children = await walkDirectory(fullPath, relativePath);
      structure.push({
        id,
        type: 'folder',
        name: entry.name,
        children,
        path: `/${relativePath}`
      });
    } else {
      const ext = path.extname(entry.name).slice(1);
      const isReadonly = entry.name === 'package.json'; // Customize this rule if needed

      structure.push({
        id,
        type: 'file',
        name: entry.name,
        extension: ext,
        path: `/${relativePath}`,
        ...(isReadonly ? { readonly: true } : {})
      });
    }
  }

  return structure;
}

(async () => {
  try {
    const structure = await walkDirectory(path.join(CHALL_DIR, 'code'));
    await fs.writeJson(OUTPUT_FILE, structure, { spaces: 2 });
    console.log(`✅ structure.json generated at ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('❌ Error generating structure.json:', err);
  }
})();
