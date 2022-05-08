const __module__ = require('..');
const repl = require('node:repl');

process.stdin?.setRawMode?.(true);

const prompter = repl.start({
  prompt: '~> ',
  useColors: true,
  useGlobal: true,
  input: process.stdin,
  output: process.stdout,
});

prompter.context.__module__ = __module__;
Object.assign(prompter.context, __module__);
prompter.context.r = new __module__.REST();
