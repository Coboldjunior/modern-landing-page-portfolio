import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlFiles = [];
const errors = [];

const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".git")) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(fullPath);
    }
  }
};

const collectIds = (html) => {
  const ids = new Set();
  const idPattern = /\sid="([^"]+)"/g;
  let match;

  while ((match = idPattern.exec(html))) {
    ids.add(match[1]);
  }

  return ids;
};

const isExternal = (value) =>
  /^(https?:|mailto:|tel:|javascript:)/i.test(value) || value.startsWith("//");

walk(root);

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const ids = collectIds(html);
  const attrPattern = /\s(?:href|src)="([^"]+)"/g;
  let match;

  while ((match = attrPattern.exec(html))) {
    const raw = match[1];
    if (!raw || isExternal(raw)) continue;

    const [targetPath, hash] = raw.split("#");
    const targetFile = targetPath
      ? path.resolve(path.dirname(file), targetPath)
      : file;

    if (targetPath && !existsSync(targetFile)) {
      errors.push(`${path.relative(root, file)} -> missing ${raw}`);
      continue;
    }

    if (hash) {
      const hashHtml = targetPath ? readFileSync(targetFile, "utf8") : html;
      const hashIds = targetPath ? collectIds(hashHtml) : ids;

      if (!hashIds.has(hash)) {
        errors.push(`${path.relative(root, file)} -> missing anchor #${hash}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Verified ${htmlFiles.length} HTML files and their local links.`);
