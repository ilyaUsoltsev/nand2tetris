const op = ['+', '-', '*', '/', '&', '|', '<', '>', '='];
const keywordConstant = ['true', 'false', 'null', 'this'];
const unaryOp = ['-', '~'];
const statements = ['let', 'if', 'while', 'do', 'return'];

class CompilationEngine {
  constructor(tokens) {
    this.tokens = tokens;
    this.indentation = 0;
    this.tokenCount = 0;
    this.currentToken = this.tokens[0];
    this.result = [];
    this.classSymbolTable = { field: 0, static: 0 };
    this.subroutineSymbolTable = { arg: 0, var: 0 };
  }

  advance() {
    this.tokenCount++;
    this.currentToken = this.tokens[this.tokenCount];
  }

  moveBack() {
    this.tokenCount--;
    this.currentToken = this.tokens[this.tokenCount];
  }

  run() {
    this.addToResult('<class>');
    this.indentation++;
    while (this.tokenCount < this.tokens.length) {
      const { type, value } = this.processToken(this.currentToken);
      if (type === 'keyword') {
        this.processKeyword(type, value);
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
      this.processName('class'); // push class name e.g. Main
      this.advance();
      this.processSymbol('{'); // push {
      while (this.peek().value === 'static' || this.peek().value === 'field') {
        this.processClassVarDec();
      }
      this.processSubroutineDec();
      this.advance();
      this.processSymbol('}'); // push }
    }
    return result;
  }

  processParameterList() {
    this.addToResult('<parameterList>');
    let argIndex = 1; // argument index starts with 1 because of "this" argument for methods
    while (this.isType(this.peek().token)) {
      this.advance();
      const varType = this.processType();
      this.advance();
      this.processName('arg', argIndex, 'defined', varType);
      argIndex++;
      while (this.peek().value === ',') {
        this.advance();
        this.processSymbol(',');
        this.advance();
        const nextVarType = this.processType();
        this.advance();
        this.processName('arg', argIndex, 'defined', nextVarType);
        argIndex++;
      }
    }
    this.addToResult('</parameterList>');
  }

  processSubroutineDec() {
    while (
      this.peek().value === 'constructor' ||
      this.peek().value === 'function' ||
      this.peek().value === 'method'
    ) {
      this.addToResult('<subroutineDec>');
      this.indentation++;
      this.advance();
      this.addToResult(this.currentToken); // push function/method/constructor
      this.advance();
      this.processTypeOrVoid();
      this.advance();
      this.processName('subroutine'); // push subroutine name e.g. new / dispose / main
      this.advance();
      this.processSymbol('(');
      this.processParameterList();
      this.advance();
      this.processSymbol(')');
      this.processSubroutineBody();
      this.indentation--;
      this.addToResult('</subroutineDec>');
    }
  }

  processSubroutineBody() {
    this.addToResult('<subroutineBody>');
    this.indentation++;
    this.advance();
    this.processSymbol('{');
    while (this.peek().value === 'var') {
      this.processVarDec();
    }
    this.processStatements();
    this.advance();
    this.processSymbol('}');
    this.indentation--;
    this.addToResult('</subroutineBody>');
  }

  processStatements() {
    this.addToResult('<statements>');
    this.indentation++;
    while (
      this.peek() &&
      this.peek().type === 'keyword' &&
      statements.includes(this.peek().value)
    ) {
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
    this.processName('var', null, 'used'); // var name

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
  processIfStatement() {
    this.addToResult('<ifStatement>');
    this.indentation++;

    this.advance();
    this.addToResult(this.currentToken); // if token

    this.advance();
    this.processSymbol('(');
    this.processExpression();
    this.advance();
    this.processSymbol(')');

    this.advance();
    this.processSymbol('{');
    this.processStatements();
    this.advance();
    this.processSymbol('}');

    if (this.peek().value === 'else') {
      this.advance();
      this.addToResult(this.currentToken); // else token

      this.advance();
      this.processSymbol('{');
      this.processStatements();
      this.advance();
      this.processSymbol('}');
    }

    this.indentation--;
    this.addToResult('</ifStatement>');
  }
  processWhileStatement() {
    this.addToResult('<whileStatement>');
    this.indentation++;

    this.advance();
    this.addToResult(this.currentToken); // while token

    this.advance();
    this.processSymbol('(');
    this.processExpression();
    this.advance();
    this.processSymbol(')');

    this.advance();
    this.processSymbol('{');
    this.processStatements();
    this.advance();
    this.processSymbol('}');

    this.indentation--;
    this.addToResult('</whileStatement>');
  }

  processDoStatement() {
    this.addToResult('<doStatement>');
    this.indentation++;

    this.advance();
    this.addToResult(this.currentToken); // do token

    this.advance();
    this.processName('subroutine'); // push subroutine name e.g. new / dispose / main

    if (this.peek().value === '.') {
      this.advance();
      this.processSymbol('.');
      this.advance();
      this.processName('subroutine');
    }

    this.advance();
    this.processSymbol('(');
    this.processExpressionList();
    this.advance();
    this.processSymbol(')');

    this.advance();
    this.processSymbol(';');

    this.indentation--;
    this.addToResult('</doStatement>');
  }
  processReturnStatement() {
    this.addToResult('<returnStatement>');
    this.indentation++;

    this.advance();
    this.addToResult(this.currentToken); // return token

    if (this.peek().value !== ';') {
      this.processExpression();
    }

    this.advance();
    this.processSymbol(';');

    this.indentation--;
    this.addToResult('</returnStatement>');
  }

  processExpression() {
    this.addToResult('<expression>');
    this.indentation++;
    const result = this.processTerm();
    while (this.peek().type === 'symbol' && op.includes(this.peek().value)) {
      this.advance();
      this.processSymbol(this.processToken(this.currentToken).value); // push op symbol
      this.processTerm();
    }
    this.indentation--;
    this.addToResult('</expression>');

    return result;
  }

  processTerm() {
    let isTerm = true;
    this.addToResult('<term>');
    this.indentation++;
    this.advance();
    const { type, value } = this.processToken(this.currentToken);
    if (
      type === 'integerConstant' ||
      type === 'stringConstant' ||
      type === 'keyword' // not <keywordConstant
    ) {
      this.addToResult(this.currentToken);
    } else if (
      type === 'identifier' &&
      this.peek().type !== 'symbol' &&
      this.peek().value !== '['
    ) {
      this.processName('var', null, 'used');
    } else if (
      type === 'identifier' &&
      this.peek().type === 'symbol' &&
      this.peek().value === '['
    ) {
      this.processName('var', null, 'used');
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
      this.processSymbol(value); // not <unaryOp
      this.processTerm();
    } else if (
      type === 'identifier' &&
      this.peek().type === 'symbol' &&
      this.peek().value === '('
    ) {
      this.processName('subroutine');
      this.advance();
      this.processSymbol('(');
      this.processExpressionList();
      this.advance();
      this.processSymbol(')');
    } else if (
      type === 'identifier' &&
      this.peek().type === 'symbol' &&
      this.peek().value === '.'
    ) {
      this.processName('subroutine');
      this.advance();
      this.processSymbol('.');
      this.advance();
      this.processName('subroutine');
      this.advance();
      this.processSymbol('(');
      this.processExpressionList();
      this.advance();
      this.processSymbol(')');
    } else if (type === 'identifier') {
      this.processName('var', null, 'used');
    } else {
      isTerm = false;
    }
    this.indentation--;
    this.addToResult('</term>');
    return isTerm;
  }

  processExpressionList() {
    this.addToResult('<expressionList>');
    this.indentation++;
    const result = this.processExpression();
    if (!result) {
      // two <expressions> and two <terms>
      new Array(4).fill().forEach(() => {
        this.popFromResult();
      });
      this.moveBack();
    } else {
      while (this.peek().type === 'symbol' && this.peek().value === ',') {
        this.advance();
        this.processSymbol(',');
        this.processExpression();
      }
    }
    this.indentation--;
    this.addToResult('</expressionList>');
  }

  processVarDec() {
    this.addToResult('<varDec>');
    this.indentation++;
    let varIndex = 0;
    if (this.peek().value === 'var') {
      this.advance();
      this.addToResult(this.currentToken); // push var keyword
      this.advance();
      const varType = this.processType();
      this.advance();
      this.processName('var', varIndex, 'defined', varType);
      varIndex++;
      while (this.peek().value === ',') {
        this.advance();
        this.processSymbol(',');
        this.advance();
        this.processName('var', varIndex, 'defined', varType);
        varIndex++;
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
    let fieldIndex = 0;
    if (this.peek().value === 'static' || this.peek().value === 'field') {
      this.advance();
      const { value } = this.processToken(this.currentToken);
      this.addToResult(this.currentToken); // push static / field keyword
      this.advance();
      const varType = this.processType();
      this.advance();
      this.processName(value, fieldIndex, 'defined', varType);
      this.classSymbolTable;
      fieldIndex++;
      while (this.peek().value === ',') {
        this.advance();
        this.processSymbol(',');
        this.advance();
        this.processName(value, fieldIndex, 'defined', varType);
        fieldIndex++;
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
      const { value } = this.processToken(this.currentToken);
      this.addToResult(this.currentToken);
      return value;
    } else {
      throw new Error(`Error in processType ${type} ${value}`);
    }
  }

  processSymbol(symbol) {
    const { type, value } = this.processToken(this.currentToken);
    if (type !== 'symbol') {
      console.log(this.currentToken, 'this.currentToken', value, type, symbol);
      throw new Error(
        `There must be symbol ${symbol} now instead of ${type} ${value}`,
      );
    }
    if (value !== symbol) {
      console.log(this.currentToken, 'this.currentToken', value, type, symbol);
      throw new Error(`Problem with symbol "${symbol}"- we expect one`);
    }
    this.addToResult(this.currentToken);
  }

  processName(category, index, action, varType) {
    const { type, value } = this.processToken(this.currentToken);
    if (type !== 'identifier') {
      throw new Error('There must be indentifier after class keyword');
    }
    if (!category) {
      throw new Error('Category is required for name processing');
    }

    const fieldCategories = ['static', 'field', 'arg', 'var'];

    if (fieldCategories.includes(category) && action === 'defined') {
      if (category === 'field' || category === 'static') {
        this.classSymbolTable[value] = [
          value,
          varType,
          category,
          this.classSymbolTable[category],
        ];
        this.classSymbolTable[category]++;
      } else {
        // var and arg
        this.subroutineSymbolTable[value] = [
          value,
          varType,
          category,
          this.subroutineSymbolTable[category],
        ];
        this.subroutineSymbolTable[category]++;
      }

      this.addToResult(
        `<${type} category="${category}" index=${index} action="${action}">${value}</${type}>`,
      );
    } else {
      this.addToResult(`<${type} category="${category}">${value}</${type}>`);
    }
    console.log(JSON.stringify(this.subroutineSymbolTable));
    console.log(JSON.stringify(this.classSymbolTable));
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

  popFromResult() {
    this.result.pop();
  }
}

module.exports = CompilationEngine;
