import {build} from 'esbuild';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const outfile='server/generated/online-runtime.cjs';
const result=await build({entryPoints:['server/http.ts'],bundle:true,platform:'node',format:'cjs',target:'node22',packages:'external',outfile,write:false,sourcemap:false,legalComments:'none',banner:{js:'// GERADO por scripts/build-online-runtime.mjs. Edite server/*.ts e src/engine, nunca este arquivo.'}});
const bytes=result.outputFiles[0].contents;
if(process.argv.includes('--check')){const saved=await readFile(outfile);if(saved.toString('utf8').replace(/\r\n/g,'\n')!==Buffer.from(bytes).toString('utf8').replace(/\r\n/g,'\n'))throw Error('O runtime online está desatualizado. Execute npm run online:bundle.');console.log('PASS: runtime do servidor corresponde ao código-fonte.');}
else {await mkdir('server/generated',{recursive:true});await writeFile(outfile,bytes);console.log('Runtime online compilado: '+bytes.length+' bytes.');}
