const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const app = path.join(root,'release/win-unpacked/resources/app');
const manifest = JSON.parse(fs.readFileSync(path.join(app,'package.json'),'utf8'));
assert.equal(manifest.main,'desktop/main.cjs');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
let verified = 0;
function check(directory) {
  for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    const file = path.join(directory,entry.name);
    if (entry.isDirectory()) check(file);
    else { assert.equal(hash(file),hash(path.join(app,path.relative(root,file))),`Cópia divergente: ${file}`); verified++; }
  }
}
check(path.join(root,'dist'));
assert.equal(hash(path.join(root,'desktop/main.cjs')),hash(path.join(app,'desktop/main.cjs')));
assert.ok(fs.readdirSync(path.join(app,'dist/assets')).some(name=>/^buildLab\.worker-.*\.js$/.test(name)));
const name=`Mythreon-Online-${config.version}-Windows-x64.exe`;
const exe=path.join(root,'release',name);
const file=fs.openSync(exe,'r');const signature=Buffer.alloc(2);fs.readSync(file,signature,0,2,0);fs.closeSync(file);assert.equal(signature.toString(),'MZ');
const sha256=hash(exe);
fs.writeFileSync(path.join(root,'release','checksums.sha256'),`${sha256}  ${name}\n`);
fs.writeFileSync(path.join(root,'release','verification.json'),JSON.stringify({manifest:true,filesVerified:verified,worker:true,main:true,artifact:name,bytes:fs.statSync(exe).size,sha256},null,2));
console.log(`PASS: manifesto, ${verified} arquivos, main e Worker; ${name}; SHA-256 ${sha256}`);
