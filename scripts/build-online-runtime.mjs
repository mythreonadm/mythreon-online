import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const runtimes=[['server/http.ts','server/generated/online-runtime.cjs'],['server/premium.ts','server/generated/premium-runtime.cjs']];
const banner='// GERADO por scripts/build-online-runtime.mjs. Edite server/*.ts e src/engine, nunca este arquivo.';
for(const [entry,outfile] of runtimes){
 const relativeEntry=`./${entry}`;const relativeOutfile=`./${outfile}`;const absoluteOutfile=path.join(root,outfile);
 const result=await build({absWorkingDir:root,entryPoints:[relativeEntry],bundle:true,platform:'node',format:'cjs',target:'node22',packages:'external',outfile:relativeOutfile,write:false,sourcemap:false,legalComments:'none',banner:{js:banner}});const bytes=result.outputFiles[0].contents;
 if(process.argv.includes('--check')){const saved=await readFile(absoluteOutfile);if(saved.toString('utf8').replace(/\r\n/g,'\n')!==Buffer.from(bytes).toString('utf8').replace(/\r\n/g,'\n'))throw Error(`O runtime ${outfile} está desatualizado. Execute npm run online:bundle.`);}
 else {await mkdir(path.dirname(absoluteOutfile),{recursive:true});await writeFile(absoluteOutfile,bytes);console.log(`Runtime compilado ${outfile}: ${bytes.length} bytes.`);}
}
if(process.argv.includes('--check'))console.log('PASS: runtimes online correspondem ao código-fonte.');
