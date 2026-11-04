import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const runtimes=[['server/http.ts','server/generated/online-runtime.cjs'],['server/premium.ts','server/generated/premium-runtime.cjs']];
const banner='// GERADO por scripts/build-online-runtime.mjs. Edite server/*.ts e src/engine, nunca este arquivo.';
for(const [entry,outfile] of runtimes){
 const result=await build({entryPoints:[entry],bundle:true,platform:'node',format:'cjs',target:'node22',packages:'external',outfile,write:false,sourcemap:false,legalComments:'none',banner:{js:banner}});const bytes=result.outputFiles[0].contents;
 if(process.argv.includes('--check')){const saved=await readFile(outfile);if(saved.toString('utf8').replace(/\r\n/g,'\n')!==Buffer.from(bytes).toString('utf8').replace(/\r\n/g,'\n'))throw Error(`O runtime ${outfile} está desatualizado. Execute npm run online:bundle.`);}
 else {await mkdir('server/generated',{recursive:true});await writeFile(outfile,bytes);console.log(`Runtime compilado ${outfile}: ${bytes.length} bytes.`);}
}
if(process.argv.includes('--check'))console.log('PASS: runtimes online correspondem ao código-fonte.');
