// Contenus confirmés par le propriétaire : contact officiel et pompage solaire.
const additions = {
 fr: {
  ui:{email:'E-mail',emailAction:'Nous contacter par e-mail'},
  contact:{emailTitle:'Écrivez-nous par e-mail'},
  form:{
   mailtoSubmit:'Continuer par e-mail',whatsappSubmit:'Continuer sur WhatsApp',
   mailtoHelp:'Votre application de messagerie va s’ouvrir avec le message préparé. Vérifiez-le, puis appuyez sur Envoyer.',
   mailPrepared:'Message préparé. L’envoi reste à effectuer dans votre application de messagerie.',
   mailSubjectQuote:'Demande de devis — AJ ENERGIES',mailSubjectContact:'Demande de contact — AJ ENERGIES',
   mailtoLong:'Le message est trop long pour être inclus dans le lien. Copiez-le, ouvrez l’e-mail avec le destinataire et l’objet préparés, puis collez le contenu avant de l’envoyer.',
   mailtoOpen:'Ouvrir ma messagerie',mailSubjectLabel:'Objet',recipient:'Destinataire',copyRecipient:'Copier l’adresse e-mail',recipientCopied:'Adresse e-mail copiée.',recipientCopyError:'La copie automatique est indisponible. Sélectionnez et copiez l’adresse e-mail affichée.',
   pumping:'Pompage solaire',pumpingInfo:'Votre projet de pompage solaire — informations facultatives',
   waterUse:'Usage de l’eau',irrigation:'Irrigation',watering:'Abreuvement',
   waterSource:'Source d’eau',well:'Puits',borehole:'Forage',tank:'Réservoir',
   waterNeed:'Besoin approximatif en eau',waterUnit:'Unité du besoin en eau',m3day:'m³/jour',m3hour:'m³/h',
   pumpingHead:'Hauteur de relevage estimée',meters:'m',
   pumpingHeadHelp:'Indication en mètres, si connue. La profondeur du forage n’est pas la hauteur manométrique totale. Ce formulaire ne calcule pas le dimensionnement.',
   existingPump:'Pompe existante',yes:'Oui',no:'Non',unknown:'Inconnu',
   pumpDetails:'Caractéristiques de la pompe existante',pumpDetailsPlaceholder:'Indiquez les caractéristiques connues, sans obligation.',
   pumpingDescription:'Décrivez votre projet de pompage solaire',pumpingHelp:'Ces informations techniques sont facultatives. Vous pouvez demander une étude même si les valeurs restent à déterminer.',
   pumpingCaption:'Illustration d’un système de pompage solaire.',pumpingAlt:'Illustration d’un ensemble de panneaux photovoltaïques associé à une installation de pompage et un réservoir d’eau en environnement agricole'
  },
  service:{id:'pumping',title:'Installation de pompage solaire',tagline:'Une solution à étudier selon les besoins en eau du site',
   text:'AJ ENERGIES réalise des installations de pompage solaire photovoltaïque. Présentez votre besoin en eau et les caractéristiques de votre site pour préparer l’étude d’une solution adaptée.',
   note:'Le dimensionnement dépend notamment du volume d’eau recherché, de la hauteur de relevage, de la ressource en eau et des équipements existants. Ces éléments sont à préciser pour chaque projet.',
   benefit:'Une installation photovoltaïque pour alimenter un système de pompage, selon les besoins en eau et les caractéristiques du site.',
   pointsTitle:'Informations utiles',points:['Localisation du projet et usage de l’eau.','Source d’eau disponible.','Besoin en eau et hauteur de relevage, si connus.','Caractéristiques d’une pompe existante, si connues.'],
   steps:['Présenter le besoin en eau et le site.','Rassembler les indications techniques disponibles.','Préparer l’étude avec AJ ENERGIES.'],cta:'Demander une étude de pompage solaire'},
  faq:[{id:'solar-pumping',q:'Proposez-vous l’installation de pompage solaire ?',a:'Oui. AJ ENERGIES réalise des installations de pompage solaire photovoltaïque. Les caractéristiques de la solution sont à définir selon le besoin en eau et les conditions du site.'},
   {id:'pumping-information',q:'Quelles informations fournir pour un projet de pompage solaire ?',a:'Indiquez la localisation, l’usage de l’eau et la source disponible. Si vous les connaissez, précisez le besoin en eau, la hauteur de relevage et les caractéristiques d’une pompe existante. Vous pouvez demander une étude même si ces informations sont encore incomplètes.'}],
  servicesIntro:'AJ ENERGIES propose quatre services complémentaires pour vos projets solaires : l’étude personnalisée, l’installation photovoltaïque, la maintenance avec service après-vente et le pompage solaire.',
  aboutTopic:'Votre projet de pompage solaire photovoltaïque.',
  mailPrivacy:{title:'Messagerie du visiteur',text:'Le formulaire peut préparer un lien mailto vers {companyEmail}, avec un objet et le message affiché dans l’aperçu. Votre application de messagerie s’ouvre uniquement après votre clic. Vous devez vérifier puis envoyer vous-même le message. Le site ne vérifie pas la présence d’une application de messagerie ni la réception de l’e-mail. Si le message est long, vous pouvez le copier et le coller dans votre messagerie. La copie du message ou de l’adresse n’accède au presse-papiers qu’après votre action.'},
  pumpingPrivacy:' Pour un projet de pompage solaire, vous pouvez aussi indiquer l’usage et la source d’eau, un besoin en eau et son unité, une hauteur de relevage estimée et des informations sur une pompe existante. Ces indications techniques sont facultatives.'
 },
 ar: {
  ui:{email:'البريد الإلكتروني',emailAction:'تواصل معنا عبر البريد الإلكتروني'},
  contact:{emailTitle:'راسلنا عبر البريد الإلكتروني'},
  form:{
   mailtoSubmit:'تابع عبر البريد الإلكتروني',whatsappSubmit:'تابع على واتساب',
   mailtoHelp:'سيُفتح تطبيق البريد الإلكتروني مع الرسالة المُعدّة. راجعها، ثم اضغط على إرسال.',
   mailPrepared:'تم إعداد الرسالة. يبقى إرسالها من تطبيق البريد الإلكتروني الخاص بك.',
   mailSubjectQuote:'طلب عرض سعر — AJ ENERGIES',mailSubjectContact:'طلب تواصل — AJ ENERGIES',
   mailtoLong:'الرسالة أطول من أن تُدرج في الرابط. انسخها، ثم افتح البريد مع المستلم والموضوع المُعدّين والصق المحتوى قبل الإرسال.',
   mailtoOpen:'افتح تطبيق البريد',mailSubjectLabel:'الموضوع',recipient:'المستلم',copyRecipient:'انسخ عنوان البريد الإلكتروني',recipientCopied:'تم نسخ عنوان البريد الإلكتروني.',recipientCopyError:'النسخ التلقائي غير متاح. حدّد عنوان البريد الإلكتروني المعروض وانسخه يدويًا.',
   pumping:'ضخّ المياه بالطاقة الشمسية',pumpingInfo:'مشروع ضخّ المياه بالطاقة الشمسية — معلومات اختيارية',
   waterUse:'استخدام المياه',irrigation:'الريّ',watering:'سقي الماشية',
   waterSource:'مصدر المياه',well:'بئر',borehole:'بئر عميقة',tank:'خزّان',
   waterNeed:'الاحتياج التقريبي من المياه',waterUnit:'وحدة الاحتياج من المياه',m3day:'م³/يوم',m3hour:'م³/ساعة',
   pumpingHead:'ارتفاع الرفع التقديري',meters:'م',
   pumpingHeadHelp:'قيمة تقديرية بالمتر إن كانت معروفة. عمق البئر ليس الارتفاع المانومتري الكلي. هذا النموذج لا يحسب أبعاد النظام.',
   existingPump:'هل توجد مضخة؟',yes:'نعم',no:'لا',unknown:'غير معروف',
   pumpDetails:'خصائص المضخة الموجودة',pumpDetailsPlaceholder:'اذكر الخصائص المعروفة إن توفّرت، دون إلزام.',
   pumpingDescription:'صِف مشروع ضخّ المياه بالطاقة الشمسية',pumpingHelp:'هذه المعلومات التقنية اختيارية. يمكنك طلب دراسة حتى إن لم تُحدّد القيم بعد.',
   pumpingCaption:'صورة توضيحية لنظام ضخّ مياه بالطاقة الشمسية.',pumpingAlt:'صورة توضيحية لألواح كهروضوئية مرتبطة بنظام ضخّ وخزّان مياه في بيئة زراعية'
  },
  service:{id:'pumping',title:'تركيب أنظمة ضخّ المياه بالطاقة الشمسية',tagline:'حلّ تُدرس خصائصه بحسب احتياجات الموقع من المياه',
   text:'تنجز AJ ENERGIES تركيبات لضخّ المياه بالطاقة الشمسية الكهروضوئية. اعرض احتياجاتك من المياه وخصائص موقعك لإعداد دراسة لحلّ مناسب.',
   note:'يعتمد تحديد أبعاد النظام خصوصًا على كمية المياه المطلوبة وارتفاع الرفع ومصدر المياه والتجهيزات الموجودة. وتُحدّد هذه العناصر لكل مشروع على حدة.',
   benefit:'نظام كهروضوئي لتغذية منظومة ضخّ، بحسب احتياجات المياه وخصائص الموقع.',
   pointsTitle:'معلومات مفيدة',points:['موقع المشروع واستخدام المياه.','مصدر المياه المتاح.','الاحتياج من المياه وارتفاع الرفع إن كانا معروفين.','خصائص المضخة الموجودة إن كانت معروفة.'],
   steps:['اعرض احتياجات المياه والموقع.','اجمع المعلومات التقنية المتاحة.','حضّر الدراسة مع AJ ENERGIES.'],cta:'اطلب دراسة لضخّ المياه بالطاقة الشمسية'},
  faq:[{id:'solar-pumping',q:'هل توفّرون تركيب أنظمة ضخّ المياه بالطاقة الشمسية؟',a:'نعم. تنجز AJ ENERGIES تركيبات لضخّ المياه بالطاقة الشمسية الكهروضوئية. وتُحدّد خصائص الحلّ وفق احتياجات المياه وظروف الموقع.'},
   {id:'pumping-information',q:'ما المعلومات المطلوبة لمشروع ضخّ المياه بالطاقة الشمسية؟',a:'اذكر موقع المشروع واستخدام المياه ومصدرها المتاح. وإن كنت تعرفها، أضف كمية المياه المطلوبة وارتفاع الرفع وخصائص المضخة الموجودة. يمكنك طلب دراسة حتى إن كانت هذه المعلومات غير مكتملة.'}],
  servicesIntro:'تقدّم AJ ENERGIES أربع خدمات متكاملة لمشاريعك الشمسية: الدراسة المخصصة وتركيب الأنظمة الكهروضوئية والصيانة وخدمة ما بعد البيع وضخّ المياه بالطاقة الشمسية.',
  aboutTopic:'مشروع ضخّ المياه بالطاقة الشمسية الكهروضوئية.',
  mailPrivacy:{title:'تطبيق البريد الإلكتروني للزائر',text:'يمكن للنموذج إعداد رابط mailto إلى {companyEmail}، مع الموضوع والرسالة المعروضة في المعاينة. لا يُفتح تطبيق البريد إلا بعد النقر، وعليك مراجعة الرسالة وإرسالها بنفسك. لا يتحقق الموقع من وجود تطبيق بريد أو من وصول الرسالة. إذا كانت الرسالة طويلة، يمكنك نسخها ولصقها في تطبيق البريد. ولا تُستخدم الحافظة لنسخ الرسالة أو العنوان إلا بعد إجراء منك.'},
  pumpingPrivacy:' ولمشروع ضخّ المياه بالطاقة الشمسية، يمكنك أيضًا إدخال استخدام المياه ومصدرها والاحتياج التقريبي ووحدته وارتفاع الرفع التقديري ومعلومات عن مضخة موجودة. هذه البيانات التقنية اختيارية.'
 }
};

