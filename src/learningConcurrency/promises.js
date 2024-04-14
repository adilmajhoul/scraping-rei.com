const getHello = new Promise((resolve, reject) => {
  let hello;
  setTimeout(() => {
    hello = 'hello';
    if (hello === 'hello') {
      resolve(hello);
    } else {
      reject('sorry i did not find hello');
    }
  }, 3000);
});

// Parallel Requests using Promise.all
console.time('Parallel Requests');
const parallelRequests = Array.from({ length: 100 }, () => getHello);

Promise.all(parallelRequests)
  .then((responses) => {
    console.timeEnd('Parallel Requests');
    responses.forEach((response, index) => {});
  })
  .catch((error) => {
    console.error('Error in parallel requests:', error);
  });

// Sequential Requests using Promise Resolution
console.time('Sequential Requests');
const sequentialRequests = Array.from({ length: 100 }, () => getHello);

const sequentialPromiseResolution = (promises) => {
  return promises.reduce((chain, promise, index) => {
    return chain.then((responses) => {
      return promise.then((response) => {
        responses.push(response);
        return responses;
      });
    });
  }, Promise.resolve([]));
};

sequentialPromiseResolution(sequentialRequests)
  .then((responses) => {
    console.timeEnd('Sequential Requests');
  })
  .catch((error) => {
    console.error('Error in sequential requests:', error);
  });
