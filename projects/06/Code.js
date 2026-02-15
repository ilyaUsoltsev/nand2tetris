import { SymbolTable } from './constants.js';

const NULL_FIELD = 'null';

class Code {
  symbolTable = SymbolTable;
  constructor(instructions) {
    this.instructions = instructions;
    this.symbolCounter = 16;
  }

  processInstructions() {
    this.buildSymbolTable();
    this.generateBinary();
  }

  buildSymbolTable() {
    let romAddress = 0;
    for (const inst of this.instructions) {
      if (inst.instructionType === 'L_INSTRUCTION') {
        this.symbolTable[inst.symbol] = romAddress;
      } else {
        romAddress++;
      }
    }
  }

  generateBinary() {
    for (const inst of this.instructions) {
      if (inst.instructionType === 'C_INSTRUCTION') {
        inst.binary = this.processCInstruction(inst);
      } else if (inst.instructionType === 'A_INSTRUCTION') {
        inst.binary = this.processAInstruction(inst);
      }
    }
  }

  processAInstruction(inst) {
    if (!inst.symbol) {
      throw new Error('A-instruction must contain symbol or number');
    }

    const numericValue = Number.parseInt(inst.symbol, 10);

    if (isNaN(numericValue)) {
      // It's a symbol, resolve it
      if (!(inst.symbol in this.symbolTable)) {
        // Allocate new variable
        this.symbolTable[inst.symbol] = this.symbolCounter++;
      }
      const address = this.symbolTable[inst.symbol];
      return `0${this.convertToBinary(address)}`;
    } else {
      // It's a numeric literal
      return `0${this.convertToBinary(numericValue)}`;
    }
  }

  processCInstruction(inst) {
    const dest = this.getDestCode(inst.dest);
    const jump = this.getJumpCode(inst.jump);
    const comp = this.getCompCode(inst.comp);
    const alpha = inst.alpha ? '1' : '0';
    return `111${alpha}${comp}${dest}${jump}`;
  }

  getDestCode(dest) {
    // Normalize by sorting the destination registers (A, D, M in alphabetical order)
    const normalized = dest === NULL_FIELD ? NULL_FIELD : dest.split('').sort().join('');
    const config = {
      [NULL_FIELD]: '000',
      M: '001',
      D: '010',
      DM: '011',
      A: '100',
      AM: '101',
      AD: '110',
      ADM: '111',
    };
    if (!config[normalized]) {
      throw new Error(`Invalid destination: ${dest}`);
    }
    return config[normalized];
  }

  getJumpCode(jmp) {
    const config = {
      [NULL_FIELD]: '000',
      JGT: '001',
      JEQ: '010',
      JGE: '011',
      JLT: '100',
      JNE: '101',
      JLE: '110',
      JMP: '111',
    };
    if (!config[jmp]) {
      throw new Error(`Invalid jump: ${jmp}`);
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
    return num.toString(2).padStart(15, '0');
  }
}

export default Code;
