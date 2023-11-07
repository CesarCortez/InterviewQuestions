# Interview Questions

## Node.js

### Table of Contents - Node JS

| No. | Questions |
| --- | --------- |
|   | **Express JS** |
| 1 | [What is ExpressJS?](#what-is-expressjs)|
| 2 | [What are some of the salient features of express?](#what-are-some-of-the-salient-features-of-express)|
| 3 | [Explain with an example a working of a simple express app?](#explain-with-an-example-a-working-of-a-simple-express-app)|
| 4 | [Mention few properties of request parameter in express?](#mention-few-properties-of-request-parameter-in-express)|
| 5 | [How to get the name parameters in express?](#how-to-get-the-name-parameters-in-express)|
| 6 | [How to retrieve the get query string parameters using express? ?](#how-to-retrieve-the-get-query-string-parameters-using-express)|
| 7 | [How to send a response back using express?](#how-to-send-a-response-back-using-express)|
| 8 | [How to set http response status using express?](#how-to-set-http-response-status-using-express)|
| 9 | [What are the different http status codes?](#what-are-the-different-http-status-codes)|
| 10 | [Mention few properties of request parameter in express?](#mention-few-properties-of-request-parameter-in-express)|
| 11 | [How can you change http header value of a response?](#how-can-you-change-http-header-value-of-a-response)|
| 12 | [How to redirect to other pages server-side?](#how-to-redirect-to-other-pages-server-side)|
| 13 | [How does routing work in express?](#how-does-routing-work-in-express)|
| 14 | [What are the tasks that a middleware can do?](#what-are-the-tasks-that-a-middleware-can-do)|
| 15 | [What are the different types of middleware?](#what-are-the-different-types-of-middleware)|
| 16 | [How to serve static assests from express?](#how-to-serve-static-assests-from-express)|
| 17 | [How to provide file download using express?](#how-to-provide-file-download-using-express)|
| 18 | [How to use the Response.cookie() method to manipulate your cookies?](#how-to-use-the-response-cookie-()-method-to-manipulate-your-cookies)|
| 19 | [How to manage sessions using express?](#how-to-manage-sessions-using-express)|
| 20 | [How to provide file download using express?](#how-to-provide-file-download-using-express)|
| 21 | [How To Allow Cors In Expressjs  Explain With An Example?](#how-to-allow-cors-in-expressjs--explain-with-an-example)|

## Express Js

1. ### What is ExpressJS?

   Fast, unopinionated, minimalist web framework for Node.js,Express is a project of the Node.js Foundation.it is open source and click [here](https://github.com/expressjs/express/) to view,it is mainly used for  building networking services (web applications) and applications,it is builds on top of node js features to provide easy to use functionality that satisfy the needs for building web applications.it has lots of pre-built packages and also many framework are built on top of it like <br/>
   **Feathers**: Build prototypes in minutes and production ready real-time apps in days<br/>
   **NestJs**: A progressive Node.js framework for building efficient, scalable, and enterprise-grade server-side applications on top of TypeScript & JavaScript (ES6, ES7, ES8)<br/>
   **Sails**: MVC framework for Node.js for building practical, production-ready apps.<br/>

**[ Back to Top ⬆ ](#table-of-contents---express-js)**

2. ### What are some of the salient features of express? 
	
	
    **Middlewares**: Set up middlewares in order to respond to HTTP/RESTful Requests.<br/>
    **Routing**: It is possible to defines a routing table in order to perform different HTTP operations.<br/>
    **Templates**: Dynamically renders HTML Pages based on passing arguments to templates.<br/>
    **High Performance**: Express prepare a thin layer, therefore, the performance is adequate.<br/>
    **Database Support**: Express supports RDBMS as well as NoSQL databases.<br/>
    **MVC Support**: Organize the web application into an MVC architecture.
    **Manages everything from routes** to rendering view and preforming HTTP request.<br/>


**[ Back to Top ⬆ ](#table-of-contents---express-js)**

3. ### Explain with an example a working of a simple express app? 
	
	
	~~~js
    // This code creates a web server that listens for requests on port 3000.
    // When a request is received, the server responds with "Hello World!"

    const express = require('express')
	const port = 3000
	const app = express()

	// Start listening on the port
	app.listen(port, function(){ 
      console.log('listening on port',port)
	})

	// Send a message to the client
	app.get('/', function(req, res) {
      res.send('Hello World!')
	})

	~~~

**[ Back to Top ⬆ ](#table-of-contents---express-js)**

4. ### Mention few properties of request parameter in express? 
	
	here is a list of few req methods needed for you to knows
	![req methods](/img/express_req_methods.png)

**[ Back to Top ⬆ ](#table-of-contents---express-js)**

5. ### How to get the name parameters in express?  
	
	This property is an object containing properties mapped to the named route “parameters”. For example, if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.
	```
	// GET /user/tj
	req.params.name
	// => "tj"
	```

**[ Back to Top ⬆ ](#table-of-contents---express-js)**

6. ### How to retrieve the get query string parameters using express?   
	
	The query string is the part that comes after the URL path, and starts with a question mark ?.
	```
	?height=6&weight=60
	//req.query.height - 6
	//req.query.weight - 60
	```

**[ Back to Top ⬆ ](#table-of-contents---express-js)**

7. ### How to send a response back using express?   
	
	we can use any one of these commands
	```
	function(req, res) {
		res.send('Hello World!')
	}
	function(req, res) {
		res.end('Hello World!')
	}
	function(req, res) {
		res.json({title:'Hello World!'})
	}
	```

**[ Back to Top ⬆ ](#table-of-contents---express-js)**


8. ### How to set http response status using express?   
	
	we can either use **res.status()** or **res.sendStatus()**
	```
	res.status(404).send('File not found')
	
	//if sendStatus we no need to write send method , i will pre send a few inbuilt messages upon using that
	
	res.sendStatus(200)
	// === res.status(200).send('OK')

	res.sendStatus(403)
	// === res.status(403).send('Forbidden')

	res.sendStatus(404)
	// === res.status(404).send('Not Found')

	res.sendStatus(500)
	// === res.status(500).send('Internal Server Error')
	```

**[ Back to Top ⬆ ](#table-of-contents---express-js)**

9. ### What are the different http status codes?   
	
	| Code | Message |	Description                   |
	| ---- | ------- |	------------------------------|
	|	100|Continue|Only a part of the request has been received by the server, but as long as it has not been rejected, the client should continue with the request|
	|101|Switching Protocols|The server switches protocol|
	|200 |OK|The request is OK.|
	|201 |Created|The request is complete, and a new resource is created |
	|202 |Accepted|The request is accepted for processing, but the processing is not complete|
	|203 |Non-authoritative Information|The information in the entity header is from a local or third-party copy, not from the original server.|
	|204 |No Content|A status code and a header are given in the response but there is no entity-body in the reply|
	|205 |Reset Content|The browser should clear the form used for this transaction for additional input|
	|206 |Partial Content|The server is returning partial data of the size requested. Used in response to a request specifying a Range header. The server must specify the range included in the response with the Content-Range header|
	|300 |Multiple Choices|A link list. The user can select a link and go to that location. Maximum five addresses|
	|301 |Moved Permanently|The requested page has moved to a new url |
	|302 |Found|The requested page has moved temporarily to a new url|
	|303  |See Other|The requested page can be found under a different url|
	|304  |Not Modified|This is the response code to an If-Modified-Since or If-None-Match header, where the URL has not been modified since the specified date|
	|305  |Use Proxy|The requested URL must be accessed through the proxy mentioned in the Location header|
	|306  |Unused|This code was used in a previous version. It is no longer used, but the code is reserved|
	|307  |Temporary Redirect|The requested page has moved temporarily to a new url|
	|400  |Bad Request|The server did not understand the request|
	|401  | Unauthorized|The requested page needs a username and a password|
	|402  | Payment Required|You can not use this code yet.|
	|403  |Forbidden|Access is forbidden to the requested page.|
	|404  |Not Found|The server can not find the requested page.|
	|405  |Method Not Allowed|The method specified in the request is not allowed|
	|406  |Not Acceptable|The server can only generate a response that is not accepted by the client|
	|407  | Proxy Authentication Required|You must authenticate with a proxy server before this request can be served|
	|408  |Request Timeout|The request took longer than the server was prepared to wait|
	|409  |Conflict|The request could not be completed because of a conflict|
	|410  |Gone|The requested page is no longer available|
	|411  |Length Required|The "Content-Length" is not defined. The server will not accept the request without it .|
	|412  |Precondition Failed|The pre condition given in the request evaluated to false by the server|
	|413  | Request Entity Too Large|The server will not accept the request, because the request entity is too large.|
	|414  |Request-url Too Long|The server will not accept the request, because the url is too long. Occurs when you convert a "post" request to a "get" request with a long query information|
	|415  |Unsupported Media Type|The server will not accept the request, because the mediatype is not supported |
	|416  |Requested Range Not Satisfiable|The requested byte range is not available and is out of bounds|
	|417  |Expectation Failed|The expectation given in an Expect request-header field could not be met by this server.|
	|500  |Internal Server Error|The request was not completed. The server met an unexpected condition.|
	|501  | Not Implemented|The request was not completed. The server did not support the functionality required.|
	|502  | Bad Gateway|The request was not completed. The server received an invalid response from the upstream server.|
	|503  |Service Unavailable|The request was not completed. The server is temporarily overloading or down.|
	|504  |Gateway Timeout|The gateway has timed out.|
	|505  |HTTP Version Not Supported|The server does not support the "http protocol" version|
	

**[ Back to Top ⬆ ](#table-of-contents---express-js)**

10. ### Mention few properties of request parameter in express? 
	
	You can access all the HTTP headers using the Request.headers property:
	```
	app.get('/', (req, res) => {
	console.log(req.headers)
	})
	
	app.get('/', (req, res) => {
	req.header('User-Agent')
	})
	```
	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

11. ### How can you change http header value of a response? 
	
	You can change any HTTP header value using Response.set():
	```
	res.set('Content-Type', 'text/html')
	res.type('json')
	// => 'application/json'

	res.type('application/json')
	// => 'application/json'

	res.type('png')
	// => image/png:
	```
	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

12. ### How to redirect to other pages server-side? 
	
	Redirects are common in Web Development. You can create a redirect using the Response.redirect() method:<br/>
	```
	res.redirect('/go-there')
	//it can be either a url or a path of file
	res.redirect(301, '/go-there')
	```
	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

13. ###  How does routing work in express? 
	
	Routing is the process of determining what should happen when a URL is called, or also which parts of the application should handle a specific incoming request.<br/>

	In the Hello World example we used this code<br/>

	```
    app.get('/', function(req, res) { 
     /* */ 
	})
	//This creates a route that maps accessing the root domain URL / using the HTTP GET method to the response we want to provide.
	```
	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

14. ###   What are the tasks that a middleware can do? 
	
	Middleware functions can perform the following tasks:<br/>

    Execute any code.<br/>
    Make changes to the request and the response objects.<br/>
    End the request-response cycle.<br/>
    Call the next middleware function in the stack.<br/>

	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

15. ###   What are the different types of middleware?
	
	An Express application can use the following types of middleware:<br/>

    
    Application-level middleware<br/>
    Router-level middleware<br/>
    Error-handling middleware<br/>
    Built-in middleware<br/>
    Third-party middleware

	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

16. ###    How to serve static assests from express?
	
	It’s common to have images, CSS and more in a public subfolder, and expose them to the root level:

    
    ```
	const express = require('express')
	const app = express()

	app.use(express.static('public'))

	app.listen(3000, () => console.log('Server ready'))
	```

	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

17. ###   How to provide file download using express?
	
	Express provides a handy method to transfer a file as attachment: Response.download().<br/>

	Once a user hits a route that sends a file using this method, browsers will prompt the user for download.<br/>

	The Response.download() method allows you to send a file attached to the request, and the browser instead of showing it in the page, it will save it to disk.<br/>
	```
	app.get('/', (req, res) => res.download('./file.pdf'))
	```

	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

18. ###   How to use the Response.cookie() method to manipulate your cookies?
	
	Cookies are small pieces of data sent from a website and are stored in user's web browser while user is browsing that website. Every time the user loads that website back, the browser sends that stored data back to website or server, to distinguish user's previous 	activity.
	

	```
	res.cookie('username', 'Adam')
	
	This method accepts a third parameter which contains various options:
	res.cookie('username', 'Adam', { domain: '.bangalore.com', path: '/administrator', secure: true })

	res.cookie('username', 'Adam', { expires: new Date(Date.now() + 900000), httpOnly: true })
	
	//clear cookie
	res.clearCookie('username')
	```
	
	The most useful parameters you can set are:
	| Value | Description |
	| ----- | ----------- |
	| domain | the cookie domain name|
	|expires|set the cookie expiration date. If missing, or 0, the cookie is a session cookie|
	|httpOnly|set the cookie to be accessible only by the web server. See HttpOnly|
	|maxAge|set the expiry time relative to the current time, expressed in milliseconds|
	|path|the cookie path. Defaults to /|
	|secure|Marks the cookie HTTPS only|
	|signed| 	set the cookie to be signed|
	|sameSite|Value of SameSite|

	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

19. ###   How to manage sessions using express?
	
	We’ll use the express-session module, which is maintained by the Express team.When implemented, every user of you API or website will be assigned a unique session, and this allows you to store the userstate.as by default Express requests are sequential and no request can be linked to each other. There is no way to know if this request comes from a client that already performed a request previously.
	```
	const express = require('express')
	const session = require('express-session')

	const app = express()
	app.use(session(
	'secret': '343ji43j4n3jn4jk3n'
	))
	```
	All solutions store the session id in a cookie, and keep the data server-side. The client will receive the session id in a cookie, and will send it along with every HTTP request.

	We’ll reference that server-side to associate the session id with the data stored locally.

	Memory is the default, it requires no special setup on your part, it’s the simplest thing but it’s meant only for development purposes.

	The best choice is a memory cache like Redis, for which you need to setup its own infrastructure.

	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

20. ###   How to process forms using Express? 
	
	The form data will be sent in the POST request body.

	To extract it, you will use the express.urlencoded() middleware, provided by Express:
	```
	const express = require('express')
	const app = express()

	app.use(express.urlencoded())
	```
	Now you need to create a POST endpoint on the /submit-form route, and any data will be available on Request.body:
	```
	app.post('/submit-form', (req, res) => {
	const username = req.body.username
	//...
	res.end()
	})
	```

	
**[ Back to Top ⬆ ](#table-of-contents---express-js)**

21. ###   How To Allow Cors In Expressjs  Explain With An Example? 
	
	
	In order to allow CORS in Express.js,  add the following code in server.js:
	~~~js
	app.all('*', function(req, res, next) {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	if ('OPTIONS' == req.method) return res.send(200);
	next();
	});
	```
	or you can install a package called cors ,CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.[link](https://www.npmjs.com/package/cors)
	```
	var express = require('express')
	var cors = require('cors')
	var app = express()
 
	app.use(cors())
	~~~

**[ Back to Top ⬆ ](#table-of-contents---express-js)**