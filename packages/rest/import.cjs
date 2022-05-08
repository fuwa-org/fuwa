const fs = require('fs');
const path = require('path');

// read file ./src/REST.ts
const file = fs.readFileSync(path.join(__dirname, './src/REST.ts'), 'utf8');

// extract first import statement
const regex = /import\s+\{(?<imports>[^}]+)\}\s+from\s+['"]discord-api-types\/v[0-9]+['"];/;
const imports = regex.exec(file);
if (!imports) process.exit();

const allImports = imports.groups.imports.split(',').map(i => i.trim());
const allRESTRefs = file.match(/\bREST\w+API\w+\b/g) ?? process.exit();

for (const ref of allRESTRefs) {
  if (!imports[0].includes(ref)) {
    console.log(`${ref} is not imported`);
    allImports.push(ref);
  }
}

const tabSize = imports[0].match(/import \{\n(?<padding> +)/)?.groups.padding.length ?? 2;

const newImports = imports[0].replace(/\{[^}]+\}/, `{\n${' '.repeat(tabSize)}${allImports.filter(v => v).sort().join(`,\n${' '.repeat(tabSize)}`)},\n}`);

// write to ./src/REST.ts
fs.writeFileSync(path.join(__dirname, './src/REST.ts'), file.replace(imports[0], newImports));
