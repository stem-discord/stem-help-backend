<div align="center">

![banner](https://api.stem.help/v1/service/banner/html/STEM_Help_Backend)

![file count badge](https://api.stem.help/v1/service/badge/git/file-count)
![Dev badge](https://img.shields.io/badge/Developing%20stage-Almost%20Stable-ff69b4?style=for-the-badge)

[![ci badge](https://github.com/stem-discord/stem-help-backend/actions/workflows/ci.yaml/badge.svg)](https://github.com/stem-discord/stem-help-backend/actions)
[![Coverage Status](https://coveralls.io/repos/github/stem-discord/stem-help-backend/badge.svg?branch=main)](https://coveralls.io/github/stem-discord/stem-help-backend?branch=main)

</div>

Enviroment file, do

`npm run env:help`

```
test
  env - used for options when testing. Is not loaded to process.env
.env - used for development and production
.env.test - used for testing. Loaded by the test

```

If you have any questions on running this ask me in discord.gg/stem

# Starting the project for yourself

To set up `.env`, run `npm run env:help`

And also type `npm run setup`

# Explanation of the project

[![dependency graph](https://api.stem.help/v1/service/dependency/png)](https://stem.help/about/dependency-graph)

project structure

Lower modules require upper modules. The listing is not alphabetical

ex) A, B(requires A), C(requires B)

<!-- 
├───
│
└───
│   └───
 -->
```

# Directory src/

config #module export default

tool #module export { ... }
├───passport.js - is not used directly
├───roleManager.js
├───logger.js - used instead of console.log
├───morgan.js #(logger)
└───index.js #export

util #module export { ... }
├───<name>.js
└───index.js #export

types #module export { ... }
├───<namespace>
│   ├───<file>.js
│   └───index.js #export
└───index.js #export

models #module export { ... } - **mongoose Schemas** (does not initiate connection with mongoose)
├───base
│   ├───<file>.js
│   └───index.js #export
├───plugins
│   ├───<file>.js
│   └───index.js #export
├───env.js
└───index.js #export

connection #module export { ... } - clients, connections, apis: might be offline. It is up to the service to implement custom functions. If connection field is none, return null
└───index.js #export

shared #(connections) export { ... } - shared initialization. For example, client.channels.cache.get(`839399426643591188`). 
└───index.js #export, single

service #(services, models(mongo), connections(everything else), shared) export { ... } - functions: interacts with models, connections, and each other. return 503 if any of the according connection(s) are unavailable.
├───<file>.js
└───index.js #export

middlewares #(models, tools) export { ... } - passthrough/assert middlewares
├───<file>.js
└───index.js #export

auth #(models, tools) export { ... }- middlewares specified for authentication/authorization
├───<file>.js
└───index.js #export

validations #module export { ... } - joi validations. semantic grouping instead of functional
├───<name>.js
└───index.js #export

// There is no controller. Controllers should be implemented in the route itself.

pages #module export { ... } - ejs html pages
// These exist to return a friendly error html page in a case something is misconfigured in the server
└───index.js # export

routes #(validations, services) export { ... } - project structure matches end point
├───index.js # exports { v1: require('v1') }
├───lib
│   └───index.js #(validations,services) - eliminate redundant ../ also prevent circular dependency. APIs should ONLY use the modules declared in lib
└───v1 - /v1
    ├───auth - starts with /auth
    │   └───index.js # - implement it here. return Router
    └───index.js #export Router

static - #module export default - static view for testing api in browser
├───views
│   └───(ejs files here)
└───router.js

app.js - #(middlewares, routes, static) - express app
index.js - #(app.js, db.js) registers top level process hooks and exits.

```

`script` folder is used for helpers in `npm run`

# Auth flow (database)

## User

A `User` has multiple refresh tokens. Usually one for each client.

However, the property `sessions` does not exist on the `User` model

This is because sessions automatically 



# JWT

## Refresh token

```json
{
    "sub": "user id",
    "type": "REFRESH",
}
```

## Access token

```json
{
    "sub": "user id",
    "type": "ACCESS"
}
```

# Testing

```
test/
client - client side requests. Does not import anything from src. Starts a server to test
server - server side functional testing. Imports most packeges from src.
unit   - 0 latency tdd style testing. Unit testing functions.
```
# copy pasta

```sh
npm run dev -- --db-uri mongodb://127.0.0.1:27017/stem-backend-db-test 
```
