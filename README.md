*Check out* [Free Your Mind](odedc.net)

# Introduction

A template project for a secured NodeJs API application with MongoDB.
The project uses the [express](https://expressjs.com/) framework and connects to the [Atlas](https://www.mongodb.com/cloud/atlas) cloud based MongoDB service, which you can replace with any other DB connection.

To manage session tokens, we use [Jason Web Token](https://jwt.io/introduction/).

# Scope
This project implements a simple, but secured, REST API for managing Tasks. The API supports the following operations:

1. List all tasks
2. Retrieve a specific task, by its id
3. Create a new task
4. Update an existing task
5. Delete a task
6. Create a user
7. Retrieve a specific user, by its id

# Authentication

To access the API, an application must first get a token using an HTTP GET request to `/api/auth/`. The Content-Type HTTP header should be

    Content-Type: application/x-www-form-urlencoded

and the body should include the username and password data (as if sent from an HTML form)

    logemail=<email urlencoded>&logpassword=<password urlencoded>

Example:  logemail=someone%40gmail.com&logpassword=1%3C234%3C    

If successful, the API returns `200` with a Json in the HTTP body

    {
    "success": true,
    "token": "some-token"
    }
The API expects this token to be used in each consecutive request as an HTTP header:

    x-access-token: some-token

or as a URI attribute:

    /api/task/create?token=the-token

or as a Json in the HTTP body:

    {
    	"token" : "the-token"
    }

**Note:** The API expects users to be provisioned on the server with an email and password so it would be able to validate the login credentials. Use the user related API calls to create users.

On error, the response is `400` with a Json in the HTTP body (the 'message' field provide guidance on why the call failed)

    {
    "success": false,
    "message": "Authentication failed. Missing fields"
    }

Or response code `401`

    {
        "success": false,
        "message": "Authentication failed"
    }

## User Validation
When a request arrives, the application looks for the authentication token in the  `x-access-token` the HTTP body (Json) or the URI. If the token does not exist, the application would respond with a `401` (Unauthorized).

If the token exists, it uses JWT to verify the token's validity. If not valid, it responds with a `401`.

Ifthe token is valid, it looks for a user (in the DB) with a matching token. If such a user is not found, an `401` response is sent back. 

if a user is found, the appRouter forwards the request to the subsequent routers.

### Logout
You can issue a GET logout request to the `/api/logout` URI. To access the API again, you'd need to re-authenticate.

*Note* that JWT does not support logging out (except for a token timeout). When requested to logout, the application replaces the user's token in the DB with an "Invalid" value so that subsequent calls will not be able to find a matching user.

# API responses
Upon success, the API responds with a `2xx` response. There are 2 types of responses:
1. A Json with data
2. A Json with success indication in the form of

    `{
        "success": true,
        "message": "Task successfully deleted"
    }`

where "success" may be true or false and "message" provide additional information.

On error, you also might get 2 types of responses:
1. A Json with failure indication in the form of

    `{
        "success": false,
        "message": "Authentication failed"
    }`

2. A redirect to the root index.html page

# Tasks

## Get all tasks
To get a list of all tasks, issue a GET request to `/api/task/all`. The response is in the form of a Json file

    [
    {
        "priority": 3,
        "_id": "5cc7dc621c9d440000a52ad7",
        "title": "task 2",
        "contents": "contents 2",
        "owner": "5cc7dbee689e460000c68078",
        "created": "2019-04-11T21:00:00.000Z",
        "modified": "2019-05-21T21:00:00.000Z"
    },
    {
        "priority": 1,
        "_id": "5cc86670227e9d2b3c8b0364",
        "title": "task 11",
        "owner": "5cc2a6c44677803ea08eb260",
        "contents": "this is a task",
        "created": "2019-04-30T15:14:56.998Z",
        "modified": "2019-04-30T15:14:57.000Z",
        "__v": 0
    }
    ]

## Get a specific task
To get a specific task by its id, issue a GET request to `/api/task/get/id` where **id** is the id of the task. The response is in the form of a Json file

Example:

    /api/task/get/5cc8391df6eb52092c672fa6

Response: `HTTP response code: 200`

    {
    "priority": 3,
    "_id": "5cc8391df6eb52092c672fa6",
    "title": "task 6",
    "owner": "5cc2a6c44677803ea08eb260",
    "contents": "this is a task",
    "created": "2019-04-30T12:01:33.757Z",
    "modified": "2019-04-30T12:01:33.762Z",
    "__v": 0
    }

## Create a new task
To create a new task, issue a PUT request to `/api/task/create` with Json in the HTTP body containing 3 parameters
1. Task title
2. Task priority
3. Task contents

The response is a Json describing the newly created task

Example:

    {
	"title": "task 11",
	"priority" : "1",
	"contents" : "this is a task"
	}

Response:  `HTTP response code: 201`

    {
    "priority": 1,
    "_id": "5cc965ae817f7540b41664f9",
    "title": "task 11",
    "owner": "5cc2a6c44677803ea08eb260",
    "contents": "this is a task",
    "created": "2019-05-01T09:23:58.542Z",
    "modified": "2019-05-01T09:23:58.544Z",
    "__v": 0
    }

## Updating an existing task
To update a task, issue a PUT request to  `/api/task/update/id` where **id** is the id of the task. The body should include at least one of the following parameters in a Json format:
1. Task title
2. Task priority
3. Task contents

The response is the updated task in the form of a Json file.

Example (changing the priority of a task):
PUT `/api/task/update/5cc8392af6eb52092c672fa7`

    {
	"priority" : "3",
	}   

Response:  `HTTP response code: 201`

    {
        "_id": "5cc8392af6eb52092c672fa7",
        "priority": 3,
        "title": "task 7",
        "owner": "5cc2a6c44677803ea08eb260",
        "contents": "this is a task",
        "created": "2019-04-30T12:01:46.646Z",
        "modified": "2019-05-01T09:30:32.541Z",
        "__v": 0
    }

## Delete a task
To delete a task, issue a DELETE request to `/api/task/delete/id` where **id** is the id of the task. The response is a Json.

Example: DELETE `/api/task/delete/5cc8392af6eb52092c672fa7`

    {
        "success": true,
        "message": "Task successfully deleted"
    }

# Users
The project provides several user related APIs as well as some internal user related functions used by the authentication process

## Create a new user
To create a new user, issue a PUT request to `/api/user/create` with Json in the HTTP body containing 4 parameters (similar to an HTML form)
1. Username
2. Email
3. Password
4. Password confirmation (retype the password)

The response is a Json describing the newly created user

Example:

    {
	"username": "someone",
	"email" : "me@something.com",
	"password" : "this is a password"
	"passwordConf" : "this is a password"
	}

Response:  `HTTP response code: 201`

    {
        "success": true,
        "message": "User created"
    }

If the email or username is already in the DB, the response is
    {
        "driver": true,
        "name": "MongoError",
        "index": 0,
        "code": 11000,
        "errmsg": "E11000 duplicate key error collection: stories.users index: email_1 dup key: { : \"user@email.com\" }"
    }

## Get a user
To retrieve a specific user by its id, issue a GET request to `/api/user/get/:id` where **id** is the id of the user. 

Example:    `/api/user/get/5cc4442b2233f632c452d31c`

Response:  `HTTP response code: 200`
    {
    "_id": "5cc4442b9233f632c452d31c",
    "email": "oded@gmail.com",
    "username": "oded",
    "password": "$2b$10$tL4Bypc63wSruu2YmLDr2ufx/fW8HB634uXrhM9/pfSVOQ2mcZxo6",
    "token": "5678",
    "last_login": "2019-04-29T18:26:17.199Z"
    }

On error the response is
    {
        "success": false,
        "message": "Failed to retrieve user"
    }

# Configuration
The project's configuration is stored in the [config/config.js](config/config.js) file. It contains a production as well as a dev configuration which is automatically determined by the `process.env.NODE_ENV` value ('production' or 'development').

### Credits and References
This work was inspired by [Daniel Deutsch](https://github.com/Createdd/Writing/blob/master/2017/articles/AuthenticationIntro.md#structure) and
[Chris Sevilleja](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
