const CodeWrite = require('./CodeWrite');

const op = ['+', '-', '*', '/', '&', '|', '<', '>', '='];
const keywordConstant = ['true', 'false', 'null', 'this'];
const unaryOp = ['-', '~'];
const statements = ['let', 'if', 'while', 'do', 'return'];
const vmMap = {
  field: 'this',
  static: 'static',
  arg: 'argument',
  var: 'local',
};

class CompilationEngine {
  constructor(tokens) {
    this.tokens = tokens;
    this.indentation = 0;
    this.tokenCount = 0;
    this.currentToken = this.tokens[0];
    this.result = [];
    this.vmResult = [];
    this.classSymbolTable = { field: 0, static: 0 };
    this.subroutineSymbolTable = { arg: 0, var: 0 };
    this.codeWrite = new CodeWrite();
    this.className = '';
    this.labelCount = 0;
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
    while (this.tokenCount < this.tokens.length) {
      const { type, value } = this.processToken(this.currentToken);
      // essentially we start here and finish here as it's a class
      if (type === 'keyword') {
        this.processKeyword(type, value);
      }
      this.advance(); // final EOF
    }
    return this.codeWrite.vmResult;
  }

  processKeyword(type, value) {
    if (value === 'class') {
      this.addToResult(this.currentToken); // push <keyword>class</keyword>
      this.advance();
      this.className = this.processName('class'); // push class name e.g. Main
      this.advance();
      this.processSymbol('{'); // push {
      while (this.peek().value === 'static' || this.peek().value === 'field') {
        this.processClassVarDec();
      }
      this.processSubroutineDec();
      this.advance();
      this.processSymbol('}'); // push }
    }
  }

  processParameterList() {
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
  }

  processSubroutineDec() {
    while (
      this.peek().value === 'constructor' ||
      this.peek().value === 'function' ||
      this.peek().value === 'method'
    ) {
      this.subroutineSymbolTable = { arg: 0, var: 0 };
      this.advance();
      this.addToResult(this.currentToken); // push function/method/constructor
      this.advance();
      this.processTypeOrVoid();
      this.advance();
      const functionName = this.processName('subroutine'); // push subroutine name e.g. new / dispose / main
      this.advance();
      this.processSymbol('(');
      this.processParameterList();
      this.advance();
      this.processSymbol(')');
      this.processSubroutineBody(functionName);
    }
  }

  processSubroutineBody(functionName) {
    this.advance();
    this.processSymbol('{');
    let totalLocalVars = 0;
    while (this.peek().value === 'var') {
      const typeCount = this.processVarDec();
      totalLocalVars += typeCount;
    }
    this.codeWrite.vmResult.push(
      `function ${this.className}.${functionName} ${totalLocalVars}`,
    );
    this.processStatements();
    this.advance();
    this.processSymbol('}');
  }

  processStatements() {
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
  }

  processLetStatement() {
    this.advance();
    this.addToResult(this.currentToken); // let token
    this.advance();
    const varName = this.processName('var', null, 'used'); // var name

    // [expression]
    while (this.peek().value === '[') {
      this.advance();
      this.processSymbol('[');
      this.processExpression(); // Array LATER
      this.advance();
      this.processSymbol(']');
    }
    this.advance();
    this.processSymbol('=');
    const exp = this.processExpression();
    this.codeWrite.codeWrite(exp);
    this.codeWrite.vmResult.push(this.getVarFromTable(varName, 'pop'));
    this.advance();
    this.processSymbol(';');
  }

  getVarFromTable(varName, action) {
    let info = this.subroutineSymbolTable[varName];
    if (!info) {
      info = this.classSymbolTable[varName];
    }
    if (!info) {
      throw new Error(`Variable is not declared ${varName}`);
    }

    return `${action} ${vmMap[info[2]]} ${info[3]}`;
  }

  processIfStatement() {
    this.advance();
    this.addToResult(this.currentToken); // if token

    this.advance();
    this.processSymbol('(');
    const ifExp = this.processExpression();
    this.codeWrite.codeWrite(ifExp);
    this.codeWrite.vmResult.push('not');
    const L1 = this.getLabel();
    this.codeWrite.vmResult.push(`if-goto ${L1}`);
    this.advance();
    this.processSymbol(')');

    this.advance();
    this.processSymbol('{');
    this.processStatements();
    this.advance();
    this.processSymbol('}');
    const L2 = this.getLabel();
    this.codeWrite.vmResult.push(`goto ${L2}`);

    this.codeWrite.vmResult.push(`label ${L1}`);
    if (this.peek().value === 'else') {
      this.advance();
      this.addToResult(this.currentToken); // else token

      this.advance();
      this.processSymbol('{');
      this.processStatements();
      this.advance();
      this.processSymbol('}');
    }
    this.codeWrite.vmResult.push(`label ${L2}`);
  }
  processWhileStatement() {
    const L1 = this.getLabel();
    this.codeWrite.vmResult.push(`label ${L1}`);
    this.advance();
    this.addToResult(this.currentToken); // while token
    this.advance();
    this.processSymbol('(');
    const whileExp = this.processExpression();
    this.codeWrite.codeWrite(whileExp);
    this.codeWrite.vmResult.push('not');
    const L2 = this.getLabel();
    this.codeWrite.vmResult.push(`if-goto ${L2}`);
    this.advance();
    this.processSymbol(')');

    this.advance();
    this.processSymbol('{');
    this.processStatements();
    this.advance();
    this.processSymbol('}');
    this.codeWrite.vmResult.push(`goto ${L1}`);
    this.codeWrite.vmResult.push(`label ${L2}`);
  }

