import test from 'node:test';
import assert from 'node:assert/strict';
import { createEmailAdapter, isEmailConfigured } from '../assets/js/email-adapter.mjs';

// Valeurs réservées aux bouchons de tests : jamais de service réel.
const config={enabled:true,publicKey:'test-public',serviceId:'test-service',contactTemplateId:'test-contact',quoteTemplateId:'test-quote'};
const input={kind:'quote',lang:'fr',name:'Test local',phone:'00000000',email:'',subject:'study',message:'Essai simulé uniquement'};

test('configuration absente : aucun appel, aucune acceptation',async()=>{
 let calls=0;const adapter=createEmailAdapter({enabled:false},{fetchImpl:()=>{calls++;}});
 assert.equal(isEmailConfigured({enabled:false}),false);
 await assert.rejects(adapter.send(input),{code:'unconfigured'});assert.equal(calls,0);
});
test('une promesse en attente ne confirme pas le succès ; doubles appels refusés',async()=>{
 let resolve;let accepted=false;let payload;
 const adapter=createEmailAdapter(config,{fetchImpl:async(url,options)=>{payload=JSON.parse(options.body);return new Promise(r=>{resolve=r;});}});
 const pending=adapter.send(input).then(result=>{accepted=result.accepted;});
 assert.equal(accepted,false);await assert.rejects(adapter.send(input),{code:'busy'});
 assert.equal(payload.template_id,'test-quote');assert.equal(payload.template_params.visitor_email,'');
 assert.equal(Object.hasOwn(payload.template_params,'to_email'),false);
 resolve({status:200});await pending;assert.equal(accepted,true);
});
test('rejet, réseau et temporisation ne retournent aucun succès',async()=>{
 for(const status of [400,429,500]){
  const adapter=createEmailAdapter(config,{fetchImpl:async()=>({status}),cooldownMs:0});
  await assert.rejects(adapter.send(input),{code:status===429?'rate':'rejected'});
 }
 const network=createEmailAdapter(config,{fetchImpl:async()=>{throw new Error('simulation');}});
 await assert.rejects(network.send(input),{code:'network'});
 const timeout=createEmailAdapter(config,{timeoutMs:10,fetchImpl:async(url,{signal})=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>{const error=new Error();error.name='AbortError';reject(error);}))});
 await assert.rejects(timeout.send(input),{code:'timeout'});
});
test('verrou libéré après rejet ; temporisation locale appliquée',async()=>{
 let time=0;let status=400;
 const adapter=createEmailAdapter(config,{fetchImpl:async()=>({status}),now:()=>time});
 await assert.rejects(adapter.send(input),{code:'rejected'});
 status=200;await assert.rejects(adapter.send(input),{code:'rate'});
 time=11000;assert.equal((await adapter.send(input)).accepted,true);
});
test('validation et choix de modèle contact',async()=>{
 let payload;const adapter=createEmailAdapter(config,{fetchImpl:async(url,options)=>{payload=JSON.parse(options.body);return {status:200};},cooldownMs:0});
 await assert.rejects(adapter.send({...input,name:''}),{code:'invalid'});
 await adapter.send({...input,kind:'contact'});assert.equal(payload.template_id,'test-contact');
});
