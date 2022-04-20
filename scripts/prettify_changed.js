const child_process = require('child_process');

// get current branch from git
const branch = child_process
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

// get modified files from git
const modifiedFiles = child_process
  .execSync('git diff --name-only --diff-filter=AM origin/' + branch)
  .toString()
  .trim()
  .split('\n');

try {
  child_process.execSync('prettier -w ' + modifiedFiles.join(' '), {
    stdio: 'inherit',
  });
} catch {}

// add modified files to git
child_process.execSync('git add ' + modifiedFiles.join(' '));
