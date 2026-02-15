import Code from './Code.js';
import Parser from './Parser.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { basename, extname, join, dirname } from 'path';

function main() {
  const fileName = process.argv[2];

  if (!fileName) {
    console.error('Error: No input file specified');
    console.error('Usage: node HackAssembler.js <input.asm>');
    process.exit(1);
  }

  if (!existsSync(fileName)) {
    console.error(`Error: File '${fileName}' not found`);
    process.exit(1);
  }

  if (extname(fileName) !== '.asm') {
    console.error(`Error: Input file must have .asm extension`);
    process.exit(1);
  }

  try {
    const fileContent = readFileSync(fileName, { encoding: 'utf-8' });

    const parser = new Parser(fileContent);
    const lines = parser.readLines();

    const code = new Code(lines);
    code.processInstructions();

    const result = [];
    for (const line of lines) {
      if (line.binary) {
        result.push(line.binary);
      }
    }

    // Generate output filename: replace .asm with .hack
    const baseFileName = basename(fileName, '.asm');
    const outputFileName = join(dirname(fileName), `${baseFileName}.hack`);

    writeFileSync(outputFileName, result.join('\n'));
    console.log(`Successfully assembled: ${outputFileName}`);
  } catch (error) {
    console.error(`Error during assembly: ${error.message}`);
    process.exit(1);
  }
}

main();
