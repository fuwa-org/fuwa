const { execSync, execFileSync } = require('child_process');
const { writeFileSync, readFileSync } = require('fs');

const tag = execSync('git tag | cat').toString().trim();
const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const commit = execSync('git rev-parse --short HEAD').toString().trim();

console.log(`debug: writing to CHANGELOG.md on commit ${commit} (@${branch}), latest tag ${tag}`);

const existing = readFileSync(`${__dirname}/../CHANGELOG.md`, 'utf8').trim();
const prev = existing.split('\n\n').slice(2).join('\n\n');

const prevHash = existing.split('\n').reverse()[0].match(/<!-- (.*) -->/)[1];

if (prevHash === commit) {
  console.log('debug: no changes since last commit');
  process.exit(0);
}

const data = execFileSync("git", ["cliff", `${tag}..${branch}`]).toString();

writeFileSync(`${__dirname}/../CHANGELOG.md`, `${existing}\n\n${data}\n\n${prev.replace(/<!-- .* -->$/, '')}<!-- ${commit} -->`.replace(new RegExp(`<!-- ${prevHash} -->\\s*`, "gi"), "").replace(/.*update dependency.*/ig, "").replace(/\n{3,}/g, "\n\n"));
