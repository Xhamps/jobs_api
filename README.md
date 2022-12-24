# Xhamps Job's API 💫

This code is a test where I built a part of job payment management API. Here I follow the best practice to build this application.


## Project Requirements

- [NodeJs](https://nodejs.org/en/)
- [Git](https://git-scm.com/downloads)
- [SQLite](https://www.sqlite.org/index.html)


## Getting Started
### 1. Project Cloning & Build
Frist clone the repository:

``` shell
 $ git clone https://github.com/Xhamps/jobs_api.git
```

And now, install the all dependences:

```shell
 $ npm install
```

### 2. Database Set Up
To create and populate de DB with some data, you need only run this comend on terminal ( we are using SQLite how database):

```shell
 $ npm run seed
```

### 3. Running
Congratulation, It's time to play. 🎉🎉
We use `nodemon` to start the serve, it will help if you make any change on the code and that restart automaticament the server.

Now you need running the aplication:

```shell
 $ npm run start
```

The Application will run on port 3001.

### 4. Tests

We have a great suit the test with big coverage of us code.
To running the test you need do the command:

```shell
 $ npm run test
```

If you are a developar, and need do some change in the code, and don't want care about running the test suit on all changes. This command will listening all changes and reruning automaticament the suite.

```shell
 $ npm run test:dev
```

To check the test coverage, use this command:

```shell
 $ npm run test:coverage
```

### 5. Documentation

In addition to this document we have other documentation.
We are using JSDocs along with swagger to do the documentation for our APIs. You can look this documentation on all files inside the routes folder, the path: '/src/routes/*'.
After running the server, you can see all this documentation and play with the endpotins, at this url:

```
 http://localhost:3001/api-docs/
```
