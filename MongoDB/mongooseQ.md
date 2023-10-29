### Table of Contents - Mongoose

| No. | Questions |
| --- | --------- |
|   | **Mongoose** |
| 1 | [What is Mongoose?](#1)|
| 2 | [Can you explain how to connect to a MongoDB using Mongoose?](#2)|
| 3 | [Can you give me an example of how you would define a schema in Mongoose?](#3)|

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