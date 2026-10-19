import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { site } from '../config/site.mjs';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const headers=Object.fromEntries((await readFile(path.join(root,'_headers'),'utf8')).split('\n').filter(l=>l.startsWith('  ')).map(l=>{const i=l.indexOf(':');return[l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const server=http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(site.basePath){if(!pathname.startsWith(site.basePath+'/')){res.writeHead(302,{Location:site.basePath+'/'});res.end();return;}pathname=pathname.slice(site.basePath.length);}
 const target=path.resolve(root,'.'+pathname);const relative=path.relative(root,target);
 if(relative.startsWith('..')||path.isAbsolute(relative)||pathname.includes('\\')){res.writeHead(403);res.end();return;}
 let file=target,code=200;
 try{const info=await stat(file);if(info.isDirectory()){if(!pathname.endsWith('/')){res.writeHead(308,{Location:site.basePath+pathname+'/'});res.end();return;}file=path.join(file,'index.html');}await stat(file);}catch{file=path.join(root,pathname.startsWith('/ar/')?'ar/404/index.html':'404.html');code=404;}
 try{const data=await readFile(file);res.writeHead(code,{...headers,'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(500);res.end('Build required');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${site.basePath}/`));
