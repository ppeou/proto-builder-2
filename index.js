const path = require('path');
const args = require('./libs/arg');
const envs = require('./libs/env');
const setup = require('./libs/setup');
const {getSecondDiff} = require('./libs/helper');
const {composer, createStep} = require('./libs/orchestra');
const del = require('del');

const finalArgs = {...envs, ...args};

const orgConsole = {};
const orgStdout = {};
const [writer, buffer] = ((arr) => [(...params) => arr.push(...params), arr])([]);

const createOverride = (backupFn, nativeFn) => {
  return (arr) => {
    arr.forEach(k => {
      if (!backupFn[k]) {
        backupFn[k] = nativeFn[k];
        nativeFn[k] = writer;
      }
    });
  };
};

const overrideConsole = createOverride(orgConsole, console);
const overrideStdout = createOverride(orgStdout, process.stdout);

if (!finalArgs.verbose) {
  overrideConsole(['log']);
}
if (finalArgs.silent) {
  overrideConsole(['log', 'info', 'error', 'warn', 'fatal']);
  overrideStdout(['write']);
}

const step1 = createStep('  setup [staging] folders', (cb) => {
  setup.prepareTempFolders({
    output: finalArgs.output,
    ...finalArgs.staging,
  });
  cb('');
});

const step2 = createStep('  copy [proto] files', (cb) => {
  setup.copyFiles(finalArgs.input, finalArgs.staging.proto);
  cb();
});

const step3 = createStep('  compiling [proto] files', (cb) => {
  setup.compileProtobuf({
    compiler: 'compiler\\protoc.exe',
    protoFolder: finalArgs.staging.proto,
    javaFolder: finalArgs.staging.java,
    cmjFolder: finalArgs.staging.cmj,
  }).then(cb);
});

const step4 = createStep('  bundle [cmj] files', (cb) => {
  setup.bundleJSFiles({
    cmjFolder: finalArgs.staging.cmj,
    outputFile: path.resolve(finalArgs.staging.js, 'bundle.js')
  }).then(cb);
});

const step5 = createStep('  copy to [output] folder', (cb) => {
  setup.copyFiles(finalArgs.staging.basedir, finalArgs.output);
  cb();
});

const step6 = createStep('  cleanup [staging] folder', (cb) => {
  del(finalArgs.staging.basedir);
  cb();
});

(async () => {
  await composer('Bundle Proto', [step1, step2, step3, step4, step5, step6]);
})();