class CompilationEngine {
  constructor(tokens) {
    this.tokens = tokens;
    this.indentation = 0;
    this.tokenCount = 0;
    this.currentToken = this.tokens[0];
    this.result = [];
  }

  advance() {
    this.tokenCount++;
    this.currentToken = this.tokens[this.tokenCount];
  }

  run() {
    this.addToResult('<class>');
    this.indentation++;
    while (this.tokenCount < this.tokens.length) {
      const { type, value } = this.processToken(this.currentToken);
      if (type === 'keyword') {
        this.processKeyword(type, value);
      } else if (type === 'symbol') {
        this.processSymbol(value);
      }
      this.advance();
    }
    this.indentation--;
    this.addToResult('</class>');
    return this.result;
  }

  processKeyword(type, value) {
    const result = [];
    if (value === 'class') {
      this.addToResult(this.currentToken); // push <keyword>class</keyword>
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
    this.addToResult('<parameterList>');
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
    this.addToResult('</parameterList>');
  }

  processSubroutineDec() {
    this.addToResult('<subroutineDec>');
    this.indentation++;
    while (
      this.peek().value === 'constructor' ||
      this.peek().value === 'function' ||
      this.peek().value === 'method'
    ) {
      this.advance();
      this.addToResult(this.currentToken); // push function/method/constructor
      this.advance();
      this.processTypeOrVoid();
      this.advance();
      this.processName();
      this.advance();
      this.processSymbol('(');
      this.processParameterList();
      this.advance();
      this.processSymbol(')');
      this.processSubroutineBody();
    }
    this.indentation--;
    this.addToResult('</subroutineDec>');
  }

  processSubroutineBody() {
    this.addToResult('<subroutineBody>');
    this.indentation++;
    this.advance();
    this.processSymbol('{');
    this.processVarDec();
    this.processStatements();
    this.indentation--;
    this.addToResult('</subroutineBody>');
  }

  processStatements() {
    this.addToResult('<statements>');
    this.indentation++;
    const { value } = this.peek();
    if (value === 'let') {
      this.processLetStatement();
    } else if (value === 'if') {
      this.processIfStatement();
    } else if (value === 'while') {
      this.processWhileStatement();
    } else if (value === 'do') {
      this.processDoStatement();
    } else if (value === 'return') {
      this.processReturnStatement();
    } else {
      throw new Error(`Unknown statement ${value}`);
    }
    this.indentation--;
    this.addToResult('</statements>');
  }

  processLetStatement() {
    this.addToResult('<letStatement>');
    this.indentation++;

    this.advance();
    this.addToResult(this.currentToken); // let token
    this.advance();
    this.processName();

    // [expression]
    while (this.peek().value === '[') {
      this.advance();
      this.processSymbol('[');
      this.processExpression();
      this.advance();
      this.processSymbol(']');
    }
    this.advance();
    this.processSymbol('=');
    this.processExpression();
    this.advance();
    this.processSymbol(';');

    this.indentation--;
    this.addToResult('</letStatement>');
  }
  processIfStatement() {}
  processWhileStatement() {}
  processDoStatement() {}
  processReturnStatement() {}

  processExpression() {
    this.addToResult('<expression>');
    this.indentation++;
    this.processTerm();

    this.addToResult('</expression>');
  }

  processTerm() {
    this.addToResult('<term>');
    this.indentation++;
    this.advance();
    const { type, value } = this.processToken(this.currentToken);
    if (
      type === 'integerConstant' ||
      type === 'stringConstant' ||
      type === 'keyword' // not <keywordConstant
    ) {
      this.result.push(this.currentToken);
    } else if (
      type === 'identifier' &&
      this.peek().type !== 'symbol' &&
      this.peek().value !== '['
    ) {
      this.processName();
    } else if (
      type === 'identifier' &&
      this.peek().type === 'symbol' &&
      this.peek().value === '['
    ) {
      this.processName();
      this.advance();
      this.processSymbol('[');
      this.processExpression();
      this.advance();
      this.processSymbol(']');
    } else if (type === 'symbol' && value === '(') {
      this.processSymbol('(');
      this.processExpression();
      this.advance();
      this.processSymbol(')');
    } else if (type === 'symbol' && (value === '-' || value === '~')) {
      this.processSymbol(); // not <unaryOp
      this.processTerm();
    } else if (type === 'identifier' && ) { 
      // CONTINUE HERE WITH subroutineCall
    }
    else {
      throw new Error(`Error in expression ${value} - ${type}`);
    }

    this.addToResult('<term>');
  }

  processVarDec() {
    this.addToResult('<varDec>');
    this.indentation++;
    while (this.peek().value === 'var') {
      this.advance();
      this.addToResult(this.currentToken);
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
    this.indentation--;
    this.addToResult('</varDec>');
  }

  processClassVarDec() {
    this.addToResult('<classVarDec>');
    this.indentation++;
    while (this.peek().value === 'static' || this.peek().value === 'field') {
      this.advance();
      this.addToResult(this.currentToken); // push static / field keyword
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
    this.indentation--;
    this.addToResult('</classVarDec>');
  }

  processTypeOrVoid() {
    const { value, type } = this.processToken(this.currentToken);
    if (value === 'void') {
      this.addToResult(this.currentToken);
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
      this.addToResult(this.currentToken);
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
    this.addToResult(this.currentToken);
  }

  processName() {
    const { type } = this.processToken(this.currentToken);
    if (type !== 'identifier') {
      throw new Error('There must be indentifier after class keyword');
    }
    this.addToResult(this.currentToken);
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

  addToResult(token) {
    const indentation = '  '.repeat(this.indentation);
    this.result.push(`${indentation}${token}`);
  }
}

module.exports = CompilationEngine;
