class Code {
  constructor(instructions, fileName) {
    this.instructions = instructions;
    this.fileName = fileName;
    this.labelCounter = 0;
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
      } else if (commandType === 'C_LABEL') {
        result.push(this.processLabel(arg1));
      } else if (commandType === 'C_GOTO') {
        result.push(this.processGoTo(arg1));
      } else if (commandType === 'C_IF') {
        result.push(this.processIfGoTo(arg1));
      }
    }
    return result;
  }

  processPush(arg1, arg2) {
    const result = `// push ${arg1} ${arg2}\n`;

    const handlers = {
      constant: () => this.processPushConstant(arg2),
      local: () => this.processPushLocalArgThisThat('LCL', arg2),
      argument: () => this.processPushLocalArgThisThat('ARG', arg2),
      this: () => this.processPushLocalArgThisThat('THIS', arg2),
      that: () => this.processPushLocalArgThisThat('THAT', arg2),
      static: () => this.processPushStatic(arg2),
      temp: () => this.processPushTemp(arg2),
      pointer: () => this.processPushPointer(arg2),
    };

    const handler = handlers[arg1];
    if (!handler) {
      throw new Error(`Invalid push with args: ${arg1} and ${arg2}`);
    }

    return result + handler();
  }

  processPop(arg1, arg2) {
    const result = `// pop ${arg1} ${arg2}\n`;

    const handlers = {
      local: () => this.processPopLocalArgThisThat('LCL', arg2),
      argument: () => this.processPopLocalArgThisThat('ARG', arg2),
      this: () => this.processPopLocalArgThisThat('THIS', arg2),
      that: () => this.processPopLocalArgThisThat('THAT', arg2),
      static: () => this.processPopStatic(arg2),
      temp: () => this.processPopTemp(arg2),
      pointer: () => this.processPopPointer(arg2),
    };

    const handler = handlers[arg1];
    if (!handler) {
      throw new Error(`Invalid pop with args: ${arg1} and ${arg2}`);
    }

    return result + handler();
  }

  processPushPointer(arg2) {
    if (arg2 !== '0' && arg2 !== '1') {
      throw new Error(`Invalid pointer index: ${arg2} (must be 0 or 1)`);
    }
    const segment = arg2 === '0' ? 'THIS' : 'THAT';
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
    if (arg2 !== '0' && arg2 !== '1') {
      throw new Error(`Invalid pointer index: ${arg2} (must be 0 or 1)`);
    }
    const segment = arg2 === '0' ? 'THIS' : 'THAT';
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
    const index = parseInt(arg2);
    if (index < 0 || index > 7) {
      throw new Error(`Invalid temp index: ${arg2} (must be 0-7)`);
    }
    const address = 5 + index;
    return `
      @${address}
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
    `;
  }

  processPopTemp(arg2) {
    const index = parseInt(arg2);
    if (index < 0 || index > 7) {
      throw new Error(`Invalid temp index: ${arg2} (must be 0-7)`);
    }
    const address = 5 + index;
    return `
      @SP
      M=M-1
      A=M
      D=M
      @${address}
      M=D
    `;
  }

  processPopLocalArgThisThat(segment, i) {
    return `
      ${this.getAddressOfSegmentIElement(segment, i)}
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
      ${this.getAddressOfSegmentIElement(segment, i)}
      @lcl_addr
      A=M
      D=M
      @SP
      A=M
      M=D
      @SP
      M=M+1
      `;
  }

  getAddressOfSegmentIElement(segment, i) {
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
    const result = `// arithmetic: ${arg1}\n`;

    const handlers = {
      add: () => this.processOperator('+', false),
      sub: () => this.processOperator('-', true),
      neg: () => this.processSign('-'),
      eq: () => this.processComp('JEQ'),
      gt: () => this.processComp('JGT'),
      lt: () => this.processComp('JLT'),
      and: () => this.processOperator('&', false),
      or: () => this.processOperator('|', false),
      not: () => this.processSign('!'),
    };

    const handler = handlers[arg1];
    if (!handler) {
      throw new Error(`Invalid Arithmetic: ${arg1}`);
    }

    return result + handler();
  }

  processComp(condition) {
    const labelId = this.labelCounter++;
    const trueAddress = `TRUE_${this.fileName}_${labelId}`;
    const endProcessAddress = `END_${this.fileName}_${labelId}`;
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

  processOperator(sign, reversed = false) {
    const operation = reversed ? `M-D` : `D${sign}M`;
    return `
      @SP
      M=M-1
      A=M
      D=M
      @SP
      M=M-1
      A=M
      D=${operation}
      M=D
      @SP
      M=M+1
    `;
  }

  processLabel(arg1) {
    return `
      (${arg1})
    `;
  }

  processGoTo(arg1) {
    return `
      @${arg1}
      0;JMP
    `;
  }

  processIfGoTo(arg1) {
    return `
      @SP
      M=M-1
      A=M
      D=M
      @${arg1}
      D;JGT
    `;
  }
}

module.exports = Code;
