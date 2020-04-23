# LRC-AST

Building AST(Abstract Syntax Tree) and JS Object from LRC file, and create LRC file from AST.

## Get Started

Install via npm:

```
npm install lrc-ast
```

Use:

```javascript
const parser = require('lrc-ast');
```

## Example

Original LRC file:

```lrc
[00:00.00]
[00:01.15]aaaaa
[00:15.50]bbbbb
[03:35.13]ccccc
[03:40.00]
```

AST:

Fully compliant the content of original LRC file, including the row and column number.

[example.json](src/test/example.json)

Lyric Object:

Much more compact JS object than AST tree.

```json
{
  "tags": {},
  "lyrics": [
    {
      "time": [0,0,0],
      "text": ""
    },
    {
      "time": [0,1,0.15],
      "text": "aaaaa"
    },
    {
      "time": [0,15,0.5],
      "text": "bbbbb"
    },
    {
      "time": [3,35,0.13],
      "text": "ccccc"
    },
    {
      "time": [3,40,0],
      "text": ""
    }
  ]
}
```



## API

[API Docs](https://crsjimo.github.io/lrc-ast/index.html)

## License

Open source under [MIT License](LICENSE).