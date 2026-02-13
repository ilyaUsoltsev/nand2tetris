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
    let processed = line.trim();
    processed = processed.replace(/\s/g, '');
    if (processed === '') {
      return null;
    }
    if (processed.startsWith('//')) {
      return null;
    }

    return processed;
  }

  readLine(line) {
    const isA = line.startsWith('@');
    const isL = line.startsWith('(');
    let result = {};
    if (isA) {
      result.instructionType = 'A_INSTRUCTION';
      result.symbol = line.slice(1);
    } else if (isL) {
      result.instructionType = 'L_INSTRUCTION';
      result.symbol = line.slice(1, -1);
    } else {
      result.instructionType = 'C_INSTRUCTION';
      let dest, comp, jump, compjump;
      [dest, compjump] = line.split('=');
      if (!compjump) {
        compjump = dest;
        dest = undefined;
      }
      [comp, jump] = compjump.split(';');

      result.dest = dest ?? 'n';
      result.comp = comp ?? 'n';
      result.jump = jump ?? 'n';
      result.alpha = comp.includes('M');
    }
    return result;
  }
}

export default Parser;
