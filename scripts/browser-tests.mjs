import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(process.env.USERPROFILE||process.env.HOME,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const root=fileURLToPath(new URL('../',import.meta.url));const out=path.join(root,'test-results');await mkdir(out,{recursive:true});
const base=process.env.TEST_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();
const errors=[],external=[],mapFixtures=[],results=[];let checks=0;
const ok=(value,message)=>{assert.ok(value,message);checks++;};
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error'&&!message.text().includes('404'))errors.push(message.text());});
const isMap = request => request.resourceType()==='document' && request.url().startsWith('https://www.google.com/maps');
context.on('request',request=>{if(isMap(request))mapFixtures.push(request.url());else if(!request.url().startsWith(base))external.push(request.url());});
await context.route('**/*',route=>isMap(route.request())?route.fulfill({contentType:'text/html',body:'<!doctype html><html lang=fr><body>Cadre cartographique intercepté pour les tests locaux.</body></html>'}):route.request().url().startsWith(base)?route.continue():route.abort());
const routes=['','about/','services/','projects/','quote/','contact/','faq/','privacy/','404/'];
const fit=async(message)=>ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),message);
async function fillQuote(lang){
 await page.locator('#name').fill('Test local');await page.locator('#phone').fill(lang==='ar'?'٩٨ ٢٨٩ ٧٠٠':'+216 98 289 700');
 await page.locator('#profile').selectOption('individual');await page.locator('#need').selectOption('study');
 await page.locator('#city').fill('Msaken');await page.locator('#description').fill('Essai local <img src=x onerror=alert(1)>');
}
try{
 for(const lang of ['fr','ar']){
  for(const width of [360,390,768,1024,1440]){
   await page.setViewportSize({width,height:1000});
   for(const route of routes){
    const response=await page.goto(`${base}/${lang}/${route}`);ok(response.status()===200,'HTTP '+lang+'/'+route);
    ok(await page.locator('html').getAttribute('dir')===(lang==='ar'?'rtl':'ltr'),'direction');
    ok(await page.locator('.language').getAttribute('href')===`/${lang==='fr'?'ar':'fr'}/${route}`,'page équivalente');
    await fit(`débordement ${lang} ${route} ${width}`);
    for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(el=>el.decode());}
    ok(await page.locator('img').evaluateAll(images=>images.every(el=>el.complete&&el.naturalWidth>0)),'images chargées');
    if(['quote/','contact/'].includes(route)){
     await page.locator('button[type=submit]').first().click();ok(await page.locator('[aria-invalid=true]').count()>0,'erreurs requises');await fit('erreurs adaptatives');
    }
    if(await page.locator('#menu-toggle').isVisible()){await page.locator('#menu-toggle').click();ok(await page.locator('#more-panel').isVisible(),'menu ouvert');await fit('menu ouvert adaptatif');await page.keyboard.press('Escape');await page.waitForFunction(()=>document.getElementById('menu-toggle').getAttribute('aria-expanded')==='false');ok(await page.locator('#menu-toggle').getAttribute('aria-expanded')==='false','menu fermé');}
    if(route===''||route==='quote/')await page.screenshot({path:path.join(out,`${lang}-${route?'quote':'home'}-${width}.png`),fullPage:true});
   }
   results.push({lang,width,pages:routes.length,overflow:false});
  }
  await page.setViewportSize({width:390,height:844});await page.goto(`${base}/${lang}/`);
  await page.keyboard.press('Tab');ok(await page.locator('.skip-link').evaluate(el=>el===document.activeElement),'lien évitement');await page.keyboard.press('Enter');ok(await page.locator('main').evaluate(el=>el===document.activeElement),'focus main');
  await page.goto(`${base}/${lang}/faq/`);await page.locator('summary').first().focus();await page.keyboard.press('Enter');ok(await page.locator('details').first().getAttribute('open')!==null,'FAQ clavier');
  await page.goto(`${base}/${lang}/projects/`);ok(await page.locator('.empty-state').isVisible(),'galerie honnête');ok(await page.locator('[data-project-category]').count()===0,'aucun faux projet');
  await page.goto(`${base}/${lang}/quote/?need=maintenance`);ok(await page.locator('#need').inputValue()==='maintenance','préselection');ok(await page.locator('#sizing').isHidden(),'maintenance masquée');ok(await page.locator('#consumption').isDisabled(),'données désactivées');ok(await page.locator('#maintenance-fields').isVisible(),'équipement maintenance');
  await page.goto(`${base}/${lang}/quote/`);ok(await page.locator('[value=email]').count()===0,'aucun faux bouton email');await page.locator('[value=whatsapp]').click();ok(await page.locator('[aria-invalid=true]').count()===6,'six champs devis');ok(await page.locator('#name').evaluate(el=>el===document.activeElement),'focus première erreur');
  await fillQuote(lang);await page.locator('#phone').fill('abc');await page.locator('#email').fill('non-valide');await page.locator('[value=whatsapp]').click();ok(await page.locator('#phone').getAttribute('aria-invalid')==='true','téléphone rejeté');ok(await page.locator('#email').getAttribute('aria-invalid')==='true','email rejeté');
  await page.locator('#phone').fill(lang==='ar'?'٩٨٢٨٩٧٠٠':'98289700');await page.locator('#email').fill('');await page.locator('#consumption').fill('-2');await page.locator('[value=whatsapp]').click();ok(await page.locator('#consumption').getAttribute('aria-invalid')==='true','nombre rejeté');
  await page.locator('#consumption').fill('450');await page.locator('#period').selectOption('twoMonths');await page.locator('#power').fill('3.5');await page.locator('[value=whatsapp]').focus();await page.keyboard.press('Enter');
  ok(await page.locator('#message-review').isVisible(),'soumission au clavier');const wa=await page.locator('#whatsapp-continue').getAttribute('href');const message=new URL(wa).searchParams.get('text');ok(message.includes('450 kWh')&&message.includes('3.5 kWc'),'unités');ok(await page.locator('#message-text img').count()===0,'aucune injection HTML');
  await page.locator('#copy-message').click();await page.waitForFunction(()=>document.getElementById('copy-status').textContent.length>0);ok((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n')===message,'copie message');
  await page.locator('#edit-message').click();ok(await page.locator('#name').inputValue()==='Test local','saisie conservée');await page.locator('#need').selectOption('maintenance');await page.locator('#equipment').fill('Équipement de test');await page.locator('[value=whatsapp]').click();ok(!(await page.locator('#message-text').textContent()).includes('450'),'dimensionnement exclu');
  await page.locator('#edit-message').click();await page.locator('#description').fill('Description de test '.repeat(220));await page.locator('[value=whatsapp]').click();ok(await page.locator('#long-message').isVisible(),'message long');ok(await page.locator('#whatsapp-continue').getAttribute('href')==='https://wa.me/21698289700','sans texte long URL');await fit('aperçu long');
  await page.locator('#message-review').screenshot({path:path.join(out,`design-${lang}-message-long.png`)});
  await page.evaluate(()=>{navigator.clipboard.writeText=()=>Promise.reject(new Error('refus simulé'));});await page.locator('#copy-message').click();ok((await page.locator('#copy-status').textContent()).length>25,'copie refusée');
  await page.goto(`${base}/${lang}/contact/`);await page.locator('[value=whatsapp]').click();ok(await page.locator('[aria-invalid=true]').count()===3,'trois champs contact');await page.locator('#name').fill('Test local');await page.locator('#phone').fill('98289700');await page.locator('#description').fill('Question locale');await page.locator('[value=whatsapp]').click();ok(await page.locator('#message-review').isVisible(),'contact valide');
  ok(await page.locator('.map-panel iframe').count()===1,'carte intégrée');ok((await page.locator('.map-panel .text-link').getAttribute('href')).includes('/maps/search/'),'recherche adresse');ok(await page.locator('.floating-whatsapp').count()===0,'aucun flottant devant champs');
  ok(await page.evaluate(()=>localStorage.length===0&&sessionStorage.length===0),'aucune persistance');
 }
 for(const route of ['/introuvable/','/ar/introuvable/']){const response=await page.goto(base+route);ok(response.status()===404,'vraie 404');ok(await page.locator('html').getAttribute('lang')===(route.startsWith('/ar/')?'ar':'fr'),'langue 404');}
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/fr/');ok(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)==='auto','mouvement réduit');
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await nojs.newPage();await np.goto(base+'/fr/quote/');ok(await np.locator('h1').isVisible(),'HTML sans JS');ok(await np.locator('.bottom-nav a').first().isVisible(),'navigation sans JS');ok(await np.locator('button[type=submit]').evaluateAll(buttons=>buttons.every(b=>b.disabled)),'pas de GET sans JS');await nojs.close();
 // Fixture mémoire : activer les boutons e-mail, jamais une requête EmailJS réelle.
 for(const lang of ['fr','ar']){
  const fixture=await browser.newContext();await fixture.route('**/*',async route=>{
   if(!route.request().url().startsWith(base)){await route.abort();return;}
   if(route.request().isNavigationRequest()){
    const response=await route.fetch();let body=await response.text();
    body=body.replace('"email":{"enabled":false,"publicKey":"","serviceId":"","contactTemplateId":"","quoteTemplateId":""}', '"email":{"enabled":true,"publicKey":"test-public","serviceId":"test-service","contactTemplateId":"test-contact","quoteTemplateId":"test-quote"}');
    body=body.replace('<div class="form-actions">','<div class="form-actions"><button type="submit" value="email" disabled>E-mail test</button>');
    await route.fulfill({response,body});
   }else await route.continue();
  });
  await fixture.addInitScript(()=>{
   const original=window.fetch;window.testCalls=0;
   window.fetch=(url,options)=>{if(String(url).includes('api.emailjs.com')){window.testCalls++;return new Promise((resolve,reject)=>{window.resolveEmail=()=>resolve({status:200});window.rejectEmail=()=>reject(new Error('rejet simulé'));});}return original(url,options);};
  });
  const fp=await fixture.newPage();fp.on('pageerror',error=>errors.push(error.message));
  await fp.goto(`${base}/${lang}/quote/`);await fp.locator('#name').fill('Test local');await fp.locator('#phone').fill('98289700');await fp.locator('#profile').selectOption('individual');await fp.locator('#need').selectOption('study');await fp.locator('#city').fill('Msaken');await fp.locator('#description').fill('Essai bouchon');
  await fp.locator('[value=email]').evaluate(el=>{el.className='button yellow';el.textContent=JSON.parse(document.getElementById('page-config').textContent).form.emailSubmit;});
  await fp.locator('[value=email]').click();ok(await fp.locator('[value=email]').isDisabled(),'verrou envoi');ok(await fp.locator('#form-status').getAttribute('data-state')==='loading','attente avant succès');
  await fp.locator('.form-card').screenshot({path:path.join(out,`design-${lang}-email-loading-simulation.png`)});
  await fp.locator('form').evaluate(el=>el.dispatchEvent(new SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:el.querySelector('[value=email]')})));ok(await fp.evaluate(()=>window.testCalls)===1,'double soumission bloquée');
  await fp.evaluate(()=>window.rejectEmail());await fp.waitForFunction(()=>document.getElementById('form-status').dataset.state==='error');ok(await fp.locator('#name').inputValue()==='Test local','saisie après rejet');ok(await fp.locator('[value=email]').isEnabled(),'verrou libéré');
  await fp.locator('.form-card').screenshot({path:path.join(out,`design-${lang}-email-error-simulation.png`)});
  // Une nouvelle page représente un nouvel essai, sans attendre le throttle local de 10s.
  await fp.reload();await fp.locator('#name').fill('Test local');await fp.locator('#phone').fill('98289700');await fp.locator('#profile').selectOption('individual');await fp.locator('#need').selectOption('study');await fp.locator('#city').fill('Msaken');await fp.locator('#description').fill('Essai bouchon');
  await fp.locator('[value=email]').evaluate(el=>{el.className='button yellow';el.textContent=JSON.parse(document.getElementById('page-config').textContent).form.emailSubmit;});
  await fp.locator('[value=email]').click();ok(await fp.locator('#form-status').getAttribute('data-state')==='loading','aucun succès immédiat');await fp.evaluate(()=>window.resolveEmail());await fp.waitForFunction(()=>document.getElementById('form-status').dataset.state==='success');ok(await fp.locator('#name').inputValue()==='','reset après acceptation');
  await fp.locator('.form-card').screenshot({path:path.join(out,`design-${lang}-email-accepted-simulation.png`)});await fixture.close();
 }
 ok(errors.length===0,'erreurs JS : '+errors.join(';'));ok(external.length===0,'aucune requête externe');
 const report={date:new Date().toISOString(),browser:await browser.version(),checks,results,errors,externalRequests:external,mapFixtures,email:'Bouchons exclusivement, aucune livraison vérifiée',method:'Chrome headless ; viewports simulés ; iframe cartographique interceptée ; aucun appareil physique'};
 await writeFile(path.join(out,'browser-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
