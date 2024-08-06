const { minifySQL, SQLMinifyError, errorCodes } = require('./index');

describe('SQL Minifier Tests', () => {
    test('minifies SQL with unnecessary whitespace', () => {
        const sql = 'SELECT   *  FROM     table WHERE  id = 1  ;';
        const expected = 'SELECT * FROM table WHERE id = 1;';
        expect(minifySQL(sql)).toBe(expected);
    });

    test('removes single line comments', () => {
        const sql = 'SELECT * FROM table -- This is a comment\nWHERE id = 1;';
        const expected = 'SELECT * FROM table WHERE id = 1;';
        expect(minifySQL(sql)).toBe(expected);
    });

    test('preserves single line comments when asked', () => {
        const sql = 'SELECT * FROM table -- This is a comment\nWHERE id = 1;';
        const expected = 'SELECT * FROM table /* This is a comment */ WHERE id = 1;';
        expect(minifySQL(sql, { includeComments: true })).toBe(expected);
    });

    test('removes multiline comments', () => {
        const sql = 'SELECT * /* This is a\nmultiline comment */ FROM table WHERE id = 1;';
        const expected = 'SELECT * FROM table WHERE id = 1;';
        expect(minifySQL(sql)).toBe(expected);
    });

    test('preserves multiline comments when asked', () => {
        const sql = 'SELECT * /* This is a\nmultiline comment */ FROM table WHERE id = 1;';
        const expected = 'SELECT * /* This is a multiline comment */ FROM table WHERE id = 1;';
        expect(minifySQL(sql, { includeComments: true })).toBe(expected);
    });

    test('throws error on unclosed string', () => {
        const sql = "SELECT * FROM table WHERE name = 'John";
        expect(() => minifySQL(sql)).toThrow(SQLMinifyError);
        expect(() => minifySQL(sql)).toThrow("Unclosed string constant.");
    });

    test('throws error on unclosed multiline comment', () => {
        const sql = 'SELECT * FROM table /* Comment starts but does not end';
        expect(() => minifySQL(sql)).toThrow(SQLMinifyError);
        expect(() => minifySQL(sql)).toThrow("Unclosed comment.");
    });

    test('correctly handles strings with escaped characters', () => {
        const sql = "UPDATE users SET data = 'O\\'Reilly' WHERE id = 1;";
        const expected = "UPDATE users SET data = 'O\\'Reilly' WHERE id = 1;";
        expect(minifySQL(sql)).toBe(expected);
    });

    test('manages complex SQL with multiple comments and strings', () => {
        const sql = `
            SELECT * FROM /* Select from all tables */
            users WHERE name = 'John' -- This is a comment
            AND age > 25;
        `;
        const expected = "SELECT * FROM users WHERE name = 'John' AND age > 25;";
        expect(minifySQL(sql)).toBe(expected);
    });

    test('handles SQL with mixed types of comments and whitespace correctly', () => {
        const sql = `
            SELECT /* This is a multiline
            comment */ * -- a comment
            FROM table WHERE id = /* another comment */ 1;
        `;
        const expected = 'SELECT * FROM table WHERE id = 1;';
        expect(minifySQL(sql)).toBe(expected);
    });
});