const Tokenizer = require('./Tokenizer.js');
const {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
} = require('fs');
const { basename, extname, join, dirname } = require('path');
const CompilationEngine = require('./CompilationEngine.js');

function translateFile(filePath) {
  const fileContent = readFileSync(filePath, { encoding: 'utf-8' });
  const baseFileName = basename(filePath, '.jack');
  const tokenizer = new Tokenizer(fileContent);
  const tokens = tokenizer.run();
  const compilationEngine = new CompilationEngine(tokens);
  return compilationEngine.run();
}

function main() {
  const input = process.argv[2];

  if (!input) {
    console.error('Error: No input specified');
    console.error('Usage: node JackAnalyzer.js <input.jack|directory>');
    process.exit(1);
  }

  if (!existsSync(input)) {
    console.error(`Error: '${input}' not found`);
    process.exit(1);
  }

  try {
    const stat = statSync(input);

    if (stat.isDirectory()) {
      const jackFiles = readdirSync(input)
        .filter((f) => extname(f) === '.jack')
        .map((f) => join(input, f));

      if (jackFiles.length === 0) {
        console.error(`Error: No .jack files found in '${input}'`);
        process.exit(1);
      }

      for (const filePath of jackFiles) {
        writeFileSync(
          join(input, `${basename(filePath, '.jack')}.vm`),
          translateFile(filePath).join('\n') + '\n',
        );
      }

      console.log(`Successfully translated all .jack files in '${input}'`);
    } else {
      if (extname(input) !== '.jack') {
        console.error(`Error: Input file must have .jack extension`);
        process.exit(1);
      }

      const baseFileName = basename(input, '.jack');
      const outputFileName = join(dirname(input), `${baseFileName}.vm`);
      const result = translateFile(input);
      writeFileSync(outputFileName, result.join('\n') + '\n');
      console.log(`Successfully translated: ${outputFileName}`);
    }
  } catch (error) {
    console.error(`Error during translation: ${error.message}`);
    process.exit(1);
  }
}

main();
