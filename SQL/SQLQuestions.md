| No. | Questions |
| --- | --------- |
|   | **SQL** |
| 1 | [What is Database?](#1)|
| 2 | [What is DBMS?](#2)|
| 3 | [What is RDBMS? How is it different from DBMS?](#3)|
| 4 | [What is SQL?](#4)|
| 5 | [What is the difference between SQL and MySQL?](#5)|
| 6 | [What are Tables and Fields?](#6)|
| 7 | [What are Constraints in SQL?](#7)|
| 8 | [What is a Primary Key?](#8)|
| 9 | [What is a UNIQUE constraint?](#9)|
| 10| [What is a Foreign Key?](#10)|
| 11| [Explain React state and props.](#11)|
| 12| [Explain about types of side effects in React component.](#12)|
| 13| [What is prop drilling in React?](#13)|
| 14| [What are error boundaries?](#14)|
| 15| [What is React Hooks?](#15)|
| 16| [Explain React Hooks.](#16)|
| 17| [What are the rules that must be followed while using React Hooks?](#17)|
| 18 | [What is the use of useEffect React Hooks?](#18)|
| 19 | [Why do React Hooks make use of refs?](#19)|
| 20 | [What are Custom Hooks?](#20)|
| 21 | [Explain Strict Mode in React.](#21)|
| 22 | [How to prevent re-renders in React?](#22)|
| 23 | [What are the different ways to style a React component?](#23)|
| 24 | [Name a few techniques to optimize React app performance.](#24)|
| 25 | [How to pass data between react components?](#25)|
| 26 | [What are Higher Order Components?](#26)|
| 27| [What are the different phases of the component lifecycle?](#27)|
| 28| [What are the lifecycle methods of React?](#28)|
| 29| [Does React Hook work with static typing?](#29)|
| 30| [Explain about types of Hooks in React.](#30)|
| 31| [Differentiate React Hooks vs Classes.](#31)|
| 32| [What is React Router?](#32)|
| 33| [Can React Hook replaces Redux?](#33)|
| 34| [Explain conditional rendering in React.](#34)|
| 35| [Explain how to create a simple React Hooks example program.](#35)|
| 36| [How to create a switching component for displaying different pages?](#36)|
| 37| [How to re-render the view when the browser is resized?](#37)|
| 38| [How to pass data between sibling components using React router?](#38)|
| 39| [How to perform automatic redirect after login?](#39)|

## 1. What is Database?<a id="1"></a>

A database is an organized collection of data, stored and retrieved digitally from a remote or local computer system. Databases can be vast and complex, and such databases are developed using fixed design and modeling approaches.

## 2. What is DBMS?<a id="2"></a>

DBMS stands for Database Management System. DBMS is a system software responsible for the creation, retrieval, updation, and management of the database. It ensures that our data is consistent, organized, and is easily accessible by serving as an interface between the database and its end-users or application software.

## 3. What is RDBMS? How is it different from DBMS?<a id="3"></a>

RDBMS stands for Relational Database Management System. The key difference here, compared to DBMS, is that RDBMS stores data in the form of a collection of tables, and relations can be defined between the common fields of these tables. Most modern database management systems like MySQL, Microsoft SQL Server, Oracle, IBM DB2, and Amazon Redshift are based on RDBMS.

## 4. What is SQL?<a id="4"></a>

SQL stands for Structured Query Language. It is the standard language for relational database management systems. It is especially useful in handling organized data comprised of entities (variables) and relations between different entities of the data.

## 5. What is the difference between SQL and MySQL?<a id="5"></a>

SQL is a standard language for retrieving and manipulating structured databases. On the contrary, MySQL is a relational database management system, like SQL Server, Oracle or IBM DB2, that is used to manage SQL databases.

## 6. What are Tables and Fields?<a id="6"></a>

- A table is an organized collection of data stored in the form of rows and columns. 
- Columns can be categorized as vertical, and Rows are horizontal.
- Columns are also called as fields, and rows are also called as records.

## 7. What are Constraints in SQL?<a id="7"></a>

Constraints are used to specify the rules concerning data in the table. It can be applied for single or multiple fields in an SQL table during the creation of the table or after creating using the ALTER TABLE command.

- **NOT NULL** - Restricts NULL value from being inserted into a column.
- **CHECK** - Verifies that all values in a field satisfy a condition.
- **DEFAULT** - Automatically assigns a default value if no value has been specified for the field.
- **UNIQUE** - Ensures unique values to be inserted into the field.
- **INDEX** - Indexes a field providing faster retrieval of records.
- **PRIMARY KEY** - Uniquely identifies each record in a table.
- **FOREIGN KEY** - Ensures referential integrity for a record in another table

## 8. What is a Primary Key?<a id="8"></a>

The PRIMARY KEY constraint uniquely identifies each row in a table. It must contain UNIQUE values and has an implicit NOT NULL constraint.
A table in SQL is strictly restricted to have one and only one primary key, which is comprised of single or multiple fields (columns).

~~~sql
CREATE TABLE Students (   /* Create table with a single field as primary key */
   ID INT NOT NULL
   Name VARCHAR(255)
   PRIMARY KEY (ID)
);

CREATE TABLE Students (   /* Create table with multiple fields as primary key */
   ID INT NOT NULL
   LastName VARCHAR(255)
   FirstName VARCHAR(255) NOT NULL,
   CONSTRAINT PK_Student
   PRIMARY KEY (ID, FirstName)
);

ALTER TABLE Students   /* Set a column as primary key */
ADD PRIMARY KEY (ID);
ALTER TABLE Students   /* Set multiple columns as primary key */
ADD CONSTRAINT PK_Student   /*Naming a Primary Key*/
PRIMARY KEY (ID, FirstName);
~~~

## 9. What is a UNIQUE constraint?<a id="9"></a>

A UNIQUE constraint ensures that all values in a column are different. Unlike primary key, there can be multiple unique constraints defined per table. The code syntax for UNIQUE is quite similar to that of PRIMARY KEY and can be used interchangeably.

~~~sql
CREATE TABLE Students (   /* Create table with a single field as unique */
   ID INT NOT NULL UNIQUE
   Name VARCHAR(255)
);

CREATE TABLE Students (   /* Create table with multiple fields as unique */
   ID INT NOT NULL
   LastName VARCHAR(255)
   FirstName VARCHAR(255) NOT NULL
   CONSTRAINT PK_Student
   UNIQUE (ID, FirstName)
);

ALTER TABLE Students   /* Set a column as unique */
ADD UNIQUE (ID);
ALTER TABLE Students   /* Set multiple columns as unique */
ADD CONSTRAINT PK_Student   /* Naming a unique constraint */
UNIQUE (ID, FirstName);
~~~

## 10. What is a Foreign Key?<a id="10"></a>

A FOREIGN KEY comprises of single or collection of fields in a table that essentially refers to the PRIMARY KEY in another table.

Foreign key constraint ensures referential integrity in the relation between two tables.

**Note**: Referential integrity ensures that the value or existence of one column (or collection of columns) of a table depends on the value or existence of another column (or collection of columns) in another table.

The table with the foreign key constraint is labeled as the child table, and the table containing the candidate key is labeled as the referenced or parent table.

The syntax of the SQL FOREIGN KEY constraint is:

~~~sql
CREATE TABLE table_name (
    column1 data_type,
    column2 data_type,
    ...,
    FOREIGN KEY (column_name)
    REFERENCES referenced_table_name (referenced_column_name)
);
~~~

Here:

- **table_name** - is the name of the table where the FOREIGN KEY constraint is to be defined
- **column_name1, column_name2, ...** - is the name of the column where the FOREIGN KEY constraint is to be defined
- **referenced_table_name** and **referenced_column_name** - are the names of the table and the column that the FOREIGN KEY constraint references

![Texto alternativo](./images/FKey.png)

~~~sql
/* Create table with a single field as foreign key */
CREATE TABLE Orders (
    OrderID int NOT NULL,
    OrderNumber int NOT NULL,
    PersonID int,
    PRIMARY KEY (OrderID),
    FOREIGN KEY (PersonID) REFERENCES Persons(PersonID)
);
/* Create table with multiple fields as foreign key */
ALTER TABLE Orders
ADD FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
/* Naming a foreign key */
ALTER TABLE Orders
ADD CONSTRAINT FK_PersonOrder
FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
~~~