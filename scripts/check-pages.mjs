// Validate the actual Pages artifact, including case-sensitive paths on Windows.
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {site} from '../config/site.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const dir=path.resolve(root,process.env.OUTPUT_DIR||'dist');
const relative=path.relative(root,dir);
assert.ok(relative==='dist'||relative.startsWith('test-results'+path.sep),'Output must stay in project');
assert.ok(site.productionUrl,'Production origin is required');
const files=new Set();let checks=0;
function ok(value,label){assert.ok(value,label);checks++;}
async function walk(folder){
 for(const entry of await readdir(folder,{withFileTypes:true})){
  ok(!entry.isSymbolicLink(),'No symbolic links in artifact');
  const file=path.join(folder,entry.name);
  if(entry.isDirectory())await walk(file);else files.add(path.relative(dir,file).split(path.sep).join('/'));
 }
}
await walk(dir);
for(const f of ['index.html','fr/index.html','ar/index.html','404.html','robots.txt','sitemap.xml','assets/styles.css','assets/js/main.mjs','assets/favicon-officiel.png'])ok(files.has(f),'Required file: '+f);
for(const f of files)ok(!/(?:^|\/)(?:\.env(?:\..*)?|\.git|\.github|node_modules|docs|test-results|config|scripts|tests)(?:\/|$)|-source\.(?:png|jpg)$|\.(?:pem|key|p12|pfx|log|bak)$/.test(f),'No private/source file in public artifact: '+f);
async function reference(value,from){
 let ref=value.replaceAll('&amp;','&');
 if(!ref||/^(?:mailto:|tel:|data:|#)/.test(ref))return;
 const resolved=new URL(ref,'https://artifact.invalid'+site.basePath+'/'+from);
 if(!['https://artifact.invalid',site.productionUrl].includes(resolved.origin))return;
 ok(resolved.pathname.startsWith(site.basePath+'/'),'Repository prefix: '+from);
 let target=decodeURIComponent(resolved.pathname.slice(site.basePath.length+1));
 if(target.endsWith('/'))target+='index.html';
 ok(files.has(target)||files.has(target+'/index.html'),'Exact resource case: '+target+' from '+from);
}
const secretPatterns=[/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/,/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,/\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}\b/,/https?:\/\/[^\s/@:]+:[^\s/@]+@/];
for(const f of files){
 if(!/\.(?:html|css|mjs|js|txt|xml)$/.test(f))continue;
 const text=await readFile(path.join(dir,f),'utf8');
 for(const pattern of secretPatterns)ok(!pattern.test(text),'No secret pattern in '+f);
 if(f.endsWith('.html')){
  for(const m of text.matchAll(/(?:href|src)="([^"]+)"/g))await reference(m[1],f);
  for(const m of text.matchAll(/srcset="([^"]+)"/g))for(const entry of m[1].split(','))await reference(entry.trim().split(/\s+/)[0],f);
  ok(!/https?:\/\/(?:localhost|127\.0\.0\.1)|\.invalid\b/.test(text),'No local/fictitious URL: '+f);
  const notFound=f==='404.html'||f.endsWith('/404/index.html');
  if(!notFound){
   const route=f==='index.html'?'fr/':f.replace(/index\.html$/,'');
   ok(text.includes('rel="canonical" href="'+site.productionUrl+site.basePath+'/'+route+'"'),'Canonical: '+f);
   ok(text.includes('property="og:url" content="'+site.productionUrl+site.basePath+'/'+route+'"'),'OG URL: '+f);
   const image=text.match(/property="og:image" content="([^"]+)"/);
   ok(image?.[1].startsWith(site.productionUrl+site.basePath+'/assets/'),'Absolute share image: '+f);
   if(image)await reference(image[1],f);
   ok(text.includes('content="index, follow"'),'Production indexation: '+f);
   for(const lang of ['fr','ar','x-default'])ok(text.includes('hreflang="'+lang+'" href="'+site.productionUrl+site.basePath+'/'),'Absolute alternate '+lang+': '+f);
  }else ok(text.includes('content="noindex, nofollow"'),'404 not indexed');
 }
 if(f.endsWith('.css'))for(const m of text.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g))await reference(m[1],f);
 if(f.endsWith('.mjs'))for(const m of text.matchAll(/from ['"](\.\.?\/[^'"]+)['"]/g))await reference(m[1],f);
}
const sitemap=await readFile(path.join(dir,'sitemap.xml'),'utf8');
const locations=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
ok(locations.length===16,'16 sitemap routes');
for(const location of locations){ok(location.startsWith(site.productionUrl+site.basePath+'/'),'Sitemap prefix');await reference(location,'sitemap.xml');}
ok((await readFile(path.join(dir,'robots.txt'),'utf8')).includes('Sitemap: '+site.productionUrl+site.basePath+'/sitemap.xml'),'robots sitemap reference');
console.log(`Pages artifact: ${checks} checks passed, ${files.size} files, base path ${site.basePath||'/'}.`);
