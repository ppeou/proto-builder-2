const process = require('process');
const path = require('path');
const {cliArgMap, internalPaths} = require('./const');
const { getAbsolutePath } = require('./helper');


const [a, b, ...c] = process.argv;
const writeablePath = path.dirname(b.indexOf('snapshot') > -1 ? a : b);

const args = c.reduce((p, item) => {
    const [a, ...b] = item.split(':');
    if(a && b) {
        p[cliArgMap[a]] = b && b.length > 0 ? b.join(':') : true;
    }
    return p;
}, {});

['input', 'output'].forEach(k => {
  args[k] = getAbsolutePath(writeablePath, args[k]); 
});

[['root1', a], ['root2', b]].forEach(([k, v]) => {
    args[k] = path.dirname(v);
});

module.exports = args;