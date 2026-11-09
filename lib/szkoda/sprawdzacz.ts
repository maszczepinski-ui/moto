// Logika Sprawdzacza kosztorysu: które argumenty pasują, ile wynosi kwota sporna, terminy i składanie pism.
// Wszystko liczy się w przeglądarce kupującego – liczby z kosztorysu i dane do pism nie są wysyłane na serwer.
// Treść argumentów i pism przychodzi z prywatnego pliku (typy w lib/szkoda/typy.ts).
import type { Argument, DaneSzkody, Pismo, Pole, Riposta } from './typy';

export interface StanSprawdzacza {
  // nadawca
  imieNazwisko: string;
  adres: string;
  telefon: string;
  email: string;
  miejscowosc: string;
  konto: string;
  // szkoda
  ubezpieczyciel: string;
  adresUbezpieczyciela: string;
  numerSzkody: string;
  dataZdarzenia: string;
  dataZgloszenia: string;
  dataDecyzji: string;
  markaModel: string;
  nrRej: string;
  rokProdukcji: string;
  rodzaj: 'czesciowa' | 'calkowita';
  wyplacono: boolean;
  kwotaWyplacona: number;
  // szkoda częściowa
  rbg: number;
  stawkaKosztorys: number;
  stawkaWarsztat: number;
  nazwaWarsztatu: string;
  zamienniki: boolean;
  roznicaOryginaly: number;
  potracenia: number;
  rabaty: number;
  netto: boolean;
  odliczamVat: boolean;
  naprawionoBezVat: boolean;
  pominiete: string;
  // szkoda całkowita
  wartoscTu: number;
  wrakTu: number;
  ogloszenia: number[];
  wrakWlasny: number;
  // dodatkowe koszty
  kosztNajmu: number;
  okresNajmu: string;
  celNajmu: string;
  kosztRzeczoznawcy: number;
  // etap 2
  dataReklamacji: string;
  dataDoreczeniaReklamacji: string;
  odpowiedzWTerminie: 'tak' | 'nie' | '';
  dataOdmowy: string;
  riposty: string[];
  // wybór argumentów (puste = automatycznie)
  wylaczone: string[];
  kwotaReczna: number;
}

export const POCZATEK: StanSprawdzacza = {
  imieNazwisko: '', adres: '', telefon: '', email: '', miejscowosc: '', konto: '',
  ubezpieczyciel: '', adresUbezpieczyciela: '', numerSzkody: '', dataZdarzenia: '', dataZgloszenia: '', dataDecyzji: '',
  markaModel: '', nrRej: '', rokProdukcji: '', rodzaj: 'czesciowa', wyplacono: true, kwotaWyplacona: 0,
  rbg: 0, stawkaKosztorys: 0, stawkaWarsztat: 0, nazwaWarsztatu: '', zamienniki: false, roznicaOryginaly: 0, potracenia: 0, rabaty: 0,
  netto: false, odliczamVat: false, naprawionoBezVat: false, pominiete: '',
  wartoscTu: 0, wrakTu: 0, ogloszenia: [], wrakWlasny: 0,
  kosztNajmu: 0, okresNajmu: '', celNajmu: '', kosztRzeczoznawcy: 0,
  dataReklamacji: '', dataDoreczeniaReklamacji: '', odpowiedzWTerminie: '', dataOdmowy: '', riposty: [],
  wylaczone: [], kwotaReczna: 0
};

