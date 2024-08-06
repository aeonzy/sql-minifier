# SQL Minifier

A lightweight npm package to minify the SQL Statements, by removing unnecessary whitespace and comments, making your SQL scripts cleaner and more efficient.

## Features

- Minifies SQL by removing unnecessary whitespace and comments.
- Preserves comments when specified through options, reducing them to a condensed form.
- Handles both single-line (`--`) and multi-line (`/* ... */`) comments.
- Detects and throws errors for unclosed strings and comments, enhancing script safety.
- Designed for efficiency, performing minification in a single pass through the input.


## Installation

```bash
npm install sql-minifier
```


## Usage

```javascript
const { minifySQL } = require('sql-minifier');

const originalSQL = 'SELECT * FROM   users   WHERE id = 1;   ';
const minifiedSQL = minifySQL(originalSQL);

console.log(minifiedSQL);
// Output: 'SELECT * FROM users WHERE id=1;'
```


### Options

You can specify options to modify the behavior of the minifier:

- `includeComments`: Set to `true` to preserve comments in a condensed form. By default, comments are not preserved.

Example with options:

```javascript
const minifiedSQLWithComments = minifySQL(originalSQL, { includeComments: true });
console.log(minifiedSQLWithComments);
// Output includes comments if originally present
```


## API Documentation

### minifySQL(sql, [options])
- `sql` (String) - The SQL string to be minified.
- `options` (Object) [optional]
    - includeComments: Boolean - Whether to include comments in the output.
- Returns (String) - The minified SQL string.


## Examples

Without preserving comments:

```javascript
const minified = minifySQL('SELECT * FROM table; --comment', { includeComments: false });
console.log(minified); // Outputs: 'SELECT * FROM table;'
```

With preserving comments:

```javascript
const minified = minifySQL('SELECT * FROM table; --comment', { includeComments: true });
console.log(minified); // Outputs: 'SELECT * FROM table; /*comment*/'
```


## Contributing

Contributions are welcome! We welcome contributions from the community. Here are some ways you can contribute:

- Reporting bugs
- Suggesting enhancements
- Pull requests


## License

MIT License - see the [License](https://github.com/aeonzy/sql-minifier/blob/main/LICENSE) file for details.