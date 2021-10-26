# Backend for stem.help

Enviroment file looks like this

If you have any questions on running this ask me in discord.gg/stem

To set up `.env`, run `npm run env:help`

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
# Keyword declaration

#module = does not require outside of folder. e.g no require('../')
#(fileName, folderName, ...) = requires filename, folderName, .... those marked with #modules might not be listed
#export = index file is used to bundle a folder

# Directory src/

config - #module
├───env.js - loads .env file at root
└───index.js

tool - #module
├───passport.js - is not used directly
├───roleManager.js
├───logger.js - used instead of console.log
├───morgan.js #(logger)
└───index.js #export

util - #module - utility functions
├───<name>.js
└───index.js #export

types - #module - types used across
├───<namespace>
│   ├───<file>.js
│   └───index.js #export
└───index.js #export

models - #module - **mongoose Schemas** (does not initiate connection with mongoose)
├───base
│   ├───<file>.js
│   └───index.js #export
├───plugins
│   ├───<file>.js
│   └───index.js #export
├───env.js
├───env.js
└───index.js #export

connection - #(config) - clients, connections, apis: might be offline. It is up to the service to implement custom functions. If connection field is none, return null
└───index.js #export

shared - #(config, connections) - shared initialization. For example, client.channels.cache.get(`839399426643591188`). 
└───index.js #export, single

service #(services, models(mongo), connections(everything else), shared) - functions: interacts with models, connections, and each other. return 503 if any of the according connection(s) are unavailable.
├───<file>.js
└───index.js #export

middlewares - #(config, models, tools) - passthrough/assert middlewares
├───<file>.js
└───index.js #export

auth - #(config, models, tools) - middlewares specified for authentication/authorization
├───<file>.js
└───index.js #export

validations - #module - joi validations. semantic grouping instead of functional
├───<name>.js
└───index.js #export

// There is no controller. Controllers should be implemented in the route itself.

routes - #(validations, services) - project structure matches end point
├───index.js # exports { v1: require('v1') }
├───lib
│   └───index.js #(validations,services) - eliminate redundant ../ also prevent circular dependency. APIs should ONLY use the modules declared in lib
└───v1 - /v1
    ├───auth - starts with /auth
    │   └───index.js # - implement it here. return Router
    └───index.js #export Router

static - #(config) - static view for testing api in browser
├───views
│   └───(ejs files here)
└───router.js

app.js - #(config, middlewares, routes, static?) - express app
index.js - #(app.js, db.js) registers top level process hooks and exits.

```

`script` folder is used for helpers in `npm run`
