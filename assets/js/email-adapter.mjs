const ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';

export function isEmailConfigured(config, kind = 'contact') {
  const template = kind === 'quote' ? config?.quoteTemplateId : config?.contactTemplateId;
  return config?.enabled === true && [config.publicKey, config.serviceId, template]
    .every(value => typeof value === 'string' && value.trim().length > 0);
}

export class EmailError extends Error {
  constructor(code) { super(code); this.name = 'EmailError'; this.code = code; }
}

// Adaptateur navigateur REST officiel EmailJS : aucune clé privée, aucun destinataire visiteur.
// fetchImpl est injectable uniquement dans les tests locaux, sans requête réelle.
export function createEmailAdapter(config, { fetchImpl = globalThis.fetch, timeoutMs = 15000, cooldownMs = 10000, now = Date.now } = {}) {
  let pending = false;
  let lastAttempt = -Infinity;
  return {
    configured: kind => isEmailConfigured(config, kind),
    async send({ kind, lang, name, phone, email = '', subject = '', message }) {
      if (!isEmailConfigured(config, kind)) throw new EmailError('unconfigured');
      if (pending) throw new EmailError('busy');
      if (now() - lastAttempt < cooldownMs) throw new EmailError('rate');
      if (![name, phone, message].every(x => typeof x === 'string' && x.trim())) throw new EmailError('invalid');
      if (message.length > 14000 || name.length > 100 || phone.length > 30 || email.length > 150) throw new EmailError('invalid');
      pending = true;
      lastAttempt = now();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetchImpl(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'omit',
          signal: controller.signal,
          body: JSON.stringify({
            service_id: config.serviceId,
            template_id: kind === 'quote' ? config.quoteTemplateId : config.contactTemplateId,
            user_id: config.publicKey,
            template_params: {
              from_name: name.trim(), visitor_phone: phone.trim(), visitor_email: email.trim(),
              request_kind: kind, language: lang, subject, request_body: message,
            },
          }),
        });
        if (response.status !== 200) throw new EmailError(response.status === 429 ? 'rate' : 'rejected');
        return { accepted: true };
      } catch (error) {
        if (error instanceof EmailError) throw error;
        throw new EmailError(error?.name === 'AbortError' ? 'timeout' : 'network');
      } finally {
        clearTimeout(timer);
        pending = false;
      }
    },
  };
}
