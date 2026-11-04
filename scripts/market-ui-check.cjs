const {app,BrowserWindow}=require('electron'),{build}=require('esbuild');
const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),cache=path.join(root,'node_modules/.cache/market-ui');
app.setPath('userData',path.join(cache,'profile'));
let server,win;const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
app.whenReady().then(async()=>{try{
 await fs.mkdir(cache,{recursive:true});
 const bundle=await build({absWorkingDir:root,bundle:true,write:false,format:'iife',outfile:path.join(cache,'preview.js'),define:{'import.meta.env':'{}'},stdin:{loader:'tsx',resolveDir:root,contents:`
import React from 'react';import {createRoot} from 'react-dom/client';
import {OnlineMarket} from './src/ui/OnlineMarket';import {useGameStore} from './src/store/gameStore';import {createNewCharacter} from './src/engine/save';import {makeComponent} from './src/engine/drops';
const character=createNewCharacter('Mercador de Lyss');character.id='preview';const item=makeComponent('A1');item.uid='sale-stack';item.quantity=25;character.inventory.items=[item];useGameStore.setState({character});
window.__marketCommands=[];window.__marketFixture={market:{listings:[{id:'offer',seller_name:'Mirelle',item:{...item,quantity:5},currency:'GOLD',price:500,fee:25}],mine:[],summary:{total:1,averagePrice:500,minPrice:500,maxPrice:500},salesHistory:[{template_id:'A1',rarity:item.rarity,tier:item.tier,upgrade_level:0,currency:'GOLD',sale_events:2,units_sold:7,average_unit_price:85.71,lowest_unit_price:50,highest_unit_price:100,last_sold_at:'2026-11-04T10:00:00Z',daily:[{day:'2026-11-03',units:2,average:50},{day:'2026-11-04',units:5,average:100}]}]}};
createRoot(document.getElementById('root')).render(<OnlineMarket/>);
`},plugins:[{name:'online-fixtures',setup(plugin){
 plugin.onResolve({filter:/online\/(client|controller)$/},args=>({path:args.path,namespace:'fixture'}));
 plugin.onLoad({filter:/.*/,namespace:'fixture'},args=>({loader:'js',contents:args.path.endsWith('client')?'export async function worldRequest(){return window.__marketFixture}':'export function useOnlineState(selector){return selector({active:true,pending:false})};export async function onlineAction(operation,payload){window.__marketCommands.push({operation,payload});return {ok:true}}'}));
 }}]});
 const compiled=bundle.outputFiles.find(file=>file.path.endsWith('.js')).contents;
 const cssFile=(await fs.readdir(path.join(root,'dist/assets'))).find(file=>/^index-.*\.css$/.test(file)),css=await fs.readFile(path.join(root,'dist/assets',cssFile));
 const html='<meta name="viewport" content="width=device-width,initial-scale=1"/><link rel="stylesheet" href="/style.css"/><style>body{margin:0;padding:16px;background:#071116;color:white;font-family:Arial}#root{max-width:1100px;margin:auto}</style><div id="root"></div><script src="/preview.js"></script>';
 server=http.createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;if(pathname==='/'){res.setHeader('Content-Type','text/html');res.end(html);return;}if(pathname==='/preview.js'){res.setHeader('Content-Type','application/javascript');res.end(compiled);return;}if(pathname==='/style.css'){res.setHeader('Content-Type','text/css');res.end(css);return;}const file=path.resolve(root,'public','.'+decodeURIComponent(pathname));if(!file.startsWith(path.join(root,'public')+path.sep)){res.writeHead(403).end();return;}res.setHeader('Content-Type',({'.png':'image/png','.gif':'image/gif','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(file)]??'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 win=new BrowserWindow({show:false,width:1180,height:1000,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,offscreen:true,backgroundThrottling:false}});
 const errors=[];win.webContents.on('console-message',(_event,level,message)=>{if(level===3&&!message.includes('404')&&!message.includes('Failed to load resource'))errors.push(message);});
 const js=async source=>{const value=await win.webContents.executeJavaScript('(()=>{try{return eval('+JSON.stringify(source)+')}catch(error){return {__testError:String(error),stack:error.stack}}})()',true);if(value?.__testError)throw Error(value.__testError+' SOURCE '+source+' '+value.stack);return value;};
 await win.loadURL('http://127.0.0.1:'+server.address().port+'/');
 for(let i=0;i<100;i++){if(await js('document.body.innerText.includes("85,71")'))break;await pause(100);}
 assert.equal(await js('document.body.innerText.includes("85,71")'),true);
 await js('document.querySelectorAll("details").forEach(el=>el.open=true);const select=document.getElementById("market-item");Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value").set.call(select,"sale-stack");select.dispatchEvent(new Event("change",{bubbles:true}));');await pause(150);
 await js('const el=document.getElementById("market-quantity");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(el,"5");el.dispatchEvent(new Event("input",{bubbles:true}));');await pause(100);
 await js('const el=document.getElementById("market-price");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(el,"1000");el.dispatchEvent(new Event("input",{bubbles:true}));');await pause(150);
 assert.equal(await js('document.body.innerText.includes("você recebe 950 gold")'),true);
 await js('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 await fs.writeFile(path.join(cache,'desktop.png'),(await win.webContents.capturePage()).toPNG());
 win.setSize(390,1000);await pause(300);
 assert.equal(await js('document.documentElement.scrollWidth<=window.innerWidth'),true,'Mercado deve caber em 390px');
 await fs.writeFile(path.join(cache,'mobile.png'),(await win.webContents.capturePage()).toPNG());
 await js('const button=Array.from(document.querySelectorAll("button")).find(el=>el.textContent==="Publicar lote por 48h");button.click();button.click();');await pause(150);
 const commands=await js('window.__marketCommands');assert.equal(commands.length,1);assert.equal(commands[0].payload.item.quantity,5);assert.equal(commands[0].payload.price,1000);assert.equal(commands[0].payload.currency,'GOLD');
 assert.deepEqual(errors,[]);console.log('PASS Mercado UI: histórico, gráfico, lote de 5, preço total 1000, líquido 950, clique repetido protegido e 390px sem overflow.');
 await new Promise(resolve=>server.close(resolve));app.exit(0);
}catch(error){console.error(error);app.exit(1)}});
setTimeout(()=>{console.error('Timeout Mercado UI');app.exit(2)},45000);
