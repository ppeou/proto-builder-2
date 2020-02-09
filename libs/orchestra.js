const process = require('process');
const spinner = require('./spinner');

const envelop = (intialValue) => ({start: new Date().getTime(), end: '', result: intialValue});
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

const runner = (arr, parentResponse, tracker, resolve) => {
  const itr = arr.shift();
  const data = envelop();
  itr(parentResponse).then(r => {
    data.end = new Date().getTime();
    spinner();
    console.info(` ~ ${getSecDiff(data.start, data.end)} secs`);
    data.result = r;
    tracker.result.push(data);
    if (arr.length > 0) {
      return runner(arr, r, tracker, resolve);
    } else {
      tracker.end = new Date().getTime();
      const {start, end, result} = tracker;
      resolve({start, end, result});
    }
  });
};

const asyncWrapper = async (steps, tracker) => {
  return new Promise(r => {
    runner(steps, undefined, tracker, r);
  });
};

const composer = async (name, steps) => {
  return new Promise((r) => {
    const tracker = envelop([]);
    console.info('');
    console.info(`Starting ${name} ${new Date(tracker.start).toLocaleString()}`);
    console.info('');
    asyncWrapper(steps, tracker).then((r2) => {
      console.info('');
      process.stdout.write('End');
      console.info(` ~ ${getSecDiff(tracker.start, tracker.end)} secs`);
      r(r2);
    });
  });
};

module.exports = {
  composer,
  createStep,
};