class CompilationEngine {
  constructor(tokens) {
    this.tokens = tokens;
    this.indentationLevel = 0;
    this.tokenCount = 0;
    this.currentToken = this.tokens[0];
    this.result = [];
  }

  advance() {
    this.tokenCount++;
    this.currentToken = this.tokens[this.tokenCount];
  }

  run() {
    this.result.push('<class>');
    while (this.tokenCount < this.tokens.length) {
      const { type, value } = this.processToken(this.currentToken);
      if (type === 'keyword') {
        this.processKeyword(type, value);
      } else if (type === 'symbol') {
        this.processSymbol(value);
      }
      this.advance();
    }
    this.result.push('</class>');
    return this.result;
  }

  processKeyword(type, value) {
    const result = [];
    if (value === 'class') {
      this.result.push(this.currentToken); // push <keyword>class</keyword>
      this.advance();
      this.processName(); // push class name e.g. Main
      this.advance();
      this.processSymbol('{'); // push {
      this.processClassVarDec();
      this.processSubroutineDec();
    }
    return result;
  }

  processParameterList() {
    this.result.push('<parameterList>');
    while (this.isType(this.peek().token)) {
      this.advance();
      this.processType();
      this.advance();
      this.processName();
      while (this.peek().value === ',') {
        this.advance();
        this.processSymbol(',');
        this.advance();
        this.processType();
        this.advance();
        this.processName();
      }
    }
    this.result.push('</parameterList>');
  }

  processSubroutineDec() {
    this.result.push('<subroutineDec>');
    while (
      this.peek().value === 'constructor' ||
      this.peek().value === 'function' ||
      this.peek().value === 'method'
    ) {
      this.advance();
      this.result.push(this.currentToken); // push function/method/constructor
      this.advance();
      this.processTypeOrVoid();
      this.advance();
      this.processName();
      this.advance();
      this.processSymbol('(');
      this.processParameterList();
      this.advance();
      this.processSymbol(')');
    }
    this.result.push('</subroutineDec>');
  }

  processClassVarDec() {
    this.result.push('<classVarDec>');
    while (this.peek().value === 'static' || this.peek().value === 'field') {
      this.advance();
      this.result.push(this.currentToken); // push static / field keyword
      this.advance();
      this.processType();
      this.advance();
      this.processName();
      while (this.peek().value === ',') {
        this.advance();
        this.processSymbol(',');
        this.advance();
        this.processName();
      }
      this.advance();
      this.processSymbol(';');
    }
    this.result.push('</classVarDec>');
  }

  processTypeOrVoid() {
    const { value, type } = this.processToken(this.currentToken);
    if (value === 'void') {
      this.result.push(this.currentToken);
    } else {
      try {
        this.processType();
      } catch (error) {
        throw new Error(`Type error in typeOrVoid ${type} ${value}`);
      }
    }
  }

  processType() {
    if (this.isType(this.currentToken)) {
      this.result.push(this.currentToken);
    } else {
      throw new Error(`Error in processType ${type} ${value}`);
    }
  }

  processSymbol(symbol) {
    const { type, value } = this.processToken(this.currentToken);
    if (type !== 'symbol') {
      throw new Error(
        `There must be symbol ${symbol} now instead of ${type} ${value}`,
      );
    }
    if (value !== symbol) {
      throw new Error(`Problem with symbol "${symbol}"- we expect one`);
    }
    this.result.push(this.currentToken);
  }

  processName() {
    const { type } = this.processToken(this.currentToken);
    if (type !== 'identifier') {
      throw new Error('There must be indentifier after class keyword');
    }
    this.result.push(this.currentToken);
  }

  processToken(token) {
    const data = token.match(/^<(\w+)>\s*(.*?)\s*<\/\1>$/);
    if (data) {
      const type = data[1];
      const value = data[2];
      return { type, value };
    } else {
      throw Error('Wrong token format', token);
    }
  }

  peek() {
    const totalTokens = this.tokens.length;
    const tempCount = this.tokenCount + 1;
    if (tempCount >= totalTokens) {
      return null;
    }
    const token = this.tokens[tempCount];
    return { ...this.processToken(this.tokens[tempCount]), token };
  }

  isType(token) {
    const { value, type } = this.processToken(token);
    return (
      value === 'int' ||
      value === 'char' ||
      value === 'boolean' ||
      type === 'identifier'
    );
  }
}

module.exports = CompilationEngine;
