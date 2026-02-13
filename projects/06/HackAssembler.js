import Code from './Code.js';
import Parser from './Parser.js';
import { readFileSync, writeFileSync } from 'fs';

const fileName = process.argv[2];
const fileContent = readFileSync(fileName, { encoding: 'utf-8' });

const parser = new Parser(fileContent);
const lines = parser.readLines();
console.log(lines, 'lines');
const code = new Code(lines);
code.processInstructions();

const result = [];
for (const line of lines) {
  if (line.binary) {
    result.push(line.binary);
  }
}

writeFileSync('Add.hack', result.join('\n'));
