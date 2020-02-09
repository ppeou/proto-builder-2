const process = require('process');
const path = require('path');
const {internalPaths} = require('./const');


const [a, b] = process.argv;

const root1 = path.dirname(a);
const root2 = path.dirname(b);
const writeablePath = root2.indexOf('snapshot') > -1 ? root1 : root2;
const stagingPath = path.resolve(writeablePath, internalPaths.staging);
const tempFolders = ['cmj', 'java', 'js', 'proto'].reduce(
  (p, k) => {
    p[k] = path.resolve(stagingPath, `./${k}`);
    return p;
  }, {});

module.exports = {
  root1,
  root2: root2,
  protoc: path.resolve(root2, internalPaths.protoc),
  staging: {
    basedir: stagingPath,
    ...tempFolders
  },
  root: writeablePath,
  ...tempFolders,
};

//index.js
// root1: 'H:\\FAST\\nodejs',
// root2: 'H:\\codes\\proto-builder',

//exe
// root1: 'H:\\codes\\proto-builder',
// root2: 'H:\\snapshot\\proto-builder',
