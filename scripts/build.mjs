import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'src', '_worker.source.js');
const outputPath = path.join(root, '_worker.js');
const source = await readFile(sourcePath, 'utf8');

const result = JavaScriptObfuscator.obfuscate(source, {
  target: 'browser',
  compact: true,
  simplify: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayThreshold: 0.65,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  selfDefending: false,
  sourceMap: false
});

const output = `${result.getObfuscatedCode()}\n`;
if (!output.includes('export default')) {
  throw new Error('obfuscation output lost the Worker module export');
}
await writeFile(outputPath, output, 'utf8');
console.log(`built ${path.relative(root, outputPath)} from ${path.relative(root, sourcePath)}`);
