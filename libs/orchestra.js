const process = require('process');
const spinner = require('./spinner');

const createProgress = (intialValue) => ({start: new Date().getTime(), end: '', result: intialValue});
const getSecDiff = (d1, d2) => ((d2 - d1) / 1000);

const createStep = (name, fn) => {
  return (data) => {
    return new Promise((resolver) => {
      process.stdout.write(`${name} `);
      spinner();
      fn.call(null, resolver, data);
    });
  };
};

const runner = (arr, parentResponse, overallProgress, resolve) => {
  const itr = arr.shift();
  const currentProgress = createProgress();
  itr(parentResponse).then(r => {
    currentProgress.end = new Date().getTime();
    spinner();
    console.info(` ~ ${getSecDiff(currentProgress.start, currentProgress.end)} secs`);
    currentProgress.result = r;
    overallProgress.result.push(currentProgress);
    if (arr.length > 0) {
      return runner(arr, r, overallProgress, resolve);
    } else {
      overallProgress.end = new Date().getTime();
      const {start, end, result} = overallProgress;
      resolve({start, end, result});
    }
  });
};

const walk = async (steps, overallProgress) => {
  return new Promise(r => {
    runner(steps, undefined, overallProgress, r);
  });
};

const composer = async (name, steps) => {
  const overalProgress = createProgress([]);
  console.info('');
  console.info(`Starting ${name} ${new Date(overalProgress.start).toLocaleString()}`);
  console.info('');
  const r = await walk(steps, overalProgress);
  console.info('');
  process.stdout.write('End');
  console.info(` ~ ${getSecDiff(overalProgress.start, overalProgress.end)} secs`);
  return r;
};

module.exports = {
  composer,
  createStep,
};