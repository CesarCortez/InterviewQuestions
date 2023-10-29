### Table of Contents - MongoDB

| No. | Questions |
| --- | --------- |
|   | **MongoDB** |
| 1 | [What is MongoDB?](#1)|
| 2 | [What are the difference between NoSQL and SQL](#2)|
| 3 | [How to establish MongoDB database connection in a node application?](#3)|
| 4 | [What are Indexes in MongoDB?](#4)|
| 5 | [What are secondary indexes?](#5)|
| 6 | [What are some of the advantages of MongoDB?](#6)|
| 7 | [What are some of the disadvantages of MongoDB?](#7)|
| 8 | [Sharding vs Replication vs Partitioning](#8)|
| 9 | [What is a Document in MongoDB?](#9)|
| 10| [What is a Collection in MongoDB?](#10)|
| 11| [What is a Database in MongoDB?](#11)|
| 12| [What is a Field in MongoDB?](#12)|
| 13| [What is a Subdocument in MongoDB?](#13)|
| 14| [What is a Nested Field in MongoDB?](#14)|
| 15| [What is a Primary Key in MongoDB?](#15)|
| 16| [What is a Replica Set in MongoDB?](#16)|
| 17| [What is the Mongo Shell?](#17)|
| 18| [How does Scale-Out occur in MongoDB?](#18)|
| 19| [What are some features of MongoDB?](#19)|
| 20| [How to add data in MongoDB?](#20)|

## 1. What is MongoDB?<a id="1"></a>

- MongoDB is an open-source NoSQL database written in C++ language. It uses JSON-like documents with optional schemas.
- It provides easy scalability and is a cross-platform, document-oriented database.
- MongoDB works on the concept of Collection and Document.
- It combines the ability to scale out with features such as secondary indexes, range queries, sorting, aggregations, and geospatial indexes.
- MongoDB is developed by MongoDB Inc. and licensed under the Server Side Public License (SSPL).
   

## 2. What are the difference between NoSQL and SQL? <a id="2"></a>

   | Parameter | SQL | NOSQL |
   | --------- | --- | ----- |
   |Definition |SQL databases are primarily called RDBMS or Relational Databases |NoSQL databases are primarily called as Non-relational or distributed database |
   |Query Language|Structured query language (SQL) |No declarative query language |
   |Type |	SQL databases are table based databases |NoSQL databases can be document based, key-value pairs, graph databases |
   |Schema |SQL databases have a predefined schema |NoSQL databases use dynamic schema for unstructured data. |
   |Ability to scale |SQL databases are vertically scalable |NoSQL databases are horizontally scalable |
   |Examples|Oracle, Postgres, and MS-SQL. |	MongoDB, Redis, Neo4j, Cassandra, Hbase.|
   |Best suited for |An ideal choice for the complex query intensive environment. |It is not good fit complex queries. |
   |Hierarchical data storage |SQL databases are not suitable for hierarchical data storage.|More suitable for the hierarchical data store as it supports key-value pair method |
   |Variations|	One type with minor variations|Many different types which include key-value stores, document databases, and graph databases|
   |Consistency |It should be configured for strong consistency. |It depends on DBMS as some offers strong consistency like MongoDB, whereas others offer only offers eventual consistency, like Cassandra. |
   |Hardware|Specialized DB hardware (Oracle Exadata, etc.)|Commodity hardware |
   |Network |Highly available network (Infiniband, Fabric Path, etc.) |Commodity network (Ethernet, etc.) |
   |Best features |Cross-platform support, Secure and free |Easy to use, High performance, and Flexible tool. |
   |Top Companies Using |Hootsuite, CircleCI, Gauges |Airbnb, Uber, Kickstarter |
   |ACID vs. BASE Mode|ACID( Atomicity, Consistency, Isolation, and Durability) is a standard for RDBMS |Base ( Basically Available, Soft state, Eventually Consistent) is a model of many NoSQL systems |
   |Average salary|₹ 5,58,704 per year|₹ 6,04,959 per year|
   
   

## 3. How to establish MongoDB database connection in a node application? <a id="3"></a>

   **Install MongoDB**<br/>

	**Database Connection**
	Create a file ./config/database.js under the project root.

	Database Connection

	Next, we will add code that connects to the database.

	in database.js file 
  
~~~js
	const mongoose = require('mongoose');
	const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
	const database = 'fcc-Mail';      // REPLACE WITH YOUR DB NAME

     mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
 
	module.exports = { mongoose }
~~~
**MongoDB Atlas**
	sign up to mongosb atlas and it will help you make a connection by url, having a secret key and password

## 4. What are Indexes in MongoDB? <a id="4"></a>

   Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan, i.e. scan every document in a collection, to select those documents that match the query statement. If an appropriate index exists for a query, MongoDB can use the index to limit the number of documents it must inspect.

### Index Types
   MongoDB provides several index types and strengths to support various data access patterns.

   - **Single Field Indexes**
   The simplest index, a single field index, indexes on a single field in a document.

   - **Compound Indexes**
   A compound index can include one or more fields of any type except for array. MongoDB indexes each field in the index in ascending order or descending order separately, and can include references to other documents.

   - **Multikey Indexes**
   MongoDB can index arrays, so that you can index fields that contain arrays.

   - **Geospatial Indexes**
   MongoDB supports two types of geospatial indexes: 2d indexes that use planar geometry and 2dsphere indexes that use spherical geometry.

   - **Text Indexes**
   Text indexes support search of string content in documents.

   - **Hashed Indexes**
   Hashed indexes do not support range-based queries. You cannot use a hashed index for sort operations.

   - **Unique Indexes**
   Unique indexes prevent clients from inserting documents that have duplicate values for the indexed field(s). By default, MongoDB creates a unique index on the _id field during the creation of a collection.

   - **Wildcard Indexes**
    Wildcard indexing is an index that can filter and automatically matches any field, sub-document, or array in a collection and then index those matches


## 5. What are secondary indexes? <a id="5"></a>

 The primary index is typically created when the database is created and is used as the primary means of accessing data in the database. Secondary indexes, on the other hand, can be created and dropped at any time, allowing for greater flexibility in managing the database.

## 6. What are some of the advantages of MongoDB? <a id="6"></a>

Some advantages of MongoDB are as follows:

- MongoDB supports field, range-based, string pattern matching type queries. for searching the data in the database 
- MongoDB support primary and secondary index on any fields
- MongoDB basically uses JavaScript objects in place of procedures
- MongoDB uses a dynamic database schema
- MongoDB is very easy to scale up or down
- MongoDB has inbuilt support for data partitioning (Sharding).

## 7. What are some of the disadvantages of MongoDB? <a id="7"></a>

Some disadvantages of MongoDB are as follows:

- MongoDB does not support joins
- In case if the indexing is implemented incorrectly or has any discrepancies, MongoDB will perform at a very low speed.
- MongoDB allows a limited size of only 16 MB for a document. Performance nesting for documents is also limited to only 100 levels.

## 8. Sharding vs Replication vs Partitioning <a id="8"></a>

- **Sharding** MongoDB uses sharding while handling large datasets. Sharding is the process of dividing data from a large set and distributing it to multiple servers.
In case, there is an issue where the server cannot handle the data due to its size, it automatically divides it further without pausing the activity
- **Replication** MongoDB uses replication to provide high availability. Replication is the process of synchronizing data across multiple servers. Replication provides redundancy and increases data availability with multiple copies of data on different database servers.
- **Partitioning** MongoDB uses partitioning to store data in multiple servers. Partitioning is the process of splitting data across different servers. MongoDB partitioning is known as “sharding”.
**Sharding distributes data across multiple servers, while partitioning splits tables within one server**

## 9. What is a Document in MongoDB? <a id="9"></a>

A Document in MongoDB is an ordered set of keys with associated values. It is represented by a map, hash, or dictionary. In JavaScript, documents are represented as objects:

~~~js
{
  name: "John",
  age: 25,
  status: "single"
}
~~~

## 10. What is a Collection in MongoDB? <a id="10"></a>

A collection in MongoDB is a group of documents. If a document is the MongoDB analog of a row in a relational database, then a collection can be thought of as the analog to a table.
Documents within a single collection can have any number of different “shapes.”, i.e. collections have dynamic schemas. 
For example, both of the following documents could be stored in a single collection:

~~~js
{
  name: "John",
  age: 25,
  status: "single"
},
{
  name: "Jane",
  age: 30,
  status: "married",
  children: ["Sam", "Alex"]
}
~~~

## 11. What is a Database in MongoDB? <a id="11"></a>

MongoDB groups collections into databases. MongoDB can host several databases, each grouping together collections. 
Some reserved database names are as follows:
- admin
- local
- config

## 12. What is a Field in MongoDB? <a id="12"></a>

A field is a key-value pair in a document. A document has zero or more fields. Fields are analogous to columns in relational databases.

## 13. What is a Subdocument in MongoDB? <a id="13"></a>

A subdocument is a document nested in another document. Subdocuments are analogous to nested objects in object-oriented programming languages.

## 14. What is a Nested Field in MongoDB? <a id="14"></a>

A nested field is a field within a subdocument. Nested fields are analogous to nested object fields in object-oriented programming languages.

## 15. What is a Primary Key in MongoDB? <a id="15"></a>

A primary key is a unique identifier for a document in a collection. Every MongoDB document has a primary key that is automatically assigned by MongoDB on document creation. The primary key is always stored in the _id field.

## 16. What is a Replica Set in MongoDB? <a id="16"></a>

A replica set is a group of MongoDB servers that maintain the same data set, providing redundancy and increasing data availability. A replica set contains several data bearing nodes and optionally one arbiter node. Of the data bearing nodes, one and only one member is deemed the primary node, while the other nodes are deemed secondary nodes. The primary node receives all write operations. A replica set can have only one primary capable of confirming writes with { w: "majority" } write concern; although in some circumstances, another mongod instance may transiently believe itself to also be primary. Replica sets can have only one arbiter.

## 17. What is the Mongo Shell? <a id="17"></a>

The mongo shell is an interactive JavaScript interface to MongoDB. You can use the mongo shell to query and update data as well as perform administrative operations.

To start the shell, run the mongo executable:

~~~js
$ mongod
$ mongo
MongoDB shell version: 4.2.0
connecting to: test
>
~~~

## 18. How does Scale-Out occur in MongoDB? <a id="18"></a>

The document-oriented data model of MongoDB makes it easier to split data across multiple servers. Balancing and loading data across a cluster is done by MongoDB. It then redistributes documents automatically.

The mongos acts as a query router, providing an interface between client applications and the sharded cluster.

Config servers store metadata and configuration settings for the cluster. MongoDB uses the config servers to manage distributed locks. Each sharded cluster must have its own config servers.

![req methods](./images/ScaleOut.jpg)

## 19. What are some features of MongoDB? <a id="19"></a>

- **Indexing**: It supports generic secondary indexes and provides unique, compound, geospatial, and full-text indexing capabilities as well.
- **Aggregation**: It provides an aggregation framework based on the concept of data processing pipelines.
- **Special collection and index types**: It supports time-to-live (TTL) collections for data that should expire at a certain time
- **File storage**: It supports an easy-to-use protocol for storing large files and file metadata.
- **Sharding**: Sharding is the process of splitting data up across machines.

## 20. How to add data in MongoDB? <a id="20"></a>

To add data in MongoDB, we use the **insert()** or **save()** method. The insert() method inserts a record in the collection whereas the save() method replaces the existing document with the new document passed in the save() method.
**InsertMany()** method is used to insert multiple documents in a collection.

~~~js
db.collection.insert(document); // inserts a record or records in a collection
// or
db.collection.save({"b": 3}, {'c': 4});
db.collections.insetOne(document);//inserts a single record in a collection
db.collection.save(document);//replaces the existing document
//or
db.collection.insertMany([document1, document2, ...]); //inserts multiple records in a collection
~~~

# ------------------Mongoose------------------


### Table of Contents - Mongoose

| No. | Questions |
| --- | --------- |
|   | **Mongoose** |
| 1 | [What is MongoDB?](#what-is-mongodb)|
| 2 | [What are the difference between NoSQL and SQL](#what-are-the-difference-between-nosql-and-sql)|
| 3 | [How to establish MongoDB database connection in a node application?](#how-to-establish-mongodb-database-connection-in-a-node-application)|
| 4 | [What are virtual property in mongoose](#what-are-virtual-property-in-mongoose)|
| 5 | [How can we add or create our own instance methods in mongoose](#how-can-we-add-or-create-our-own-instance-methods-in-mongoose)|
| 6 | [How can we add or create our own static methods in mongoose](#how-can-we-add-or-create-our-own-static-methods-in-mongoose)|
| 7 | [What are the mongoose middlewares?](#what-are-the-mongoose-middlewares)|
| 8 | [How to query data using mongoose?](#how-to-query-data-using-mongoose)|
| 9 | [What is Population in mongoose](#what-is-population-in-mongoose)|
| 10| [What is Datamasking?](#what-is-datamasking)|
| 11| [What is hashing and explain how it works?](#what-is-hashing-and-explain-how-it-works)|
| 12| [What are salts and why are they so important?](#what-are-salts-and-why-are-they-so-important)|
| 13| [What are pepper and why are they so important?](#what-are-pepper-and-why-are-they-so-important)|
| 14| [What are JWT?](#what-are-jwt)|
| 15| [What are different authentication methods?](#what-are-different-authentication-methods)|
| 16| [What are disadvantages of using session based authentication?](#what-are-disadvantages-of-using-session-based-authentication)|
| 17| [What are disadvantages of using jwt based authentication?](#what-are-disadvantages-of-using-jwt-based-authentication)|


4. ### What are virtual property in mongoose?

  A virtual property is not persisted to the database. We can add it to our schema as a helper to get and set values.but it wont store in database
  
  ```
	userSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName
	})
	
	userSchema.virtual('fullName').set(function(name) {
	let str = name.split(' ')
  
	this.firstName = str[0]
	this.lastName = str[1]
	})
	
	const user = new User()
	user.fullName = 'Thomas Anderson'
	console.log(user.toJSON())  // Output model fields as JSON
	console.log()
	console.log(user.fullName)  // Output the full name
	//The code above will output the following:

	{ _id: 5a7a4248550ebb9fafd898cf,
		firstName: 'Thomas',
		lastName: 'Anderson' }
	//Thomas Anderson
  ```

**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**


5. ### How can we add or create our own instance methods in mongoose?

   We can create custom helper methods on the schema and access them via the model instance. These methods will have access to the model object and they can be used quite creatively
   
   ```
	userSchema.methods.details = function() {
	return this.username + ' - ' +  this.email
	}
	//This method will be accessible via a model instance:
	const user = new User({
	username: 'user2',
	email: 'user2@gmail.com'
	})
	```

**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**


6. ### How can we add or create our own static methods in mongoose?

  Similar to instance methods, we can create static methods on the schema. Let’s create a method to retrieve all users in the database:
  ```
  userSchema.statics.getUsers = function() {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if(err) {
        console.error(err)
        return reject(err)
      }
      resolve(docs)
			})
		})
	}
  ```

**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**

7. ### What are the mongoose middlewares?

   Middleware are functions that run at specific stages of a pipeline. Mongoose supports middleware for the following operations:<br/>

	Aggregate<br/>
	Document<br/>
	Model<br/>
	Query<br/>

**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**

8. ### How to query data using mongoose?

   Mongoose has a very rich API that handles many complex operations supported by MongoDB. Consider a query where we can incrementally build query components.<br/>

	In this example, we are going to:<br/>

	Find all users<br/>
	Skip the first 100 records<br/>
	Limit the results to 10 records<br/>
	Sort the results by the firstName field<br/>
	Select the firstName<br/>
	Execute that query<br/>
	```
	User.find()                   // find all users
         .skip(100)                // skip the first 100 items
         .limit(10)                // limit to 10 items
         .sort({firstName: 1}      // sort ascending by firstName
         .select({firstName: true} // select firstName only
         .exec()                   // execute the query
         .then(docs => {
            console.log(docs)
          })
         .catch(err => {
            console.error(err)
          })
	```

**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**

9. ### What is Population in mongoose?

  Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). We may populate a single document, multiple documents, plain object, multiple plain objects, or all objects returned from a query.

**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**

10. ### What is Datamasking?

  Data masking is a method of creating a structurally similar but inauthentic version of an organization's data that can be used for purposes such as software testing and user training. The purpose is to protect the actual data while having a functional substitute for occasions when the real data is not required.<br/>
  you can simply use **$project** to hide the mobile field<br/>
  Or perhaps you have an extra field in your document to indicate whether the information is public or not, i.e. given documents<br/>

**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**

11. ### What is hashing and explain how it works?

  Hashing is the process of converting an input of any length into a fixed size string of text, using a mathematical function.
  ![hashing](https://miro.medium.com/max/4000/0*Zkd2fcKuVGirbNpl.png)
  When the user provides a input it will be converted to a value of fixed length by a hashing function and the resulting value will be called as hashed text, and it should be always unique for different value
  
**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**

12. ### What are salts and why are they so important?

  It's a unique value that can be added to the end of the password to create a different hash value. This adds a layer of security to the hashing process<br/>
  They are so important as they prevent **brute force attacks**(Trying all possible combintaion of password) and also against **rainbow table**(a table containing all common hashed text and their respective passwords)<br/>
  
**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**

13. ### What are pepper and why are they so important?

	A pepper is a secret added to an input such as a password prior to being hashed with a cryptographic hash function<br/>
	A pepper performs a comparable role to a salt, but while a salt is not secret (merely unique) and can be stored alongside the hashed output<br/> A pepper is secret and must not be stored with the output. The hash and salt are usually stored in a database, but a pepper must be stored separately (e.g. in a configuration file) to prevent it from being obtained by the attacker in case of a database breach. <br/> Where the salt only has to be long enough to be unique, a pepper has to be secure to remain secret (at least 112 bits is recommended by NIST), otherwise an attacker only needs one known entry to crack the pepper.<br/> Finally, the pepper must be generated anew for every application it is deployed in, otherwise a breach of one application would result in lowered security of another application.


  
**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**

14. ### What are JWT?

	JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object<br/>
	some scenarios where JSON Web Tokens are useful:<br/>
	**Authorization**: This is the most common scenario for using JWT. Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token. Single Sign On is a feature that widely uses JWT nowadays, because of its small overhead and its ability to be easily used across different domains.<br/>

	**Information Exchange**: JSON Web Tokens are a good way of securely transmitting information between parties. Because JWTs can be signed—for example, using public/private key pairs—you can be sure the senders are who they say they are. Additionally, as the signature is calculated using the header and the payload, you can also verify that the content hasn't been tampered with.<br/>
	
	![jwt](https://research.securitum.com/wp-content/uploads/sites/2/2019/10/jwt_ng1_en.png)


  
**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**

15. ### What are different authentication methods?

	

    Use **API keys** if you expect developers to build internal applications that don’t need to access more than a single user’s data.<br/>
    Use **OAuth** access tokens if you want users to easily provide authorization to applications without needing to share private data or dig through developer documentation.<br/>
	Use **session cookies**, here server is responsible for creating a session for the particular user when the user log's in, after that the id of the session is stored in a cookie on the user browser. For every request sent by the user, the cookie will be sent too, where the server can compare the session id from the cookie with the session information stored on the server so the user identity is verified.
  



  
**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**


16. ### What are disadvantages of using session based authentication?

	

   **Compromised Secret Key** : The best and the worst thing about JWT is that it relies on just one Key. Consider that the Key is leaked by a careless or a rogue developer/administrator, the whole system is compromised!<br/>
  **Cannot manage client from the server**<br/>**Cannot push Messages to clients** <br/>**Crypto-algo can be deprecated**<br/>**Data Overhead** : The size of the JWT token will be more than that of a normal Session token<br/>Complicated to understand: JWT uses cryptographic Signature algorithms to verify the data and get the user-id from the token. Understanding the Signing Algo in itself requires basics of cryptography. <br/>



  
**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**


17. ### What are disadvantages of using jwt based authentication?

	

   **Session based authentication**:<br/> Because the sessions are stored in the server’s memory, scaling becomes an issue when there is a huge number of users using the system at once.<br/>Cookies normally work on a single domain or subdomains and they are normally disabled by browser if they work cross-domain (3rd party cookies). It poses issues when APIs are served from a different domain to mobile and web devices.



  
**[ Back to Top ⬆ ](#table-of-contents---mongodb-and-mongoose)**