export const zl = (n: number) => `${(Math.round(n * 100) / 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
export const data = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}` : '');
const dzis = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Warsaw' });
const plusDni = (iso: string, dni: number) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dni);
  return d.toISOString().slice(0, 10);
};
const plusLat = (iso: string, lat: number) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${Number(iso.slice(0, 4)) + lat}${iso.slice(4)}` : '');

/** Mediana cen z ogłoszeń – odporna na jedno dziwne ogłoszenie */
export function mediana(xs: number[]) {
  const v = xs.filter((x) => x > 0).sort((a, b) => a - b);
  if (!v.length) return 0;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

/** VAT należy się, gdy wypłacono netto, kupujący nie odlicza VAT i nie naprawił auta bez faktury z VAT */
const vatPasuje = (s: StanSprawdzacza) => s.rodzaj === 'czesciowa' && s.netto && !s.odliczamVat && !s.naprawionoBezVat;

/** Składniki kwoty spornej – każdy z nazwą argumentu, którego dotyczy */
export function skladniki(s: StanSprawdzacza): { id: Argument['id']; kwota: number; opis: string }[] {
  const w: { id: Argument['id']; kwota: number; opis: string }[] = [];
  if (s.rodzaj === 'czesciowa') {
    const roznicaStawki = s.stawkaWarsztat > s.stawkaKosztorys && s.rbg > 0 ? (s.stawkaWarsztat - s.stawkaKosztorys) * s.rbg : 0;
    if (roznicaStawki) w.push({ id: 'stawka', kwota: roznicaStawki, opis: `${s.rbg} rbg × różnica stawek` });
    if (s.zamienniki && s.roznicaOryginaly > 0) w.push({ id: 'zamienniki', kwota: s.roznicaOryginaly, opis: 'różnica do cen oryginałów' });
    if (s.potracenia > 0) w.push({ id: 'potracenia', kwota: s.potracenia, opis: 'potrącenia z kosztorysu' });
    if (s.rabaty > 0) w.push({ id: 'rabaty', kwota: s.rabaty, opis: 'rabaty z kosztorysu' });
    if (vatPasuje(s)) {
      const podstawa = s.kwotaWyplacona + w.reduce((a, x) => a + x.kwota, 0);
      if (podstawa > 0) w.push({ id: 'vat', kwota: podstawa * 0.23, opis: '23% VAT od kwoty netto (z dopłatami)' });
    }
  } else {
    const wlasna = mediana(s.ogloszenia);
    if (wlasna > s.wartoscTu && s.wartoscTu > 0) w.push({ id: 'calkowita-wartosc', kwota: wlasna - s.wartoscTu, opis: 'mediana ogłoszeń minus wycena ubezpieczyciela' });
    if (s.wrakWlasny > 0 && s.wrakTu > s.wrakWlasny) w.push({ id: 'calkowita-wrak', kwota: s.wrakTu - s.wrakWlasny, opis: 'wycena wraku minus Twoja oferta odkupu' });
  }
  if (s.kosztNajmu > 0) w.push({ id: 'zastepcze', kwota: s.kosztNajmu, opis: 'koszt najmu auta zastępczego' });
  if (s.kosztRzeczoznawcy > 0) w.push({ id: 'rzeczoznawca', kwota: s.kosztRzeczoznawcy, opis: 'koszt opinii rzeczoznawcy' });
  return w;
}

/** Które argumenty pasują do sprawy (zanim kupujący sam coś wyłączy) */
export function pasujaceArgumenty(s: StanSprawdzacza, dane: DaneSzkody): Argument[] {
  const tak = new Set<Argument['id']>();
  if (s.rodzaj === 'czesciowa') {
    if (s.stawkaKosztorys > 0) tak.add('stawka');
    if (s.zamienniki) tak.add('zamienniki');
    if (s.potracenia > 0) tak.add('potracenia');
    if (s.rabaty > 0) tak.add('rabaty');
    if (vatPasuje(s)) tak.add('vat');
    if (s.pominiete.trim()) tak.add('pominiete');
  } else {
    if (s.wartoscTu > 0 && mediana(s.ogloszenia) > s.wartoscTu) tak.add('calkowita-wartosc');
    if (s.wrakTu > 0) tak.add('calkowita-wrak');
  }
  if (s.kosztNajmu > 0) tak.add('zastepcze');
  if (s.kosztRzeczoznawcy > 0) tak.add('rzeczoznawca');
  return dane.argumenty.filter((a) => tak.has(a.id));
}

/** Argumenty wybrane do pism = pasujące minus wyłączone ręcznie */
export const wybraneArgumenty = (s: StanSprawdzacza, dane: DaneSzkody) => pasujaceArgumenty(s, dane).filter((a) => !s.wylaczone.includes(a.id));

export const kwotaSporna = (s: StanSprawdzacza) => skladniki(s).filter((x) => !s.wylaczone.includes(x.id)).reduce((a, x) => a + x.kwota, 0);
/** Kwota żądana w pismach: wpisana ręcznie albo wyliczona */
export const kwotaZadana = (s: StanSprawdzacza) => (s.kwotaReczna > 0 ? s.kwotaReczna : kwotaSporna(s));

export interface Termin {
  data: string;
  co: string;
  minal: boolean;
}

/** Najważniejsze daty sprawy (kalendarz) */
export function terminy(s: StanSprawdzacza): Termin[] {
  const t: Termin[] = [];
  const d = dzis();
  const dodaj = (iso: string, co: string) => iso && t.push({ data: iso, co, minal: iso < d });
  dodaj(plusDni(s.dataZgloszenia, 30), 'mija 30 dni na wypłatę od zgłoszenia szkody');
  dodaj(plusDni(s.dataZgloszenia, 90), 'najpóźniejszy termin wypłaty w trudnej sprawie (90 dni)');
  dodaj(plusDni(s.dataDoreczeniaReklamacji, 30), 'mija 30 dni na odpowiedź na reklamację – po tej dacie, bez odpowiedzi, działa art. 8');
  dodaj(plusDni(s.dataDoreczeniaReklamacji, 60), 'najpóźniejszy termin odpowiedzi, jeśli ubezpieczyciel przedłużył go do 60 dni');
  dodaj(plusLat(s.dataZdarzenia, 3), 'orientacyjnie: 3 lata na dochodzenie roszczenia (zgłoszenie szkody i reklamacja przerywają ten termin)');
  return t.sort((a, b) => a.data.localeCompare(b.data));
}

/** Czy można już wysłać wezwanie z art. 8 (minęło 30 dni od doręczenia reklamacji bez odpowiedzi) */
export const art8Gotowe = (s: StanSprawdzacza) => !!s.dataDoreczeniaReklamacji && plusDni(s.dataDoreczeniaReklamacji, 30) < dzis() && s.odpowiedzWTerminie === 'nie';

// ───────────── Składanie pism ─────────────

const ETYKIETY: Partial<Record<Pole, string>> = {
  imieNazwisko: 'imię i nazwisko', adres: 'adres', miejscowosc: 'miejscowość', ubezpieczyciel: 'nazwa ubezpieczyciela', numerSzkody: 'numer szkody',
  dataZdarzenia: 'data zdarzenia', dataZgloszenia: 'data zgłoszenia szkody', dataDecyzji: 'data decyzji', markaModel: 'marka i model', nrRej: 'numer rejestracyjny',
  dataReklamacji: 'data reklamacji', dataDoreczeniaReklamacji: 'data doręczenia reklamacji', dataOdmowy: 'data odpowiedzi ubezpieczyciela',
  okresNajmu: 'okres najmu (np. 3–17.11.2026)', email: 'e-mail', kwotaZadana: 'kwota żądana'
};

/** Wartości pól do wstawienia w pisma (puste = brak) */
export function wartosci(s: StanSprawdzacza): Partial<Record<Pole, string>> {
  const k = (n: number) => (n > 0 ? zl(n) : '');
  const sk = Object.fromEntries(skladniki(s).map((x) => [x.id, x.kwota]));
  return {
    imieNazwisko: s.imieNazwisko, adres: s.adres, telefon: s.telefon, email: s.email, miejscowosc: s.miejscowosc, data: data(dzis()),
    ubezpieczyciel: s.ubezpieczyciel, adresUbezpieczyciela: s.adresUbezpieczyciela, numerSzkody: s.numerSzkody,
    dataZdarzenia: data(s.dataZdarzenia), dataZgloszenia: data(s.dataZgloszenia), markaModel: s.markaModel, nrRej: s.nrRej, rokProdukcji: s.rokProdukcji,
    konto: s.konto, kwotaWyplacona: s.wyplacono ? k(s.kwotaWyplacona) : '', kwotaZadana: k(kwotaZadana(s)), dataDecyzji: data(s.dataDecyzji),
    dataReklamacji: data(s.dataReklamacji), dataDoreczeniaReklamacji: data(s.dataDoreczeniaReklamacji), dataOdmowy: data(s.dataOdmowy),
    stawkaKosztorys: k(s.stawkaKosztorys), stawkaWarsztat: k(s.stawkaWarsztat), nazwaWarsztatu: s.nazwaWarsztatu || 'z mojej okolicy', rbg: s.rbg ? String(s.rbg) : '',
    potracenia: k(s.potracenia), rabaty: k(s.rabaty), vat: k(sk.vat || 0), roznicaOryginaly: k(s.zamienniki ? s.roznicaOryginaly : 0), pominiete: s.pominiete.trim(),
    wartoscTu: k(s.wartoscTu), wrakTu: k(s.wrakTu), wartoscWlasna: k(mediana(s.ogloszenia)), wrakWlasny: k(s.wrakWlasny),
    kosztNajmu: k(s.kosztNajmu), okresNajmu: s.okresNajmu, celNajmu: s.celNajmu.trim().replace(/\.$/, ''), kosztRzeczoznawcy: k(s.kosztRzeczoznawcy)
  };
}

/** Wstawia {pola}; brakujące oznacza jako [uzupełnij: …], żeby kupujący je zauważył */
export function wypelnij(tekst: string, w: Partial<Record<Pole, string>>): string {
  return tekst.replace(/\{(\w+)\}/g, (_, p: Pole) => w[p] || `[uzupełnij: ${ETYKIETY[p] || p}]`);
}

const akapityZ = (lista: Argument['akapity'], w: Partial<Record<Pole, string>>) =>
  lista.filter((a) => typeof a === 'string' || !!w[a.jesli]).map((a) => wypelnij(typeof a === 'string' ? a : a.tekst, w));

export type Element = { typ: 'p'; t: string } | { typ: 'punkt'; nr: number; tytul: string; akapity: string[] };

export interface GotowePismo {
  id: Pismo['id'];
  tytul: string;
  nadawca: string[];
  adresat: string[];
  miejsceData: string;
  naglowek: string;
  dotyczy: string;
  elementy: Element[];
  zalaczniki: string[];
  podpis: string;
  /** brakujące pola – do ostrzeżenia nad pismem */
  braki: number;
}

export function zlozPismo(p: Pismo, s: StanSprawdzacza, dane: DaneSzkody): GotowePismo {
  const w = wartosci(s);
  const args = p.id === 'zastepcze' ? dane.argumenty.filter((a) => a.id === 'zastepcze') : wybraneArgumenty(s, dane);
  const ripo: Riposta[] = dane.riposty.filter((r) => s.riposty.includes(r.id));
  const elementy: Element[] = [];
  const dowody = new Set<string>();
  for (const a of p.akapity) {
    if (typeof a === 'string') elementy.push({ typ: 'p', t: wypelnij(a, w) });
    else if ('wstaw' in a) {
      if (a.wstaw === 'argumenty')
        args.forEach((x, i) => {
          elementy.push({ typ: 'punkt', nr: i + 1, tytul: x.naglowek || x.tytul, akapity: akapityZ(x.akapity, w) });
          x.dowody.forEach((d) => dowody.add(d));
        });
      if (a.wstaw === 'riposty')
        ripo.forEach((x, i) => {
          elementy.push({ typ: 'punkt', nr: i + 1, tytul: `Na zarzut: ${x.zarzut}`, akapity: akapityZ(x.akapity, w) });
          x.dowody.forEach((d) => dowody.add(d));
        });
    } else if (a.jesli === 'argumenty' ? args.length : a.jesli === 'riposty' ? ripo.length : w[a.jesli]) elementy.push({ typ: 'p', t: wypelnij(a.tekst, w) });
  }
  const zalaczniki = [...p.zalaczniki.map((z) => wypelnij(z, w)), ...[...dowody].map((d) => d.replace(/\s*\(jeśli masz\)$/, ''))];
  const wynik: GotowePismo = {
    id: p.id,
    tytul: p.tytul,
    nadawca: [s.imieNazwisko || '[uzupełnij: imię i nazwisko]', s.adres || '[uzupełnij: adres]', ...(s.telefon ? [`tel. ${s.telefon}`] : []), ...(s.email ? [s.email] : [])],
    adresat: [s.ubezpieczyciel || '[uzupełnij: nazwa ubezpieczyciela]', ...(s.adresUbezpieczyciela ? s.adresUbezpieczyciela.split(/,\s*|\n/) : [])],
    miejsceData: `${s.miejscowosc || '[uzupełnij: miejscowość]'}, ${w.data}`,
    naglowek: wypelnij(p.naglowek, w),
    dotyczy: `Szkoda nr ${s.numerSzkody || '[uzupełnij: numer szkody]'}`,
    elementy,
    zalaczniki,
    podpis: s.imieNazwisko || '',
    braki: 0
  };
  wynik.braki = (JSON.stringify(wynik).match(/\[uzupełnij:/g) || []).length;
  return wynik;
}

/** Pismo jako zwykły tekst (do skopiowania, np. w formularz ubezpieczyciela albo Rzecznika) */
export function pismoTekst(g: GotowePismo, zFormalnosciami = true): string {
  const linie: string[] = [];
  if (zFormalnosciami) linie.push(g.miejsceData, '', ...g.nadawca, '', ...g.adresat, '', g.dotyczy, '', g.naglowek.toUpperCase(), '');
  for (const e of g.elementy) {
    if (e.typ === 'p') linie.push(e.t, '');
    else linie.push(`${e.nr}. ${e.tytul}`, ...e.akapity, '');
  }
  if (g.zalaczniki.length) linie.push('Załączniki:', ...g.zalaczniki.map((z, i) => `${i + 1}) ${z}`), '');
  if (zFormalnosciami) linie.push('', g.podpis);
  return linie.join('\n').trim();
}
