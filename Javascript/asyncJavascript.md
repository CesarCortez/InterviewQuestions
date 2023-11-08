### Table of Contents - Asyncronous Javascript

| No. | Questions |
| --- | --------- |
|   | **Asyncronous Javascript** |
| 1 | [What is Asyncronous Javascript?](#1)|
| 2 | [What is the difference between synchronous and asynchronous code?](#2)|
| 3 | [What is a callback function?](#3)|
| 4 | [What is a promise?](#4)|
| 5 | [What is a promise chain?](#5)|
| 6 | [What is a promise.all?](#6)|
| 7 | [Promises vs Callbacks](#7)|
| 8 | [What is the difference between synchronous and asynchronous callbacks?](#8)|
| 9 | [How do error-first callbacks work?](#9)|
| 10 | [What is the difference between Promises and Observables?](#10)|
| 11 | [Creating a Promise around an old callback API](#11)|
| 12 | [Task queues vs. microtasks?](#12)|

# 1. What is Asyncronous Javascript? <a id="1"></a>

- Asyncronous Javascript is a non-blocking, single-threaded language. It has a concurrency model based on an event loop, which is responsible for executing the code, collecting and processing events, and executing queued sub-tasks.

# 2. What is the difference between synchronous and asynchronous code? <a id="2"></a>

- Synchronous code is executed in sequence – each statement waits for the previous statement to finish before executing. 
- Asynchronous code doesn’t have to wait – your program can continue to run. You do this to keep your site or app responsive, reducing waiting time for the user.

# 3. What is a callback function? <a id="3"></a>

- A callback function is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of routine or action.

Example:

~~~js

function greeting(name) {
  alert('Hello ' + name);
}

function processUserInput(callback) {
  var name = prompt('Please enter your name.');
  callback(name);
}

processUserInput(greeting);// Hello John

//or ----

function fetchData(callback) {
  // Simulating asynchronous data retrieval
  setTimeout(() => {
    const data = { name: "John Doe", age: 30 };
    callback(null, data); // Pass null as the error parameter and data as the result
  }, 2000);
}

function processData(error, result) {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Data:", result);
  }
}

// Call fetchData and pass the processData function as a callback
fetchData(processData);// Data: { name: 'John Doe', age: 30 }

//or

const operation = (a, b, callback) => {
  return callback(a, b);
};

operation(5, 10, (a, b) => a + b); // 15
operation(5, 10, (a, b) => a - b); // -5
operation(5, 10, (a, b) => a * b); // 50
operation(5, 10, (a, b) => a / b); // 0.5

~~~

# 3.1 Why are callbacks important? <a id="3.1"></a>

Callbacks enable asynchronous operations, allowing code execution to continue while waiting for tasks like HTTP requests or timer events, ensuring a non-blocking and efficient code execution flow.

# 3.2 Callbacks and Fetch API <a id="3.2"></a>

~~~js
function fetchData(url, callback) {
  fetch(url)
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => console.log(error));
}

fetchData('https://jsonplaceholder.typicode.com/todos/1', function(data) {
  console.log(data);
});
~~~


# 4. What is a promise? <a id="4"></a>

- A promise is an object that may produce a single value some time in the future: either a resolved value, or a reason that it’s not resolved (e.g., a network error occurred).

- A promise may be in one of 3 possible states: fulfilled, rejected, or pending. Promise users can attach callbacks to handle the fulfilled value or the reason for rejection.

Example:

~~~js

const myPromise = new Promise((resolve, reject) => {
  if (Math.random() * 100 <= 90) {
    resolve('Hello, Promises!');
  }
  reject(new Error('In 10% of the cases, I fail. Miserably.'));
});

const onResolved = (resolvedValue) => console.log(resolvedValue);
const onRejected = (error) => console.log(error);

myPromise.then(onResolved, onRejected);

~~~

or

~~~js
doSomething()
  .then(function (result) {
    // If using a full function expression: return the promise
    return doSomethingElse(result);
  })
  // If using arrow functions: omit the braces and implicitly return the result
  .then((newResult) => doThirdThing(newResult))
  // Even if the previous chained promise returns a result, the next one
  // doesn't necessarily have to use it. You can pass a handler that doesn't
  // consume any result.
  .then((/* result ignored */) => doFourthThing())
  // Always end the promise chain with a catch handler to avoid any
  // unhandled rejections!
  .catch((error) => console.error(error));
~~~

Note that () => x is short for () => { return x; }.

# 5. What is a promise chain? <a id="5"></a>

- A promise chain is a sequence of promises which are called subsequently and which are dependent on each other.

Example:

~~~js

doSomething()
  .then(function (result) {
    return doSomethingElse(result);
  })
  .then(function (newResult) {
    return doThirdThing(newResult);
  })
  .then(function (finalResult) {
    console.log(`Got the final result: ${finalResult}`);
  })
  .catch(failureCallback);

  // or

doSomething()
  .then((result) => doSomethingElse(result))
  .then((newResult) => doThirdThing(newResult))
  .then((finalResult) => {
    console.log(`Got the final result: ${finalResult}`);
  })
  .catch(failureCallback);

  //or 
doSomething()
  .then((url) => fetch(url))
  .then((res) => res.json())
  .then((data) => {
    listOfIngredients.push(data);
  })
  .then(() => {
    console.log(listOfIngredients);
  });
~~~

Chaining after a catch

~~~js
new Promise((resolve, reject) => {
  console.log("Initial");

  resolve();
})
  .then(() => {
    throw new Error("Something failed");

    console.log("Do this");
  })
  .catch(() => {
    console.error("Do that");
  })
  .then(() => {
    console.log("Do this, no matter what happened before");
  });
~~~

Nesting with Promises

~~~js
doSomethingCritical()
  .then((result) =>
    doSomethingOptional(result)
      .then((optionalResult) => doSomethingExtraNice(optionalResult))
      .catch((e) => {}),
  ) // Ignore if optional stuff fails; proceed.
  .then(() => moreCriticalStuff())
  .catch((e) => console.error(`Critical failure: ${e.message}`));
~~~


# 6. What is a promise.all? <a id="6"></a>

- The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises. This returned promise will resolve when all of the input's promises have resolved, or if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting or non-promises throwing an error, and will reject with this first rejection message / error.

Example:

~~~js

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});

// expected output: Array [3, 42, "foo"]

~~~

# 7. Promises vs Callbacks <a id="7"></a>

- Promises are a much cleaner solution to writing asynchronous code than callbacks. They are chainable, and you can catch errors from them. They are also part of the ES6 specification, which means that they are becoming more and more supported across browsers and platforms.

- Callbacks are a good solution to writing asynchronous code when you don’t have promises available. They are also a good solution when you want to execute a function immediately after another function has finished executing.

~~~js

// Callbacks

function doSomethingAsyncCallback(n1,n2,callback) {
  const result = n1 + n2;
  setTimeout(() => {
    callback(result);
  }, 1000);
}

doSomethingAsyncCallback(1,3(res) => {
  console.log(res + "with callback");// 4 with callback
});

// Promises

function doSomethingAsyncPromises(n1,n2) {
  const result = n1 + n2;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, 1000);
  });
}

doSomethingAsyncPromises(1,3).then((data) => {
  console.log(data + "with promise");// 4 with promise
});

// or with async/await

let res = await doSomethingAsyncPromises(1,3);// 4

~~~

# 8. What is the difference between synchronous and asynchronous callbacks? <a id="8"></a>

- Synchronous callbacks execute immediately within the calling function, blocking further code execution.
- Asynchronous callbacks allow other code to execute before the callback is invoked, enabling non-blocking operations.

synchronous callback
~~~js
function syncCallback() {
  console.log("Synchronous callback executed!");
}

function performSyncOperation(callback) {
  console.log("Performing synchronous operation...");
  callback();
  console.log("Synchronous operation completed.");
}

performSyncOperation(syncCallback);
console.log("Program execution continues...");

// Performing synchronous operation...
// Synchronous callback executed!
// Synchronous operation completed.
// Program execution continues...
~~~

asynchronous callback

~~~js
function asyncCallback() {
  console.log("Asynchronous callback executed!");
}

function performAsyncOperation(callback) {
  console.log("Performing asynchronous operation...");
  setTimeout(function() {
    callback();
    console.log("Asynchronous operation completed.");
  }, 2000);
}

performAsyncOperation(asyncCallback);
console.log("Program execution continues...");

// Performing asynchronous operation...
// Program execution continues...
// Asynchronous callback executed!
// Asynchronous operation completed.

~~~

# 9. How do error-first callbacks work? <a id="9"></a>

- Error-first callbacks are used to pass errors and data. The first argument is always an error object that the programmer has to check. Subsequent arguments are used to pass data.

Example:
~~~js

function doSomethingAsync(callback) {
  setTimeout(() => {
    callback(new Error("Danger, Will Robinson!"));
  }, 1000);
}

doSomethingAsync((err, data) => {
  if (err) {
    console.log("Error: " + err.message);
  } else {
    console.log(data);
  }
});

// Error: Danger, Will Robinson!

~~~

# 10. What is the difference between Promises and Observables? <a id="10"></a>

- Promises are eager, meaning that a promise will start doing whatever task you give it as soon as the promise constructor is invoked. 
- Observables are lazy, meaning that they will only start emitting data when an observer subscribes to them.

- Promises are not cancellable, once you fire off a promise, you can’t abort it.
- Observables are cancellable, when you subscribe to an observable, you get a subscription object that you can call unsubscribe on to cancel execution.

# 11. Creating a Promise around an old callback API <a id="11"></a>

- Many asynchronous APIs are callback-based. For example, the setTimeout function takes a callback function to run after the timer elapses:

~~~js
setTimeout(() => saySomething("10 seconds passed"), 10000);
~~~

- Promises have a static method called resolve that takes a value and returns a promise that resolves to that value:

~~~js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
wait(10000).then(() => saySomething("10 seconds")).catch(failureCallback);
~~~

# 12. Task queues vs. microtasks? <a id="12"></a>

~~~js
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

wait(0).then(() => console.log(4));
Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3));
console.log(1); 
// 1, 2, 3, 4
~~~
Or
~~~js
const promise = new Promise((resolve, reject) => {
  console.log("Promise callback");
  resolve();
}).then((result) => {
  console.log("Promise callback (.then)");
});

setTimeout(() => {
  console.log("event-loop cycle: Promise (fulfilled)", promise);
}, 0);

console.log("Promise (pending)", promise);
// Promise callback
// Promise (pending) Promise { <state>: "pending" }
// Promise callback (.then)
// event-loop cycle: Promise (fulfilled) Promise { <state>: "fulfilled", <value>: undefined }
~~~


# Excersises

# 1. What is the output of the following code? <a id="1"></a>

~~~js
async function asyncFunc() {
  const array = [1, 1, 1];

  const plusOne = async (n) => n + 1;

  async function awaitAll(array) {
    return await Promise.all(array.map(async (n) => await plusOne(n)));
  }
  //or with for of
  // async function awaitAll(array) {
  //   const result = [];
  //   for (const n of array) {
  //     result.push(await plusOne(n));
  //   }
  //   return result;
  // }

  const result = await awaitAll(array);

  console.log(result);
}

asyncFunc(); // [2, 2, 2]
~~~