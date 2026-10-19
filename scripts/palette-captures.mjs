import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url);const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage();
const out='test-results/palette-solaire',results=[];
try{
await p.route('https://www.google.com/maps**',r=>r.fulfill({contentType:'text/html',body:'<html><body style="background:#eaf1f6;color:#123047;font:16px Arial">Google Maps intercepté pour le contrôle local du cadre.</body></html>'}));
for(const lang of ['fr','ar'])for(const width of [360,768,1024,1440]){
await p.setViewportSize({width,height:1000});await p.goto(`http://127.0.0.1:4173/${lang}/`);await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
results.push(await p.evaluate(()=>({lang:document.documentElement.lang,width:innerWidth,nav:getComputedStyle(document.querySelector('.bottom-nav')).display,header:getComputedStyle(document.querySelector('.site-header')).display,sidebar:getComputedStyle(document.querySelector('.site-layout')).gridTemplateColumns})));
await p.screenshot({path:`${out}/viewport-${lang}-${width}-home.png`});
if(width<1250){await p.locator('#contacts-toggle').click();await p.waitForFunction(()=>!document.querySelector('.company-contacts').classList.contains('is-animating'));await p.locator('#contacts-toggle').blur();await p.screenshot({path:`${out}/viewport-${lang}-${width}-contacts-open.png`});}
await p.goto(`http://127.0.0.1:4173/${lang}/contact/`);await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`${out}/viewport-${lang}-${width}-contact.png`});
}
await writeFile(out+'/viewport-report.json',JSON.stringify(results,null,2));console.log(results);
}finally{await b.close()}
