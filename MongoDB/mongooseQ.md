### Table of Contents - Mongoose

| No. | Questions |
| --- | --------- |
|   | **Mongoose** |
| 1 | [What is Mongoose?](#1)|
| 2 | [Can you explain how to connect to a MongoDB using Mongoose?](#2)|
| 3 | [Can you give me an example of how you would define a schema in Mongoose?](#3)|
| 4 | [How do the Schema and Model objects work together?](#4)|
| 5 | [How can we use mongoose models to create, read, update, and delete documents from our database?](#5)|
| 6 | [How do we specify validation rules for data fields when defining our schema?](#6)|
| 7 | [In what situations is it best to use a Mongoose virtual field over a normal one?](#7)|
| 8 | [What’s the difference between static methods and instance methods in Mongoose?](#8)|
| 9 | [ What are some ways to validate Mongoose schemas?](#what-are-virtual-property-in-mongoose)|
| 10| [What are middleware functions in Mongoose?](#what-are-virtual-property-in-mongoose)|
| 11| [How does Mongooe handle concurrency issues with multiple users writing to the same document?](#what-are-virtual-property-in-mongoose)|
| 12| [What is your opinion on the performance of Mongoose?](#what-are-virtual-property-in-mongoose)|
| 13| [What are pre-hooks and post-hooks in Mongoose?](#what-are-virtual-property-in-mongoose)|
| 14| [Why should I use Mongoose over raw MongoDB queries?](#what-are-virtual-property-in-mongoose)|
| 15| [What’s the difference between findOne() and findById()?](#what-are-virtual-property-in-mongoose)|
| 16| [Is it possible to have more than one model per collection with Mongoose? If yes then why would you want to do that?](#what-are-virtual-property-in-mongoose)|
| 17| [Can you explain what populate() is used for in Mongoose?](#what-are-virtual-property-in-mongoose)|
| 18| [What is the purpose of $where in Mongoose queries?](#what-are-virtual-property-in-mongoose)|
| 19| [Can you give some examples of common query operators in Mongoose?](#what-are-virtual-property-in-mongoose)|
| 20| [What are some tips to keep in mind while designing Mongoose Schemas?](#what-are-virtual-property-in-mongoose)|

## 1. What is Mongoose? <a id="1"></a>

Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.

## 2. Can you explain how to connect to a MongoDB using Mongoose? <a id="2"></a>

In order to connect to a MongoDB using Mongoose, you will need to first install the Mongoose npm package. Once you have done that, you can use the Mongoose.connect() function to connect to your MongoDB database.

~~~js

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true, useUnifiedTopology: true});

~~~

## 3. Can you give me an example of how you would define a schema in Mongoose? <a id="3"></a>

A schema in Mongoose is simply a representation of the structure of your data. For example, if you were creating a schema for a blog post, it might look something like this:

~~~js

var blogSchema = new mongoose.Schema({
title: String,
body: String,
date: { type: Date, default: Date.now },
comments: [{ type: mongoose.Schema.Types.ObjectId, ref: ‘Comment’ }] // this is a reference to another collection
});

~~~

This schema defines a few key things about our data: that it will have a title and body (both strings), a date (with a default value of the current date and time), and an array of comments (which are ObjectIds that reference the Comment model).

## 4. How do the Schema and Model objects work together? <a id="4"></a>

- **Schema object** contains information about the structure of the data in the collection
- **Model object** contains functions that allow you to interact with the data in the collection.

## 5. How can we use mongoose models to create, read, update, and delete documents from our database? <a id="5"></a>

We can use mongoose models to create, read, update, and delete documents from our database by using the model functions create(), find(), update(), and deleteOne().

example:

~~~js

var blogSchema = new mongoose.Schema({
	title: String,
	body: String,
	date: { type: Date, default: Date.now },
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: ‘Comment’ }] // this is a reference to another collection
});

var Blog = mongoose.model(‘Blog’, blogSchema);

// create a new blog post
Blog.create({ title: ‘My first blog post’, body: ‘This is my first blog post!’ }, function (err, blog) {
if (err) return handleError(err);
// saved!
});

// find all blog posts
Blog.find(function (err, blogs) {
if (err) return handleError(err);
// returns all blogs
});

// find a blog post by id

Blog.findById(‘5f0b3b2b4f4f4f4f4f4f4f4f’, function (err, blog) {
if (err) return handleError(err);
// returns the blog post with the given id
});

// update a blog post by id
Blog.updateOne({ _id: ‘5f0b3b2b4f4f4f4f4f4f4f4f’ }, { title: ‘My updated blog post’ }, function (err, blog) {
if (err) return handleError(err);
// updated!
});

// delete a blog post by id
Blog.deleteOne({ _id: ‘5f0b3b2b4f4f4f4f4f4f4f4f’ }, function (err, blog) {
if (err) return handleError(err);
// deleted!
});

~~~

## 6. How do we specify validation rules for data fields when defining our schema? <a id="6"></a>

We can specify validation rules for data fields by adding validation keywords to the field definition in our schema. For example, we could add the “required” keyword to a field to make sure that it is always populated with a value.

example:

~~~js

	var blogSchema = new mongoose.Schema({

		title: { type: String, required: true },

		body: String,

		date: { type: Date, default: Date.now },

		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: ‘Comment’ }] // this is a reference to another collection

	});

~~~

## 7. In what situations is it best to use a Mongoose virtual field over a normal one? <a id="7"></a>

It is best to use a Mongoose virtual field over a normal one when you want to create a field that is not stored in the database. For example, if you wanted to create a field that calculated the number of comments on a blog post, you could use a virtual field to do this.

example:

~~~js

	var blogSchema = new mongoose.Schema({

		title: String,

		body: String,

		date: { type: Date, default: Date.now },

		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: ‘Comment’ }] // this is a reference to another collection

	});

	blogSchema.virtual(‘numComments’).get(function () {

		return this.comments.length;

	});

~~~

## 8. What’s the difference between static methods and instance methods in Mongoose? <a id="8"></a>

- **Static methods** are methods that are called on the model itself
- **instance methods** are methods that are called on an instance of the model.

example:

~~~js

	var blogSchema = new mongoose.Schema({

		title: String,

		body: String,

		date: { type: Date, default: Date.now },

		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: ‘Comment’ }] // this is a reference to another collection

	});

	// static method

	blogSchema.statics.findByTitle = function (title, cb) {

		return this.find({ title: new RegExp(title, ‘i’) }, cb);

	}; // returns all blogs with a title that matches the given string

	// instance method

	blogSchema.methods.findByTitle = function (title, cb) {

		return this.model(‘Blog’).find({ title: new RegExp(title, ‘i’) }, cb);

	}; // returns all blogs with a title that matches the given string 

~~~

## 9. What are some ways to validate Mongoose schemas? <a id="9"></a>

- **SchemaType#validate()** - This method allows you to validate a single field in your schema. It takes a function as an argument that will be called with the value of the field and a callback function. If the callback function is called with an error, the validation will fail.
- **Schema#pre()** - This method allows you to add a pre-hook to your schema. A pre-hook is a function that will be called before a certain event occurs. For example, you could add a pre-hook to your schema that will be called before a document is saved to the database.
- **Schema#post()** - This method allows you to add a post-hook to your schema. A post-hook is a function that will be called after a certain event occurs. For example, you could add a post-hook to your schema that will be called after a document is saved to the database.
- **Schema#validate()** - This method allows you to validate an entire document. It takes a function as an argument that will be called with the document and a callback function. If the callback function is called with an error, the validation will fail.
- **Schema#validateSync()** - This method allows you to validate an entire document synchronously. It takes a function as an argument that will be called with the document. If the function returns an error, the validation will fail.
- **Schema#validateAsync()** - This method allows you to validate an entire document asynchronously. It takes a function as an argument that will be called with the document and a callback function. If the callback function is called with an error, the validation will fail.

## 10. What are middleware functions in Mongoose? <a id="10"></a>

Middleware functions are functions that are called before or after certain events occur. For example, you could add a pre-hook to your schema that will be called before a document is saved to the database.

example:

~~~js

	var blogSchema = new mongoose.Schema({

		title: String,

		body: String,

		date: { type: Date, default: Date.now },

		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: ‘Comment’ }] // this is a reference to another collection

	});

	blogSchema.pre(‘save’, function (next) {

		// do something before saving

		next();

	});

	blogSchema.post(‘save’, function (doc) {

		// do something after saving

	});

~~~

## 11. How does Mongooe handle concurrency issues with multiple users writing to the same document? <a id="11"></a>

Mongoose uses **optimistic concurrency** control to handle concurrency issues with multiple users writing to the same document. This means that when a user tries to save a document, Mongoose will check to see if the document has been modified since it was last read. If it has, Mongoose will throw an error and the user will have to try again.

## 12. What is your opinion on the performance of Mongoose? <a id="12"></a>

Mongoose is a great tool for working with MongoDB, but it does have some performance issues. For example, Mongoose uses a lot of memory because it stores all of the data in memory. This can be a problem if you have a lot of data or if you are running on a server with limited memory.

## 13. What are pre-hooks and post-hooks in Mongoose? <a id="13"></a>

**Pre-hooks** and **post-hooks** are functions that are called before or after certain events occur. For example, you could add a pre-hook to your schema that will be called before a document is saved to the database.

## 14. Why should I use Mongoose over raw MongoDB queries? <a id="14"></a>

Mongoose provides a schema-based solution to modeling your data, which means that you can define types and validations for your data that will be enforced when you try to insert or update documents. 

This can help to keep your data consistent and avoid errors. Additionally, Mongoose provides a number of helpful features, like pre- and post- hooks, that can make working with data easier.

## 15. What’s the difference between findOne() and findById()? <a id="15"></a>

- **findOne()** - This method will return the first document that matches the given query. If no documents match the query, it will return null.

- **findById()** - This method will return the document with the given id. If no document matches the id, it will return null.

## 16. Is it possible to have more than one model per collection with Mongoose? If yes then why would you want to do that? <a id="16"></a>

Yes, it is possible to have more than one model per collection with Mongoose. This can be useful if you want to have different types of documents in the same collection.

- You might want to have different models for different purposes. For example, you might have a “User” model for storing information about users, and a “Post” model for storing information about posts.

- You might want to have different models for different parts of your application. For example, you might have a ” frontend” model for storing information that will be used in the frontend of your application, and a ” backend” model for storing information that will be used in the backend of your application.

- You might want to have different models for different versions of your application. For example, you might have a ” v1″ model for storing information about the first version of your application, and a ” v2″ model for storing information about the second version of your application.

## 17. Can you explain what populate() is used for in Mongoose? <a id="17"></a>

The populate() method in Mongoose is used to automatically populate the referenced fields in a document with the data from the referenced document. This is useful when you want to retrieve data from multiple documents in a single query.

## 18. What is the purpose of $where in Mongoose queries? <a id="18"></a>

The $where operator in Mongoose queries is used to perform a JavaScript function on the data in the database. This can be useful if you want to perform a complex query that cannot be expressed using the other operators.

However, you should be aware that using $where can be very slow, since it has to execute the JavaScript expression for every document in the collection.

example:

~~~js

	Blog.find({ $where: function () {

		return this.comments.length > 10;

	} }, function (err, blogs) {

		if (err) return handleError(err);

		// returns all blogs with more than 10 comments

	});
	
~~~

## 19. Can you give some examples of common query operators in Mongoose? <a id="19"></a>

- **$eq** - Matches values that are equal to a specified value.
- **$gt** - Matches values that are greater than a specified value.
- **$gte** - Matches values that are greater than or equal to a specified value.
- **$in** - Matches any of the values specified in an array.
- **$lt** - Matches values that are less than a specified value.
- **$lte** - Matches values that are less than or equal to a specified value.
- **$ne** - Matches all values that are not equal to a specified value.
- **$nin** - Matches none of the values specified in an array.

example:

~~~js

	Blog.find({ title: { $eq: ‘My first blog post’ } }, function (err, blogs) {

		if (err) return handleError(err);

		// returns all blogs with a title that matches the given string

	});

	Blog.find({ comments: { $gt: 10 } }, function (err, blogs) {

		if (err) return handleError(err);

		// returns all blogs with more than 10 comments

	});

	Blog.find({ comments: { $gte: 10 } }, function (err, blogs) {

		if (err) return handleError(err);

		// returns all blogs with 10 or more comments

	});

	Blog.find({ comments: { $in: [‘comment1’, ‘comment2’] } }, function (err, blogs) {

		if (err) return handleError(err);

		// returns all blogs with a comment that matches one of the given strings

	});

	Blog.find({ comments: { $lt: 10 } }, function (err, blogs) {

		if (err) return handleError(err);

		// returns all blogs with less than 10 comments

	});

	Blog.find({ comments: { $lte: 10 } }, function (err, blogs) {

		if (err) return handleError(err);

		// returns all blogs with 10 or less comments

	});

	Blog.find({ comments: { $ne: 10 } }, function (err, blogs) {

		if (err) return handleError(err);

		// returns all blogs with a comment that does not match the given string

	});

	Blog.find({ comments: { $nin: [‘comment1’, ‘comment2’] } }, function (err, blogs) {

		if (err) return handleError(err);

		// returns all blogs with a comment that does not match one of the given strings

	});

~~~

## 20. What are some tips to keep in mind while designing Mongoose Schemas? <a id="20"></a>

- **Keep your schemas simple** - It is best to keep your schemas as simple as possible. This will make it easier to understand and maintain your code.
- **Use the right data types** - It is important to use the right data types for your fields. For example, if you are storing a date, you should use the Date data type instead of a string.
- **Use the right validation rules** - It is important to use the right validation rules for your fields. For example, if you are storing a date, you should use the Date data type instead of a string.
- **Use the right indexes** - It is important to use the right indexes for your fields. For example, if you are storing a date, you should use the Date data type instead of a string.
- **Use the right hooks** - It is important to use the right hooks for your fields. For example, if you are storing a date, you should use the Date data type instead of a string.
- **Use the right virtual fields** - It is important to use the right virtual fields for your fields. For example, if you are storing a date, you should use the Date data type instead of a string.
- **Use the right methods** - It is important to use the right methods for your fields. For example, if you are storing a date, you should use the Date data type instead of a string.




### Table of Contents - Mongoose and AUTH

| No. | Questions |
| --- | --------- |
|   | **Mongoose and Auth** |
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

	JWT consists of three parts separated by dots (.), which are:<br/>
	- Header: Contains the metadata for the token. It contains the type of the token and the hashing algorithm used.<br/>
	- Payload: Contains the claims. Claims are statements about an entity (typically, the user) and additional data. There are three types of claims: registered, public, and private claims.<br/>
	- Signature: To create the signature part you have to take the encoded header, the encoded payload, a secret, the algorithm specified in the header, and sign that.<br/>
	
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