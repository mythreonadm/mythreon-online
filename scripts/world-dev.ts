import {createServer} from 'node:http';
import {existsSync} from 'node:fs';
if(existsSync('.env'))process.loadEnvFile('.env');
const {default:handler}=await import('../server/http');
createServer(async(req:any,res)=>{if(req.url!=='/api/world'){res.writeHead(404).end();return;}let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>128000){res.writeHead(413).end();return;}}try{req.body=raw?JSON.parse(raw):{};}catch{res.writeHead(400).end();return;}await handler(req,res);}).listen(8787,'127.0.0.1',()=>console.log('Servidor Mythreon: http://127.0.0.1:8787/api/world'));
