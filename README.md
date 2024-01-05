# FullStackDeveloper-NotesApp

## General Description:
Scalable, Secure and Optimized Notes Web Application - RESTful API Made with Node JS and MongoDB for Backend Assessment (Full Stack Developer Position)

Securely stores, displays, deletes and edits Notes for all authenticated users
Notes contain Title and Text attributes (String format)
Notes and Users are stored in a MongoDB, accessed through a MongoDB docker container, see more 
All authenticated users are able to:
1) Create, Edit, Delete and View all their notes, or View a specific note of their choice
2) Share a specific note with other authenticated note
3) Search through the title/text of all the notes they are allowed to display with fast text-indexing search

Full project including README.md and tests is available on github:
https://github.com/dinstoey/FullStackDeveloper-NotesApp.git
## Table of Content

- Choice of Frameworks / Libraries / 3rd Party Tools
- Project Structure Overview
- Endpoints
- Running Instructions
- Set up - Testing files


### Choice of Frameworks / Libraries / 3rd Party Tools

- **Node.js** and **Express**
	 Node.js along with the **Express** Framework is used to create this project.
	Express is easy-to-use, allows flexibility in project structure and most importantly, it offers middleware that simplify creation and integration of different needed features such as Authentication and Error Handling.

- **MongoDB**
	MongoDB's noSQL structure and flexibility in dealing with unstructured data is the reason it was chosen as the database choice. **MongoDB**'s library **Mongoose**, is very easy to use with Node.js and specifically designed for building web applications. Additionally, Mongoose's built-in text-indexing boosts search functionality, making the application faster and more responsive.

- **JWT**
	JSON Web Tokens is used to authenticate users with ease, and efficiency. Ensuring user authenticity with the encoded user information, allows for secure communication through our endpoints

- **bcrypt**
	bycrypt library is used to hash user passwords in the MongoDB database in order to ensure security and resistance to brute-force attacks.

- **Jest**
	Jest is a JavaScript testing framework which has a built-in library assertion library, minimal configuration and mocking capabilities. Allows for both unit testing and integration testing.


#### Project Structure Overview
``` 
├── /src
│   ├── /controllers
│   │   ├── authController.js
│   │   └── noteController.js
│   ├── /models
│   │   ├── user.js
│   │   └── note.js
│   ├── /middlewares
│   │   └── authenticationMiddleware.js
│   ├── /routes
│   │   ├── authRoutes.js
│   │   └── notesRoutes.js
│   └── index.js
├── /tests
│   └── ├── auth.test.js
│       └── notes.test.js
├── /node_modules
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

```

### Endpoints

#### Authentication
There are 2 authentication endpoints, that allow users to register and login.
1) /api/notes/signup
	POST allows users to send **username** and **password** to register
	
2) /api/notes/login
	POST allows user to login with username and password in the body of the request
	If authorized, returns token
#### Notes

1) /api/notes (CRUD)
		allows authenticated users to create, edit, delete and view notes
2) /notes/:id/share (POST)
		allows a user to share a specific note with another user (via the user id)
1) /api/search?q=:query (GET)
		allows a user to search through the text/title of the notes they're allowed to view, with keyword in the query

**Note:** To enhance the website security, displaying internal error to the user should be avoided. Upon review and more time, I would update the code to reflect that.

### Running Instructions

#### MongoDB docker container
Run the following docker commands to get the necessary docker image and create and run the required container:
```
	docker pull mongodb/mongodb-community-server
```
This configures initial mongo username and password and initializes the database 
```
docker run -d -e MONGO_INITDB_ROOT_USERNAME=uname \
	  -e MONGO_INITDB_ROOT_PASSWORD=pass \
	  -e MONGO_INITDB_DATABASE=notesdb \
	  -p 27017:27017 \
	  --name my_mongodb_container \
	  -d mongodb/mongodb-community-server:latest
```

Note: Alternatively a docker-compose file could be used which would initialize the mongodb container like:
```
  mongodb:

    image: mongo:4.0.8

    container_name: mongodb

    command: mongod --auth

    environment:

      MONGO_INITDB_ROOT_USERNAME: uname

      MONGO_INITDB_ROOT_PASSWORD: pass

      MONGO_INITDB_DATABASE: notesdb

    ports:

    - 27017:27017
```
#### Web app

To run the web application, you must run the steps below:
```
	npm init --y
	npm install --y
	npm start (OR) nodemon
```
### Set up, Testing files

A collection of Integration tests and unit tests are included in the /__test__ directory.
These tests are written using **Jest**
You can run all the tests by running the following commands:

```
cd __test__
npm test
```