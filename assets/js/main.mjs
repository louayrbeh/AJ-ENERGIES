import { initRequestForm } from './request-form.mjs';

const config = JSON.parse(document.getElementById('page-config').textContent);
document.documentElement.classList.add('js');
const menu = document.getElementById('menu-toggle');
const more = document.getElementById('more-panel');
const contacts = document.getElementById('company-contacts');
const contactsToggle = document.getElementById('contacts-toggle');
const companyPanel = document.querySelector('.company-panel');
const bottomNav = document.querySelector('.bottom-nav');
const wide = matchMedia('(min-width: 1250px)');
const topNavigation = matchMedia('(min-width: 1024px)');
let contactsAnimation, animationTarget;
let contactsOpen = false;
function updateContacts(animate = false) {
  const expanded = wide.matches || contactsOpen;
  if (!expanded && contacts.contains(document.activeElement)) contactsToggle.focus();
  contactsToggle.setAttribute('aria-expanded', String(expanded));
  contactsToggle.setAttribute('aria-label', expanded ? config.ui.hideContacts : config.ui.showContacts);
  contactsToggle.querySelector('span').textContent = expanded ? config.ui.hideContacts : config.ui.showContacts;
  if (!animate && contactsAnimation && animationTarget === expanded) return;
  const before = contacts.hidden ? 0 : contacts.getBoundingClientRect().height;
  const wasHidden = contacts.hidden;
  contactsAnimation?.cancel(); contactsAnimation = null;
  contacts.classList.remove('is-animating');
  contacts.inert = !expanded;
  if (!animate || wide.matches || matchMedia('(prefers-reduced-motion: reduce)').matches) { contacts.hidden = !expanded; return; }
  contacts.hidden = false;
  const fullHeight = contacts.getBoundingClientRect().height;
  animationTarget = expanded;
  contacts.classList.add('is-animating');
  const motion = contacts.animate([{height:before+'px',opacity:wasHidden?0:1},{height:(expanded?fullHeight:0)+'px',opacity:expanded?1:0}],{duration:500,easing:'ease-in-out'});
  contactsAnimation = motion;
  motion.onfinish = () => {
    if (contactsAnimation !== motion) return;
    contacts.hidden = !expanded;
    contacts.classList.remove('is-animating');
    contactsAnimation = null; motion.cancel(); updateLayout();
  };
}
contactsToggle.addEventListener('click', () => { contactsOpen = !contactsOpen; updateContacts(true); });
menu.addEventListener('click', () => {
  more.showModal();
  menu.setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('more-open');
});
function restoreMoreTrigger() {
  menu.setAttribute('aria-expanded', 'false');
  document.documentElement.classList.remove('more-open');
  (topNavigation.matches ? document.querySelector('#site-nav [aria-current="page"]') || document.getElementById('main') : menu).focus();
}
function closeMore() {
  more.close();
  restoreMoreTrigger();
}
more.querySelector('[data-close-more]').addEventListener('click', closeMore);
more.addEventListener('cancel', event => { event.preventDefault(); closeMore(); });
// Compléter le dialogue natif : certains moteurs passent par body au bouclage.
more.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const focusable = [...more.querySelectorAll('a[href],button:not(:disabled),[tabindex="0"]')].filter(el => el.getClientRects().length);
  const first = focusable[0], last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
more.addEventListener('click', event => {
  const r = more.getBoundingClientRect();
  if (event.target === more && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) closeMore();
});
more.addEventListener('close', () => {
  if (!more.open) restoreMoreTrigger();
});
const navMeasure = document.createElement('canvas').getContext('2d');
function updateLayout() {
  updateContacts();
  if (topNavigation.matches && more.open) closeMore();
  // Réserver seulement l'espace réellement nécessaire, sans éloigner l'identité.
  const reserve = parseFloat(companyPanel.style.getPropertyValue('--contacts-tab-reserve')) || 0;
  const tab = contactsToggle.getBoundingClientRect();
  let needed = 0;
  if (!wide.matches && tab.height) {
    for (const element of companyPanel.querySelectorAll('.company-logo,.company-name,.company-badge,.company-slogan')) {
      const range = document.createRange(); range.selectNodeContents(element);
      const rects = element.classList.contains('company-logo') ? [element.getBoundingClientRect()] : [...range.getClientRects()];
      for (const rect of rects) {
        const top = rect.top - reserve, bottom = rect.bottom - reserve;
        if (rect.left < tab.right + 5 && rect.right > tab.left - 5 && top < tab.bottom + 5 && bottom > tab.top) needed = Math.max(needed, tab.bottom + 8 - top);
      }
    }
  }
  companyPanel.style.setProperty('--contacts-tab-reserve', Math.ceil(needed) + 'px');
  // À texte agrandi, les cinq destinations restent lisibles sur plusieurs rangées.
  if (!topNavigation.matches && navMeasure) {
    const labels = [...bottomNav.querySelectorAll('a:not(.more-fallback)>span,button>span')];
    const items = labels.map(label => { navMeasure.font = getComputedStyle(label).font; return Math.max(44,Math.ceil(navMeasure.measureText(label.textContent).width)+14); });
    const style = getComputedStyle(bottomNav), gap = parseFloat(style.columnGap) || 0;
    const available = bottomNav.clientWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd);
    bottomNav.classList.toggle('is-wrapped', items.reduce((a,b)=>a+b,0) + gap*(items.length-1) > available);
    bottomNav.style.setProperty('--bottom-nav-columns', Math.min(5, Math.max(1, Math.floor((available+gap)/(Math.max(...items)+gap)))));
  }
  const height = Math.ceil(bottomNav.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--bottom-nav-height', height + 'px');
  companyPanel.classList.toggle('is-sticky', wide.matches && companyPanel.getBoundingClientRect().height <= innerHeight - 120);
  document.querySelector('.site-header').dataset.layoutReady = 'true';
}
const layoutObserver = new ResizeObserver(updateLayout);
layoutObserver.observe(companyPanel);
layoutObserver.observe(contactsToggle);
layoutObserver.observe(bottomNav);
window.addEventListener('resize', updateLayout);
wide.addEventListener('change', updateLayout);
topNavigation.addEventListener('change', updateLayout);
document.fonts.ready.then(updateLayout);
updateLayout();
initRequestForm(config);

// Galerie : tous les contenus restent visibles sans JavaScript.
const filters = [...document.querySelectorAll('[data-project-filter]')];
for (const filter of filters) filter.addEventListener('click', () => {
  for (const button of filters) button.setAttribute('aria-pressed', String(button === filter));
  for (const card of document.querySelectorAll('[data-project-category]')) card.hidden = filter.dataset.projectFilter !== 'all' && card.dataset.projectCategory !== filter.dataset.projectFilter;
});
const dialog = document.getElementById('image-dialog');
if (dialog) {
  let trigger;
  for (const button of document.querySelectorAll('[data-enlarge]')) button.addEventListener('click', () => {
    const original = button.querySelector('img'); const image = dialog.querySelector('img');
    trigger = button; image.src = original.src; image.alt = original.alt;
    dialog.querySelector('figcaption').textContent = button.dataset.caption;
    dialog.showModal();
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger?.focus());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
