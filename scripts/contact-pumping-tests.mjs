import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {company} from '../data/company.mjs';
import fr from '../locales/fr.mjs';import ar from '../locales/ar.mjs';
const require=createRequire(import.meta.url);const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const out='test-results/email-pompage';await mkdir(out,{recursive:true});const failures=[],errors=[],missing=[],external=[];let checks=0;const cases=[];
const ok=(v,m)=>{checks++;if(!v)failures.push(m)};
const hash=x=>createHash('sha256').update(x).digest('hex');
const protectedBefore=JSON.parse(await readFile(out+'/protected.json','utf8'));
for(const [f,h] of Object.entries(protectedBefore)){let data=await readFile(f);if(f==='config/site.mjs')data=Buffer.from(data.toString().replace('  mailtoMaxUrlLength: 1900,\n',''));ok(hash(data)===h,'préservation '+f);}
const css=await readFile('assets/styles.css','utf8'),before=await readFile(out+'/styles-before.css','utf8');
const original=css.replace(/^\.company-logo img[^\n]+\n/m,'').replace(/^\.email-address[^\n]+\n/m,'').replace(/^\.brand-symbol img[^\n]+\n/m,'');
ok(original===before,'toutes les règles CSS préexistantes sont inchangées');
const build=await readFile('scripts/build.mjs','utf8'),oldBuild=await readFile(out+'/build-before.mjs','utf8');
const nav=s=>s.slice(s.indexOf('function mobileNavigation('),s.indexOf('\nfunction document('));ok(nav(build)===nav(oldBuild),'navigation source inchangée');
ok(hash(await readFile('assets/images/logo-officiel-source.jpg'))===hash(await readFile('C:/Users/louay/Desktop/704898658_122138798013133892_8769785382068832190_n.jpg')),'logo source fourni conservé');
const b=await chromium.launch({channel:'chrome',headless:true});
try{
const ctx=await b.newContext({permissions:['clipboard-read','clipboard-write']});
await ctx.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:4173')?r.continue():r.request().url().startsWith('https://www.google.com/maps')?r.fulfill({contentType:'text/html; charset=utf-8',body:'<html><meta charset="utf-8"><body>Cadre Google Maps intercepté pour les contrôles locaux.</body></html>'}):(external.push(r.request().url()),r.abort()));
const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4173')&&r.status()>=400)missing.push(r.url())});
const fit=async key=>ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'débordement '+key);
async function open(lang,route,width){await page.setViewportSize({width,height:1000});await page.goto(`http://127.0.0.1:4173/${lang}/${route}`);await page.evaluate(()=>document.fonts.ready);}
async function fill(quote=true){await page.locator('#name').fill('Élodie رانية');await page.locator('#phone').fill('٩٨ ٢٨٩ ٧٠٠');await page.locator('#description').fill('Besoin d’étude : eau & énergie — مشروع ضخّ المياه.');if(quote){await page.locator('#profile').selectOption('individual');await page.locator('#city').fill('Msaken');}}
for(const t of [fr,ar])for(const width of [360,768,1024,1440])for(const route of ['','about/','services/','quote/','contact/','faq/']){
const key=t.lang+' '+width+' '+route;await open(t.lang,route,width);cases.push({lang:t.lang,width,route});await fit(key);
ok(await page.locator('.bottom-nav').isVisible()===(width<1024),'seuil navigation '+key);
ok(await page.locator('#contacts-toggle').isVisible()===(width<1250),'seuil fiche '+key);
ok(await page.locator('.site-layout').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)===(width>=1250?2:1),'colonnes '+key);
const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());ok(schema.email===company.email,'schema email '+key);ok(schema.hasOfferCatalog.itemListElement.length===4,'schema services '+key);
ok(await page.locator('.company-email').getAttribute('href')==='mailto:'+company.email,'email panneau '+key);ok(await page.locator('.footer-email').getAttribute('href')==='mailto:'+company.email,'email footer '+key);
ok(await page.locator('.company-logo').getAttribute('aria-label').then(x=>x.includes('AJ ENERGIES')),'nom accessible '+key);
await page.locator('img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await page.waitForFunction(()=>[...document.images].every(i=>i.complete));ok(await page.locator('img').evaluateAll(es=>es.every(i=>i.naturalWidth>0)),'images '+key);
ok(await page.locator('.company-logo img').evaluate(i=>{const r=i.getBoundingClientRect();return r.width>0&&Math.abs(r.width-r.height)<1&&getComputedStyle(i).objectFit==='contain'}),'logo proportions '+key);
if(width<1250){await page.locator('#contacts-toggle').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>!document.querySelector('.company-contacts').classList.contains('is-animating'));ok(await page.locator('.company-email').isVisible(),'email déplié '+key);await fit(key+' fiche ouverte');await page.locator('#contacts-toggle').click();await page.locator('#company-contacts').waitFor({state:'hidden'});}
if(route===''){ok(await page.locator('.service-card').count()===4,'4 cartes '+key);if(width<1024){await page.locator('#menu-toggle').click();ok(await page.locator('#more-panel').isVisible(),'Plus '+key);await page.keyboard.press('Escape');}}
if(route==='services/'){ok(await page.locator('#pumping').count()===1,'service pompage '+key);ok(await page.locator('#pumping a').getAttribute('href')===`/${t.lang}/quote/?need=pumping`,'CTA '+key);ok(await page.locator('#pumping figcaption').textContent()===t.form.pumpingCaption,'légende '+key);await page.locator('#pumping').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/pumping-${t.lang}-${width}.png`});}
if(route==='faq/')for(const id of ['solar-pumping','pumping-information'])ok(await page.locator('#'+id).count()===1,'FAQ '+id+' '+key);
if(route==='contact/')ok(await page.locator('.contact-details a[href="mailto:'+company.email+'"]').count()===1,'email contact '+key);
if(route==='quote/'||route==='contact/'){
const quote=route==='quote/';await page.locator('button[value="mailto"]').click();ok(await page.locator('[aria-invalid=true]').count()===(quote?6:3),'validation '+key);await fill(quote);await page.locator(quote?'#need':'#subject').selectOption('pumping');
ok(await page.locator('#pumping-fields').isVisible(),'champs pompage '+key);if(quote)ok(await page.locator('#sizing').isHidden(),'pas dimensionnement électrique '+key);
await page.locator('button[value="mailto"]').click();ok(await page.locator('#message-review').isVisible(),'technique facultative '+key);
let mail=new URL(await page.locator('#email-continue').getAttribute('href'));ok(mail.pathname===company.email,'destinataire '+key);ok(mail.searchParams.get('subject').includes(t.form.pumping),'objet traduit '+key);
let body=mail.searchParams.get('body').replace(/\r\n/g,'\n');ok(body.includes('Élodie رانية')&&body.includes('مشروع ضخّ المياه'),'UTF-8 '+key);ok(!body.includes(t.form.waterNeed+' :'),'valeurs vides exclues '+key);ok(!mail.searchParams.has('bcc')&&!mail.searchParams.has('cc'),'pas autre destinataire '+key);
ok(await page.locator('#form-status').getAttribute('data-state')!=='success','pas faux succès '+key);
await page.locator('#copy-message').click();ok((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n')===body,'copie message '+key);
await page.locator('#copy-recipient').click();ok(await page.evaluate(()=>navigator.clipboard.readText())===company.email,'copie adresse '+key);
let wa=new URL(await page.locator('#whatsapp-continue').getAttribute('href'));ok(wa.searchParams.get('text')===body,'contenu commun '+key);
await page.screenshot({path:`${out}/preview-${quote?'quote':'contact'}-${t.lang}-${width}.png`});
await page.locator('#edit-message').click();ok(await page.locator('#name').inputValue()==='Élodie رانية','saisie conservée '+key);
await page.locator('#waterNeed').fill('12');await page.locator('#waterUnit').selectOption('m3hour');await page.locator('#waterUse').selectOption('irrigation');await page.locator('#waterSource').selectOption('borehole');await page.locator('#pumpingHead').fill('35');await page.locator('#existingPump').selectOption('yes');await page.locator('#pumpDetails').fill('Pompe existante — معلومات متاحة');
await page.locator('button[value="whatsapp"]').click();body=await page.locator('#message-text').textContent();ok(body.includes('12 '+t.form.m3hour)&&body.includes('35 '+t.form.meters)&&body.includes('Pompe existante — معلومات متاحة'),'unités et pompe '+key);
ok(!body.includes('kWh')&&!body.includes('kWc'),'champs non pertinents exclus '+key);
const links=await page.locator('#email-continue').getAttribute('href');const mailParams=new URL(links).searchParams;
// Avec l’encodage arabe, le budget conservateur peut imposer la copie du corps.
ok(mailParams.has('body')?mailParams.get('body').replace(/\r\n/g,'\n')===body:await page.locator('#long-email').isVisible(),'corps identique ou copie explicite '+key);
await page.locator('#edit-message').click();await page.locator('#existingPump').selectOption('no');ok(await page.locator('#pumpDetails').isDisabled(),'pompe inexistante exclue '+key);
await page.locator(quote?'#need':'#subject').selectOption('installation');ok(await page.locator('#pumping-fields').isHidden(),'autre service '+key);ok(await page.locator('#waterNeed').isDisabled(),'données cachées désactivées '+key);
await page.locator('button[value="mailto"]').click();body=await page.locator('#message-text').textContent();ok(!body.includes(t.form.waterNeed+' :')&&!body.includes('Pompe existante — معلومات متاحة'),'aucune ancienne donnée pompage '+key);
}
if(route===''||route==='contact/'){await open(t.lang,route,width);await page.screenshot({path:`${out}/viewport-${route?'contact':'home'}-${t.lang}-${width}.png`});}
}
// CTA de présélection, message long, saisies erronées, presse-papiers refusé.
for(const t of [fr,ar]){
await open(t.lang,'services/',390);await page.locator('#pumping a').click();await page.waitForURL(`**/${t.lang}/quote/?need=pumping`);await page.waitForFunction(()=>document.querySelector('#need')?.value==='pumping');ok(await page.locator('#need').inputValue()==='pumping','présélection réelle '+t.lang);await fill();
await page.locator('#waterNeed').fill('-2');await page.locator('button[value="mailto"]').click();ok(await page.locator('#waterNeed').getAttribute('aria-invalid')==='true','nombre négatif '+t.lang);ok(await page.locator('#name').inputValue()==='Élodie رانية','saisie sur erreur '+t.lang);
await page.locator('#waterNeed').fill('');await page.locator('#description').fill('Texte long عربي & énergie\n'.repeat(140));await page.locator('button[value="mailto"]').click();const href=await page.locator('#email-continue').getAttribute('href');ok(!new URL(href).searchParams.has('body'),'mail long sans corps '+t.lang);ok(await page.locator('#long-email').isVisible(),'copier long '+t.lang);ok(new URL(href).pathname===company.email,'destinataire long '+t.lang);
await page.evaluate(()=>{navigator.clipboard.writeText=()=>Promise.reject(new Error('refus test'));});await page.locator('#copy-message').click();ok(await page.evaluate(()=>getSelection().toString()===document.getElementById('message-text').textContent),'sélection de secours '+t.lang);await page.locator('#copy-recipient').click();ok(await page.evaluate(()=>getSelection().toString())===company.email,'adresse sélectionnée secours '+t.lang);
await page.locator('#email-continue').evaluate(e=>e.addEventListener('click',ev=>ev.preventDefault()));await page.locator('#email-continue').click();ok(await page.locator('#review-status').textContent()===t.form.mailPrepared,'aucun envoi prétendu '+t.lang);ok(await page.locator('#form-status').getAttribute('data-state')!=='success','pas succès après mailto '+t.lang);
}
ok(errors.length===0,'erreurs JS '+errors.join(';'));ok(missing.length===0,'ressources manquantes '+missing.join(';'));ok(external.length===0,'appels externes '+external.join(';'));
await writeFile(out+'/report.json',JSON.stringify({checks,failures,cases,errors,missing,external,limits:['Chrome headless ; pas d’application de messagerie réellement ouverte ni de réception vérifiée','Google Maps intercepté ; aucun envoi réel','Viewports simulés ; pas d’appareil physique']},null,2));console.log(JSON.stringify({checks,scenarios:cases.length,failures,errors,missing,external},null,2));if(failures.length)process.exitCode=1;
}finally{await b.close()}
