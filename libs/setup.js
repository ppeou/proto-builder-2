const {exec} = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const helper = require('./helper');
const browserify = require('browserify');

const prepareTempFolders = (args) => {
  Object.keys(args).forEach(k => {
    fs.emptyDirSync(args[k]);
  });
};

const cleanupTempFolder = (folder) => {
  fs.removeSync(path.dirname(folder));
};

const copyFiles = (srcFolder, destFolder) => {
  fs.copySync(srcFolder, destFolder);
};

const execSync = async (cmd) => {
  console.log(cmd);
  return new Promise((r1, r2) => {
    exec(cmd, (a, b) => {
      console.log(a, b);
      if (a) r2(b);
      r1(b);
    })
  });
};

const compileProtobuf = async ({compiler, protoFolder, javaFolder, cmjFolder}) => {
  let files = helper.findRecusiveByExt({base: protoFolder, ext: 'proto', useRelative: true});
  fs.emptyDirSync(javaFolder);
  fs.emptyDirSync(cmjFolder);
  console.log('Proto Files to be compiled:', files);
  const cmd = [
    compiler,
    `--proto_path=${protoFolder}`,
    `--js_out=import_style=commonjs,binary:${cmjFolder}`,
    `--java_out=${javaFolder}`,
    files.join(' ')
  ].join(' ');

  const r = await execSync(cmd);
};

const bundleJSFiles = ({cmjFolder, outputFile}) => {
  return new Promise((r1, r2) => {
    fs.emptyDirSync(path.dirname(outputFile));
    let files = helper.findByExt({base: cmjFolder, ext: 'js', useRelative: true});

    console.log('CMJ Files to be bundled:', files);
    const streamWriter = fs.createWriteStream(outputFile);
    const b = new browserify(files, {
      require: 'google-protobuf',
      basedir: cmjFolder
    });

    b.bundle().pipe(streamWriter);
    streamWriter.on('finish', r1);
  });
};

module.exports = {
  prepareTempFolders,
  cleanupTempFolder,
  copyFiles,
  compileProtobuf,
  bundleJSFiles
};