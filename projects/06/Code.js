import { SymbolTable } from './constants.js';

class Code {
  symbolTable = { ...SymbolTable };
  constructor(instructions) {
    this.instructions = instructions;
    this.symbolCounter = 16;
  }

  processInstructions() {
    let realLineCounter = 0;
    for (let i = 0; i < this.instructions.length; i++) {
      const inst = this.instructions[i];
      if (inst.instructionType === 'C_INSTRUCTION') {
        const binary = this.processCInstruction(inst);
        inst.binary = binary;
      } else if (inst.instructionType === 'L_INSTRUCTION') {
        this.symbolTable[inst.symbol] = realLineCounter;
        continue;
      }
      realLineCounter++;
    }

    for (const inst of this.instructions) {
      if (inst.instructionType === 'A_INSTRUCTION') {
        if (!inst.symbol) {
          throw new Error('A-instruction must contain symbol or number');
        }

        const symToNum = Number.parseInt(inst.symbol, 10);

        if (isNaN(symToNum)) {
          if (inst.symbol in this.symbolTable) {
            const value = this.symbolTable[inst.symbol];
            const binary = this.convertToBinary(value);
            inst.binary = `0${binary}`;
          } else {
            this.symbolTable[inst.symbol] = this.symbolCounter;
            inst.binary = `0${this.convertToBinary(this.symbolCounter)}`;
            this.symbolCounter++;
          }
        } else {
          const binary = this.convertToBinary(symToNum);
          inst.binary = `0${binary}`;
        }
      }
    }
  }

  processCInstruction(inst) {
    const dest = this.getDestCode(inst.dest);
    const jump = this.getJumpCode(inst.jump);
    const comp = this.getCompCode(inst.comp);
    const alpha = inst.alpha ? '1' : '0';
    return `111${alpha}${comp}${dest}${jump}`;
  }

  processLInstruction(inst) {}

  getDestCode(dest) {
    const config = {
      n: '000',
      M: '001',
      D: '010',
      DM: '011',
      MD: '011',
      A: '100',
      AM: '101',
      MA: '101',
      AD: '110',
      DA: '110',
      ADM: '111',
      AMD: '111',
      DMA: '111',
      DAM: '111',
      MDA: '111',
      MAD: '111',
    };
    if (!config[dest]) {
      throw new Error(`dest is wrong ${dest}`);
    }
    return config[dest];
  }

  getJumpCode(jmp) {
    const config = {
      n: '000',
      JGT: '001',
      JEQ: '010',
      JGE: '011',
      JLT: '100',
      JNE: '101',
      JLE: '110',
      JMP: '111',
    };
    if (!config[jmp]) {
      throw new Error('jmp is wrong', jmp);
    }
    return config[jmp];
  }

  getCompCode(comp) {
    const config = {
      0: '101010',
      1: '111111',
      '-1': '111010',
      D: '001100',
      A: '110000',
      M: '110000',
      '!D': '001101',
      '!A': '110001',
      '!M': '110001',
      '-D': '001111',
      '-A': '110011',
      '-M': '110011',
      'D+1': '011111',
      'A+1': '110111',
      'M+1': '110111',
      'D-1': '001110',
      'A-1': '110010',
      'M-1': '110010',
      'D+A': '000010',
      'D+M': '000010',
      'D-A': '010011',
      'D-M': '010011',
      'A-D': '000111',
      'M-D': '000111',
      'D&A': '000000',
      'D&M': '000000',
      'D|A': '010101',
      'D|M': '010101',
    };

    if (!config[comp]) {
      throw new Error('comp is wrong');
    }
    return config[comp];
  }

  convertToBinary(num) {
    const result = [];
    let counter = 15;
    while (counter > 0) {
      const mod = num % 2;
      result.unshift(mod);
      num = Math.floor(num / 2);
      counter--;
    }
    return result.join('');
  }
}

export default Code;
