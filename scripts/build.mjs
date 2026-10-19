import { mkdir, writeFile, readFile, cp, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import path from 'node:path';
import fr from '../locales/fr.mjs';
import ar from '../locales/ar.mjs';
import { company as c } from '../data/company.mjs';
import { projects } from '../data/projects.mjs';
import { illustrations, illustrationHeading } from '../data/illustrations.mjs';
import { site } from '../config/site.mjs';
import { map } from '../config/map.mjs';
import { isEmailConfigured } from '../assets/js/email-adapter.mjs';
import { renderRequestForm } from './request-form-template.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.resolve(root, process.env.OUTPUT_DIR || 'dist');
const relativeOutput = path.relative(root, dist);
if (relativeOutput !== 'dist' && !relativeOutput.startsWith('test-results' + path.sep)) throw Error('OUTPUT_DIR doit être dist ou un sous-dossier de test-results.');
if (site.productionUrl && !/^https:\/\/[^/\s?#]+$/.test(site.productionUrl)) throw Error('SITE_URL doit être une origine HTTPS sans chemin ni slash final.');
if (site.basePath && !/^\/(?:[\w-]+\/)*[\w-]+$/.test(site.basePath)) throw Error('BASE_PATH invalide.');
const mapEnabled = map.enabled !== false && Boolean(map.embedUrl);
if (mapEnabled) {
 const embed = new URL(map.embedUrl);
 const compatible = embed.pathname.startsWith('/maps/embed') || (embed.pathname === '/maps' && embed.searchParams.get('output') === 'embed');
 if (embed.origin !== 'https://www.google.com' || embed.username || embed.password || !compatible) throw Error('URL d’intégration Google Maps HTTPS nécessaire.');
}
if (site.email.enabled && !['contact', 'quote'].every(kind => isEmailConfigured(site.email, kind))) throw Error('EmailJS activé : tous les paramètres publics sont nécessaires.');
const pages = ['home', 'about', 'services', 'projects', 'quote', 'contact', 'faq', 'privacy', 'notFound'];
const slugs = { home: '', about: 'about/', services: 'services/', projects: 'projects/', quote: 'quote/', contact: 'contact/', faq: 'faq/', privacy: 'privacy/', notFound: '404/' };
const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const json = value => JSON.stringify(value).replace(/</g, '\u003c');
const url = (lang, page = 'home') => `${site.basePath}/${lang}/${slugs[page]}`;
const asset = file => `${site.basePath}/assets/${file}`;
const wa = (t, kind = 'contact') => `${c.whatsapp}?text=${encodeURIComponent(t.form.messageHeader + '\n' + (kind === 'quote' ? t.form.quoteMessage : t.form.contactMessage))}`;
const arrow = '<span class="arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19 19 5M5 5h14v14"/></svg></span>';
const iconPaths = {
 plus: '<path d="M12 5v14M5 12h14"/>',
 sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
 study: '<path d="M5 3h10l4 4v14H5ZM14 3v5h5M8 12h8m-8 4h5"/>',
 installation: '<path d="m5 5-3 13h20L19 5ZM4 12h16M9 5l-1 13m7-13 1 13M12 18v4m-5 0h10"/>',
 maintenance: '<path d="M14 6a5 5 0 0 0-6 6l-5 5a3 3 0 0 0 4 4l5-5a5 5 0 0 0 6-6l-4 4-4-4Z"/>',
 house: '<path d="m2 11 10-8 10 8M5 10v11h14V10m-10 11v-7h6v7"/>',
 shop: '<path d="M3 10h18L19 3H5ZM4 10v11h16V10M9 21v-7h6v7"/>',
 industry: '<path d="M3 21V10l6 4v-4l6 4V3h4l2 18ZM6 18h1m4 0h1m4 0h1"/>',
 email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
 pumping: '<path d="m3 3-2 9h12l-2-9ZM2 8h10M6 3l-1 9m4-9 1 9M7 12v5h8v-4h6m-3 0v5"/><path d="M18 20c-2 2-2 3 0 3s2-1 0-3Z"/>',
 phone: '<path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4c0 4-8 2-13-3S1 3 5 3Z"/>',
 pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
 chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.8 7.3L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 9h8m-8 4h5"/>',
 more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
 chevron: '<path d="m6 9 6 6 6-6"/>',
 facebook: '<path d="M14 22v-9h3l1-4h-4V6c0-1 1-2 2-2h2V1h-3c-3 0-5 2-5 5v3H7v4h3v9"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.sun}</svg>`;
const link = (href, text, cls = 'text-link', attrs = '') => `<a class="${cls}" href="${esc(href)}" ${attrs}><span class="link-label">${esc(text)}</span>${arrow}</a>`;
const phoneAction = (t,cls='text-link') => `<a class="${cls}" href="${c.phoneLink}"><span class="link-label">${esc(t.ui.call)} <bdi dir="ltr">${esc(c.phoneDisplay)}</bdi></span>${arrow}</a>`;
const logo = `<img src="${asset('images/logo-officiel-160.webp')}" srcset="${asset('images/logo-officiel-160.webp')} 160w, ${asset('images/logo-officiel-320.webp')} 320w" sizes="150px" width="320" height="320" alt="">`;
const brand = t => `<span class="brand-symbol">${logo}</span><span class="brand-name"><small dir="auto">${t.lang==='ar'?'الطاقة الكهروضوئية':'PHOTOVOLTAÏQUE'}</small></span>`;
const emailAction = (t, cls='text-link') => `<a class="${cls}" href="mailto:${esc(c.email)}"><bdi class="email-address" dir="ltr">${esc(c.email)}</bdi></a>`;
const pumpingPhoto = t => `<figure class="solar-photo"><img src="${asset('images/pumping-1536.webp')}" srcset="${asset('images/pumping-768.webp')} 768w, ${asset('images/pumping-1536.webp')} 1536w" sizes="(min-width:1024px) 450px, 100vw" width="1536" height="864" alt="${esc(t.form.pumpingAlt)}" loading="lazy"><figcaption>${esc(t.form.pumpingCaption)}</figcaption></figure>`;
const eyebrow = text => `<p class="eyebrow">${esc(text)}</p>`;
const heading = (t, title, intro = '') => `<header class="page-heading wrap">${eyebrow(c.name + ' · ' + (t.lang === 'ar' ? 'مساكن' : 'MSAKEN'))}<h1>${esc(title)}</h1>${intro ? `<p class="lead">${esc(intro)}</p>` : ''}</header>`;
const photo = (t, secondary = false) => {
 const image=secondary?'commercial':'solar';
 const alt=secondary?illustrations[1].alt[t.lang]:t.ui.photoAlt;
 return `<figure class="solar-photo ${secondary ? 'secondary-photo' : ''}"><img src="${asset('images/'+image+'-1536.webp')}" srcset="${asset('images/'+image+'-768.webp')} 768w, ${asset('images/'+image+'-1536.webp')} 1536w" sizes="(min-width:1024px) 50vw, 100vw" width="1536" height="864" alt="${esc(alt)}" ${secondary ? 'loading="lazy"' : 'fetchpriority="high"'}><figcaption>${esc(t.ui.illustration)}</figcaption></figure>`;
};
const cta = t => `<section class="cta wrap"><div>${eyebrow(c.name)}<h2>${esc(t.home.ctaTitle)}</h2><p>${esc(t.home.ctaText)}</p></div><div class="cta-actions">${link(url(t.lang,'quote'),t.ui.quote,'button yellow')}${link(wa(t),t.ui.whatsapp,'text-link','rel="noopener noreferrer"')}</div></section>`;
const faqs = (t, subset) => `<div class="faq-list">${(subset || t.faq.items).map(item => `<details id="${item.id}"><summary>${esc(item.q)}<span aria-hidden="true">${icon('plus')}</span></summary><p>${esc(item.a)}</p></details>`).join('')}</div>`;
const servicesCards = t => `<div class="service-grid">${t.services.items.map((s,i) => `<article class="service-card"><div class="card-top"><span class="icon-tile">${icon(s.id)}</span><span class="index" aria-hidden="true">0${i+1}</span></div><div class="service-content"><h3>${esc(s.title)}</h3><p>${esc(s.benefit)}</p>${link(url(t.lang,'quote')+'?need='+s.id,s.cta)}</div></article>`).join('')}</div>`;
const audience = t => `<section class="audience"><div class="wrap"><div class="section-heading">${eyebrow(c.name)}<h2>${esc(t.home.audienceTitle)}</h2></div><div class="audience-grid">${t.home.audiences.map((a,i) => `<article>${icon(['house','shop','industry'][i])}<h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`).join('')}</div></div></section>`;

const requestForm=(t,quote)=>renderRequestForm(t,quote,{site,company:c,esc,url,arrow});

function mapBlock(t) {
 const search = 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(c.address.fr);
 const embed = mapEnabled ? new URL(map.embedUrl) : null;
 if (embed) embed.searchParams.set('hl',t.lang);
 return `<section class="map-panel" aria-labelledby="map-title"><h2 id="map-title">${esc(t.contact.mapTitle)}</h2>${!map.verified?`<p class="map-context">${esc(t.contact.mapNote)}</p>`:''}${embed?`<iframe src="${esc(embed.href)}" title="${esc(map.verified?t.contact.mapTitle:t.contact.mapNote)}" loading="lazy" width="1000" height="380" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`:''}<div class="map-info"><div><address>${esc(c.address[t.lang])}</address>${link(search,t.contact.mapLink,'text-link','rel="noopener noreferrer"')}</div><div class="map-actions">${phoneAction(t,'button outline')}${link(wa(t),t.ui.whatsapp,'button yellow','rel="noopener noreferrer"')}</div></div></section>`;
}
function gallery(t) {
 if (!projects.length) return `<div class="section-heading"><h2>${esc(illustrationHeading[t.lang])}</h2></div><div class="project-grid illustrative-gallery">${illustrations.map(v=>`<figure class="solar-photo" data-illustration><img src="${asset('images/'+v.image+'-768.webp')}" srcset="${asset('images/'+v.image+'-768.webp')} 768w, ${asset('images/'+v.image+'-1536.webp')} 1536w" sizes="(min-width:1024px) 280px, (min-width:768px) 320px, 100vw" width="1536" height="864" alt="${esc(v.alt[t.lang])}" loading="lazy"><figcaption><strong>${esc(v.title[t.lang])}</strong><br>${esc(t.ui.illustration)}</figcaption></figure>`).join('')}</div><div class="empty-state"><p>${esc(t.projects.emptyText)}</p>${link(url(t.lang,'contact'),t.projects.cta,'button yellow')}</div>`;
 const categories = [...new Set(projects.map(p=>p.category))];
 return `${categories.length>1?`<div class="gallery-filters" aria-label="${esc(t.ui.filter)}"><button type="button" data-project-filter="all" aria-pressed="true">${esc(t.ui.all)}</button>${categories.map(id=>`<button type="button" data-project-filter="${esc(id)}" aria-pressed="false">${esc(projects.find(p=>p.category===id).categoryLabel[t.lang])}</button>`).join('')}</div>`:''}<div class="project-grid">${projects.map(p=>`<article data-project-category="${esc(p.category)}"><button type="button" class="enlarge" data-enlarge data-caption="${esc(p.title[t.lang])}" aria-label="${esc(t.ui.learnMore+' — '+p.title[t.lang])}"><img src="${asset(p.image)}" alt="${esc(p.alt[t.lang])}" width="${p.width}" height="${p.height}" loading="lazy"></button><p class="eyebrow">${esc(p.categoryLabel[t.lang])}</p><h2>${esc(p.title[t.lang])}</h2><p>${esc(p.description[t.lang])}</p>${p.city?`<p>${esc(p.city[t.lang])}</p>`:''}${p.verifiedFeatures?`<p>${esc(p.verifiedFeatures[t.lang])}</p>`:''}</article>`).join('')}</div><dialog id="image-dialog" aria-label="${esc(t.nav.projects)}"><button type="button" class="button outline">${esc(t.ui.close)}</button><figure><img alt=""><figcaption></figcaption></figure></dialog>`;
}
function page(t,p) {
 switch(p) {
 case 'home': return `<section class="hero"><div class="hero-grid wrap"><div class="hero-copy">${eyebrow(t.home.eyebrow)}<h1>${esc(t.home.title).replace(c.name, `<span class="hero-brand" dir="ltr">${c.name}</span>`)}</h1><p class="hero-description">${esc(t.home.intro)}</p><div class="hero-actions">${link(url(t.lang,'quote'),t.ui.quote,'button yellow')}${link(url(t.lang,'services'),t.ui.discover,'hero-link')}</div><div class="hero-signature"><span class="sun-dot" aria-hidden="true"></span>${esc(c.slogan[t.lang])}</div></div><div class="hero-visual">${photo(t)}</div></div><div class="hero-foot wrap"><span>${t.lang==='ar'?'مساكن · تونس':'MSAKEN · TUNISIE'}</span><div class="hero-services">${t.services.items.map(s=>`<a href="${url(t.lang,'services')}#${s.id}">${icon(s.id)}<span>${esc(s.title)}</span>${arrow}</a>`).join('')}</div></div></section><section class="intro section wrap"><div>${eyebrow(c.name)}<h2>${esc(t.home.introTitle)}</h2></div><div><p class="lead">${esc(t.home.introText)}</p>${link(url(t.lang,'about'),t.home.introLink)}</div></section><section class="section service-section wrap"><div class="section-heading"><div>${eyebrow(t.nav.services)}<h2>${esc(t.home.servicesTitle)}</h2></div>${link(url(t.lang,'services'),t.ui.allServices)}</div>${servicesCards(t)}</section>${audience(t)}<section class="study section wrap"><div>${eyebrow(t.services.items[0].title)}<h2>${esc(t.home.studyTitle)}</h2><p class="lead">${esc(t.home.studyText)}</p>${link(url(t.lang,'quote')+'?need=study',t.services.items[0].cta)}</div><ul class="study-points">${t.home.studyPoints.map((x,i)=>`<li><span aria-hidden="true">0${i+1}</span>${esc(x)}</li>`).join('')}</ul></section><section class="process section wrap"><div class="section-heading"><h2>${esc(t.home.processTitle)}</h2></div><ol class="steps">${t.home.steps.map((x,i)=>`<li><span class="step-number" aria-hidden="true">0${i+1}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join('')}</ol></section><section class="project-invitation wrap"><div>${eyebrow(t.nav.projects)}<h2>${esc(t.home.projectTitle)}</h2><p>${esc(t.home.projectText)}</p></div>${link(url(t.lang,projects.length?'projects':'contact'),projects.length?t.nav.projects:t.ui.contact,'button outline')}</section><section class="faq-section section wrap"><div>${eyebrow(t.nav.faq)}<h2>${esc(t.home.faqTitle)}</h2>${link(url(t.lang,'faq'),t.ui.allFaq)}</div>${faqs(t,[0,1,2,7].map(i=>t.faq.items[i]))}</section>${cta(t)}`;
 case 'about': return heading(t,t.about.title,t.about.intro)+`<section class="about-layout section wrap">${photo(t,true)}<div>${eyebrow(t.about.activityTitle)}<h2>${esc(t.about.topicsTitle)}</h2><p>${esc(t.about.activityText)}</p><ul class="check-list">${t.about.topics.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></section><section class="about-prepare wrap"><h2>${esc(t.about.prepareTitle)}</h2><p class="lead">${esc(t.about.prepareText)}</p><address>${esc(c.address[t.lang])}</address><div class="hero-actions">${link(url(t.lang,'quote'),t.ui.quote,'button yellow')}${phoneAction(t)}</div></section>${audience(t)}${cta(t)}`;
 case 'services': return heading(t,t.services.title,t.services.intro)+`<div class="service-details wrap">${t.services.items.map((s,i)=>`<article id="${s.id}" class="service-detail"><div><span class="icon-tile">${icon(s.id)}</span>${eyebrow('0'+(i+1))}<h2>${esc(s.title)}</h2><h3>${esc(s.tagline)}</h3><p class="lead">${esc(s.text)}</p>${link(url(t.lang,'quote')+'?need='+s.id,s.cta,'button yellow')}</div><div class="service-explanation">${s.id==='pumping'?pumpingPhoto(t):''}<h3>${esc(s.pointsTitle)}</h3><ul>${s.points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>${esc(s.benefit)}</p><ol>${s.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><p class="help">${esc(s.note)}</p></div></article>`).join('')}</div>${cta(t)}`;
 case 'projects': return heading(t,t.projects.title,t.projects.intro)+`<section class="section wrap">${gallery(t)}</section>`+cta(t);
 case 'quote': return heading(t,t.quote.title,t.quote.intro)+`<section class="form-layout wrap"><aside class="form-aside">${icon('study')}<h2>${esc(t.home.ctaTitle)}</h2><p>${esc(t.home.ctaText)}</p><a class="phone-number" href="${c.phoneLink}"><bdi dir="ltr">${c.phoneDisplay}</bdi></a>${link(wa(t,'quote'),t.ui.whatsapp,'text-link','rel="noopener noreferrer"')}${emailAction(t)}</aside>${requestForm(t,true)}</section>`;
 case 'contact': return heading(t,t.contact.title,t.contact.intro)+`<section class="contact-layout wrap">${mapBlock(t)}<div class="contact-lower"><div><h2 class="form-heading">${esc(t.contact.formTitle)}</h2>${requestForm(t,false)}</div><div class="contact-details"><article>${icon('email')}<h2>${esc(t.contact.emailTitle)}</h2>${emailAction(t)}</article><article>${icon('phone')}<h2>${esc(t.contact.phoneTitle)}</h2><a class="phone-number" href="${c.phoneLink}"><bdi dir="ltr">${c.phoneDisplay}</bdi></a>${link(c.phoneLink,t.ui.call)}</article><article>${icon('chat')}<h2>${esc(t.contact.waTitle)}</h2><p>${esc(t.contact.waText)}</p>${link(wa(t),t.ui.whatsapp,'text-link','rel="noopener noreferrer"')}</article><article>${icon('facebook')}<h2>${esc(t.contact.socialTitle)}</h2>${link(c.facebook,t.ui.facebook,'text-link','rel="noopener noreferrer"')}</article></div></div></section>`;
 case 'faq': return heading(t,t.faq.title,t.faq.intro)+`<section class="section wrap narrow">${faqs(t)}</section>`+cta(t);
 case 'privacy': return heading(t,t.privacy.title,t.privacy.intro)+`<div class="prose wrap narrow">${t.privacy.sections.filter(s=>!s.internal).map(s=>`<section><h2>${esc(s.title)}</h2><p>${esc(s.text.replace('{companyEmail}',c.email))}</p></section>`).join('')}${site.email.enabled?`<section><h2>EmailJS</h2><p>${esc(t.privacy.emailText)}</p></section>`:''}${mapEnabled?`<section><h2>Google Maps</h2><p>${esc(t.privacy.mapText)}</p></section>`:''}${link('https://www.whatsapp.com/legal/privacy-policy',t.privacy.externalPolicy,'text-link','rel="noopener noreferrer"')}</div>`;
 default: return heading(t,t.notFound.title,t.notFound.text)+`<div class="wrap not-found"><span aria-hidden="true">404</span><div class="hero-actions">${link(url(t.lang),t.notFound.home,'button yellow')}${link(url(t.lang,'contact'),t.notFound.contact)}</div></div>`;
 }
}
function languageLink(t,p,cls) {
 const other=t.lang==='fr'?'ar':'fr';
 return `<a class="${cls}" href="${url(other,p)}" lang="${other}" dir="ltr" aria-label="${esc(t.ui.language)}"><span lang="fr" ${t.lang==='fr'?'aria-current="true"':''}>FR</span><span aria-hidden="true">/</span><span lang="ar" dir="rtl" ${t.lang==='ar'?'aria-current="true"':''}>العربية</span></a>`;
}
function companyPanel(t) {
 return `<aside class="company-panel" aria-label="${esc(t.shell.company)}"><div class="company-overview"><a class="company-logo" href="${url(t.lang)}" aria-label="${c.name} — ${esc(t.nav.home)}">${logo}</a><div class="company-identity"><p class="company-badge">${esc(t.shell.badge)}</p><p class="company-slogan">${esc(c.slogan[t.lang])}</p></div></div><button type="button" class="contacts-toggle" id="contacts-toggle" aria-expanded="false" aria-controls="company-contacts"><span>${esc(t.shell.showContacts)}</span>${icon('chevron')}</button><div id="company-contacts" class="company-contacts"><div class="contact-row"><span class="contact-icon">${icon('phone')}</span><div><p class="contact-label">${esc(t.ui.phone)}</p><a href="${c.phoneLink}"><bdi dir="ltr">${c.phoneDisplay}</bdi></a></div></div><div class="contact-row"><span class="contact-icon">${icon('chat')}</span><div><p class="contact-label">WhatsApp</p><a href="${c.whatsapp}" rel="noopener noreferrer"><bdi dir="ltr">${c.phoneDisplay}</bdi></a></div></div><div class="contact-row"><span class="contact-icon">${icon('email')}</span><div><p class="contact-label">${esc(t.ui.email)}</p>${emailAction(t,'company-email')}</div></div><div class="contact-row"><span class="contact-icon">${icon('pin')}</span><div><p class="contact-label">${esc(t.ui.address)}</p><address>${esc(c.address[t.lang])}</address></div></div><div class="company-social"><a href="${c.facebook}" rel="noopener noreferrer">${icon('facebook')}<span>${esc(t.ui.facebook)}</span></a></div></div></aside>`;
}
function siteFooter(t,nav,p) {
 return `<footer><div class="footer-grid wrap"><div><a class="brand" href="${url(t.lang)}" aria-label="${c.name}">${brand(t)}</a><p>${esc(t.ui.footerText)}</p><p class="footer-slogan">${esc(c.slogan[t.lang])}</p></div><div id="footer-nav"><h2>${esc(t.ui.navigation)}</h2>${nav.concat('quote').map(n=>`<a href="${url(t.lang,n)}">${esc(t.nav[n])}</a>`).join('')}${languageLink(t,p,'footer-language')}</div><div><h2>${esc(t.ui.contact)}</h2><address>${esc(c.address[t.lang])}</address><a href="${c.phoneLink}"><bdi dir="ltr">${c.phoneInternational}</bdi></a>${emailAction(t,'footer-email')}<a href="${wa(t)}" rel="noopener noreferrer">WhatsApp</a><a href="${c.facebook}" rel="noopener noreferrer">${esc(t.ui.facebook)}</a></div></div><div class="footer-bottom wrap"><span>© ${new Date().getUTCFullYear()} ${c.name}. ${esc(t.ui.rights)}</span><a href="${url(t.lang,'privacy')}">${esc(t.nav.privacy)}</a></div></footer>`;
}
function mobileNavigation(t,p) {
 const moreActive=['about','projects','faq','privacy','notFound'].includes(p);
 return `<nav class="bottom-nav" aria-label="${esc(t.ui.navigation)}">${[['home','house'],['services','installation'],['quote','study'],['contact','chat']].map(([n,i])=>`<a href="${url(t.lang,n)}" ${p===n?'aria-current="page"':''}>${icon(i)}<span>${esc(n==='quote'?t.shell.quote:t.nav[n])}</span></a>`).join('')}<button type="button" id="menu-toggle" class="more-toggle ${moreActive?'is-current':''}" aria-controls="more-panel" aria-expanded="false" aria-haspopup="dialog" aria-label="${esc(moreActive?t.shell.moreCurrent:t.shell.more)}">${icon('more')}<span>${esc(t.shell.more)}</span></button><a class="more-fallback" href="#footer-nav">${icon('more')}<span>${esc(t.shell.more)}</span></a></nav><dialog id="more-panel" aria-labelledby="more-title"><div class="more-heading"><h2 id="more-title">${esc(t.shell.more)}</h2><button class="button outline" type="button" data-close-more autofocus aria-label="${esc(t.shell.closeMore)}">${esc(t.ui.close)}</button></div><div class="more-body"><nav aria-label="${esc(t.shell.more)}">${['about','projects','faq','privacy'].map(n=>`<a href="${url(t.lang,n)}" ${p===n?'aria-current="page"':''}><span>${esc(t.nav[n])}</span>${arrow}</a>`).join('')}</nav><div class="more-language-row"><span>${esc(t.ui.language)}</span>${languageLink(t,p,'more-language')}</div></div></dialog>`;
}

function document(t,p) {
 const is404=p==='notFound', other=t.lang==='fr'?'ar':'fr', canonical=site.productionUrl+url(t.lang,p);
 const nav=['home','about','services','projects','faq','contact'];
 const schema={'@context':'https://schema.org','@type':'LocalBusiness',name:c.name,email:c.email,telephone:c.phoneInternational,hasOfferCatalog:{'@type':'OfferCatalog',name:t.nav.services,itemListElement:t.services.items.map(s=>({'@type':'Offer',itemOffered:{'@type':'Service',name:s.title,description:s.text}}))},address:{'@type':'PostalAddress',streetAddress:'Rue Youssef Temimi',addressLocality:'Msaken',postalCode:'4070',addressCountry:'TN'},...(site.productionUrl?{url:site.productionUrl+url(t.lang)}:{})};
 const alternates=!is404?['fr','ar','x-default'].map(l=>`<link rel="alternate" hreflang="${l}" href="${site.productionUrl+url(l==='x-default'?'fr':l,p)}">`).join(''):'';
 return `<!doctype html><html lang="${t.lang}" dir="${t.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${esc(t.meta[p][0])}</title><meta name="description" content="${esc(t.meta[p][1])}"><meta name="theme-color" content="#f3f7fa"><meta name="robots" content="${site.productionUrl&&!is404?'index, follow':'noindex, nofollow'}">${site.productionUrl&&!is404?`<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.productionUrl+asset('images/solar-1536.webp')}">`:''}${alternates}<meta property="og:title" content="${esc(t.meta[p][0])}"><meta property="og:description" content="${esc(t.meta[p][1])}"><meta property="og:type" content="website"><meta property="og:locale" content="${t.locale.replace('-','_')}"><meta property="og:site_name" content="${c.name}"><link rel="icon" type="image/png" sizes="128x128" href="${asset('favicon-officiel.png')}"><link rel="stylesheet" href="${asset('styles.css')}"><script type="module" src="${asset('js/main.mjs')}"></script><script type="application/ld+json">${json(schema)}</script></head><body><a class="skip-link" href="#main">${esc(t.ui.skip)}</a><div class="site-layout">${companyPanel(t)}<div class="main-panel"><header class="site-header"><nav id="site-nav" aria-label="${esc(t.ui.navigation)}">${nav.concat('quote').map(n=>`<a href="${url(t.lang,n)}" ${p===n?'aria-current="page"':''}>${esc(n==='quote'?t.shell.quote:t.nav[n])}</a>`).join('')}${languageLink(t,p,'language')}</nav></header><main id="main" tabindex="-1">${page(t,p)}</main>${siteFooter(t,nav,p)}</div></div>${mobileNavigation(t,p)}<script id="page-config" type="application/json">${json({lang:t.lang,ui:{menu:t.ui.menu,close:t.ui.close,showContacts:t.shell.showContacts,hideContacts:t.shell.hideContacts},form:t.form,whatsapp:c.whatsapp,maxLength:site.whatsappMaxUrlLength,mailtoMaxLength:site.mailtoMaxUrlLength,recipient:c.email,email:site.email})}</script></body></html>`;
}
await mkdir(dist,{recursive:true});
await mkdir(path.join(dist,'assets'),{recursive:true});
await cp(path.join(root,'assets/js'),path.join(dist,'assets/js'),{recursive:true});
await cp(path.join(root,'assets/fonts'),path.join(dist,'assets/fonts'),{recursive:true});
for(const file of ['styles.css','favicon-officiel.png','images/logo-officiel-160.webp','images/logo-officiel-320.webp','images/pumping-768.webp','images/pumping-1536.webp',...illustrations.flatMap(v=>[768,1536].map(w=>'images/'+v.image+'-'+w+'.webp'))]) {
 const target=path.join(dist,'assets',file); await mkdir(path.dirname(target),{recursive:true}); await cp(path.join(root,'assets',file),target);
}
for(const project of projects) {
 if(!/^[a-z0-9-]+$/.test(project.id)||!/^[a-z0-9-]+$/.test(project.category)||!project.source||!project.permission||!project.width||!project.height) throw Error('Projet incomplet ou droits manquants.');
 if(project.image.includes('..')||path.isAbsolute(project.image)) throw Error('Image projet invalide.');
 await access(path.join(root,'assets',project.image)); await mkdir(path.dirname(path.join(dist,'assets',project.image)),{recursive:true}); await cp(path.join(root,'assets',project.image),path.join(dist,'assets',project.image));
}
for(const t of [fr,ar]) for(const p of pages) {const dir=path.join(dist,t.lang,slugs[p]);await mkdir(dir,{recursive:true});await writeFile(path.join(dir,'index.html'),document(t,p));}
await writeFile(path.join(dist,'index.html'),document(fr,'home'));
await writeFile(path.join(dist,'404.html'),document(fr,'notFound'));
await writeFile(path.join(dist,'robots.txt'),site.productionUrl?`User-agent: *\nAllow: /\nSitemap: ${site.productionUrl+site.basePath}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
// Le sitemap est toujours présent ; sans domaine il ne contient aucune URL fictive.
await writeFile(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${site.productionUrl?[fr,ar].flatMap(t=>pages.filter(p=>p!=='notFound').map(p=>`<url><loc>${site.productionUrl+url(t.lang,p)}</loc>${['fr','ar'].map(l=>`<xhtml:link rel="alternate" hreflang="${l}" href="${site.productionUrl+url(l,p)}"/>`).join('')}</url>`)).join(''):''}</urlset>`);
const hashes=new Set();
async function hashScripts(dir) { for(const entry of await readdir(dir,{withFileTypes:true})) {const f=path.join(dir,entry.name);if(entry.isDirectory())await hashScripts(f);else if(f.endsWith('.html'))for(const match of (await readFile(f,'utf8')).matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))if(match[1])hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`); } }
await hashScripts(dist);
const csp=`default-src 'self'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self'; img-src 'self'; font-src 'self'; connect-src ${site.email.enabled?'https://api.emailjs.com':"'none'"}; frame-src ${mapEnabled?'https://www.google.com':"'none'"}; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`;
await writeFile(path.join(dist,'_headers'),`/*\n  Content-Security-Policy: ${csp}\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`);
console.log('Build : 20 pages HTML, FR/AR ; '+(site.productionUrl?'origine de production configurée':'préproduction noindex')+' ; EmailJS '+(site.email.enabled?'configuré':'désactivé')+' ; carte '+(mapEnabled?(map.verified?'emplacement vérifié':'vue générale de Msaken, emplacement exact à confirmer'):'désactivée'));
