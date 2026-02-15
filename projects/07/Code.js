class Code {
  constructor(instructions, fileName) {
    this.instructions = instructions;
    this.fileName = fileName;
  }

  processInstructions() {
    const result = [];
    for (const instruction of this.instructions) {
      const { commandType, arg1, arg2 } = instruction;
      if (commandType === 'C_PUSH') {
        result.push(this.processPush(arg1, arg2));
      } else if (commandType === 'C_POP') {
        result.push(this.processPop(arg1, arg2));
      } else if (commandType === 'C_ARITHMETIC') {
        result.push(this.processArithmetic(arg1));
      }
    }
    return result;
  }

  processPush(arg1, arg2) {
    let result = `// push ${arg1} ${arg2} \n`;
    if (arg1 === 'constant') {
      return (result += this.processPushConstant(arg2));
    } else if (arg1 === 'local') {
      return (result += this.processPushLocalArgThisThat('LCL', arg2));
    } else if (arg1 === 'argument') {
      return (result += this.processPushLocalArgThisThat('ARG', arg2));
    } else if (arg1 === 'this') {
      return (result += this.processPushLocalArgThisThat('THIS', arg2));
    } else if (arg1 === 'that') {
      return (result += this.processPushLocalArgThisThat('THIS', arg2));
    } else if (arg1 === 'static') {
      return (result += this.processPushStatic(arg2));
    } else if (arg1 === 'temp') {
      return (result += this.processPushTemp(arg2));
    } else if (arg1 === 'pointer') {
      return (result += this.processPushPointer(arg2));
    }
    throw new Error(`Invalid push with args: ${arg1} and ${arg2}`);
  }

  processPop(arg1, arg2) {
    let result = `// pop ${arg1} ${arg2} \n`;
    if (arg1 === 'local') {
      return (result += this.processPopLocalArgThisThat('LCL', arg2));
    } else if (arg1 === 'argument') {
      return (result += this.processPopLocalArgThisThat('ARG', arg2));
    } else if (arg1 === 'this') {
      return (result += this.processPopLocalArgThisThat('THIS', arg2));
    } else if (arg1 === 'that') {
      return (result += this.processPopLocalArgThisThat('THAT', arg2));
    } else if (arg1 === 'static') {
      return (result += this.processPopStatic(arg2));
    } else if (arg1 === 'temp') {
      return (result += this.processPopTemp(arg2));
    } else if (arg1 === 'pointer') {
      return (result += this.processPopPointer(arg2));
    }
    throw new Error(`Invalid pop with args: ${arg1} and ${arg2}`);
  }

  processPushPointer(arg2) {
    const segment = arg2 === 0 ? 'THIS' : 'THAT';
    return `
      @${segment}
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
    `;
  }

  processPopPointer(arg2) {
    const segment = arg2 === 0 ? 'THIS' : 'THAT';
    return `
      @SP
      M=M-1
      A=M
      D=M
      @${segment}
      M=D
    `;
  }

  processPopStatic(arg2) {
    return `
      @SP
      M=M-1
      A=M
      D=M
      @${this.fileName}.${arg2}
      M=D
    `;
  }

  processPushStatic(arg2) {
    return `
      @${this.fileName}.${arg2}
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
    `;
  }

  processPushConstant(arg2) {
    return `
      @${arg2}
      D=A
      @SP
      A=M
      M=D
      @SP
      M=M+1
    `;
  }

  processPushTemp(arg2) {
    let result = `
      @5
      D=A
      @processPushTemp
      M=D
    `;
    return (result += this.processPushLocalArgThisThat(
      'processPushTemp',
      arg2,
    ));
  }

  processPopTemp(arg2) {
    let result = `
      @5
      D=A
      @processPopTemp
      M=D
    `;
    return (result += this.processPopLocalArgThisThat('processPopTemp', arg2));
  }

  processPopLocalArgThisThat(segment, i) {
    return `
      ${this.getAddressOfSegementIElement(segment, i)}
      @SP
      M=M-1
      A=M
      D=M
      @lcl_addr
      A=M
      M=D
      `;
  }

  processPushLocalArgThisThat(segment, i) {
    return `
      ${this.getAddressOfSegementIElement(segment, i)}
      @lcl_addr
      A=M
      M=D
      @SP
      A=M
      M=D
      @SP
      M=M+1
      `;
  }

  getAddressOfSegementIElement(segment, i) {
    return `
      @${i}
      D=A
      @${segment}
      D=D+M
      @lcl_addr
      M=D
      `;
  }

  processArithmetic(arg1) {
    let result = `// arithmetic: ${arg1} \n`;
    if (arg1 === 'add') {
      return (result += this.processOperator('+'));
    } else if (arg1 === 'sub') {
      return (result += this.processSub());
    } else if (arg1 === 'neg') {
      return (result += this.processSign('-'));
    } else if (arg1 === 'eq') {
      return (result += this.processComp('JEQ'));
    } else if (arg1 === 'gt') {
      return (result += this.processComp('JGT'));
    } else if (arg1 === 'lt') {
      return (result += this.processComp('JLT'));
    } else if (arg1 === 'and') {
      return (result += this.processOperator('&'));
    } else if (arg1 === 'or') {
      return (result += this.processOperator('|'));
    } else if (arg1 === 'not') {
      return (result += this.processSign('!'));
    }
    throw new Error(`Invalid Arithmetic: ${arg1} `);
  }

  processComp(condition) {
    const trueAddress = `TRUE_${this.fileName}_${Math.random()}`;
    const endProcessAddress = `END_${this.fileName}_${Math.random()}`;
    return `
      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=M-D
      // if ${condition}
      @${trueAddress}
      D;${condition}
      // else
      @SP
      A=M
      M=0
      @${endProcessAddress}
      0;JMP
      (${trueAddress})
      @SP
      A=M
      M=-1
      (${endProcessAddress})
      @SP
      M=M+1
    `;
  }

  processSign(sign) {
    return `
      @SP
      M=M-1
      A=M
      M=${sign}M
      @SP
      M=M+1
    `;
  }

  processOperator(sign) {
    return `
      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=D${sign}M
      M=D
      @SP
      M=M+1
    `;
  }

  processSub() {
    return `
      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=M-D
      M=D
      @SP
      M=M+1
    `;
  }
}

module.exports = Code;
