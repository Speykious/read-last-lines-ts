# read-last-lines-ts

Read the last lines of a file, written in TypeScript for intellisense, inspired from the current [read-last-lines](https://github.com/alexbbt/read-last-lines) package by [Alexander Bell-Towne](https://github.com/alexbbt).

Copyright (c) 2020 [Speykious](https://github.com/Speykious)

***
## How to install

- If you use npm: `npm install read-last-lines-ts --save`
- If you use yarn: `yarn add read-last-lines-ts`

***
## How to use

### CommonJS syntax
To read the last 10 lines of a file in utf8 encoding:
```js
const { readLastLines, readLastLinesEnc } = require("read-last-lines-ts")

// You get a Buffer from readLastLines
const buffer = readLastLines("absolute/path/to/file", 10)
console.log(buffer.toString("utf8"))

// Alternatively, you can use this curried function for builtin string conversion
const lines = readLastLinesEnc("utf8")("absolute/path/to/file", 10)
console.log(lines)
```
You can choose any encoding from the `BufferEncoding` enum from `fs`.

### ESX syntax
Same example:
```js
import { readLastLines, readLastLinesEnc } from "read-last-lines-ts"

const buffer = readLastLines("absolute/path/to/file", 10)
console.log(buffer.toString("utf8"))

const lines = readLastLinesEnc("utf8")("absolute/path/to/file", 10)
console.log(lines)
```

***
## Why make this package?
(coming soon)