// Les deux liens utilisent le même message validé ; aucun envoi ou lancement ici.
export function prepareContactLinks({recipient,subject,message,whatsapp,mailMaxLength=1900,waMaxLength=1900}) {
 if(!/^[^\s?&#]+@[^\s?&#]+\.[^\s?&#]+$/.test(recipient))throw new Error('invalid-recipient');
 const mailBase='mailto:'+recipient+'?subject='+encodeURIComponent(subject.replace(/[\r\n]/g,' '));
 const mailFull=mailBase+'&body='+encodeURIComponent(message.replace(/\r?\n/g,'\r\n'));
 const waFull=whatsapp+'?text='+encodeURIComponent(message);
 const mailLong=mailFull.length>mailMaxLength,waLong=waFull.length>waMaxLength;
 return {mailto:mailLong?mailBase:mailFull,mailLong,whatsapp:waLong?whatsapp:waFull,waLong};
}
