# GoF (Gang of Four) Design Patterns

GoF Design Patterns are a collection of 23 design patterns that were created by Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides in their book "Design Patterns: Elements of Reusable Object-Oriented Software".

Divided into three categories:

- Creational Patterns: concerned with the way of creating objects.
- Structural Patterns: concerned with the composition of classes and objects.
- Behavioral Patterns: concerned with the interaction between objects.

## Creational Design Patterns

Creational design patterns are concerned with the way of creating objects. These design patterns are used when a decision must be made at the time of instantiation of a class (i.e. creating an object of a class).

| Pattern | Description |
| ------- | ----------- |
| [Singleton](#singleton-pattern) | Consists of an object that cant be copied or modified. |
| [Factory Method](#factory-method-pattern) | Provides an interface for creating objects that can be modified after creation. |
| [Abstract Factory](#abstract-factory-pattern) | Provides an interface for creating families of related or dependent objects without specifying their concrete classes (Factory for factory classes). |
| [Builder](#builder-pattern) | Provides an interface for creating complex objects step by step. |
| [Prototype](#prototype-pattern) | Provides an interface for creating objects by cloning an existing object. |

## Structural Design Patterns

Structural design patterns are concerned with the composition of classes and objects. These design patterns are used to form large object structures between many disparate objects.

| Pattern | Description |
| ------- | ----------- |
| [Adapter](#adapter-pattern) | Allows the interface of an existing class to be used as another interface. |
| [Bridge](#bridge-pattern) | Decouples an abstraction from its implementation so that the two can vary independently. |
| [Composite](#composite-pattern) | Used when we have to implement a part-whole hierarchy. For example, a diagram made of other pieces such as circle, square, triangle, etc.|
| [Decorator](#decorator-pattern) | Used to add new functionality to an existing object without altering its structure. |
| [Facade](#facade-pattern) | Used to provide a unified interface to a set of interfaces in a subsystem. |
| [Flyweight](#flyweight-pattern) | Used to reduce the number of objects created and to decrease memory footprint and increase performance. |
| [Proxy](#proxy-pattern) | Used to provide a placeholder for another object to control access to it. |

## Behavioral Design Patterns

Behavioral design patterns are concerned with the interaction between objects. These design patterns are used to form large object structures between many disparate objects.

| Pattern | Description |
| ------- | ----------- |
| [Chain of Responsibility](#chain-of-responsibility-pattern) | Used to achieve loose coupling in software design where a request from the client is passed to a chain of objects to process them. |
| [Command](#command-pattern) | Used to encapsulate all the information needed to perform an action or trigger an event at a later time. |
| [Interpreter](#interpreter-pattern) | Used to define a grammatical representation for a language and provides an interpreter to deal with this grammar. |
| [Iterator](#iterator-pattern) | Used to provide a standard way to traverse through a group of objects. |
| [Mediator](#mediator-pattern) | Used to define an object that encapsulates how a set of objects interact. |
| [Memento](#memento-pattern) | Used to restore state of an object to a previous state. |
| [Observer](#observer-pattern) | Used when there is one-to-many relationship between objects such as if one object is modified, its dependent objects are to be notified automatically. |
| [State](#state-pattern) | Used when an object changes its behavior based on its internal state. |
| [Strategy](#strategy-pattern) | Used when we have multiple algorithms for a specific task and client decides the actual implementation to be used at runtime. |
| [Template Method](#template-method-pattern) | Used to define a skeleton of an algorithm in a method, deferring some steps to subclasses. |
| [Visitor](#visitor-pattern) | Used when we have to perform an operation on a group of similar kind of Objects. |


