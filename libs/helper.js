const path = require('path');
const fs = require('fs-extra');

const getRelative = (base) => f => f.replace(base, '').slice(1);

const findRecusiveByExt = ({base, ext, files, result, useRelative}) => {
  files = files || fs.readdirSync(base);
  result = result || [];

  files.forEach((file) => {
    var newbase = path.join(base, file);
    if (fs.statSync(newbase).isDirectory()) {
      result = findRecusiveByExt({base: newbase, ext, files: fs.readdirSync(newbase), result});
    } else {
      if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
        result.push(newbase)
      }
    }
  });
  return !useRelative ? result : result.map(getRelative(base));
};

const findByExt = ({base, ext, useRelative}) => {
  const files = fs.readdirSync(base);
  const result = [];
  files.forEach((file) => {
    var newbase = path.join(base, file);
    if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
      result.push(newbase);
    }
  });
  return !useRelative ? result : result.map(getRelative(base));
};

const getAbsolutePath = (root, xpath) => {
  return path.isAbsolute(xpath) ? xpath : path.resolve(root, xpath);
};

const getSecondDiff = (start, end) => {
  return (end.getTime() - start.getTime()) / 1000;
};


module.exports = {
  findRecusiveByExt,
  findByExt,
  getAbsolutePath,
  getSecondDiff
};


/*const result1 = findRecusiveByExt({base:'C:\\sample\\proto', ext: 'proto', useRelative: true});
const result2 = findByExt({base:'C:\\sample\\proto', ext: 'proto', useRelative: true});
console.log(result1);
console.log('---------------------');
console.log(result2);*/

