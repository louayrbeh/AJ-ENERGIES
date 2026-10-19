import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareContactLinks} from '../assets/js/message-channels.mjs';
import {company} from '../data/company.mjs';
const base={recipient:company.email,whatsapp:company.whatsapp};
test('accents, arabe, symboles et retours à la ligne : même contenu dans les deux canaux',()=>{
 const message='Nom : Élodie & رانية\nBesoin : 12 m³/jour\nDescription : ضخّ المياه + étude ?';
 const subject='Demande de devis — AJ ENERGIES — ضخّ المياه';
 const links=prepareContactLinks({...base,subject,message});
 const mail=new URL(links.mailto),wa=new URL(links.whatsapp);
 assert.equal(mail.pathname,'ajenergiescontact@gmail.com');assert.equal(mail.searchParams.get('subject'),subject);
 assert.equal(mail.searchParams.get('body').replace(/\r\n/g,'\n'),message);assert.equal(wa.searchParams.get('text'),message);
 assert.equal(links.mailLong,false);assert.equal(links.waLong,false);
});
test('message long : mailto garde destinataire et objet, sans corps tronqué',()=>{
 const links=prepareContactLinks({...base,subject:'Demande — étude',message:'énergie وماء\n'.repeat(400)});
 assert.equal(links.mailLong,true);assert.equal(new URL(links.mailto).searchParams.has('body'),false);
 assert.equal(new URL(links.mailto).searchParams.get('subject'),'Demande — étude');assert.equal(links.whatsapp,company.whatsapp);
});
test('budgets de lien indépendants : une alternative peut conserver le message complet',()=>{
 const message='eau '.repeat(100);const links=prepareContactLinks({...base,subject:'Pompage',message,mailMaxLength:120,waMaxLength:5000});
 assert.equal(links.mailLong,true);assert.equal(links.waLong,false);assert.equal(new URL(links.whatsapp).searchParams.get('text'),message);
});
test('l’objet ne peut injecter un en-tête ; destinataire mal formé refusé',()=>{
 const links=prepareContactLinks({...base,subject:'Étude\r\nBcc: autre',message:'test'});
 assert.equal(new URL(links.mailto).searchParams.get('subject').includes('\n'),false);
 assert.throws(()=>prepareContactLinks({...base,recipient:'adresse@example.com?bcc=autre',subject:'test',message:'test'}));
});