  processDoStatement() {
    this.advance();
    this.addToResult(this.currentToken); // do token

    this.advance();
    let subName;
    const name = this.processName('subroutine'); // push subroutine name e.g. new / dispose / main / Output

    if (this.peek().value === '.') {
      this.advance();
      this.processSymbol('.');
      this.advance();
      subName = this.processName('subroutine');
    }

    this.advance();
    this.processSymbol('(');
    const results = this.processExpressionList();
    this.advance();
    this.processSymbol(')');

    this.advance();
    this.processSymbol(';');

    const functionName = subName ? `${name}.${subName}` : name;
    this.codeWrite.codeWrite({
      type: 'f',
      value: { fn: functionName, expressions: results },
    });
    this.codeWrite.vmResult.push('pop temp 0'); // discard return value of do statement
  }
  processReturnStatement() {
    this.advance();
    this.addToResult(this.currentToken); // return token

    if (this.peek().value !== ';') {
      const exp = this.processExpression();
      this.codeWrite.codeWrite(exp);
    } else {
      this.codeWrite.codeWrite({ type: 'integerConstant', value: 0 });
    }

    this.codeWrite.vmResult.push('return');

    this.advance();
    this.processSymbol(';');
  }

  processExpression() {
    let exp1 = this.processTerm();
    while (this.peek().type === 'symbol' && op.includes(this.peek().value)) {
      this.advance();
      const op = this.processSymbol(this.processToken(this.currentToken).value); // push op symbol
      const exp2 = this.processTerm();
      exp1 = { type: 'expOpExp', value: { exp1, op, exp2 } };
    }
    return exp1;
  }

  processTerm() {
    this.advance();
    const { type, value } = this.processToken(this.currentToken);
    let result = `${type}_${value}`;
    if (
      type === 'integerConstant' ||
      type === 'stringConstant' ||
      type === 'keyword' // not <keywordConstant
    ) {
      if (type === 'integerConstant') {
        result = { type: 'integerConstant', value };
      }
      if (type === 'keyword') {
        result = { type, value };
      }
    } else if (
      type === 'identifier' &&
      this.peek().type !== 'symbol' &&
      this.peek().value !== '['
    ) {
      const varName = this.processName('var', null, 'used');
      result = { type: 'print', value: this.getVarFromTable(varName, 'push') };
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
      result = this.processExpression();
      this.advance();
      this.processSymbol(')');
    } else if (type === 'symbol' && (value === '-' || value === '~')) {
      this.processSymbol(value); // not <unaryOp
      result = this.processTerm();
      result = { type: 'opExp', value: { op: value, exp1: result } };
    } else if (
      type === 'identifier' &&
      this.peek().type === 'symbol' &&
      this.peek().value === '('
    ) {
      this.processName('subroutine');
      this.advance();
      this.processSymbol('(');
      result = this.processExpressionList()[0];
      this.advance();
      this.processSymbol(')');
    } else if (
      type === 'identifier' &&
      this.peek().type === 'symbol' &&
      this.peek().value === '.'
    ) {
      const name = this.processName('subroutine');
      this.advance();
      this.processSymbol('.');
      this.advance();
      const subName = this.processName('subroutine');
      this.advance();
      this.processSymbol('(');
      result = this.processExpressionList();
      this.advance();
      this.processSymbol(')');
      const functionName = subName ? `${name}.${subName}` : name;
      result = {
        type: 'f',
        value: { fn: functionName, expressions: result },
      };
    } else if (type === 'identifier') {
      const varName = this.processName('var', null, 'used');
      result = { type: 'print', value: this.getVarFromTable(varName, 'push') };
    } else {
      throw new Error(`Unknown term type ${type} with value ${value}`);
    }
    return result;
  }

  processExpressionList() {
    const result = [];
    const exp = this.processExpression();
    result.push(exp);
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
        const exp = this.processExpression();
        result.push(exp);
      }
    }
    return result;
  }

  processVarDec() {
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
      return varIndex;
    }
  }

  processClassVarDec() {
    let fieldIndex = 0;
    if (this.peek().value === 'static' || this.peek().value === 'field') {
      this.advance();
      const { value } = this.processToken(this.currentToken);
      this.addToResult(this.currentToken); // push static / field keyword
      this.advance();
      const varType = this.processType();
      this.advance();
      this.processName(value, fieldIndex, 'defined', varType);
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
    return value;
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

    if (fieldCategories.includes(category)) {
      if (
        (category === 'field' || category === 'static') &&
        action === 'defined'
      ) {
        this.classSymbolTable[value] = [
          value,
          varType,
          category,
          this.classSymbolTable[category],
        ];
        this.classSymbolTable[category]++;
      } else if (
        (category === 'arg' || category === 'var') &&
        action === 'defined'
      ) {
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
        `<${type} category="${category}" index="${index}" action="${action}">${value}</${type}>`,
      );
    } else {
      this.addToResult(`<${type} category="${category}">${value}</${type}>`);
    }
    // console.log(JSON.stringify(this.subroutineSymbolTable));
    // console.log(JSON.stringify(this.classSymbolTable));
    return value;
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

  getLabel() {
    const label = `${this.className}_${this.labelCount}`;
    this.labelCount++;
    return label;
  }
}

module.exports = CompilationEngine;
