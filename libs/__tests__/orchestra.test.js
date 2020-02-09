const {composer, createStep} = require('../orchestra');
/*
const createPromiseFn = (text, timeout, defaultParam) => {
  return (data) => {
    console.log('param', defaultParam || data);
    return new Promise((r1) => {
      console.log((new Date().toLocaleTimeString()), 'calling:', text, timeout);
      setTimeout(() => r1(text), timeout);
    });
  };
};

const fn1 = createPromiseFn('my text 1', 1000, {lala: 1});
const fn2 = createPromiseFn('my text 2', 3000);
const fn3 = createPromiseFn('my text 3', 5000);

composer([fn1, fn2, fn3]).then(r => {
  console.log('final', r);
});*/

composer([
  createStep('Step 1',(callback, data) => {
    setTimeout(() => callback('fn 1'), 1000);
  }),
  createStep('Step 2',(callback, data) => {
    setTimeout(() => callback('fn 2'), 3000);
  }),
  createStep('Step 3',(callback, data) => {
    setTimeout(() => callback('fn 3'), 5000);
  }),
]).then(r => {
  console.log('done:');
  r.result.forEach(({start, end, result}) => {
    console.log(new Date(start));
    console.log(new Date(end));
    console.log(result);

  });
});
