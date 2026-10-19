import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(process.env.USERPROFILE||process.env.HOME,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'test-results/palette-solaire/design');await mkdir(out,{recursive:true});
const base=process.env.TEST_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
const errors=[],missing=[],external=[],mapFixtures=[],failures=[],cases=[];
const isMap = r => r.resourceType()==='document' && r.url().startsWith('https://www.google.com/maps');let checks=0;
const ok=(value,message)=>{checks++;if(!value)failures.push(message);};
async function context(options={}){
 const ctx=await browser.newContext(options);
 await ctx.route('**/*',r=>isMap(r.request())?r.fulfill({contentType:'text/html',body:'<!doctype html><html><body>Carte interceptée pour les contrôles de géométrie ; contenu Google vérifié séparément.</body></html>'}):r.request().url().startsWith(base)?r.continue():r.abort());
 ctx.on('request',r=>{if(isMap(r))mapFixtures.push(r.url());else if(!r.url().startsWith(base))external.push(r.url());});
 ctx.on('page',p=>{p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('404'))errors.push(m.text());});p.on('response',r=>{if(r.status()>=400&&r.url().startsWith(base)&&!r.request().isNavigationRequest())missing.push(r.url());});});
 return ctx;
}
const ctx=await context();const page=await ctx.newPage();
async function navigate(lang,route,width,height=1000){
 await page.setViewportSize({width,height});const r=await page.goto(`${base}/${lang}/${route}`);ok(r.status()===200,`HTTP ${lang} ${route}`);
 await page.locator('.site-header[data-layout-ready]').waitFor({state:'attached'});await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>new Promise(requestAnimationFrame));
}
async function geometry(label){
 const data=await page.evaluate(()=>{
  const visible=el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'&&!el.closest('dialog:not([open])');
  const rect=el=>el.getBoundingClientRect();
  const overlap=(a,b)=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;
  const selected=[...document.querySelectorAll('h1,h2,.hero-description,.service-card,.form-card,.button,input:not([name=website]),select,textarea,.solar-photo,.company-panel,.company-name,#more-panel')].filter(visible);
  const outside=selected.filter(el=>{const r=rect(el);return r.left< -1||r.right>innerWidth+1;}).map(el=>({tag:el.tagName,cls:el.className,id:el.id,left:rect(el).left,right:rect(el).right}));
  const touch=[...document.querySelectorAll('button,a.button,.language,.bottom-nav>a,.footer-grid a:not(.brand),.footer-bottom a')].filter(visible).filter(el=>{const r=rect(el);return r.width<43||r.height<43;}).map(el=>({tag:el.tagName,cls:el.className,w:rect(el).width,h:rect(el).height}));
  const brand=document.querySelector('.company-name');const b=rect(brand);const clipped=[];
  const walker=document.createTreeWalker(brand,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);for(const r of range.getClientRects())if(r.left<b.left-1||r.right>b.right+1)clipped.push(node.textContent);}
  const nav=document.querySelector('.site-header');const h=document.querySelector('h1');
  const cover=visible(nav)&&overlap(rect(nav),rect(h));
  const cols=getComputedStyle(document.querySelector('.site-layout')).gridTemplateColumns.split(' ').length;
  const bottom=document.querySelector('.bottom-nav');const bar=visible(bottom)?rect(bottom):null;
  const tab=document.getElementById('contacts-toggle');const panel=rect(document.querySelector('.company-panel'));const overview=rect(document.querySelector('.company-overview'));
  let tabFailure=false;
  if(visible(tab)) {const t=rect(tab);const rtl=document.documentElement.dir==='rtl';const painted=[...document.querySelectorAll('.company-logo,.company-name,.company-badge,.company-slogan')].flatMap(e=>{if(e.classList.contains('company-logo'))return[rect(e)];const r=document.createRange();r.selectNodeContents(e);return[...r.getClientRects()];});tabFailure=t.height<43||t.width<43||Math.abs(t.top-panel.top)>2||(rtl?Math.abs(t.left-panel.left):Math.abs(t.right-panel.right))>2||painted.some(r=>overlap(t,r));}
  return {tabFailure,overflow:document.documentElement.scrollWidth>innerWidth,outside,touch,clipped,cover,cols,bar:bar?{height:bar.height,bottom:bar.bottom}:null,sticky:getComputedStyle(document.querySelector('.company-panel')).position};
 });
 ok(!data.tabFailure,label+' : languette, cible ou chevauchement');ok(!data.overflow,label+' : débordement');ok(!data.outside.length,label+' : hors écran '+JSON.stringify(data.outside));
 ok(!data.touch.length,label+' : cibles <44 px '+JSON.stringify(data.touch));ok(!data.cover,label+' : titre recouvert');ok(!data.clipped.length,label+' : marque déborde '+JSON.stringify(data.clipped));
 return data;
}
async function menuChecks(lang,width){
 const trigger=page.locator('#menu-toggle');if(!await trigger.isVisible())return;
 await trigger.click();ok(await page.locator('#more-panel').isVisible(),'Plus visible');ok(await trigger.getAttribute('aria-expanded')==='true','Plus expanded');
 ok(await page.locator('[data-close-more]').evaluate(el=>el===document.activeElement),'focus initial fermeture');
 for(let i=0;i<9;i++){await page.keyboard.press('Tab');ok(await page.evaluate(()=>!!document.activeElement.closest('#more-panel')),'focus contenu dans Plus');}
 await geometry(`Plus ${lang} ${width}`);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>document.getElementById('menu-toggle').getAttribute('aria-expanded')==='false');ok(await trigger.getAttribute('aria-expanded')==='false','Échap ferme Plus');ok(await trigger.evaluate(el=>el===document.activeElement),'focus rendu Plus');
 await trigger.click();await page.locator('[data-close-more]').click();ok(await page.locator('#more-panel').isHidden(),'bouton ferme Plus');
 ok(await page.evaluate(()=>getComputedStyle(document.documentElement).overflow!=='hidden'),'défilement rétabli');
}
const routes=['','about/','services/','projects/','quote/','contact/','faq/','privacy/','404/'];
const widths=[320,390,579,580,767,768,1023,1024,1249,1250,1440];
try{
 for(const lang of ['fr','ar'])for(const width of widths)for(const route of routes){
  await navigate(lang,route,width);await geometry(`${lang} ${route||'home'} ${width}`);
  ok(await page.locator('html').getAttribute('lang')===lang,'langue');
  ok(await page.locator('.language').getAttribute('href')===`/${lang==='fr'?'ar':'fr'}/${route}`,'équivalence langue desktop');
  ok(await page.locator('.more-language').getAttribute('href')===`/${lang==='fr'?'ar':'fr'}/${route}`,'équivalence langue Plus');
  for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(el=>el.decode());ok(await image.evaluate(el=>el.naturalWidth>0),'image décodée');}
  if(['about/','projects/','faq/','privacy/'].includes(route))ok(await page.locator('#menu-toggle').getAttribute('class').then(c=>c.includes('is-current')),'Plus indique la page active');
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(out,`after-${lang}-${route.replace('/','')||'home'}-${width}.png`),fullPage:true});
  cases.push({lang,route,width,type:'toutes-pages'});
 }
 for(const lang of ['fr','ar'])for(const width of widths)for(const route of ['','quote/','contact/']){
  await navigate(lang,route,width);const g=await geometry(`${lang} ${route||'home'} ${width}`);
  ok(g.cols===(width>=1250?2:1),'colonnes '+width);
  if(width<1250){
   ok(await page.locator('#company-contacts').isHidden(),'coordonnées repliées');
   await page.locator('#contacts-toggle').focus();await page.keyboard.press('Enter');ok(await page.locator('#company-contacts').isVisible(),'coordonnées ouvertes au clavier');
   await geometry(`coordonnées ${lang} ${width}`);
   await page.locator('#contacts-toggle').click();await page.locator('#company-contacts').waitFor({state:'hidden'});ok(await page.locator('#company-contacts').isHidden(),'coordonnées refermées');
   if(width<1024){ok(await page.locator('.bottom-nav>a:visible,.bottom-nav>button:visible').count()===5,'cinq entrées');await menuChecks(lang,width);}
   else {ok(await page.locator('.bottom-nav').isHidden(),'barre basse masquée dès 1024');ok(await page.locator('#site-nav').isVisible(),'navigation haute tablette');}
  }else{ok(await page.locator('#company-contacts').isVisible(),'coordonnées desktop');ok(await page.locator('#site-nav').isVisible(),'navigation desktop');}
  if(route){await page.locator('button[type=submit]').first().click();ok(await page.locator('[aria-invalid=true]').count()>0,'validation visuelle');await geometry(`erreurs ${lang} ${width}`);}
  await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
  ok(await page.locator('.footer-bottom').evaluate(el=>el.getBoundingClientRect().bottom <= innerHeight-document.querySelector('.bottom-nav').getBoundingClientRect().height+1),'footer dégagé '+lang+width);
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(out,`matrix-${lang}-${route.replace('/','')||'home'}-${width}.png`)});
  cases.push({lang,route,width,type:'matrice-et-états'});
 }
 for(const lang of ['fr','ar'])for(const width of [320,768,1440])for(const route of routes){
  await navigate(lang,route,width);await page.evaluate(()=>{document.documentElement.style.fontSize='200%';dispatchEvent(new Event('resize'));});await page.waitForTimeout(100);
  await geometry(`texte 200% ${lang} ${route} ${width}`);await menuChecks(lang,width);
  cases.push({lang,route,width,type:'texte-200%'});
  await page.screenshot({path:path.join(out,`text200-${lang}-${route.replace('/','')||'home'}-${width}.png`)});
 }
 for(const lang of ['fr','ar'])for(const route of ['','quote/','contact/']){
  await navigate(lang,route,667,375);await page.locator('#menu-toggle').click();await geometry(`paysage ${lang} ${route}`);
  ok(await page.locator('#more-panel').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight-document.querySelector('.bottom-nav').getBoundingClientRect().height;}),'Plus tient en paysage');
  await page.locator('.more-language').scrollIntoViewIfNeeded();ok(await page.locator('.more-language').isVisible(),'langue accessible paysage');
  await page.screenshot({path:path.join(out,`landscape-${lang}-${route.replace('/','')||'home'}.png`)});await page.keyboard.press('Escape');
  cases.push({lang,route,width:667,height:375,type:'paysage'});
 }
 // Écran desktop bas : la fiche complète est parcourable dans le défilement normal.
 for(const lang of ['fr','ar']){
  await navigate(lang,'',1440,500);ok(await page.locator('.company-panel').evaluate(el=>getComputedStyle(el).position!=='sticky'),'fiche non sticky écran bas');
  await page.locator('.company-social a').scrollIntoViewIfNeeded();ok(await page.locator('.company-social a').isVisible(),'Facebook accessible écran bas');
 }
 const zoom=await context({viewport:{width:720,height:450},deviceScaleFactor:2});const zp=await zoom.newPage();
 for(const lang of ['fr','ar'])for(const route of ['','quote/']){
  await zp.goto(`${base}/${lang}/${route}`);await zp.evaluate(()=>document.fonts.ready);
  ok(await zp.evaluate(()=>devicePixelRatio===2&&innerWidth===720&&document.documentElement.scrollWidth<=innerWidth),'reflow zoom équivalent 200%');
  await zp.screenshot({path:path.join(out,`zoom200-${lang}-${route?'quote':'home'}.png`)});cases.push({lang,route,type:'reflow-200%-équivalent'});
 }await zoom.close();
 for(const lang of ['fr','ar']){
  await navigate(lang,'',320);await page.evaluate(()=>{document.querySelector('h1').textContent+=' — '+document.querySelector('h1').textContent;document.querySelector('.hero-description').textContent+=' '+ 'PhotovoltaïqueSansEspaces'.repeat(8);});await geometry('texte long '+lang);
  await navigate(lang,'',390);ok(await page.evaluate(()=>document.fonts.check('400 16px Poppins')&&document.fonts.check('600 16px Poppins')),'Poppins chargée');
  if(lang==='ar')ok(await page.evaluate(()=>document.fonts.check('400 18px Tajawal')&&document.fonts.check('700 18px Tajawal')),'Tajawal chargée');
 }
 // Le cadre de l'iframe réelle est intercepté ; son contenu Google est vérifié séparément.
 for(const lang of ['fr','ar'])for(const width of [320,768,1440]){
  await navigate(lang,'contact/',width);ok(await page.locator('.map-panel .text-link').getAttribute('href').then(h=>h.includes('/maps/search/')),'adresse recherchée conservée');
  ok(await page.locator('.map-panel iframe').count()===1,'iframe réelle présente');
  ok(await page.locator('.map-panel iframe').getAttribute('loading')==='lazy','carte différée');
  ok(await page.locator('.map-panel iframe').evaluate(el=>!!(el.compareDocumentPosition(document.querySelector('form'))&Node.DOCUMENT_POSITION_FOLLOWING)),'carte avant formulaire');
  await geometry('cadre carte '+lang+width);ok(await page.locator('.map-panel iframe').evaluate(el=>el.clientHeight>=248&&el.clientHeight<=380),'hauteur cadre carte');
 }
 await page.emulateMedia({reducedMotion:'reduce'});await navigate('ar','',390);ok(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'),'mouvement réduit');
 let protectedFiles=null;
 try { protectedFiles=JSON.parse(await readFile(path.join(out,'protected-before.json'),'utf8')); } catch(error) { if(error.code!=='ENOENT')throw error; }
 for(const f of protectedFiles||[])ok(createHash('sha256').update(await readFile(path.isAbsolute(f.Path)?f.Path:path.join(root,f.Path))).digest('hex').toUpperCase()===f.Hash,'préservé '+f.Path);
 ok(!errors.length,'console '+errors.join(';'));ok(!external.length,'requêtes externes');ok(!missing.length,'ressources absentes '+missing.join(';'));
 const report={date:new Date().toISOString(),browser:await browser.version(),checks,failures,errors,missing,external,mapFixtures,cases,preservationBaselineCompared:!!protectedFiles,limits:['Chrome headless uniquement','Viewport et DPR simulés ; pas de zoom UI natif Chrome ni appareil physique','Formulaires sans action externe','Contenu de la carte intercepté dans la matrice ; contrôle Google réel séparé']};
 await writeFile(path.join(out,'design-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({checks,cases:cases.length,failures,errors,missing,external}));if(failures.length)process.exitCode=1;
}finally{await browser.close();}
