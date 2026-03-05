// expression = { type, value }
// value can be:
// - integerConstant: number
// - var: string (var name)
// - expOpExp: { exp1, op, exp2 }
// - opExp: { op, exp1 }
// - f: { fn, expressions }

class VmWriter {
  constructor(resolveVar) {
    this.vmResult = [];
    // resolveVar(name) => { segment: 'local'|'argument'|'static'|'this'|'temp'|'pointer', index: number }
    this.resolveVar =
      resolveVar || ((name) => ({ segment: 'local', index: 0 }));
  }

  codeWrite(expression) {
    switch (expression.type) {
      case 'integerConstant': {
        this.vmResult.push(`push constant ${expression.value}`);
        return;
      }

      case 'var': {
        const { segment, index } = this.resolveVar(expression.value);
        this.vmResult.push(`push ${segment} ${index}`);
        return;
      }

      case 'expOpExp': {
        const { exp1, op, exp2 } = expression.value;
        this.codeWrite(exp1);
        this.codeWrite(exp2);
        this.emitBinaryOp(op);
        return;
      }

      case 'opExp': {
        const { op, exp1 } = expression.value;
        this.codeWrite(exp1);
        this.emitUnaryOp(op);
        return;
      }

      case 'f': {
        const { fn, expressions } = expression.value;
        for (const exp of expressions) this.codeWrite(exp);
        this.vmResult.push(`call ${fn} ${expressions.length}`);
        return;
      }

      default:
        throw new Error(`Unknown expression type: ${expression.type}`);
    }
  }

  emitBinaryOp(op) {
    // Adjust mapping if your VM uses different commands
    switch (op) {
      case '+':
        this.vmResult.push('add');
        return;
      case '-':
        this.vmResult.push('sub');
        return;
      case '&':
        this.vmResult.push('and');
        return;
      case '|':
        this.vmResult.push('or');
        return;
      case '<':
        this.vmResult.push('lt');
        return;
      case '>':
        this.vmResult.push('gt');
        return;
      case '=':
        this.vmResult.push('eq');
        return;
      case '*':
        this.vmResult.push('call Math.multiply 2');
        return;
      case '/':
        this.vmResult.push('call Math.divide 2');
        return;
      default:
        throw new Error(`Unknown binary op: ${op}`);
    }
  }

  emitUnaryOp(op) {
    switch (op) {
      case '-':
        this.vmResult.push('neg');
        return;
      case '~':
        this.vmResult.push('not');
        return;
      default:
        throw new Error(`Unknown unary op: ${op}`);
    }
  }
}

// Example usage:
const writer = new VmWriter((name) => {
  // TODO: replace with your symbol table lookup
  if (name === 'x') return { segment: 'local', index: 0 };
  if (name === 'y') return { segment: 'argument', index: 1 };
  return { segment: 'static', index: 0 };
});

writer.codeWrite({
  type: 'expOpExp',
  value: {
    exp1: { type: 'integerConstant', value: 2 },
    op: '+',
    exp2: { type: 'var', value: 'x' },
  },
});

console.log(writer.vmResult.join('\n'));
