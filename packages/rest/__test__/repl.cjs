/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
let __module__ = require('..');
const repl = require('node:repl');

// allow autocompletion
process.stdin?.setRawMode?.(true);

const prompter = repl.start({
  prompt: '~> ',
  useColors: true,
  useGlobal: true,
  input: process.stdin,
  output: process.stdout,
});

function reload() {
  delete require.cache[require.resolve('..')];
  // @ts-ignore
  __module__ = require(require.resolve('..'));
  r = new __module__.REST();
  r.init.logger = {
    debug: console.log,
  };
  prompter.context.r = r;
}

// add module to context
prompter.context.__module__ = __module__;
Object.assign(prompter.context, __module__);

// easy module hot reload
Object.defineProperty(prompter.context, 'reload', {
  get() {
    reload();

    return 'ok';
  },
});

// create dummy client
let r = new __module__.REST();
r.init.logger = {
  debug: console.log,
};

prompter.context.r = r;
