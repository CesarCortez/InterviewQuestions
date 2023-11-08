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
| 13 | [Can you explain how Async Await helps to improve the readability and maintainability of the code compared to using Promises and callbacks?](#13)|
| 14 | [How does the use of Async Await impact error handling, and how does it differ from error handling when using Promises?](#14)|
| 15 | [What are the potential performance implications of using Async Await, and how can you mitigate those performance concerns?](#15)|
| 16 | [How does Async Await work under the hood, and how does it relate to the JavaScript event loop?](#16)|
| 17 | [How can you use Async Await in combination with Promise.all() to process multiple asynchronous tasks concurrently?](#17)|
| 18 | [Can you explain the difference between Async Await and Generator Functions in terms of syntax, control flow, and use cases?](#18)|
| 19 | [Can you explain the concept of “async generators” and how they can be used with Async Await for more complex asynchronous patterns?](#19)|
| 20 | [What steps can you take to debug an issue when working with Async Await? How does debugging differ when using Async Await compared to Promises?](#20)|
| 21| [How can you write unit tests for asynchronous code that uses Async Await?](#21)|
| 22| [Can you provide an example of using Async Await with event-driven architectures, such as Node.js EventEmitter or EventTarget in the browser?](#22)|
| 23 | [Top level await](#23)|

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


# 13. Can you explain how Async Await helps to improve the readability and maintainability of the code compared to using Promises and callbacks? <a id="13"></a>

- Async/await makes asynchronous code look and behave a little more like synchronous code.
- It makes code easier to read and understand. 
- With async/await, you don’t have to use .then() anymore
- you don’t have to worry about callback functions and the callback hell.
- Error handling is also much more straightforward with async/await. You can use try/catch blocks to handle errors.

# 14. How does the use of Async Await impact error handling, and how does it differ from error handling when using Promises? <a id="14"></a>

- Async/await makes it possible to handle both synchronous and asynchronous errors with the same try/catch block.

Promises
~~~js
function fetchData() {
  return fetch('https://api.example.com/data')
    .then(response => response.json())
    .catch(error => console.error('Error:', error));
}
~~~

Async/await
~~~js
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
~~~

# 15. What are the potential performance implications of using Async Await, and how can you mitigate those performance concerns? <a id="15"></a>

Async Await can introduce performance implications such as 
- increased memory usage, 
- thread pool exhaustion, 
- and latency due to context switching.

To mitigate these concerns:

- Use async/await judiciously, especially in long-running applications.
- Use a linter to identify unnecessary usages of async/await.
- Optimize data processing with efficient algorithms and data structures to minimize CPU-bound work in async methods.
- Utilize I/O-bound APIs that support cancellation tokens to enable responsive cancellation of long-running operations.

# 15.1 In what scenarios should you avoid using Async Await, and why? <a id="15.1"></a>

Avoid using Async Await in the following scenarios:

1. Performance-critical code: Async Await introduces overhead, which can negatively impact performance. Optimize synchronous code for better results.
2. Simple tasks: For trivial operations that don’t require asynchronous processing, avoid adding unnecessary complexity with Async Await.
3. Recursive functions: Using Async Await in recursive algorithms may lead to stack overflow issues due to increased memory consumption.
4. Event handlers: In UI frameworks, event handlers should remain synchronous to prevent unexpected behavior and maintain responsiveness.
5. Middleware components: Some middleware libraries might not support async operations, causing compatibility issues when implementing Async Await.

# 16. How does Async Await work under the hood, and how does it relate to the JavaScript event loop? <a id="16"></a>

Async/await is syntactic sugar built on top of JavaScript Promises, simplifying asynchronous code.

When a function is declared async, it returns a Promise implicitly. Await keyword can only be used inside an async function and makes the execution pause until the awaited Promise resolves or rejects.

Under the hood, when an async function encounters await, it yields control back to the event loop, allowing other tasks to execute.

The event loop continues processing callbacks in the queue (microtasks like Promises and macrotasks like setTimeout). Once the awaited Promise settles, the async function resumes execution at the point where it was paused.

Async/await doesn’t block the main thread, as it leverages non-blocking I/O operations and the event loop’s concurrency model. This ensures efficient utilization of resources and better performance for concurrent tasks.

# 17. How can you use Async Await in combination with Promise.all() to process multiple asynchronous tasks concurrently? <a id="17"></a>

To use Async Await with Promise.all() for concurrent asynchronous tasks, follow these steps:

1. Declare an async function to handle the tasks.
2. Inside the function, create an array of Promises representing each task using async functions or other Promise-returning functions.
3. Use Promise.all() to execute all Promises concurrently and await its result.
4. Process the results as needed.

Example:

~~~js
async function processTasks() {
  const taskPromises = [
    asyncTask1(),
    asyncTask2(),
    asyncTask3()
  ];
  const results = await Promise.all(taskPromises);
  // Process results here
}
~~~

# 18. Can you explain the difference between Async Await and Generator Functions in terms of syntax, control flow, and use cases? <a id="18"></a>

- Async Await and Generator Functions differ in syntax, control flow, and use cases. Async Await uses “async” to declare a function as asynchronous and “await” to pause execution until a promise is resolved or rejected. 
- Generators use the “function*” syntax and “yield” to pause/resume execution.
- Control flow in Async Await is linear, making it easier to read and understand.
- In contrast, generators have more complex control flow due to manual iterator handling using “.next()” and “.throw()”.
- Use cases for Async Await primarily involve simplifying asynchronous code, such as API calls or file I/O operations.
- Generators are suited for producing sequences of values on-the-fly, like infinite data streams or traversing tree structures.

Example:

~~~js

// Generator function
// The asterisk indicates that this function is a generator
async function* asyncGenerator() {
  let i = 0;
  while (i < 3) {
    yield i++;// yield pauses the execution of the generator function and returns the value of i
  }
}

async function main() {
  // for await...of statement iterates over async iterable objects
  for await (const value of asyncGenerator()) {
    console.log(value);
  }
}

main();
// 0
// 1
// 2
~~~

# 19. Can you explain the concept of “async generators” and how they can be used with Async Await for more complex asynchronous patterns? <a id="19"></a>

- Async generators are generator functions that return asynchronous iterators.
- Async iterators are objects that implement the AsyncIterator interface and can be used in asynchronous contexts with the “for await...of” loop. or manually with “.next()”. 
- They allow the use of “yield” within an async function, enabling the function to pause execution while awaiting a promise resolution.

~~~js
async function* asyncGenerator() {
  for (let i = 0; i < 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    yield i;
  }
}

(async () => {
  for await (const value of asyncGenerator()) {
    console.log(value); // Logs 0, 1, 2 with a delay between each log
  }
})();// the async function is immediately invoked

//or 

async function myFunction(){
for await (const value of asyncGenerator()) {
    console.log(value); // Logs 0, 1, 2 with a delay between each log
  }
}

myFunction();

~~~


# 20. What steps can you take to debug an issue when working with Async Await? How does debugging differ when using Async Await compared to Promises? <a id="20"></a>

1. Identify problematic code sections by analyzing error messages and stack traces.
2. Use breakpoints in the debugger to pause execution at specific points within async functions.
3. Step through the code using debugging tools (e.g., Chrome DevTools or Visual Studio Code) to inspect variables and observe the flow of execution.
4. Utilize console.log statements for additional insights into variable values and function calls.
5. Monitor network activity to ensure proper API requests and responses.

# 21. How can you write unit tests for asynchronous code that uses Async Await? <a id="21"></a>

To write unit tests for asynchronous code using Async Await, follow these steps:

1. Use a testing framework that supports async testing, such as Jest, Mocha, or Jasmine.
2. Write test functions as async to handle promises returned by the code being tested.
3. Use the await keyword within the test function to wait for the promise resolution before making assertions.
4. Handle errors with try-catch blocks or use the testing framework’s error handling mechanisms.
5. Mock external dependencies and services to isolate the code being tested and control the behavior of async calls.
6. Ensure proper cleanup after each test to avoid side effects on other tests.

~~~js
const myAsyncFunction = require('./myAsyncFunction');
describe('myAsyncFunction', () => {
  it('should return the expected result', async () => {
    const input = 'test';
    const expectedResult = 'result';
    // Call the async function and wait for its completion
    const result = await myAsyncFunction(input);
    // Check if the result matches the expected value
    expect(result).toEqual(expectedResult);
  });
  it('should throw an error when input is invalid', async () => {
    const invalidInput = null;
    // Test for error thrown by the async function
    await expect(myAsyncFunction(invalidInput)).rejects.toThrow(Error);
  });
});
~~~

# 22. Can you provide an example of using Async Await with event-driven architectures, such as Node.js EventEmitter or EventTarget in the browser? <a id="22"></a>

~~~js
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
function waitForEvent(emitter, eventName) {
  return new Promise((resolve) => {
    emitter.once(eventName, (data) => {
      resolve(data);
    });
  });
}
async function main() {
  myEmitter.emit('test', 'Async Await with EventEmitter');
  const eventData = await waitForEvent(myEmitter, 'test');
  console.log(`Received event data: ${eventData}`);
}
main();
~~~

This code demonstrates how to use Async Await with EventEmitter by creating a waitForEvent function that returns a Promise. The once method listens for the specified event and resolves the Promise when it occurs. In the main async function, we emit the event and then use await to wait for the event before logging its data.

# 23. Top level await <a id="23"></a>

- Top level await is a feature that allows you to use await outside of an async function in modules.
- It is currently supported in Node.js modules with the .mjs extension, and in the latest versions of Chrome and Firefox.
- It is not supported in CommonJS modules, which are the default in Node.js.


# Excersises

# 1. What is the output of the following code? <a id="1"></a>

~~~js
async function asyncFunc() {
  const array = [1, 1, 1];

  const plusOne = async (n) => n + 1;

  async function awaitAll(array) {
    return  Promise.all(array.map((n) => plusOne(n)));
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

# 2. Use promises to log data<a id="2"></a>
~~~js

const data = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
  },
  {
    id: 2,
    name: "Jane Doe",
    age: 25,
  },
  {
    id: 3,
    name: "Mary Smith",
    age: 32,
  },
];

function getData(){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(data.length === 0){
        reject(new Error("No data available"));
      }

      resolve(data);
    }, 2000);
  });
}

getData()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });

~~~

Using async/await

~~~js
const data = [
  {
    id: 1,
    name: "John Doe",
    age: 30,
  },
  {
    id: 2,
    name: "Jane Doe",
    age: 25,
  },
  {
    id: 3,
    name: "Mary Smith",
    age: 32,
  },
];


function getData(){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(data.length === 0){
        reject(new Error("No data available"));
      }

      resolve(data);
    }, 2000);
  });
}

async function main(){
  try {
    const result = await getData();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

main();

~~~