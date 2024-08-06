/**
 * Custom error class for SQL minification errors.
 */
class SQLMinifyError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'SQLMinifyError';
        this.code = code;
    }
}

/**
 * Error codes for different types of SQL minification errors.
 */
const errorCodes = {
    INVALID_INPUT: 'INVALID_INPUT',
    UNCLOSED_STRING: 'UNCLOSED_STRING',
    UNCLOSED_COMMENT: 'UNCLOSED_COMMENT',
};

/**
 * Minifies SQL code by removing unnecessary whitespace and comments.
 * Optionally preserves comments based on options.
 *
 * @param {string} sql - The SQL string to be minified.
 * @param {object} options - Configuration options for minification.
 * @param {boolean} options.includeComments - Flag to determine if comments should be preserved.
 * @throws {SQLMinifyError} If the input is not a string or if unclosed strings or comments are detected.
 * @returns {string} The minified SQL string.
 */
function minifySQL(sql, options = {}) {
    if (typeof sql !== 'string') {
        throw new SQLMinifyError('Input SQL must be a string.', errorCodes.INVALID_INPUT);
    }

    const includeComments = options.includeComments || false;

    const checkUnclosedComment = (sql) => {
        const multilineCommentOpenPattern = /\/\*/g;
        const multilineCommentClosePattern = /\*\//g;
        const openComments = (sql.match(multilineCommentOpenPattern) || []).length;
        const closeComments = (sql.match(multilineCommentClosePattern) || []).length;
        if (openComments > closeComments) {
            throw new SQLMinifyError('Unclosed comment.', errorCodes.UNCLOSED_COMMENT);
        }
    };

    const checkUnclosedString = (sql) => {
        let inString = false;
        let isEscaped = false;
        for (let i = 0; i < sql.length; i++) {
            if (sql[i] === "'" && !isEscaped) {
                inString = !inString;
            }
            isEscaped = sql[i] === "\\" && !isEscaped;
        }
        if (inString) {
            throw new SQLMinifyError('Unclosed string constant.', errorCodes.UNCLOSED_STRING);
        }
    };

    checkUnclosedComment(sql);

    const multilineCommentPattern = /\/\*[\s\S]*?\*\//g;
    sql = sql.replace(multilineCommentPattern, match => {
        return includeComments ? `/* ${match.slice(2, -2).trim()} */` : '';
    });

    const singleLineCommentPattern = /--.*$/gm;
    sql = sql.replace(singleLineCommentPattern, match => {
        return includeComments ? `/* ${match.slice(2).trim()} */` : '';
    });

    checkUnclosedString(sql);

    sql = sql.replace(/\s+/g, ' ').replace(/\s*;\s*/g, ';').trim();

    return sql;
}

module.exports = { minifySQL, SQLMinifyError, errorCodes };