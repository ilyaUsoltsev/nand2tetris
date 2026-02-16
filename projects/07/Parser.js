const { arithmeticCommands } = require('./constants.js');

class Parser {
  constructor(fileContent) {
    this.lines = fileContent.split('\n');
    this.currentLine = 0;
  }

  readLines() {
    const result = [];
    for (const line of this.lines) {
      const sanitizedLine = this.sanitizeLine(line);
      if (sanitizedLine) {
        const res = this.readLine(sanitizedLine);
        result.push(res);
      }
    }

    return result;
  }

  sanitizeLine(line) {
    // First, remove inline comments (everything after //)
    const commentIndex = line.indexOf('//');
    let processed =
      commentIndex !== -1 ? line.substring(0, commentIndex) : line;

    // Return null for empty lines
    if (processed === '') {
      return null;
    }

    return processed;
  }

  readLine(line) {
    const [first, second, third] = line.split(' ').filter((i) => i !== '');
    const isArithmetic = arithmeticCommands.has(first);
    if (isArithmetic) {
      return {
        commandType: 'C_ARITHMETIC',
        arg1: first,
      };
    }
    if (first === 'pop') {
      return {
        commandType: 'C_POP',
        arg1: second,
        arg2: third,
      };
    }
    if (first === 'push') {
      return {
        commandType: 'C_PUSH',
        arg1: second,
        arg2: third,
      };
    }

    throw new Error(`Unknown command: ${first}`);
  }
}

module.exports = Parser;
