'use client';
import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarPlus, Clock } from 'lucide-react';
import { SCENARIUSZE, terminy, type Scenariusz } from '@/lib/narzedzia/formalnosci';
import { KARTA_NARZEDZIA, PoleDaty, PoleLiczby, PoleWyboru } from '@/components/narzedzia/Pola';
import { sledz } from '@/lib/sledz';

const dzis = () => new Date().toISOString().slice(0, 10);
const dataPl = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

/** Plik kalendarza (.ics) z terminami – działa w Google, Apple i Outlooku */
function plikIcs(wpisy: { data: string; tytul: string; opis: string }[]): string {
  const esc = (s: string) => s.replace(/[\\,;]/g, (z) => `\\${z}`).replace(/\n/g, '\\n');
  const linie = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MotoRaport//Terminarz//PL'];
  wpisy.forEach((w, i) => {
    const d = w.data.replaceAll('-', '');
    linie.push('BEGIN:VEVENT', `UID:${d}-${i}@moto-raport.pl`, `DTSTAMP:${d}T090000Z`, `DTSTART;VALUE=DATE:${d}`, `SUMMARY:${esc(w.tytul)}`, `DESCRIPTION:${esc(w.opis)}`, 'BEGIN:VALARM', 'TRIGGER:-P2D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(w.tytul)}`, 'END:VALARM', 'END:VEVENT');
  });
  linie.push('END:VCALENDAR');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(linie.join('\r\n'))}`;
}

export default function KalkulatorFormalnosci({ scenariusz = 'osoba-prywatna' }: { scenariusz?: Scenariusz }) {
  const [s, setS] = useState<Scenariusz>(scenariusz);
  const [data, setData] = useState(dzis());
  const [wartosc, setWartosc] = useState(30000);
  const lista = useMemo(() => terminy(s, wartosc, data), [s, wartosc, data]);
  const doKalendarza = lista.filter((t) => t.data && (t.dni ?? 0) + (t.miesiace ?? 0) > 0) as { data: string; tytul: string; opis: string }[];
  const dzisiaj = dzis();
  return (
    <section className={`${KARTA_NARZEDZIA} space-y-6`} aria-label="Terminarz formalności">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PoleWyboru id="fm-s" etykieta="Jak kupiłeś auto?" wartosc={s} ustaw={setS} opcje={SCENARIUSZE.map((x) => ({ id: x.id, nazwa: x.nazwa }))} />
        <PoleDaty id="fm-d" etykieta={s === 'sprzedaz' ? 'Data sprzedaży' : 'Data umowy / przywozu'} wartosc={data} ustaw={setData} />
        <PoleLiczby id="fm-w" etykieta="Wartość rynkowa auta" wartosc={wartosc} ustaw={setWartosc} krok={1000} jednostka="zł" podpowiedz="Potrzebna do wyliczenia PCC" />
      </div>
      <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 space-y-6">
        {lista.map((t) => {
          const minelo = t.data && t.data < dzisiaj && (t.dni ?? 0) > 0;
          return (
            <li key={t.tytul} className="ml-6">
              <span className={`absolute -left-[9px] mt-1.5 w-4 h-4 rounded-full ring-4 ring-white dark:ring-slate-900 ${t.pilne ? 'bg-rust-500' : 'bg-slate-400'}`} aria-hidden="true" />
              <div className="flex flex-wrap items-center gap-2">
                {t.data ? (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-2.5 py-1 ${minelo ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'}`}>
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {(t.dni ?? 0) === 0 && !t.miesiace ? 'od razu' : `do ${dataPl(t.data)}`}
                    {minelo && ' – termin minął'}
                  </span>
                ) : (
                  <span className="text-xs font-bold rounded-full px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">bez sztywnego terminu</span>
                )}
                {(t.dni ?? 0) > 0 && <span className="text-xs text-slate-500">{t.dni} dni od umowy</span>}
                {t.miesiace && <span className="text-xs text-slate-500">{t.miesiace} miesięcy</span>}
              </div>
              <h3 className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">{t.tytul}</h3>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 mt-1">{t.opis}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {t.kwota && <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 px-2.5 py-1 font-semibold">Koszt: {t.kwota}</span>}
                {t.kara && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 px-2.5 py-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> Kara: {t.kara}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      {doKalendarza.length > 0 && (
        <a
          href={plikIcs(doKalendarza)}
          download="terminy-auto.ics"
          onClick={() => sledz('pobierz_kalendarz', { narzedzie: 'formalnosci', scenariusz: s })}
          className="inline-flex items-center gap-2 rounded-xl bg-rust-600 hover:bg-rust-700 text-white font-bold px-4 py-3 text-sm"
        >
          <CalendarPlus className="w-4 h-4" aria-hidden="true" /> Dodaj terminy do kalendarza (z przypomnieniem 2 dni wcześniej)
        </a>
      )}
    </section>
  );
}
