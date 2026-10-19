import {createRequire} from 'node:module';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const source=await readFile(process.env.PORTFOLIO_CSS||'C:/Users/louay/Desktop/Portfolio/assets/css/style.css','utf8');
const out='test-results/palette-solaire';await mkdir(out,{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});const ctx=await b.newContext({bypassCSP:true});
const ref=await ctx.newPage(), page=await ctx.newPage();const failures=[];let checks=0;
const ok=(v,m)=>{checks++;if(!v)failures.push(m)};
await page.route('https://www.google.com/maps**',r=>r.fulfill({contentType:'text/html',body:'Carte interceptée, fournisseur inchangé.'}));
// La palette a changé explicitement ; la référence reste celle des proportions et transitions.
const tokens=['--transition-1','--transition-2'];
const norm=v=>v.replace(/\s+/g,'').replace(/0\.(\d+)/g,'.$1');
try{
await ref.setContent(`<style>${source}</style><main><aside class="sidebar"><div class="sidebar-info"><figure class="avatar-box"><div style="width:80px;height:80px"></div></figure><div class="info-content"><h1 class="name">AJ ENERGIES</h1><p class="title">Entreprise</p></div><button class="info_more-btn"><span>Contacts</span><svg width="16" height="16"></svg></button></div><div class="icon-box"></div></aside><article class="active"><h2 class="h2 article-title">Contact</h2><div class="mapbox"></div><div class="service-item"><p class="service-item-text">Texte de comparaison</p></div><button class="form-btn">Envoyer</button></article></main>`);
for(const width of [320,390,579,580,767,768,1023,1024,1249,1250,1440]){
await ref.setViewportSize({width,height:1000});await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:4173/fr/');await page.evaluate(()=>document.fonts.ready);
const expected=await ref.evaluate(names=>({tokens:Object.fromEntries(names.map(n=>[n,getComputedStyle(document.documentElement).getPropertyValue(n)])),title:getComputedStyle(document.querySelector('.article-title')).fontSize,name:getComputedStyle(document.querySelector('.name')).fontSize,icon:getComputedStyle(document.querySelector('.icon-box')).width,map:getComputedStyle(document.querySelector('.mapbox')).height,card:getComputedStyle(document.querySelector('.service-item')).padding,pseudo:getComputedStyle(document.querySelector('.service-item'),'::before').backgroundImage}),tokens);
const actual=await page.evaluate(names=>({tokens:Object.fromEntries(names.map(n=>[n,getComputedStyle(document.documentElement).getPropertyValue(n)])),title:getComputedStyle(document.querySelector('h1')).fontSize,name:getComputedStyle(document.querySelector('.company-name')).fontSize,icon:getComputedStyle(document.querySelector('.contact-icon')).width,card:getComputedStyle(document.querySelector('.service-card')).padding,pseudo:getComputedStyle(document.querySelector('.service-card'),'::before').backgroundImage,layout:document.querySelector('.site-layout').getBoundingClientRect().width,nav:getComputedStyle(document.querySelector('.site-header')).display,cols:getComputedStyle(document.querySelector('.site-layout')).gridTemplateColumns.split(' ').length,tabText:getComputedStyle(document.querySelector('#contacts-toggle span')).clipPath,tabChevron:getComputedStyle(document.querySelector('#contacts-toggle svg')).display}),tokens);
for(const key of tokens)ok(norm(expected.tokens[key])===norm(actual.tokens[key]),key+' '+width);
for(const key of ['title','name','icon','card'])ok(norm(expected[key])===norm(actual[key]),key+' '+width);
ok(actual.nav===(width>=1024?'flex':'none'),'seuil navigation '+width);ok(actual.cols===(width>=1250?2:1),'seuil sidebar '+width);
if(width<1250){ok((actual.tabText==='none')===(width>=580),'texte languette '+width);ok((actual.tabChevron==='none')===(width>=580),'chevron languette '+width);}
const max=width>=1250?1200:width>=1024?950:width>=768?700:width>=580?520:width-24;ok(Math.abs(actual.layout-max)<=1,'largeur '+width);
await page.goto('http://127.0.0.1:4173/fr/contact/');ok(await page.locator('.map-panel iframe').evaluate(e=>getComputedStyle(e).height)===expected.map,'hauteur mapbox '+width);
ok(await page.locator('input').first().evaluate(e=>getComputedStyle(e).fontSize)==='16px','champ confortable '+width);
}
// Cycle mobile -> tablette -> desktop et menu Plus ouvert au changement de mode.
for(const lang of ['fr','ar']){
await page.setViewportSize({width:390,height:900});await page.goto(`http://127.0.0.1:4173/${lang}/`);await page.locator('#contacts-toggle').click();await page.waitForFunction(()=>!document.querySelector('.company-contacts').classList.contains('is-animating'));ok(await page.locator('#company-contacts').isVisible(),'ouverture réelle '+lang);
await page.locator('#contacts-toggle').click();await page.locator('#company-contacts').waitFor({state:'hidden'});ok(await page.locator('#company-contacts').isHidden(),'fermeture réelle '+lang);
await page.locator('#menu-toggle').click();await page.setViewportSize({width:1024,height:1000});await page.waitForFunction(()=>!document.getElementById('more-panel').open);ok(await page.locator('#company-contacts').isHidden(),'coordonnées repliées en tablette '+lang);
await page.setViewportSize({width:1250,height:1000});await page.locator('#company-contacts').waitFor({state:'visible'});ok(await page.locator('#contacts-toggle').isHidden(),'bouton masqué desktop '+lang);
}
const report={checks,failures,reference:'CSS portfolio lu en mémoire ; aucune donnée personnelle copiée',method:'comparaison des styles calculés au zoom normal, plus cycles responsive'};await writeFile(out+'/reference-report.json',JSON.stringify(report,null,2));console.log(report);if(failures.length)process.exitCode=1;
}finally{await b.close()}