export function addRequestFeatures(t) {
 const a=additions[t.lang];
 Object.assign(t.ui,a.ui);Object.assign(t.contact,a.contact);Object.assign(t.form,a.form);
 t.services.items.push(a.service);t.services.intro=a.servicesIntro;t.about.topics.push(a.aboutTopic);t.faq.items.push(...a.faq);
 if(t.lang==='fr') {
  t.ui.footerText=t.ui.footerText.replace('maintenance et service après-vente.','maintenance, service après-vente et pompage solaire.');
  t.home.introText=t.home.introText.replace('de maintenance et de SAV photovoltaïques.','de maintenance, de SAV photovoltaïques et de pompage solaire.');
  t.about.intro=t.about.intro.replace('L’entreprise s’adresse','Elle réalise aussi des installations de pompage solaire photovoltaïque. L’entreprise s’adresse');
  t.home.ctaText=t.home.ctaText.replace('Installation, étude ou maintenance','Installation, étude, maintenance ou pompage solaire');
  t.quote.intro=t.quote.intro.replace('d’étude ou de maintenance','d’étude, de maintenance ou de pompage solaire');
  t.meta.home[1]=t.meta.home[1].replace('maintenance et SAV photovoltaïques','maintenance, SAV photovoltaïques et pompage solaire');
  t.meta.services=['Services photovoltaïques et pompage solaire — AJ ENERGIES','Étude personnalisée, installation photovoltaïque, maintenance, SAV et pompage solaire : présentez votre besoin à AJ ENERGIES à Msaken.'];
  t.meta.contact[1]=t.meta.contact[1].replace('sur WhatsApp','par e-mail, sur WhatsApp');
 } else {
  t.ui.footerText=t.ui.footerText.replace('وخدمة ما بعد البيع.','وخدمة ما بعد البيع وضخّ المياه بالطاقة الشمسية.');
  t.home.introText+=' كما تنجز الشركة تركيبات لضخّ المياه بالطاقة الشمسية الكهروضوئية.';
  t.home.ctaText=t.home.ctaText.replace('تركيب أو دراسة أو صيانة','تركيب أو دراسة أو صيانة أو ضخّ مياه بالطاقة الشمسية');
  t.quote.intro=t.quote.intro.replace('أو الصيانة.','أو الصيانة أو ضخّ المياه بالطاقة الشمسية.');
  t.about.intro+=' وتنجز أيضًا تركيبات لضخّ المياه بالطاقة الشمسية الكهروضوئية.';
  t.meta.home[1]=t.meta.home[1].replace('تواصل معنا.','وضخّ المياه بالطاقة الشمسية. تواصل معنا.');
  t.meta.services=['خدمات الطاقة الكهروضوئية وضخّ المياه بالطاقة الشمسية — AJ ENERGIES','دراسة مخصصة وتركيب وصيانة وخدمة ما بعد البيع وضخّ المياه بالطاقة الشمسية مع AJ ENERGIES في مساكن. اعرض احتياجاتك.'];
  t.meta.contact[1]=t.meta.contact[1].replace('عبر الهاتف أو واتساب','عبر الهاتف أو البريد الإلكتروني أو واتساب');
 }
 t.privacy.sections[0].text+=a.pumpingPrivacy;
 t.privacy.sections.splice(t.privacy.sections.length-1,0,a.mailPrivacy);
 return t;
}
