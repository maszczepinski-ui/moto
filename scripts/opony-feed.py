#!/usr/bin/env python3
"""
Feed opon z Awin (tanie-opony.pl) → małe pliki z oponami na stronie (data/opony).

Uruchamiany codziennie przez GitHub Actions (.github/workflows/opony-feed.yml).
Adres feedu jest tajny – automat bierze go z sekretu AWIN_FEED_OPONY (nigdy nie wpisuj go do kodu).

Ręcznie, z pobranego pliku:   python3 scripts/opony-feed.py ~/Pobrane/datafeed_123.csv(.gz)
Z adresu w zmiennej:          AWIN_FEED_OPONY="https://..." python3 scripts/opony-feed.py

Co robi:
- zostawia tylko opony do aut osobowych (bez motocykli, terenowych, dostawczych i „vintage”),
- dla każdego rozmiaru (np. 205-55-r16) zapisuje listę opon w data/opony/rozmiary/<rozmiar>.json,
- spis wszystkich rozmiarów z liczbą ofert i najniższą ceną trafia do data/opony/indeks.json.
Gdy feed jest podejrzanie mały (błąd po stronie Awin), skrypt kończy się błędem i nic nie nadpisuje.
"""
import csv, gzip, hashlib, io, json, os, re, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

KATALOG = Path(__file__).resolve().parent.parent / 'data' / 'opony'
MINIMUM_OFERT = 5000  # mniej = coś nie tak z feedem, nie nadpisujemy danych

SEZONY = {'Opona zimowa': 'z', 'Opona letnia': 'l', 'Opona całoroczna': 'c'}

# Ładne nazwy marek (feed część nazw podaje wielkimi literami)
MARKI = {
    'HANKOOK': 'Hankook', 'MICHELIN': 'Michelin', 'NANKANG': 'Nankang', 'BF Goodrich': 'BFGoodrich',
    'UNIROYAL': 'Uniroyal', 'KLEBER': 'Kleber', 'SEMPERIT': 'Semperit', 'BARUM': 'Barum',
    'FIRESTONE': 'Firestone', 'FULDA': 'Fulda', 'Debica': 'Dębica', 'Cst': 'CST'
}

def marka(n: str) -> str:
    n = n.strip()
    if n in MARKI:
        return MARKI[n]
    return n.title() if n.isupper() and len(n) > 3 else n

def dostawa(t: str) -> str:
    """„0.00 1 - 3 dni roboczych” → „1–3 dni robocze”"""
    m = re.search(r'(\d+)\s*-\s*(\d+)', t)
    if not m:
        return ''
    a, b = int(m.group(1)), int(m.group(2))
    return f'{a}–{b} dni robocze' if b <= 4 else f'{a}–{b} dni roboczych'

def otworz():
    zrodlo = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('AWIN_FEED_OPONY', '').strip()
    if not zrodlo:
        sys.exit('Brak feedu: podaj plik albo ustaw zmienną AWIN_FEED_OPONY.')
    if zrodlo.startswith('http'):
        req = urllib.request.Request(zrodlo, headers={'User-Agent': 'moto-raport.pl feed'})
        with urllib.request.urlopen(req, timeout=300) as r:
            dane = r.read()
    else:
        dane = Path(zrodlo).expanduser().read_bytes()
    if dane[:2] == b'\x1f\x8b':  # plik spakowany gzipem
        dane = gzip.decompress(dane)
    return io.StringIO(dane.decode('utf-8', errors='replace'))

