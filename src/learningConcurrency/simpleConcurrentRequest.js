const urls = [
  'https://jsonplaceholder.typicode.com/todos/1',
  'https://jsonplaceholder.typicode.com/todos/2',
  'https://jsonplaceholder.typicode.com/todos/3',
];

const fetchData = async (url) => {
  const data = await fetch(url).then((res) => res.json());
  return data;
};

const fetchAllDataSequentiallMine = async () => {
  //   const promises = urls.map((url) => fetchData(url));
  //   const data = await Promise.all(promises);
  //   return data;
  const todos = [];
  for (const url of urls) {
    const todo = await fetchData(url);

    todos.push(todo);
  }

  return todos;
};

// why is this the fastest function
const fetchAllDataSequentially1 = async () => {
  const promises = urls.map((url) => fetchData(url));
  const data = [];
  for (const promise of promises) {
    data.push(await promise);
  }
  return data;
};

const fetchAllData = async () => {
  const promises = urls.map((url) => fetchData(url));
  const data = await Promise.all(promises);
  return data;
};

console.time('fetchAllData');
// ----------------------------
fetchAllData()
  .then((data) => {
    console.log('fetchAllData:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
// ----------------------------
console.timeEnd('fetchAllData');

// +++++++++++++++++++++++++++++++++++++++++

console.time('fetchAllDataSequentially1');
// ----------------------------
fetchAllDataSequentially1()
  .then((data) => {
    console.log('fetchAllDataSequentially1:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
// ----------------------------
console.timeEnd('fetchAllDataSequentially1');

// +++++++++++++++++++++++++++++++++++++++++

console.time('fetchAllDataSequentiallMine');
// ----------------------------
fetchAllDataSequentiallMine()
  .then((data) => {
    console.log('fetchAllDataSequentiallMine:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
// ----------------------------
console.timeEnd('fetchAllDataSequentiallMine');
