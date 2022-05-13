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
  __module__ = require('..');
  r = new __module__.REST();
  r.init.logger = {
    debug: console.log,
  };
  prompter.context.r = r;
}

// add module to context
prompter.context.__module__ = __module__;
Object.assign(prompter.context, __module__);
<<<<<<< HEAD
<<<<<<< HEAD
=======

// easy module hot reload
Object.defineProperty(prompter.context, 'reload', {
  get() {
    reload();
  },
});

// create dummy client
>>>>>>> 3198eac (feat(rest): add emoji routes)
let r = new __module__.REST();
r.init.logger = {
  debug: console.log,
};

prompter.context.r = r;
=======
prompter.context.r = new __module__.REST();
>>>>>>> f1e1abc (feat(rest): add pre and after request tasks)
