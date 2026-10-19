import {isEmailConfigured} from '../assets/js/email-adapter.mjs';

export function renderRequestForm(t,quote,{site,company:c,esc,url,arrow}) {
 const f=t.form,enabled=isEmailConfigured(site.email,quote?'quote':'contact');
 const input=(name,label,type='text',required=false,attrs='',help='')=>`<div class="field" ${name==='pumpDetails'?'id="pump-details-field"':''}><label for="${name}">${esc(label)}${required?' <span aria-hidden="true">*</span>':''}</label><input id="${name}" name="${name}" type="${type}" ${required?'required':''} ${attrs} aria-describedby="${help?name+'-help ':''}${name}-error">${help?`<p class="help" id="${name}-help">${esc(help)}</p>`:''}<span class="field-error" id="${name}-error"></span></div>`;
 const select=(name,label,options,required=true)=>`<div class="field"><label for="${name}">${esc(label)}${required?' *':''}</label><select id="${name}" name="${name}" ${required?'required':''} aria-describedby="${name}-error">${options.map(([id,label])=>`<option value="${id}">${esc(label)}</option>`).join('')}</select><span class="field-error" id="${name}-error"></span></div>`;
 const services=[['installation',f.installation],['study',f.study],['maintenance',f.maintenance],['pumping',f.pumping]];
 const number=(name,label,help='')=>input(name,label,'number',false,'min="0.01" step="any" inputmode="decimal"',help);
 const pumping=`<fieldset id="pumping-fields" class="optional-fields" hidden><legend>${esc(f.pumpingInfo)}</legend><p class="help">${esc(f.pumpingHelp)}</p><div class="form-grid">
 ${!quote?input('city',f.city,'text',false,'autocomplete="address-level2" maxlength="100"'):''}
 ${select('waterUse',f.waterUse,[['',f.choose],['irrigation',f.irrigation],['watering',f.watering],['other',f.other]],false)}
 ${select('waterSource',f.waterSource,[['',f.choose],['well',f.well],['borehole',f.borehole],['tank',f.tank],['other',f.other]],false)}
 ${number('waterNeed',f.waterNeed)}${select('waterUnit',f.waterUnit,[['m3day',f.m3day],['m3hour',f.m3hour]],false)}
 ${number('pumpingHead',f.pumpingHead+' ('+f.meters+')',f.pumpingHeadHelp)}
 ${select('existingPump',f.existingPump,[['',f.choose],['yes',f.yes],['no',f.no],['unknown',f.unknown]],false)}
 ${input('pumpDetails',f.pumpDetails,'text',false,`maxlength="1000" placeholder="${esc(f.pumpDetailsPlaceholder)}"`)}
 </div></fieldset>`;
 return `<div class="form-card"><form data-request-form data-kind="${quote?'quote':'contact'}" novalidate>
 <p class="small muted">${esc(t.ui.required)}</p><div id="form-errors" class="error-summary" role="alert" hidden></div>
 <div class="form-grid">${input('name',f.name,'text',true,`autocomplete="name" maxlength="100" placeholder="${esc(f.namePlaceholder)}"`)}${input('phone',f.phone,'tel',true,`autocomplete="tel" maxlength="30" dir="ltr" placeholder="${esc(f.phonePlaceholder)}"`,f.phoneHelp)}${input('email',f.email,'email',false,`autocomplete="email" maxlength="150" dir="ltr" placeholder="${esc(f.emailPlaceholder)}"`)}
 ${quote?select('profile',f.profile,[['',f.choose],['individual',f.individual],['business',f.business],['industry',f.industry]])+select('need',f.need,[['',f.choose],...services])+input('city',f.city,'text',true,`autocomplete="address-level2" maxlength="100" placeholder="${esc(f.cityPlaceholder)}"`):select('subject',f.subject,[['information',f.information],...services,['other',f.other]])}</div>
 ${quote?`<fieldset id="sizing" class="optional-fields"><legend>${esc(f.consumption)}</legend><div class="form-grid">${number('consumption',f.consumption+' (kWh)',f.consumptionHelp)}${select('period',f.period,[['month',f.month],['twoMonths',f.twoMonths],['year',f.year],['otherPeriod',f.otherPeriod]],false)}${number('power',f.power+' (kWc)',f.powerHelp)}</div></fieldset><fieldset id="maintenance-fields" class="optional-fields" hidden><legend>${esc(f.equipment)}</legend>${input('equipment',f.equipment,'text',false,`maxlength="1000" placeholder="${esc(f.equipmentPlaceholder)}"`)}</fieldset>`:''}
 ${pumping}
 <div class="field"><label id="description-label" for="description">${esc(f.description)} *</label><textarea id="description" name="description" rows="5" required maxlength="5000" placeholder="${esc(f.descriptionPlaceholder)}" aria-describedby="description-help description-error"></textarea><p class="help" id="description-help"></p><span class="field-error" id="description-error"></span></div>
 <div class="honeypot" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
 <p class="privacy-note">${esc(f.privacy)} <a href="${url(t.lang,'privacy')}">${esc(f.privacyLink)}</a></p>
 <div class="form-actions"><button class="button yellow" type="submit" value="mailto" disabled>${esc(f.mailtoSubmit)}${arrow}</button><button class="button outline" type="submit" value="whatsapp" disabled>${esc(f.whatsappSubmit)}${arrow}</button>${enabled?`<button class="button outline" type="submit" value="email" disabled>${esc(f.emailSubmit)}${arrow}</button>`:''}</div>
 <p id="form-status" class="form-status" role="status" aria-live="polite" aria-atomic="true"></p><noscript><p>${esc(f.nojs)}</p></noscript></form>
 <section id="message-review" class="message-review" tabindex="-1" aria-labelledby="review-title" hidden><h2 id="review-title">${esc(f.review)}</h2><p id="review-help">${esc(f.reviewHelp)}</p>
 <p class="help">${esc(f.recipient)} : <a href="mailto:${esc(c.email)}"><bdi id="review-recipient" class="email-address" dir="ltr">${esc(c.email)}</bdi></a></p><button type="button" id="copy-recipient" class="text-button">${esc(f.copyRecipient)}</button><p id="recipient-copy-status" role="status"></p>
 <p class="help">${esc(f.mailSubjectLabel)} : <span id="message-subject"></span></p><pre id="message-text" tabindex="0"></pre><p class="help">${esc(f.mailtoHelp)}</p><p id="long-email" class="help" hidden>${esc(f.mailtoLong)}</p><p id="long-message" class="help" hidden>${esc(f.long)}</p>
 <div class="review-actions"><a id="email-continue" class="button yellow"><span class="link-label">${esc(f.mailtoSubmit)}</span>${arrow}</a><a id="whatsapp-continue" class="button outline" rel="noopener noreferrer" target="_blank"><span class="link-label">${esc(f.continue)}</span>${arrow}</a><button type="button" id="copy-message" class="button outline">${esc(f.copy)}</button><button type="button" id="edit-message" class="text-button">${esc(f.edit)}</button></div>
 <p id="copy-status" role="status"></p><p id="review-status" role="status" aria-live="polite"></p><p class="help">${esc(f.sentNote)}</p></section></div>`;
}
