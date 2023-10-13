### Table of Contents - Javascript

| No. | Questions |
| --- | --------- |
|   | **Javascript** |
| 1 | [What is the event loop?](#1)|
| 2 | [What is the call stack?](#2)|
| 3 | [What are Macro tasks?](#3)|
| 4 | [Examples of Macro tasks](#4)|
| 5 | [What are Micro tasks?](#5)|
| 6 | [What is a callback?](#6)|
| 7 | [What is a callback hell?](#7)|
| 8 | [What is a promise?](#8)|
| 9 | [What is async/await?](#9)|
| 10| [Passed by Value and by Reference](#10)|
| 11| [What is the difference between var, let and const?](#11)|
| 12| [What is hoisting?](#12)|
| 13| [What is currying?](#13)|
| 14| [What is higher order function?](#14)|
| 15| [What is scope?](#15)|
| 16| [What is context?](#16)|
| 17| [What is an array?](#17)|
| 18 | [Array vs Set](#18)|
| 19 | [Array Methos](#19)|
| 20 | [Set Methods](#20)|
| 21 | [What is the difference between slice and splice?](#21)|
| 22 | [Object deep copy](#22)|
| 23 | [What is prototype?](#23)|
| 24 | [What is prototype chain?](#24)|
| 25 | [What is inheritance?](#25)|
| 26 | [What is the difference between classical inheritance and prototypal inheritance?](#26)|
| 27| [What is the difference between __proto__ and prototype?](#27)|
| 28| [DOM and Virtual DOM](#28)|
| 29| [What is DOM?](#29)|
| 30| [What is Virtual DOM?](#30)|
| 31| [Why is virtual DOM faster?](#31)|
| 32| [Fetch and Axios](#32)|
| 33| [What is REST?](#33)|
# Event Loop

## 1. What is the event loop?<a id="1"></a>

Event loop is simply an infinite loop. 
Wherever you run the JavaScript code, on browser or on Node.js, there will be an event loop which will take care of handling the asynchronous tasks.

Event loop involves Call stack, Macro tasks and Micro tasks.

![Texto alternativo](./images/eventLoop.png)
