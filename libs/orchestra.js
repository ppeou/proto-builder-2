const process = require('process');
const spinner = require('./spinner');

const envelop = (intialValue) => ({start: new Date().getTime(), end: '', result: intialValue});
const getSecDiff = (d1, d2) => ((d2 - d1) / 1000);
let iid;



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

const createStep = (name, fn) => {
  return (data) => {
    return new Promise((resolver) => {
      process.stdout.write(`${name} `);
      spinner();
      fn.call(null, resolver, data);
    });
  };
};

const composer = async (steps) => {
  return new Promise((r) => {
    runner(steps, undefined, envelop([]), r);
  });
};

module.exports = {
  composer,
  createStep,
};