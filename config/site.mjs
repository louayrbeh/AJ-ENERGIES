// Configuration publique de build. Aucun fichier .env n'est lu automatiquement.
export const site = {
  productionUrl: process.env.SITE_URL || '',
  basePath: process.env.BASE_PATH || '',
  whatsappMaxUrlLength: 1900,
  mailtoMaxUrlLength: 1900,
  email: {
    enabled: process.env.EMAILJS_ENABLED === 'true',
    publicKey: process.env.EMAILJS_PUBLIC_KEY || '',
    serviceId: process.env.EMAILJS_SERVICE_ID || '',
    contactTemplateId: process.env.EMAILJS_CONTACT_TEMPLATE_ID || '',
    quoteTemplateId: process.env.EMAILJS_QUOTE_TEMPLATE_ID || '',
  },
};
