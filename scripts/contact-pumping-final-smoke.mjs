import {createRequire} from 'node:module';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url);const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const browser=await chromium.launch({channel:'chrome',headless:true});let checks=0;const failures=[],errors=[];
const ok=(v,m)=>{checks++;if(!v)failures.push(m)};
try{
const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));
for(const lang of ['fr','ar'])for(const width of [360,768,1024,1440]){
await p.setViewportSize({width,height:1000});await p.goto(`http://127.0.0.1:4173/${lang}/quote/?need=pumping`);await p.waitForFunction(()=>document.getElementById('need').value==='pumping');await p.evaluate(()=>document.fonts.ready);
ok(await p.evaluate(async()=>{const i=new Image();i.src=document.querySelector('link[rel=icon]').href;await i.decode();return i.naturalWidth===128&&i.naturalHeight===128}),'favicon décodable '+lang+width);
await p.locator('#name').fill('Élodie رانية');await p.locator('#phone').fill('٩٨ ٢٨٩ ٧٠٠');await p.locator('#profile').selectOption('individual');await p.locator('#city').fill('Msaken');await p.locator('#waterNeed').fill('12');await p.locator('#waterUnit').selectOption('m3day');await p.locator('#pumpingHead').fill('35');await p.locator('#waterUse').selectOption('irrigation');await p.locator('#waterSource').selectOption('well');await p.locator('#existingPump').selectOption('yes');await p.locator('#pumpDetails').fill('Indications disponibles — تفاصيل متاحة');await p.locator('#description').fill('Étude de pompage solaire — دراسة ضخّ المياه.');
await p.locator('#pumping-fields').screenshot({path:`test-results/email-pompage/fields-${lang}-${width}.png`});
await p.locator('button[value=mailto]').click();const text=await p.locator('#message-text').textContent();
ok(await p.locator('#review-title').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.top<innerHeight}),'début aperçu visible '+lang+width);
ok(text.includes('98 289 700')&&!text.includes('٩٨ ٢٨٩ ٧٠٠'),'chiffres de téléphone normalisés '+lang+width);
ok(await p.locator('#message-text bdi[dir=ltr]').first().textContent()==='98 289 700','téléphone isolé en LTR dans aperçu '+lang+width);
ok(text.includes('12 '+(lang==='fr'?'m³/jour':'م³/يوم'))&&text.includes('35 '+(lang==='fr'?'m':'م')),'unités '+lang+width);
ok(text.includes('Indications disponibles — تفاصيل متاحة'),'caractéristiques incluses '+lang+width);
ok(new URL(await p.locator('#email-continue').getAttribute('href')).pathname==='ajenergiescontact@gmail.com','destinataire '+lang+width);
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'débordement '+lang+width);
await p.screenshot({path:`test-results/email-pompage/preview-complete-${lang}-${width}.png`});
}
await p.evaluate(()=>{navigator.clipboard.writeText=()=>Promise.reject(new Error('refus simulé'));});
await p.locator('#copy-message').click();ok(await p.evaluate(()=>getSelection().toString()===document.getElementById('message-text').textContent),'copie manuelle conserve le texte avec bdi');
await p.locator('#copy-recipient').click();ok(await p.evaluate(()=>getSelection().toString())==='ajenergiescontact@gmail.com','copie manuelle du destinataire');
ok(errors.length===0,'JS '+errors.join(';'));const result={checks,failures,errors,scope:'Favicon et préparation finale avec téléphone normalisé, 2 langues × 4 largeurs ; aucun lien de transmission activé'};await writeFile('test-results/email-pompage/final-smoke.json',JSON.stringify(result,null,2));console.log(result);if(failures.length)process.exitCode=1;
}finally{await browser.close()}
