import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='test-results/palette-solaire';
const before=await readFile(out+'/styles-before.css','utf8'),after=await readFile('assets/styles.css','utf8');
const allowed=/^(?:color(?:-scheme)?|background(?:-.*)?|box-shadow|--(?:color-.+|bg-gradient-.+|border-gradient-.+|text-gradient-.+|shadow-.+|jet|onyx|eerie-black-.+|smoky-black|white-.+|orange-yellow-crayola|vegas-gold|light-gray(?:-70)?|bittersweet-shimmer))$/;
function geometry(css){return [...css.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/([-\w]+)\s*:\s*([^;{}]+)(?:;|(?=\}))/g)].filter(([,p])=>!allowed.test(p)).map(([,p,v])=>[p,p.startsWith('border')&&!p.includes('radius')?v.trim().replace(/^(\S+\s+(?:solid|dashed|dotted))\s+.+$/,'$1 <color>'):v.replace(/\s+/g,'').trim()]);}
assert.deepEqual(geometry(after),geometry(before),'Aucune déclaration de dimensions, de typo ou de comportement ne doit changer');
assert.deepEqual([...after.matchAll(/@(?:media|container)[^{]+/g)].map(m=>m[0]),[...before.matchAll(/@(?:media|container)[^{]+/g)].map(m=>m[0]),'Points de rupture inchangés');
const lum=hex=>{const x=hex.match(/[a-f\d]{2}/gi).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return .2126*x[0]+.7152*x[1]+.0722*x[2]};
const pairs=[['texte/panneau','243746','ffffff',4.5],['texte secondaire/surface','526575','eaf1f6',4.5],['titre/panneau','123047','ffffff',4.5],['lien/surface','145b88','eaf1f6',4.5],['bouton solaire','123047','f4b942',4.5],['bouton bleu (point le plus clair)','ffffff','1b6998',4.5],['erreur/fond','a32625','fff1f0',4.5],['succès/panneau','237a57','ffffff',4.5],['bordure de champ/panneau','7c909f','ffffff',3]];
const contrasts=pairs.map(([name,fg,bg,min])=>{const a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);assert.ok(ratio>=min,name+' '+ratio);return{name,ratio:Number(ratio.toFixed(2)),minimum:min}});
const result={geometryDeclarations:geometry(after).length,breakpointsUnchanged:true,contrasts};await writeFile(out+'/static-report.json',JSON.stringify(result,null,2));console.log(result);
