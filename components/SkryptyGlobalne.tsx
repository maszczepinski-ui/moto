import { panelDane } from '@/lib/panel';
import { kodDoHead, KodWTresci } from '@/lib/kod';

// Skrypty wspólne dla całej strony – wszystko sterowane z panelu admina:
// • Google Consent Mode v2: domyślnie brak zgody na ciasteczka reklamowe i analityczne. Zgodę zbiera certyfikowany baner Google
//   (AdSense → Prywatność i wiadomości → wiadomość RODO), który aktualizuje te ustawienia.
// • AdSense i GA4 ładują się dopiero po wczytaniu strony, żeby nie spowalniać jej otwierania.
// • Kod „dla całej strony” wklejony w zakładce „Kody”.

const a = panelDane.moduly?.adsense;
const adsense = a?.wlaczony && a.klient ? a.klient.trim() : '';
const ga4 = (panelDane.seo?.ga4 || '').trim();

const consentDomyslny = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);`;

/** Własny baner zgód działa tylko dla samego GA4 (przy AdSense zgodę zbiera baner Google) */
export const wlasnyBanerZgod = !!ga4 && !adsense;
// zgoda zapisana przy poprzedniej wizycie – stosujemy ją od razu, zanim wczyta się Analytics
const zapisanaZgoda = `try{if(localStorage.getItem('zgoda-analityka')==='tak')gtag('consent','update',{analytics_storage:'granted'})}catch(e){}`;

const leniweLadowanie = (src: string, dodatki = '') => `(function(){function z(){var s=document.createElement('script');s.async=true;s.src=${JSON.stringify(src)};${dodatki}document.head.appendChild(s);}
if(document.readyState==='complete'){setTimeout(z,1)}else{window.addEventListener('load',function(){setTimeout(z,1)})}})();`;

export function SkryptyHead() {
  return (
    <>
      {(adsense || ga4) && <script dangerouslySetInnerHTML={{ __html: consentDomyslny + (wlasnyBanerZgod ? zapisanaZgoda : '') }} />}
      {ga4 && (
        <script
          dangerouslySetInnerHTML={{
            __html: `gtag('js',new Date());gtag('config',${JSON.stringify(ga4)});` + leniweLadowanie(`https://www.googletagmanager.com/gtag/js?id=${ga4}`)
          }}
        />
      )}
      {adsense && (
        <script
          dangerouslySetInnerHTML={{
            __html: leniweLadowanie(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense}`, "s.crossOrigin='anonymous';")
          }}
        />
      )}
      {kodDoHead(panelDane.kody?.head || '', 'kod-globalny')}
    </>
  );
}

export function SkryptyBody() {
  return <KodWTresci html={panelDane.kody?.body || ''} />;
}
