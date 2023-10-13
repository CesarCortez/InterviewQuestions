### Table of Contents - React and Redux

| No. | Questions |
| --- | --------- |
|   | **Javascript** |
| 1 | [What is React?](#1)|
| 2 | [What are the advantages of using React?](#2)|
| 3 | [What are the limitations of React?](#3)|
| 4 | [What is useState() in React?](#4)|
| 5 | [What are keys in React?](#5)|
| 6 | [What is JSX?](#6)|
| 7 | [What are the differences between functional and class components?](#7)|
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

## 1. What is React?<a id="1"></a>

React is a front-end and open-source JavaScript library which is useful in developing user interfaces specifically for applications with a single page. It is helpful in building complex and reusable user interface(UI) components of mobile and web applications as it follows the component-based approach.

- It supports server-side rendering.
- It will make use of the virtual DOM rather than real DOM (Data Object Model) as RealDOM manipulations are expensive.
- It follows unidirectional data binding or data flow.
- It uses reusable or composable UI components for developing the view.


## 2. What are the advantages of using React?<a id="2"></a>

- Use of Virtual DOM to improve efficiency: React uses virtual DOM to render the view. As the name suggests, virtual DOM is a virtual representation of the real DOM. Each time the data changes in a react app, a new virtual DOM gets created. Creating a virtual DOM is much faster than rendering the UI inside the browser. Therefore, with the use of virtual DOM, the efficiency of the app improves.

- Gentle learning curve: React has a gentle learning curve when compared to frameworks like Angular. Anyone with little knowledge of javascript can start building web applications using React.

- SEO friendly: React allows developers to develop engaging user interfaces that can be easily navigated in various search engines. It also allows server-side rendering, which boosts the SEO of an app.

- Reusable components: React uses component-based architecture for developing applications. Components are independent and reusable bits of code. These components can be shared across various applications having similar functionality. The re-use of components increases the pace of development.

- Huge ecosystem of libraries to choose from: React provides you with the freedom to choose the tools, libraries, and architecture for developing an application based on your requirement.

## 3. What are the limitations of React?<a id="3"></a>

- React is not a full-blown framework as it is only a library.
- The components of React are numerous and will take time to fully grasp the benefits of all.
- It might be difficult for beginner programmers to understand React.
- Coding might become complex as it will make use of inline templating and JSX.

## 4. What is useState() in React?<a id="4"></a>

The useState() is a built-in React Hook that allows you for having state variables in functional components. It should be used when the DOM has something that is dynamically manipulating/controlling.

~~~js
...
const [count, setCounter] = useState(0);
const [otherStuffs, setOtherStuffs] = useState(...);
...
const setCount = () => {
   setCounter(count + 1);
   setOtherStuffs(...);
   ...
};
~~~

The useState(0) will return a tuple where the count is the first parameter that represents the counter’s current state and the second parameter setCounter method will allow us to update the state of the counter.

We can make use of setCounter() method for updating the state of count anywhere. The idea with the usage of hooks is that we will be able to keep our code more functional and avoid class-based components if they are not required.

## 5. What are keys in React?<a id="5"></a>

A key is a special string attribute that needs to be included when using lists of elements.

~~~js
const ids = [1,2,3,4,5];
const listElements = ids.map((id)=>{
return(
<li key={id.toString()}>
  {id}
</li>
)
})
~~~

- Keys help react identify which elements were added, changed or removed.
- Keys should be given to array elements for providing a unique identity for each element.
- Without keys, React does not understand the order or uniqueness of each element.
- With keys, React has an idea of which particular element was deleted, edited, and added.
- Keys are generally used for displaying a list of data coming from an API.

***Note- Keys used within arrays should be unique among siblings. They need not be globally unique.

## 6. What is JSX?<a id="6"></a>

JSX stands for JavaScript XML. It allows us to write HTML inside JavaScript and place them in the DOM without using functions like appendChild( ) or createElement( ).

As stated in the official docs of React, JSX provides syntactic sugar for React.createElement( ) function.

Note- We can create react applications without using JSX as well. But JSX makes the code more readable and easier to debug.

~~~js
const container = (
<div>
  <p>This is a text</p>
</div>
);
ReactDOM.render(container,rootElement);
~~~

Whitout JSX

~~~js
const text = React.createElement('p', {}, 'This is a text');
const container = React.createElement('div','{}',text );
ReactDOM.render(container,rootElement);
~~~

## 7. What are the differences between functional and class components?<a id="7"></a>

Before the introduction of Hooks in React, functional components were called stateless components and were behind class components on a feature basis. After the introduction of Hooks, functional components are equivalent to class components.

| Functional Components | Class Components |
| --- | --- |
| A functional component is just a plain JavaScript pure function that accepts props as an argument and returns a React element(JSX). | A class component requires you to extend from React. Component and create a render function that returns a React element. |
| There is no render method used in functional components. | It must have the render() method returning JSX (which is syntactically similar to HTML) |
| Functional components run from top to bottom and once the function is returned it can’t be kept alive. | The class component is instantiated and different life cycle method is kept alive and is run and invoked depending on the phase of the class component. |
| Also known as Stateless components as they simply accept data and display them in some form, they are mainly responsible for rendering UI. | Also known as Stateful components because they implement logic and state. |
| React lifecycle methods (for example, componentDidMount) cannot be used in functional components. | React lifecycle methods can be used inside class components (for example, componentDidMount). |
| Hooks can be easily used in functional components to make them Stateful. | It requires different syntax inside a class component to implement hooks. |
| Constructors are not used. | Constructor is used as it needs to store state.  |


Functional components are nothing but JavaScript functions and therefore can be declared using an arrow function or the function keyword:

~~~js
  function card(props){
   return(
      <div className="main-container">
        <h2>Title of the card</h2>
      </div>
    )
   }
   const card = (props) =>{
    return(
      <div className="main-container">
        <h2>Title of the card</h2>
      </div>
    )
   }
~~~

Class components, on the other hand, are declared using the ES6 class:

~~~js
 class Card extends React.Component{
  constructor(props){
     super(props);
   }
    render(){
      return(
        <div className="main-container">
          <h2>Title of the card</h2>
        </div>
      )
    }
   }
~~~

### Handling props

~~~js
<Student Info name="Vivek" rollNumber="23" />
~~~

In functional components, the handling of props is pretty straightforward. Any prop provided as an argument to a functional component can be directly used inside HTML elements:

~~~js
 function StudentInfo(props){
   return(
     <div className="main">
       <h2>{props.name}</h2>
       <h4>{props.rollNumber}</h4>
     </div>
   )
 }
~~~

In the case of class components, props are handled in a different way:

~~~js
 class StudentInfo extends React.Component{
   constructor(props){
     super(props);
    }
    render(){
      return(
        <div className="main">
          <h2>{this.props.name}</h2>
          <h4>{this.props.rollNumber}</h4> 
        </div>
      )
    }
   }
~~~