def main():
    csv.field_size_limit(10**9)
    czytnik = csv.DictReader(otworz())
    produkty = {}   # rozmiar → {id produktu: wiersz}
    awin = None
    for r in czytnik:
        if r.get('merchant_product_third_category') != 'Samochodowe':
            continue
        sezon = SEZONY.get(r.get('merchant_product_second_category', ''))
        szer, profil, felga = r.get('custom_1', ''), r.get('custom_2', ''), r.get('custom_3', '')
        if not sezon or not (szer.isdigit() and profil.isdigit() and felga.isdigit()):
            continue
        if r.get('in_stock', '1') == '0' or r.get('is_for_sale', '1') == '0':
            continue
        link = re.search(r'pclick\.php\?p=(\d+)&a=(\d+)&m=(\d+)', r.get('aw_deep_link', ''))
        try:
            cena = round(float(r.get('search_price') or 0), 2)
        except ValueError:
            continue
        if not link or cena <= 0:
            continue
        awin = awin or {'a': link.group(2), 'm': link.group(3)}
        img = r.get('large_image') or r.get('merchant_image_url') or ''
        mi = re.match(r'^https://static\.tyres\.net/s/content-synced/(.+?)_(?:large|big|medium)\.jpg$', img)
        opis = r.get('custom_6', '')
        wpis = [
            link.group(1),                                   # 0 id produktu w Awin (do linku)
            marka(r.get('brand_name', '')),                  # 1 marka
            r.get('product_name', '').strip(),               # 2 model opony
            (r.get('custom_4', '') + r.get('custom_5', '')).strip(),  # 3 indeks nośności i prędkości, np. 91H
            sezon,                                           # 4 z / l / c
            cena,                                            # 5 cena za sztukę
            mi.group(1) if mi else '',                       # 6 zdjęcie (końcówka adresu)
            dostawa(r.get('delivery_time', '')),             # 7 czas dostawy
            1 if ('3PMSF' in opis or '3pmsf' in opis.lower()) else 0  # 8 znak płatka śniegu w opisie
        ]
        klucz = f'{szer}-{profil}-r{felga}'
        grupa = produkty.setdefault(klucz, {})
        stary = grupa.get(r.get('merchant_product_id'))
        if not stary or stary[5] > cena:
            grupa[r.get('merchant_product_id')] = wpis

    razem = sum(len(g) for g in produkty.values())
    print(f'Opony do aut osobowych: {razem}, rozmiarów: {len(produkty)}')
    if razem < MINIMUM_OFERT:
        sys.exit(f'Za mało ofert ({razem} < {MINIMUM_OFERT}) – zostawiam poprzednie dane.')

    (KATALOG / 'rozmiary').mkdir(parents=True, exist_ok=True)
    stare = {p.name for p in (KATALOG / 'rozmiary').glob('*.json')}
    indeks = {}
    skrot = hashlib.sha1()
    for klucz in sorted(produkty):
        lista = sorted(produkty[klucz].values(), key=lambda w: (w[5], w[1], w[2]))
        sz, pr, fe = klucz.replace('r', '').split('-')
        policz = lambda s: sum(1 for w in lista if w[4] == s)
        indeks[klucz] = {
            'r': [int(sz), int(pr), int(fe)],
            'z': policz('z'), 'l': policz('l'), 'c': policz('c'),
            'od': min(w[5] for w in lista)
        }
        plik = KATALOG / 'rozmiary' / f'{klucz}.json'
        tresc = json.dumps(lista, ensure_ascii=False, separators=(',', ':'))
        skrot.update(klucz.encode() + tresc.encode())
        plik.write_text(tresc, encoding='utf-8')
        stare.discard(plik.name)
    for nazwa in stare:  # rozmiary, których już nie ma w feedzie
        (KATALOG / 'rozmiary' / nazwa).unlink()

    marki = sorted({w[1] for g in produkty.values() for w in g.values()})
    meta = {
        'aktualizacja': datetime.now(timezone.utc).strftime('%Y-%m-%d'),
        'zrodlo': 'tanie-opony.pl (Awin)',
        'awin': awin,
        'liczba': razem,
        'marki': len(marki),
        'skrot': skrot.hexdigest()[:16],  # zmienia się, gdy zmieni się choćby jedna cena
        'rozmiary': indeks
    }
    # data aktualizacji zmienia się tylko wtedy, gdy zmieniły się same oferty – bez pustych commitów
    plik_indeksu = KATALOG / 'indeks.json'
    if plik_indeksu.exists():
        poprzedni = json.loads(plik_indeksu.read_text(encoding='utf-8'))
        if {**poprzedni, 'aktualizacja': ''} == {**meta, 'aktualizacja': ''}:
            meta['aktualizacja'] = poprzedni.get('aktualizacja', meta['aktualizacja'])
    plik_indeksu.write_text(json.dumps(meta, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('Zapisano data/opony.')

if __name__ == '__main__':
    main()
