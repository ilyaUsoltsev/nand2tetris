const Code = require('./Code.js');
const Parser = require('./Parser.js');
const {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
} = require('fs');
const { basename, extname, join, dirname } = require('path');

function translateFile(filePath) {
  const fileContent = readFileSync(filePath, { encoding: 'utf-8' });
  const baseFileName = basename(filePath, '.vm');
  const parser = new Parser(fileContent);
  const lines = parser.readLines();
  const code = new Code(lines);
  code.setFileName(baseFileName);
  return code.processInstructions();
}

function bootstrapCode() {
  const code = new Code([]);
  // code.setFileName('bootstrap');
  return [
    '// bootstrap',
    '@256',
    'D=A',
    '@SP',
    'M=D',
    code.processCall('Sys.init', '0'),
  ];
}

function main() {
  const input = process.argv[2];

  if (!input) {
    console.error('Error: No input specified');
    console.error('Usage: node VMTranslator.js <input.vm|directory>');
    process.exit(1);
  }

  if (!existsSync(input)) {
    console.error(`Error: '${input}' not found`);
    process.exit(1);
  }

  try {
    const stat = statSync(input);

    if (stat.isDirectory()) {
      const vmFiles = readdirSync(input)
        .filter((f) => extname(f) === '.vm')
        .map((f) => join(input, f));

      if (vmFiles.length === 0) {
        console.error(`Error: No .vm files found in '${input}'`);
        process.exit(1);
      }

      const dirName = basename(input);
      const outputFileName = join(input, `${dirName}.asm`);

      const result = bootstrapCode();
      // Sys.vm first, then remaining files
      const sysFile = vmFiles.find((f) => basename(f, '.vm') === 'Sys');
      if (sysFile) {
        result.push(...translateFile(sysFile));
      }
      for (const filePath of vmFiles) {
        if (basename(filePath, '.vm') !== 'Sys') {
          result.push(...translateFile(filePath));
        }
      }

      writeFileSync(outputFileName, result.join('\n'));
      console.log(`Successfully translated: ${outputFileName}`);
    } else {
      if (extname(input) !== '.vm') {
        console.error(`Error: Input file must have .vm extension`);
        process.exit(1);
      }

      const baseFileName = basename(input, '.vm');
      const outputFileName = join(dirname(input), `${baseFileName}.asm`);
      const result = translateFile(input);

      writeFileSync(outputFileName, result.join('\n'));
      console.log(`Successfully translated: ${outputFileName}`);
    }
  } catch (error) {
    console.error(`Error during translation: ${error.message}`);
    process.exit(1);
  }
}

main();
