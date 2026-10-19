import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import fr from '../locales/fr.mjs';
import ar from '../locales/ar.mjs';
import { site } from '../config/site.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.resolve(root,process.env.OUTPUT_DIR||'dist');
let checks=0;const ok=(condition,message)=>{assert.ok(condition,message);checks++;};
const keys=(value,prefix='')=>Object.entries(value).flatMap(([key,item])=>typeof item==='object'&&item!==null?keys(item,prefix+key+'.'):[prefix+key]);
assert.deepEqual(keys(fr).sort(),keys(ar).sort());checks++;
const files=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else files.push(f);}}await walk(dist);
const htmlFiles=files.filter(f=>f.endsWith('.html'));
ok(htmlFiles.length===20,'20 pages');
const titles=new Set();
for(const file of htmlFiles){
 const html=await readFile(file,'utf8');const rel=path.relative(dist,file);const lang=rel.startsWith('ar'+path.sep)?'ar':'fr';
 ok(html.includes(`<html lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}">`),rel+' langue');
 ok((html.match(/<h1[ >]/g)||[]).length===1,rel+' h1');
 ok(!html.includes('undefined')&&!html.includes('Lorem ipsum'),rel+' contenu');
 ok(!/href="#"|src=""/.test(html),rel+' lien/ressource vide');
 ok(/<meta name="description" content="[^"]{30,}"/.test(html),rel+' description');
 ok(html.includes('tel:+21698289700'),rel+' appel');
 ok(html.includes('https://wa.me/21698289700?text='),rel+' WhatsApp traduit');
 const title=html.match(/<title>(.*?)<\/title>/)[1];if(rel.includes(path.sep)){ok(!titles.has(title),rel+' titre unique');titles.add(title);}
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=match[1].replace(/&amp;/g,'&');if(!href.startsWith('/')&&!href.startsWith('#'))continue;
  if(href.startsWith('#')){ok(html.includes(`id="${href.slice(1)}"`),rel+' ancre');continue;}
  const [pathname,fragment]=href.split('#');const clean=pathname.split('?')[0];
  ok(clean.startsWith(site.basePath+'/'),rel+' préfixe');
  let target=path.join(dist,clean.slice(site.basePath.length));if(clean.endsWith('/'))target=path.join(target,'index.html');await access(target);checks++;
  if(fragment)ok((await readFile(target,'utf8')).includes(`id="${fragment}"`),'ancre cible');
 }
 for(const match of html.matchAll(/<script[^>]*type="application\/(?:json|ld\+json)"[^>]*>(.*?)<\/script>/g)){JSON.parse(match[1]);checks++;}
 if(html.includes('<form')){
  for(const input of html.matchAll(/<(?:input|textarea|select)\b[^>]*id="([^"]+)"/g))ok(html.includes(`for="${input[1]}"`),'label '+input[1]);
  ok(html.includes('value="whatsapp" disabled'),'sans JS pas de soumission GET');
 }
 if(!rel.includes('404')){
  for(const l of ['fr','ar','x-default'])ok(html.includes(`hreflang="${l}"`),rel+' alternate');
  ok(site.productionUrl?html.includes('rel="canonical"'):html.includes('noindex, nofollow'),rel+' SEO mode');
 }
}
for(const file of files.filter(f=>f.endsWith('.mjs'))){const source=await readFile(file,'utf8');for(const match of source.matchAll(/from ['"]\.\/([^'"]+)['"]/g)){await access(path.join(path.dirname(file),match[1]));checks++;}}
const headers=await readFile(path.join(dist,'_headers'),'utf8');ok(!headers.includes('PLACEHOLDER'),'CSP finale');ok(headers.includes("form-action 'none'"),'form-action');
const sitemap=await readFile(path.join(dist,'sitemap.xml'),'utf8');ok(site.productionUrl?sitemap.includes(site.productionUrl):!sitemap.includes('<loc>'),'sitemap sans URL fictive');
console.log(`${checks} contrôles réussis ; ${htmlFiles.length} pages ; clés FR/AR identiques.`);
