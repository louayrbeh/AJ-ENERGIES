import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const out='test-results/palette-solaire';await mkdir(out,{recursive:true});
const baseline=process.argv.includes('--baseline');
const routes=['','about/','services/','projects/','quote/','contact/','faq/','privacy/','404/'];
const properties=['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderRadius','gap','gridTemplateColumns','display','position'];
const selectors=['.site-layout','.company-panel','.company-overview','.company-identity','.company-logo','.company-logo svg','.company-name','.company-badge','.company-slogan','#contacts-toggle','#contacts-toggle span','#contacts-toggle svg','.contact-icon','.contact-row','.main-panel','.site-header','#site-nav','#site-nav a','.bottom-nav','.bottom-nav a','h1','h2','h3','.lead','.service-card','.service-content','.solar-photo','.solar-photo img','.form-grid','label','input','select','textarea','.form-actions .button','.map-panel iframe','footer'];
const protectedFiles=['assets/js/main.mjs','assets/js/request-form.mjs','assets/js/email-adapter.mjs','data/company.mjs','data/projects.mjs','config/site.mjs','config/map.mjs'];
const hashes={};for(const f of protectedFiles)hashes[f]=createHash('sha256').update(await readFile(f)).digest('hex');
const snapshots={};const failures=[];let checks=0;const ok=(v,m)=>{checks++;if(!v)failures.push(m)};
const b=await chromium.launch({channel:'chrome',headless:true});
try{
const page=await b.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4173/')&&r.status()>=400)errors.push(r.status()+' '+r.url())});
await page.route('https://www.google.com/maps**',r=>r.fulfill({contentType:'text/html',body:'Carte interceptée pour le contrôle local, sans appel externe.'}));
for(const lang of ['fr','ar'])for(const width of [360,768,1024,1440])for(const route of routes){
await page.setViewportSize({width,height:1000});await page.goto(`http://127.0.0.1:4173/${lang}/${route}`);await page.evaluate(()=>document.fonts.ready);
const key=`${lang}-${width}-${route||'home'}`;
snapshots[key]=await page.evaluate(({selectors,properties})=>{
const result={};for(const s of selectors){const e=document.querySelector(s);if(!e)continue;const c=getComputedStyle(e);result[s]=Object.fromEntries(properties.map(p=>[p,c[p]]));if(!['.site-layout','.company-panel','.main-panel','footer','.company-identity','.lead','h1','h2','h3','.form-grid','.solar-photo','.service-content'].includes(s)){result[s].width=e.getBoundingClientRect().width;result[s].height=e.getBoundingClientRect().height;}}
result.metadata=[...document.head.querySelectorAll('title,meta:not([name="theme-color"]),link[rel="canonical"],link[rel="alternate"],script[type="application/ld+json"]')].map(e=>e.outerHTML);
return result;},{selectors,properties});
ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'débordement '+key);
ok(await page.locator('.site-layout').evaluate(e=>{const r=e.getBoundingClientRect();return Math.abs(r.left-(innerWidth-r.width)/2)<1}),'conteneur centré '+key);
ok(await page.locator('.bottom-nav').isVisible()===(width<1024),'navigation '+key);
ok(await page.locator('#contacts-toggle').isVisible()===(width<1250),'coordonnées '+key);
if(width<1250){await page.locator('#contacts-toggle').click();await page.waitForFunction(()=>!document.querySelector('.company-contacts').classList.contains('is-animating'));ok(await page.locator('#company-contacts').isVisible(),'ouverture '+key);await page.locator('#contacts-toggle').focus();await page.keyboard.press('Enter');await page.locator('#company-contacts').waitFor({state:'hidden'});ok(await page.locator('#contacts-toggle').getAttribute('aria-expanded')==='false','fermeture clavier '+key);}
if(width<1024&&route===''){await page.locator('#menu-toggle').click();ok(await page.locator('#more-panel').isVisible(),'Plus '+key);await page.keyboard.press('Escape');ok(await page.evaluate(()=>document.activeElement?.id==='menu-toggle'),'focus Plus '+key);}
if(!baseline){
await page.locator('img').evaluateAll(es=>es.forEach(e=>e.loading='eager'));await page.waitForFunction(()=>[...document.images].every(i=>i.complete));ok(await page.locator('img').evaluateAll(es=>es.every(e=>e.naturalWidth>0)),'images '+key);
ok(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor)==='rgb(243, 247, 250)','fond clair '+key);
if(route==='projects/'){ok(await page.locator('[data-project-category]').count()===0,'pas de faux projets '+key);ok(await page.locator('.illustrative-gallery figure').count()===4,'illustrations '+key);}
if(route==='contact/'||route==='quote/'){await page.locator('button[value="whatsapp"]').click();ok(await page.locator('#form-errors').isVisible(),'validation '+key);ok(await page.locator('#form-status').getAttribute('data-state')!=='success','aucun faux envoi '+key);}
}
if(['','projects/','contact/'].includes(route)&&[360,1440].includes(width))await page.screenshot({path:`${out}/${baseline?'avant':'apres'}-${lang}-${width}-${route.replace('/','')||'home'}.png`,fullPage:true});
}
ok(errors.length===0,'ressources et JS '+JSON.stringify(errors));
if(baseline){await writeFile(out+'/baseline.json',JSON.stringify({snapshots,hashes},null,2));await writeFile(out+'/styles-before.css',await readFile('assets/styles.css'));for(const lang of ['fr','ar'])await writeFile(out+`/locale-before-${lang}.json`,JSON.stringify((await import(`../locales/${lang}.mjs`)).default));}
else{
const before=JSON.parse(await readFile(out+'/baseline.json','utf8'));
for(const [key,value] of Object.entries(snapshots))for(const [selector,styles] of Object.entries(value)){
const old=before.snapshots[key]?.[selector];if(!old)continue;
for(const [prop,val] of Object.entries(styles)){
// Chromium résout parfois les marges auto à 0 dans CSSOM ; centrage mesuré ci-dessus.
if(selector==='.site-layout'&&['marginRight','marginLeft'].includes(prop))continue;
// Seules les légendes d'images changent le contenu intrinsèque des figures.
if(selector==='.solar-photo'&&['gridTemplateColumns'].includes(prop))continue;
ok(JSON.stringify(old[prop])===JSON.stringify(val),`${key} ${selector} ${prop}: ${old[prop]} -> ${val}`);
}}
for(const f of protectedFiles)ok(hashes[f]===before.hashes[f],'fichier préservé '+f);
for(const lang of ['fr','ar']){
const old=JSON.parse(await readFile(out+`/locale-before-${lang}.json`,'utf8'));const now=structuredClone((await import(`../locales/${lang}.mjs`)).default);
for(const obj of [old,now]){delete obj.ui.illustration;delete obj.privacy.intro;obj.privacy.sections=obj.privacy.sections.slice(0,5);}
ok(JSON.stringify(old)===JSON.stringify(now),'textes commerciaux préservés '+lang);
}
}
await writeFile(out+`/${baseline?'baseline':'report'}.summary.json`,JSON.stringify({checks,failures,scenarios:Object.keys(snapshots).length,external:'Google Maps intercepté ; aucun envoi'},null,2));console.log(JSON.stringify({checks,scenarios:Object.keys(snapshots).length,failures:failures.slice(0,35),failureCount:failures.length},null,2));if(failures.length)process.exitCode=1;
}finally{await b.close()}
