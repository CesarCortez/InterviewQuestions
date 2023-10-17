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
| 11| [What is a Join? List its different types.](#11)|
| 12| [What is a Self-Join?](#12)|
| 13| [What is a Cross-Join?](#13)|
| 14| [What is an Index? Explain its different types.](#14)|
| 15| [What is the difference between Clustered and Non-clustered index?](#15)|
| 16| [What is Data Integrity?](#16)|
| 17| [What is a Query?](#17)|
| 18 | [What is a Subquery? What are its types?](#18)|
| 19 | [What is the SELECT statement?](#19)|
| 20 | [What are some common clauses used with SELECT query in SQL?](#20)|
| 21 | [What are UNION, MINUS and INTERSECT commands?](#21)|
| 22 | [What is Cursor? How to use a Cursor?](#22)|
| 23 | [What are Entities and Relationships?](#23)|
| 24 | [List the different types of relationships in SQL.](#24)|
| 25 | [What is an Alias in SQL?](#25)|
| 26 | [What is a View?](#26)|
| 27| [What is Normalization?](#27)|
| 28| [What is Denormalization?](#28)|
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
ADD FOREIGN KEY (PersonID,Age) REFERENCES Persons(PersonID,Age);
/* Naming a foreign key */
ALTER TABLE Orders
ADD CONSTRAINT FK_PersonOrder
FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
~~~

## 11. What is a Join? List its different types.<a id="11"></a>

![Texto alternativo](./images/sql_join.jpg)

A JOIN clause is used to combine rows from two or more tables, based on a related column between them.

The SQL Join clause is used to combine records (rows) from two or more tables in a SQL database based on a related column between the two.

There are four different types of JOINs in SQL:

- **(INNER) JOIN**: Returns records that have matching values in both tables

~~~sql
SELECT *
FROM Table_A
JOIN Table_B;
/* or */
/* INNER JOIN is the default JOIN */
SELECT *
FROM Table_A
INNER JOIN Table_B;
~~~

- **LEFT (OUTER) JOIN**: Returns all records from the left table, and the matched records from the right table

~~~sql
SELECT *
FROM Table_A A
LEFT JOIN Table_B B
ON A.col = B.col;
~~~

- **RIGHT (OUTER) JOIN**: Returns all records from the right table, and the matched records from the left table

~~~sql
SELECT *
FROM Table_A A
RIGHT JOIN Table_B B
ON A.col = B.col;
~~~

- **FULL (OUTER) JOIN**: Returns all records when there is a match in either left or right table

~~~sql
SELECT *
FROM Table_A A
FULL JOIN Table_B B
ON A.col = B.col;
~~~


Given the following tables:

<table>
<tr><th>Employees</th><th>Department</th></tr>

<tr>
   <td>

   | id | name | dept_id |
   | -- | ---- | ------- |
   | 1 | Rafferty | 31 |
   | 2 | Jones | 33 |
   | 3 | Heisenberg | 31 |
   | 4 | Robinson | 34 |
   | 5 | Smith | 34 |
   | 6 | Williams | NULL |

   </td>

   <td>

   | id | Nombre |
   | -- | ------- |
   | 31 | Sales   |
   | 33 | Engineering |
   | 34 | Clerical |
   | 35 | Marketing |

   </td>
</tr> </table>

### INNER JOIN

~~~sql

SELECT Employees.name, Department.Nombre as "Department"
FROM Employees
INNER JOIN Department
ON Employees.dept_id = Department.id;

~~~

Result in:

| name | Department |
| ---- | ------- |
| Rafferty | Sales   |
| Heisenberg | Sales |
| Jones | Engineering |
| Robinson | Clerical |
| Smith | Clerical |

### LEFT JOIN

~~~sql

SELECT Employees.name, Department.Nombre as "Department"
FROM Employees
LEFT JOIN Department
ON Employees.dept_id = Department.id;

~~~

Result in:

| name | Department |
| ---- | ------- |
| Rafferty | Sales   |
| Heisenberg | Sales |
| Jones | Engineering |
| Robinson | Clerical |
| Smith | Clerical |
| Williams | NULL |

### RIGHT JOIN

~~~sql

SELECT Employees.name, Department.Nombre as "Department"
FROM Employees
RIGHT JOIN Department
ON Employees.dept_id = Department.id;

~~~

Result in:

| name | Department |
| ---- | ------- |
| Rafferty | Sales   |
| Heisenberg | Sales |
| Jones | Engineering |
| Robinson | Clerical |
| Smith | Clerical |
| NULL | Marketing |

### FULL JOIN

~~~sql

SELECT Employees.name, Department.Nombre as "Department"
FROM Employees
FULL JOIN Department
ON Employees.dept_id = Department.id;

~~~

Result in:

| name | Department |
| ---- | ------- |
| Rafferty | Sales   |
| Heisenberg | Sales |
| Jones | Engineering |
| Robinson | Clerical |
| Smith | Clerical |
| Williams | NULL |
| NULL | Marketing |


## 12. What is a Self-Join?<a id="12"></a>

A self JOIN is a case of regular join where a table is joined to itself based on some relation between its own column(s). Self-join uses the INNER JOIN or LEFT JOIN clause and a table alias is used to assign different names to the table within the query.

Given the following table:

<table>
<tr><th>Employee</th></tr>
<tr>
   <td>

   | Id | Name | Salary | supervisorId |
   | -- | ---- | ------- | ------- |
   | 1 | Rafferty | 10000 | 2 |
   | 2 | Jones | 10200 | 4 |
   | 3 | Heisenberg | 10200 | 1 |
   | 4 | Robinson | 15000 | 2 |
   | 5 | Smith | 9000 | NULL |
   | 6 | Williams | NULL | NULL |


   </td>

</tr> </table>

~~~sql
SELECT
    emp.Id,
        emp.Name,
        emp.supervisorId,
        sup.Name as Supervisor
FROM Employee emp
JOIN Employee sup
ON emp.supervisorId = sup.Id;
~~~

Result in:

| Id | Name | supervisorId | Supervisor |
| -- | ---- | ------- | ------- |
| 1 | Rafferty | 2 | Jones |
| 2 | Jones | 4 | Robinson |
| 3 | Heisenberg | 1 | Rafferty |
| 4 | Robinson | 2 | Jones |


## 13. What is a Cross-Join?<a id="13"></a>

![Texto alternativo](./images/cross_join.jpg)

Cross join can be defined as a cartesian product of the two tables included in the join. The table after join contains the same number of rows as in the cross-product of the number of rows in the two tables. If a WHERE clause is used in cross join then the query will work like an INNER JOIN.

~~~sql
SELECT stu.name, sub.subject 
FROM students AS stu
CROSS JOIN subjects AS sub;
~~~

Given the following tables:
<table>
<tr><th>students</th><th>subjects</th></tr>
<tr>
   <td>

   | id | name |
   | -- | ---- |
   | 1 | John |
   | 2 | Sam |
   | 3 | Tom |

   </td>

   <td>

   | id | subject |
   | -- | ------- |
   | 1 | Maths   |
   | 2 | Science |
   | 3 | English |
   | 4 | History |
   | 5 | Geography |
   | 6 | Civics |

   </td>
</tr> </table>

Result in:

| name | subject |
| ---- | ------- |
| John | Maths   |
| John | Science |
| John | English |
| John | History |
| John | Geography |
| John | Civics |
| Sam | Maths |
| Sam | Science |
| Sam | English |
| Sam | History |
| Sam | Geography |
| Sam | Civics |
| Tom | Maths |
| Tom | Science |
| Tom | English |
| Tom | History |
| Tom | Geography |
| Tom | Civics |


## 14. What is an Index? Explain its different types.<a id="14"></a>

A database index is a data structure that provides a quick lookup of data in a column or columns of a table. It enhances the speed of operations accessing data from a database table at the cost of additional writes and memory to maintain the index data structure.

~~~sql
CREATE INDEX index_name   /* Create Index */
ON table_name (column_1, column_2);
DROP INDEX index_name;   /* Drop Index */
~~~

There are Four types of indexes in SQL:

- **Unique Index**: It does not allow the field to have duplicate values if the column is unique indexed. If a primary key is defined, a unique index can be applied automatically.

- **Non-Unique Index**: It allows the field to have duplicate values.

- **Clustered Index**: It reorders the physical order of the table and searches based on the basis of key values. Each table can only have one clustered index.

- **Non-Clustered Index**: It does not alter the physical order of the table and maintains a logical order of the data. Each table can have many nonclustered indexes.

## 15. What is the difference between Clustered and Non-clustered index?<a id="15"></a>

As explained above, the differences can be broken down into three small factors -

- Clustered index modifies the way records are stored in a database based on the indexed column. A non-clustered index creates a separate entity within the table which references the original table.
- Clustered index is used for easy and speedy retrieval of data from the database, whereas, fetching records from the non-clustered index is relatively slower.
- In SQL, a table can have a single clustered index whereas it can have multiple non-clustered indexes.

## 16. What is Data Integrity?<a id="16"></a>

Data Integrity is the assurance of accuracy and consistency of data over its entire life-cycle and is a critical aspect of the design, implementation, and usage of any system which stores, processes, or retrieves data.

## 17. What is a Query?<a id="17"></a>

A query is a request for data or information from a database table or combination of tables. A database query can be either a select query or an action query.

~~~sql
SELECT fname, lname    /* select query */
FROM myDb.students
WHERE student_id = 1;
~~~

~~~sql
UPDATE myDB.students    /* action query */
SET fname = 'Captain', lname = 'America'
WHERE student_id = 1;
~~~

## 18. What is a Subquery? What are its types?<a id="18"></a>

A subquery is a query within another query, also known as a nested query or inner query. 

It is used to restrict or enhance the data to be queried by the main query, thus restricting or enhancing the output of the main query respectively. 

~~~sql
SELECT name, email, mob, address
FROM myDb.contacts
WHERE roll_no IN (
 SELECT roll_no
 FROM myDb.students
 WHERE subject = 'Maths');
~~~

There are two types of subquery - Correlated and Non-Correlated.

- **Correlated Subquery**: A subquery that uses values from the outer query is called a correlated subquery. In this case, the inner query is executed multiple times, once for each row returned by the outer query.

- **Non-Correlated Subquery**: A subquery that is executed independently of the outer query and cannot access the values from the outer query is called a non-correlated subquery. In this case, the inner query is executed first, and the results are fed to the outer query.

## 19. What is the SELECT statement?<a id="19"></a>

SELECT operator in SQL is used to select data from a database. The data returned is stored in a result table, called the result-set.

~~~sql

SELECT column1, column2, ...
FROM table_name;

~~~

## 20. What are some common clauses used with SELECT query in SQL?<a id="20"></a>

Some common SQL clauses used in conjuction with a SELECT query are as follows:

- **WHERE**: It is used to filter records based on a specified condition.

- **GROUP BY**: It is used to group the result-set by one or more columns.

- **HAVING**: It is used to filter records based on a specified condition, used only with GROUP BY (Aggregations) .

- **ORDER BY**: It is used to sort the result-set by one or more columns.

~~~sql
SELECT *
FROM myDB.students
WHERE graduation_year = 2019
ORDER BY studentID DESC;
~~~

~~~sql
SELECT COUNT(studentId), country
FROM myDB.students
WHERE country != "INDIA"
GROUP BY country
HAVING COUNT(studentID) > 5;
~~~

## 21. What are UNION, MINUS and INTERSECT commands?<a id="21"></a>

- The UNION operator combines and returns the result-set retrieved by two or more SELECT statements.

- The MINUS operator in SQL is used to remove duplicates from the result-set obtained by the second SELECT query from the result-set obtained by the first SELECT query and then return the filtered results from the first.

- The INTERSECT clause in SQL combines the result-set fetched by the two SELECT statements where records from one match the other and then returns this intersection of result-sets.

Certain conditions need to be met before executing either of the above statements in SQL:

- Each SELECT statement within the clause must have the same number of columns
- The columns must also have similar data types
- The columns in each SELECT statement should necessarily have the same order

~~~sql
/*UNION */
SELECT name FROM Students   /* Fetch the union of queries */
UNION
SELECT name FROM Contacts;
SELECT name FROM Students   /* Fetch the union of queries with duplicates*/
UNION ALL
SELECT name FROM Contacts;

/*MINUS */
SELECT name FROM Students   /* Fetch names from students */
MINUS     /* that aren't present in contacts */
SELECT name FROM Contacts;

/*INTERSECT */
SELECT name FROM Students   /* Fetch names from students */
INTERSECT    /* that are present in contacts as well */
SELECT name FROM Contacts;
~~~

## 22. What is Cursor? How to use a Cursor?<a id="22"></a>

A database cursor is a control structure that allows for the traversal of records in a database. 

Cursors, in addition, facilitates processing after traversal, such as retrieval, addition, and deletion of database records.

They can be viewed as a pointer to one row in a set of rows.

## 23. What are Entities and Relationships?<a id="23"></a>

- Entity: An entity can be a real-world object, either tangible or intangible, that can be easily identifiable.
    - For example, in a college database, students, professors, workers, departments, and projects can be referred to as entities. Each entity has some associated properties that provide it an identity.
- Relationships: Relations or links between entities that have something to do with each other. 
   - For example - The employee's table in a company's database can be associated with the salary table in the same database.

![Texto alternativo](./images/Entities_and_Relationships.jpg)

## 24. List the different types of relationships in SQL.<a id="24"></a>

- One-to-One - This can be defined as the relationship between two tables where each record in one table is associated with the maximum of one record in the other table.
    - In One-to-One relationship, one record of the first table will be linked to zero or one record of another table
    - For example, each employee in the Employee table will have a corresponding row in EmployeeDetails table that stores the current passport details for that particular employee. So, each employee will have zero or one record in the EmployeeDetails table
![Texto alternativo](./images/onetoone.png)
- One-to-Many & Many-to-One - This is the most commonly used relationship where a record in a table is associated with multiple records in the other table.
   - The Employee table stores employee records where EmployeeID is the primary key. The Address table holds the addresses of employees where AddressID is a primary key and EmployeeID is a foreign key. Each employee will have one record in the Employee table. Each employee can have many addresses such as Home address, Office Address, Permanent address, etc.
![Texto alternativo](./images/onetomany.png)
- Many-to-Many - This is used in cases when multiple instances on both sides are needed for defining a relationship.
   -  As an example, an employee in the Employee table can have many skills from the EmployeeSkill table and also, one skill can be associated with one or more employees.
![Texto alternativo](./images/manytomany.png)
- Self-Referencing Relationships - This is used when a table needs to define a relationship with itself.

## 25. What is an Alias in SQL?<a id="25"></a>

It is a temporary name assigned to the table or table column for the purpose of a particular SQL query.

 In addition, aliasing can be employed as an obfuscation technique to secure the real names of database fields. A table alias is also called a correlation name.

 An alias is represented explicitly by the AS keyword but in some cases, the same can be performed without it as well. Nevertheless, using the AS keyword is always a good practice.

~~~sql
SELECT A.emp_name AS "Employee"  /* Alias using AS keyword */
B.emp_name AS "Supervisor"
FROM employee A, employee B   /* Alias without AS keyword */
WHERE A.emp_sup = B.emp_id;
~~~

## 26. What is a View?<a id="26"></a>

A view in SQL is a virtual table based on the result-set of an SQL statement. 

A view contains rows and columns, just like a real table. The fields in a view are fields from one or more real tables in the database.

![Texto alternativo](./images/SQL_View.jpg)

## 27. What is Normalization?<a id="27"></a>

Normalization represents the way of organizing structured data in the database efficiently. 

It includes the creation of tables, establishing relationships between them, and defining rules for those relationships. 

Inconsistency and redundancy can be kept in check based on these rules, hence, adding flexibility to the database.

## 28. What is Denormalization?<a id="28"></a>

Denormalization is the inverse process of normalization, where the normalized schema is converted into a schema that has redundant information. 

The performance is improved by using redundancy and keeping the redundant data consistent.

 The reason for performing denormalization is the overheads produced in the query processor by an over-normalized structure.