const path = require('path');
const args = require('./libs/arg');
const envs = require('./libs/env');
const setup = require('./libs/setup');
const {getSecondDiff} = require('./libs/helper');
const {composer, createStep} = require('./libs/orchestra');
const del = require('del');

const startTime = new Date();
const finalArgs = {...envs, ...args};

if(!finalArgs.verbose) {
  console.log = () => '';
}


const step1 = createStep('  setup [staging] folders', (cb) => {
  setup.prepareTempFolders({
    output: finalArgs.output,
    ...finalArgs.staging,
  });
  cb();
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
  cb();;
});
const step6 = createStep('  cleanup [staging] folder', (cb) => {
  del(finalArgs.staging.basedir);
  cb();
});

composer([step1, step2, step3, step4, step5, step6]);

return;

console.log(finalArgs);

console.info(`Staring [${startTime.toLocaleString()}]`);

let now = new Date();
console.info('  setup [staging] folders');
setup.prepareTempFolders({
  output: finalArgs.output,
  ...finalArgs.staging,
});
console.info(`    ~ ${getSecondDiff(now, new Date())} secs`);

now = new Date();
console.info('  copy [proto] files');
setup.copyFiles(finalArgs.input, finalArgs.staging.proto);
console.info(`    ~ ${getSecondDiff(now, new Date())} secs`);

(async () => {
  
  now = new Date();
  console.info('  compiling [proto] files');  
  await setup.compileProtobuf({
    compiler: 'compiler\\protoc.exe',
    protoFolder: finalArgs.staging.proto,
    javaFolder: finalArgs.staging.java,
    cmjFolder: finalArgs.staging.cmj,
  });
  console.info(`    ~ ${getSecondDiff(now, new Date())} secs`);

  now = new Date();
  console.info('  bundle [cmj] files');
  await setup.bundleJSFiles({
    cmjFolder: finalArgs.staging.cmj,
    outputFile: path.resolve(finalArgs.staging.js, 'bundle.js')
  });
  console.info(`    ~ ${getSecondDiff(now, new Date())} secs`);

  now = new Date();
  console.info('  copy to [output] folder');
  setup.copyFiles(finalArgs.staging.basedir, finalArgs.output);

  now = new Date();
  console.info('  cleanup [staging] folder');
  await del(finalArgs.staging.basedir);
  console.info(`    ~ ${getSecondDiff(now, new Date())} secs`);

  const endTime = new Date();
  console.info(`End [${endTime.toLocaleString()}]`);
  console.info(`  took about ~ ${getSecondDiff(startTime, endTime)} secs`);
})();

//console.info('cleanup [temp] folders');
//setup.cleanupTempFolder(finalArgs.staging.js);

//node index.js -i:C:\sample\proto -o:c:\sample\output
//node index.js -i:C:\sample\proto -o:h:\codes\test\google-protobuf\\dist\js -n:bundle.js
//node index.js -i:../proto -o:../output
//node index.js -i:C:\sample\proto1;C:\sample\proto2 -o:c:\sample\output1;c:\sample\output2