# Style

import always into two groups
```js
// module imports such as "express"
import express from "express";

// relative imports such as "./config/index.js"
import config from "./config/index.js";

// Object deconstruction "imports" go after imports but before main code body
const { mod } = config;
```

import order of each group is
```js
// none, single, all, multiple
import 'module-without-export.js';
import a from 'baz.js';
import b from 'qux.js';
import * as bar from 'bar.js';
import * as foo from 'foo.js';
import { alpha, } from 'alpha.js'; // notice the trailing ,
import { delta, gamma } from 'delta.js';
```

It is recommended to have an alphabetic order, but prefer semantics first