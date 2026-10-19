// Optional Chrome/Playwright integration test. No contact link is followed.
import http from 'node:http';
import path from 'node:path';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);let chromium;
try{({chromium}=require('playwright'));}catch{({chromium}=require(path.join(process.env.USERPROFILE||process.env.HOME,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));}
const prefix='/AJ-ENERGIES',root=path.resolve(process.env.OUTPUT_DIR||'test-results/pages-production');
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
let server;
let base=process.env.PAGES_URL?.replace(/\/$/,'');
if(!base){
 server=http.createServer(async(req,res)=>{
  try{
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(!pathname.startsWith(prefix+'/')){res.writeHead(404);res.end('Outside repository prefix');return;}
   let file=path.resolve(root,'.'+pathname.slice(prefix.length));const rel=path.relative(root,file);
   if(rel.startsWith('..')||path.isAbsolute(rel)||pathname.includes('\\')){res.writeHead(403);res.end();return;}
   let status=200;
   try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');await stat(file);}catch{file=path.join(root,'404.html');status=404;}
   res.writeHead(status,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(await readFile(file));
  }catch{res.writeHead(500);res.end('Local test server error');}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base='http://127.0.0.1:'+server.address().port+prefix;
}
const mode=process.env.PAGES_URL?'public':'local',out='test-results/pages-'+mode;
await mkdir(out,{recursive:true});
const failures=[],errors=[],missing=[],external=[];let checks=0,cases=0,mapRequests=0;
const ok=(value,label)=>{checks++;if(!value)failures.push(label);};
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
try{
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route('**/*',r=>{
  const u=r.request().url();
  if(u.startsWith(base+'/'))return r.continue();
  if(u.startsWith('https://www.google.com/maps')){mapRequests++;return r.fulfill({contentType:'text/html',body:'<!doctype html><title>Map fixture</title><p>External map intercepted for this test.</p>'});}
  external.push(u);return r.abort();
 });
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&!r.request().isNavigationRequest())missing.push(r.url());});
 const routes=['','about/','services/','projects/','quote/','contact/','faq/','privacy/','404/'];
 for(const width of [360,768,1024,1440]){
  await page.setViewportSize({width,height:1000});
  for(const lang of ['fr','ar'])for(const route of routes){
   const label=lang+' '+route+' '+width;cases++;
   const response=await page.goto(base+'/'+lang+'/'+route);await page.evaluate(()=>document.fonts.ready);
   ok(response.status()===200,'Direct URL '+label);
   ok(await page.locator('html').getAttribute('lang')===lang,'Language '+label);
   ok(await page.locator('h1').isVisible(),'Visible title '+label);
   ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow '+label);
   ok(await page.locator('.bottom-nav').isVisible()===(width<1024),'Navigation breakpoint '+label);
   ok(await page.locator('#contacts-toggle').isVisible()===(width<1250),'Company panel breakpoint '+label);
   ok(await page.locator('.language').getAttribute('href')===prefix+'/'+(lang==='fr'?'ar':'fr')+'/'+route,'Equivalent language URL '+label);
   await page.locator('img').evaluateAll(images=>images.forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
   ok(await page.locator('img').evaluateAll(images=>images.every(i=>i.naturalWidth>0)),'All images loaded '+label);
   ok(await page.locator('.company-email').getAttribute('href')==='mailto:ajenergiescontact@gmail.com','Email '+label);
   ok(await page.locator('a[href="tel:+21698289700"]').count()>0,'Phone '+label);
   ok(await page.locator('a[href^="https://wa.me/21698289700"]').count()>0,'WhatsApp '+label);
   if(route===''){
    if(width<1250){
     await page.locator('#contacts-toggle').click();ok(await page.locator('#company-contacts').isVisible(),'Contacts open '+label);
     await page.locator('#contacts-toggle').click();ok(!(await page.locator('#company-contacts').isVisible()),'Contacts closed '+label);
    }
    if(width<1024){
     await page.locator('#menu-toggle').click();ok(await page.locator('#more-panel').isVisible(),'More open '+label);
     ok(await page.locator('.more-language').getAttribute('href')===prefix+'/'+(lang==='fr'?'ar':'fr')+'/','More language '+label);
     await page.keyboard.press('Escape');ok(!(await page.locator('#more-panel').isVisible()),'More Escape '+label);
     ok(await page.locator('#menu-toggle').evaluate(e=>e===document.activeElement),'More focus restored '+label);
    }
   }
   if(route==='contact/'){
    ok(await page.locator('iframe[loading="lazy"]').count()===1,'Accessible lazy map '+label);
    ok(Boolean(await page.locator('iframe').getAttribute('title')),'Map title '+label);
    const size=await page.locator('iframe').boundingBox();ok(size.width>0&&size.height>=250,'Map dimensions '+label);
   }
   if(route==='contact/'||route==='quote/'){
    await page.waitForFunction(()=>document.querySelector('button[value="mailto"]')?.disabled===false);
    await page.reload();await page.waitForFunction(()=>document.querySelector('button[value="mailto"]')?.disabled===false);
    await page.locator('button[value="mailto"]').click();ok(await page.locator('#form-errors').isVisible(),'Empty form errors '+label);
    ok(!(await page.locator('#message-review').isVisible()),'No fake send '+label);
   }
   if((lang==='fr'&&width===360&&route==='contact/')||(lang==='ar'&&width===1440&&route===''))await page.screenshot({path:out+'/'+lang+'-'+width+'.png',fullPage:true});
   if(route==='services/'){
    await page.locator('#pumping a').click();await page.waitForFunction(()=>document.querySelector('#need')?.value==='pumping');
    ok(new URL(page.url()).pathname===prefix+'/'+lang+'/quote/','Pumping CTA '+label);
    await page.locator('#name').fill('Test local — اختبار');await page.locator('#phone').fill('+21620000000');
    await page.locator('#profile').selectOption('individual');await page.locator('#city').fill('Msaken');
    await page.locator('#description').fill('Demande de test — اختبار للمعاينة فقط.');
    await page.locator('button[value="mailto"]').click();
    ok(await page.locator('#message-review').isVisible(),'Prepared message '+label);
    const mail=await page.locator('#email-continue').getAttribute('href');
    ok(mail?.startsWith('mailto:ajenergiescontact@gmail.com?'),'Mailto recipient '+label);
    const decoded=decodeURIComponent(mail||'');ok(decoded.includes('اختبار')&&decoded.includes('Test local'),'Bilingual encoding '+label);
    ok((await page.locator('#whatsapp-continue').getAttribute('href'))?.startsWith('https://wa.me/21698289700?text='),'Prepared WhatsApp '+label);
   }
  }
  console.log(mode+': FR/AR pages verified at '+width+'px');
 }
 const home=await page.goto(base+'/');ok(home.status()===200,'Repository home');
 for(const suffix of ['/unknown-page/','/ar/unknown-page/']){
  const response=await page.goto(base+suffix);ok(response.status()===404,'Real 404 '+suffix);
  ok(await page.locator('h1').isVisible(),'Custom 404 content '+suffix);
  ok(await page.locator('html').getAttribute('lang')==='fr','Global GitHub Pages 404 is French '+suffix);
 }
 ok(errors.length===0,'No JavaScript errors');ok(missing.length===0,'No missing resources');ok(external.length===0,'No contact/external call');
 const result={mode,base,checks,cases,failures,errors,missing,external,mapRequests,mapRendering:'Intercepted; actual Google Maps rendering not verified',messageDelivery:'No email, WhatsApp or phone action followed'};
 await writeFile(out+'/report.json',JSON.stringify(result,null,2));console.log(result);
 if(failures.length)process.exitCode=1;
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
