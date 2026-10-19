import { createEmailAdapter } from './email-adapter.mjs';
import { prepareContactLinks } from './message-channels.mjs';

export function initRequestForm(config, adapter = createEmailAdapter(config.email)) {
  const form = document.querySelector('[data-request-form]');
  if (!form) return;
  const t = config.form;
  const status = document.getElementById('form-status');
  const review = document.getElementById('message-review');
  const need = form.elements.namedItem('need') || form.elements.namedItem('subject');
  const sizing = document.getElementById('sizing');
  const maintenance = document.getElementById('maintenance-fields');
  const pumping = document.getElementById('pumping-fields');
  const descLabel = document.getElementById('description-label');
  const descHelp = document.getElementById('description-help');
  const buttons = [...form.querySelectorAll('[type=submit]')];
  const emailEnabled = adapter.configured(form.dataset.kind);
  let busy = false;
  let message = '';
  let invalidFields = [];
  const field = name => form.elements.namedItem(name);
  const setStatus = (text, state = '') => { status.textContent = text; status.dataset.state = state; };
  for (const button of buttons) button.disabled = false;
  function adaptNeed() {
    const active = need?.value === 'maintenance', pump = need?.value === 'pumping';
    for (const [group, enabled] of [[sizing, !active && !pump], [maintenance, active], [pumping, pump]]) {
      if (!group) continue;
      group.hidden = !enabled;
      for (const element of group.elements) element.disabled = !enabled;
    }
    const details = document.getElementById('pump-details-field');
    if (details) {
      const show = pump && field('existingPump').value !== 'no';
      details.hidden = !show;
      field('pumpDetails').disabled = !show;
    }
    descLabel.textContent = (pump ? t.pumpingDescription : active ? t.maintenanceDescription : t.description) + ' *';
    descHelp.textContent = pump ? t.pumpingHelp : active ? t.maintenanceHelp : '';
  }
  if (need) {
    const preset = new URLSearchParams(location.search).get('need');
    if (['installation', 'study', 'maintenance', 'pumping'].includes(preset)) need.value = preset;
    need.addEventListener('change', adaptNeed);
    adaptNeed();
  }
  field('existingPump')?.addEventListener('change', adaptNeed);
  const normalizeDigits = value => value.replace(/[٠-٩۰-۹]/g, x => String('٠١٢٣٤٥٦٧٨٩'.includes(x) ? '٠١٢٣٤٥٦٧٨٩'.indexOf(x) : '۰۱۲۳۴۵۶۷۸۹'.indexOf(x)));
  function errorFor(el) {
    if (el.disabled || el.name === 'website') return '';
    if (el.required && !el.value.trim()) return t.requiredError;
    if (el.name === 'phone' && el.value) {
      const value = normalizeDigits(el.value.trim());
      if (!/^\+?[\d\s().-]+$/.test(value) || value.replace(/\D/g, '').length < 8 || value.replace(/\D/g, '').length > 15) return t.phoneError;
    }
    if (el.type === 'email' && el.value && el.validity.typeMismatch) return t.emailError;
    if (el.type === 'number' && (el.validity.badInput || el.value && (!Number.isFinite(Number(el.value)) || Number(el.value) <= 0))) return t.numberError;
    if (el.validity.tooLong) return t.lengthError;
    return '';
  }
  function validate() {
    const invalid = [];
    for (const el of form.querySelectorAll('input,select,textarea')) {
      const error = errorFor(el);
      const target = document.getElementById(el.name + '-error');
      if (target) target.textContent = error;
      el.setAttribute('aria-invalid', String(Boolean(error)));
      if (error) invalid.push(el);
    }
    const summary = document.getElementById('form-errors');
    summary.hidden = invalid.length === 0;
    summary.textContent = invalid.length ? t.invalid : '';
    invalidFields = invalid;
    return invalid;
  }
  form.addEventListener('input', event => { if (invalidFields.includes(event.target)) validate(); });
  form.addEventListener('change', () => { if (invalidFields.length) validate(); });
  function buildMessage() {
    const values = new FormData(form);
    const lines = [t.messageHeader, form.dataset.kind === 'quote' ? t.quoteMessage : t.contactMessage, ''];
    for (const [name, raw] of values) {
      if (name === 'website' || name === 'waterUnit' || !String(raw).trim() || name === 'period' && !values.get('consumption')) continue;
      const el = field(name);
      const label = name === 'description' ? descLabel.textContent.replace(/\s*\*$/, '') : t[name] || name;
      let value = el.tagName === 'SELECT' ? el.selectedOptions[0].textContent : String(raw).trim();
      if (name === 'phone') value = normalizeDigits(value);
      if (name === 'consumption') value += ' kWh';
      if (name === 'power') value += ' kWc';
      if (name === 'waterNeed') value += ' ' + t[values.get('waterUnit')];
      if (name === 'pumpingHead') value += ' ' + t.meters;
      lines.push(label + ' : ' + value);
    }
    return lines.join('\n');
  }
  function renderMessage(text) {
    const target = document.getElementById('message-text');
    target.replaceChildren();
    text.split('\n').forEach((line, index) => {
      if (index) target.append(document.createTextNode('\n'));
      const label = [t.phone,t.email].find(value => line.startsWith(value + ' : '));
      if (!label) { target.append(document.createTextNode(line)); return; }
      const prefix = label + ' : ';
      const value = document.createElement('bdi');
      value.dir = 'ltr'; value.textContent = line.slice(prefix.length);
      target.append(document.createTextNode(prefix),value);
    });
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const errors = validate();
    if (errors.length) { errors[0].focus(); return; }
    if (field('website').value) { setStatus(t.sendError, 'error'); return; }
    message = buildMessage();
    const channel = event.submitter?.value || 'mailto';
    if (channel === 'whatsapp' || channel === 'mailto') {
      const service = need?.selectedOptions[0]?.textContent || '';
      const subject = (form.dataset.kind === 'quote' ? t.mailSubjectQuote : t.mailSubjectContact) + (service ? ' — ' + service : '');
      const links = prepareContactLinks({recipient:config.recipient,subject,message,whatsapp:config.whatsapp,mailMaxLength:config.mailtoMaxLength,waMaxLength:config.maxLength});
      renderMessage(message);
      document.getElementById('message-subject').textContent = subject;
      const continuation = document.getElementById('whatsapp-continue');
      continuation.href = links.whatsapp;
      continuation.querySelector('.link-label').textContent = links.waLong ? t.open : t.continue;
      const emailContinuation = document.getElementById('email-continue');
      emailContinuation.href = links.mailto;
      emailContinuation.querySelector('.link-label').textContent = links.mailLong ? t.mailtoOpen : t.mailtoSubmit;
      document.getElementById('long-email').hidden = !links.mailLong;
      document.getElementById('long-message').hidden = !links.waLong;
      document.getElementById('review-help').textContent = channel === 'mailto' ? t.mailPrepared : t.reviewHelp;
      document.getElementById('copy-status').textContent = '';
      document.getElementById('recipient-copy-status').textContent = '';
      document.getElementById('review-status').textContent = '';
      setStatus('');
      form.hidden = true;
      review.hidden = false;
      review.focus({preventScroll:true});
      review.scrollIntoView({block:'start',behavior:'instant'});
      return;
    }
    if (!emailEnabled) { setStatus(t.unconfigured, 'error'); return; }
    busy = true;
    form.setAttribute('aria-busy', 'true');
    buttons.forEach(button => { button.disabled = true; });
    setStatus(t.sending, 'loading');
    try {
      await adapter.send({ kind: form.dataset.kind, lang: config.lang, name: field('name').value, phone: normalizeDigits(field('phone').value), email: field('email').value, subject: field('subject')?.value || field('need')?.value || '', message });
      form.reset();
      if (need) adaptNeed();
      setStatus(t.accepted, 'success');
    } catch {
      setStatus(t.sendError, 'error');
    } finally {
      busy = false;
      form.removeAttribute('aria-busy');
      buttons.forEach(button => { button.disabled = false; });
    }
  });
  document.getElementById('edit-message').addEventListener('click', () => { review.hidden = true; form.hidden = false; field('name').focus(); });
  document.getElementById('email-continue').addEventListener('click', () => {
    document.getElementById('review-status').textContent = t.mailPrepared;
  });
  async function copyText(text, element, target, success, error) {
    try { await navigator.clipboard.writeText(text); target.textContent = success; }
    catch {
      target.textContent = error;
      const range = document.createRange(); range.selectNodeContents(element);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    }
  }
  document.getElementById('copy-message').addEventListener('click', () => copyText(message, document.getElementById('message-text'), document.getElementById('copy-status'), t.copied, t.copyError));
  document.getElementById('copy-recipient').addEventListener('click', () => copyText(config.recipient, document.getElementById('review-recipient'), document.getElementById('recipient-copy-status'), t.recipientCopied, t.recipientCopyError));
}
