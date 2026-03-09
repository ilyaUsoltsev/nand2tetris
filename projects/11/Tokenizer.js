const keywordsSet = require('./keywordsMap');
const symbolsSet = require('./symbolsMap');

class Tokenizer {
  constructor(fileContent) {
    this.lines = fileContent.split('\n');
    this.currentCount = 0;
  }

  run() {
    const result = [];
    for (const line of this.lines) {
      const sanitizedLine = this.sanitizeLine(line);
      if (sanitizedLine) {
        const lineTokens = this.processLine(sanitizedLine);
        result.push(...lineTokens);
      }
    }
    return result;
  }

  sanitizeLine(line) {
    // First, remove inline comments (everything after //)
    let commentIndex = line.indexOf('//');
    let processed =
      commentIndex !== -1 ? line.substring(0, commentIndex) : line;

    processed = processed.trim();
    // Return null for empty lines
    if (
      processed === '' ||
      processed.startsWith('/**') ||
      processed.startsWith('*') ||
      processed.startsWith('*/')
    ) {
      return null;
    }

    return processed;
  }

  processLine(line) {
    this.currentCount = 0;
    const result = [];
    const lineElements = line.split('');
    while (this.currentCount < lineElements.length) {
      const el = lineElements[this.currentCount];
      if (symbolsSet.has(el)) {
        result.push(`<symbol> ${el} </symbol>`);
      } else if (this.isAlphabetic(el)) {
        let identifier = '';
        let tempCount = this.currentCount;
        while (this.isAlphabeticOrNumeric(lineElements[tempCount])) {
          identifier += lineElements[tempCount];
          tempCount++;
        }
        this.currentCount = tempCount - 1;
        if (keywordsSet.has(identifier)) {
          result.push(`<keyword> ${identifier} </keyword>`);
        } else {
          result.push(`<identifier> ${identifier} </identifier>`);
        }
      } else if (el === '"') {
        let str = '';
        this.currentCount++;
        let tempCount = this.currentCount;
        while (
          lineElements[tempCount] !== '"' &&
          lineElements[tempCount] !== undefined
        ) {
          str += lineElements[tempCount];
          tempCount++;
        }
        this.currentCount = tempCount;
        console.log('String constant is ', str.length);
        result.push(`<stringConstant> '${str}' </stringConstant>`);
      } else if (!isNaN(Number(el)) && el.charCodeAt() !== 32) {
        let num = '';
        let tempCount = this.currentCount;
        while (
          !isNaN(Number(lineElements[tempCount])) &&
          lineElements[tempCount] !== undefined &&
          lineElements[tempCount].charCodeAt() !== 32
        ) {
          num += lineElements[tempCount];
          tempCount++;
        }
        this.currentCount = tempCount - 1;
        result.push(`<integerConstant> ${num} </integerConstant>`);
      }
      this.currentCount++;
    }
    return result;
  }

  isAlphabetic(char) {
    const code = char.charCodeAt();
    return (
      (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95
    );
  }

  isAlphabeticOrNumeric(char) {
    const code = char.charCodeAt();
    return (
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122) ||
      (code >= 48 && code <= 57) ||
      code === 95
    );
  }
}

module.exports = Tokenizer;
