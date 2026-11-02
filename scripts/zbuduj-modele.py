"""
Buduje dane strony z zestawienia CEPiK.

Wejście:  data/cepik/zestawienie.tsv   – wynik liczenia paczek CEPiK (stan do listopada 2019)
          data/cepik/nowe.tsv           – auta zarejestrowane po raz pierwszy w Polsce później (z API CEPiK)
          data/definicje/*.json         – ręcznie opisane generacje (np. BMW E36)
Wyjście:  data/models/*.json            – po jednym pliku na kartę modelu
          data/cepik/tlo.json           – liczba wszystkich osobówek w województwach (do wskaźnika „zagłębi”)
          data/wojewodztwa.json         – dane do stron województw
          data/rankingi.json            – dane do strony rankingów

Uruchomienie:  python3 scripts/zbuduj-modele.py
"""
import json, os, re, glob, unicodedata
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZESTAWIENIE = os.path.join(ROOT, 'data', 'cepik', 'zestawienie.tsv')
NOWE = os.path.join(ROOT, 'data', 'cepik', 'nowe.tsv')
DEFINICJE = os.path.join(ROOT, 'data', 'definicje')
WYJSCIE = os.path.join(ROOT, 'data', 'models')
STAN_PACZKI = '2019-11-08'  # najnowsze rejestracje w paczkach CEPiK (paczki opublikowane 17.04.2022)
STAN_NA = STAN_PACZKI      # nadpisywane datą z nowe.tsv, jeśli plik istnieje
META_NOWE = {}
MIESIACE_SUMA = {}
PELNE_MIESIACE = set()


def pelne_miesiace():
    """Miesiące, dla których mamy komplet danych z podziałem na miesiące (cały miesiąc pobrany i nie czeka na uzupełnienie)."""
    if not META_NOWE.get('od') or not META_NOWE.get('do'):
        return set()
    from datetime import date as _d, timedelta as _t
    od, do_ = META_NOWE['od'], META_NOWE['do']
    brak = META_NOWE.get('miesiaceBrak') or None
    wynik = set()
    y, m = int(od[:4]), int(od[5:7])
    while f'{y:04d}-{m:02d}' <= do_[:7]:
        pierwszy = f'{y:04d}-{m:02d}-01'
        nast = _d(y + (m == 12), m % 12 + 1, 1)
        ostatni = (nast - _t(days=1)).isoformat()
        ok = pierwszy >= od and ostatni <= do_ and not (brak and not (ostatni < brak['od'] or pierwszy > brak['do']))
        if ok:
            wynik.add(f'{y:04d}-{m:02d}')
        y, m = nast.year, nast.month
    return wynik
DATA_AKTUALIZACJI = __import__('datetime').date.today().isoformat()
MIN_AUT_RODZINA = 200  # automatyczna karta powstaje dla modeli z co najmniej tyloma autami
ZRODLO_CEPIK = 'Liczby: CEPiK, Ministerstwo Cyfryzacji – paczki danych o pojazdach (stan do listopada 2019) oraz API CEPiK (auta zarejestrowane po raz pierwszy w Polsce później)'

WOJ = {
    '02': 'Dolnośląskie', '04': 'Kujawsko-pomorskie', '06': 'Lubelskie', '08': 'Lubuskie', '10': 'Łódzkie', '12': 'Małopolskie',
    '14': 'Mazowieckie', '16': 'Opolskie', '18': 'Podkarpackie', '20': 'Podlaskie', '22': 'Pomorskie', '24': 'Śląskie',
    '26': 'Świętokrzyskie', '28': 'Warmińsko-mazurskie', '30': 'Wielkopolskie', '32': 'Zachodniopomorskie'
}

# ================================================================ marki
MARKI_ALIASY = {
    'VW': 'VOLKSWAGEN', 'VOLKSWAGEN VW': 'VOLKSWAGEN', 'MERCEDES': 'MERCEDES-BENZ', 'MERCEDES BENZ': 'MERCEDES-BENZ',
    'MERCEDES-BENZ AG': 'MERCEDES-BENZ', 'FSO-WARSZAWA': 'FSO', 'DAEWOO-FSO MOTOR': 'DAEWOO', 'DAEWOO FSO': 'DAEWOO', 'DAEWOO-FSO': 'DAEWOO',
    'FSM-BIELSKO BIAŁA': 'FSM', 'FSM BIELSKO-BIAŁA': 'FSM', 'CITROËN': 'CITROEN', 'ŠKODA': 'SKODA', 'SKODA AUTO': 'SKODA',
    'ALFA-ROMEO': 'ALFA ROMEO', 'LAND-ROVER': 'LAND ROVER', 'VAZ': 'LADA', 'WAZ': 'LADA', 'ŁADA': 'LADA', 'MINI (BMW)': 'MINI',
    'STAR/WAM': 'POLSKI FIAT', 'AZLK': 'MOSKWICZ', 'TESLA MOTORS': 'TESLA', 'MERCEDES-AMG': 'MERCEDES-BENZ', 'BMW I': 'BMW',
    'JAGUAR LAND ROVER LIMITED': 'LAND ROVER', 'JAGUAR LAND ROVER': 'LAND ROVER', 'BYD AUTO': 'BYD', 'KGM': 'SSANGYONG', 'KG MOBILITY': 'SSANGYONG',
    'SAIC MG': 'MG', 'SAIC MOTOR': 'MG', 'GREAT WALL': 'GWM', 'CHERY AUTOMOBILE': 'CHERY', 'DAIMLER-BENZ': 'MERCEDES-BENZ', 'ALPINA': 'BMW'
}
# marki chińskie (do rankingu i opisów)
CHINSKIE = {'BYD', 'MG', 'OMODA', 'JAECOO', 'CHERY', 'BAIC', 'BESTUNE', 'JETOUR', 'LEAPMOTOR', 'JAC', 'GEELY', 'XPENG', 'FORTHING', 'HONGQI',
            'DONGFENG', 'GAC', 'NIO', 'ZEEKR', 'LYNK & CO', 'DFSK', 'SERES', 'VOYAH', 'EXLANTIX', 'SKYWELL', 'AIWAYS', 'MAXUS', 'GWM', 'ORA', 'WEY',
            'CHANGAN', 'SWM', 'KAIYI', 'EVOLUTE', 'AVATR', 'DEEPAL', 'ICAUR', 'MHERO', 'IM', 'SMART#', 'HAVAL'}
MARKI_LADNE = {
    'VOLKSWAGEN': 'Volkswagen', 'MERCEDES-BENZ': 'Mercedes-Benz', 'BMW': 'BMW', 'FSO': 'FSO', 'FSM': 'FSM',
    'POLSKI FIAT': 'Polski Fiat', 'ALFA ROMEO': 'Alfa Romeo', 'LAND ROVER': 'Land Rover', 'DS': 'DS', 'MG': 'MG', 'KIA': 'Kia', 'SEAT': 'Seat',
    'LADA': 'Łada', 'UAZ': 'UAZ', 'GAZ': 'GAZ', 'ZAZ': 'ZAZ', 'MOSKWICZ': 'Moskwicz', 'BYD': 'BYD', 'BAIC': 'BAIC', 'JAC': 'JAC', 'GWM': 'GWM',
    'XPENG': 'XPeng', 'NIO': 'NIO', 'DFSK': 'DFSK', 'GAC': 'GAC', 'SWM': 'SWM', 'LYNK & CO': 'Lynk & Co', 'SSANGYONG': 'SsangYong (KGM)',
    'CUPRA': 'Cupra', 'MINI': 'Mini', 'SMART': 'Smart', 'IM': 'IM'
}
BEZ_MARKI = {'?', '', '-', '---', 'BRAK', 'BRAK DANYCH', 'NIEZNANA', 'INNA', 'XXX'}

# Marki rozpoznawane z samej nazwy modelu (gdy w CEPiK pole marki jest puste)
ZGADNIJ_MARKE = [
    (r'^(B\. ?)?POLSKI\b|^P\.FIAT|^P\.? ?F\.?\s?\d|^PF\b|^FIAT ?12[56]|^12[56] ?P|^125 ?PN?\b|^126', 'POLSKI FIAT'),
    (r'POLONEZ|^CARO\b|^ATU\b|^SYRENA|^WARSZAWA|^M-?20\b|^22[34]$', 'FSO'),
    (r'^(ESCORT|SIERRA|FIESTA|TAUNUS|SCORPIO|ORION|GRANADA|MONDEO|TRANSIT|CAPRI|FOCUS)\b', 'FORD'),
    (r'^ZAZ|^968', 'ZAZ'),
    (r'CINQUECENTO|^170/', 'FIAT'),
    # marki z ostatnich lat, często wpisywane w CEPiK bez nazwy producenta
    (r'^OMODA', 'OMODA'), (r'^JAECOO', 'JAECOO'), (r'^(CUPRA|FORMENTOR|TERRAMAR|TAVASCAN)\b', 'CUPRA'), (r'^(JETOUR|DASHING)\b', 'JETOUR'),
    (r'^LEAPMOTOR|^(T03|B10|C10|B05|B03X)$', 'LEAPMOTOR'), (r'^(BEIJING|BAIC)\b|^X55$', 'BAIC'), (r'^(BESTUNE|T77)\b', 'BESTUNE'),
    (r'^(TIGGO|ARRIZO)', 'CHERY'), (r'^MG ?(ZS|HS|3|4|5|S5|S9)\b|^MG[345]', 'MG'), (r'^(BYD|ATTO|SEALION)\b|^SEAL [U56]\b', 'BYD'),
    (r'^(KORANDO|TORRES|REXTON|TIVOLI|MUSSO)\b', 'SSANGYONG'), (r'^PROACE', 'TOYOTA'), (r'^XPENG', 'XPENG'), (r'^(STARRAY|GEELY)\b', 'GEELY'),
    (r'^T2$|^X70 ?PLUS', 'JETOUR'), (r'^HONGQI\b|^HS[35]$', 'HONGQI'), (r'^(G6|G9|P7)$', 'XPENG'), (r'^(GAC )?AION\b|^(EMZOOM|EMKOO|EMPOW)\b', 'GAC'),
    (r'^BJ\d', 'BAIC'), (r'^(FORTHING|U-TOUR)\b', 'FORTHING'), (r'^BORN$', 'CUPRA'), (r'^(HAVAL|H6)$|^HAVAL\b', 'HAVAL'), (r'^B70$', 'BESTUNE'),
]
# końcówki nazw nowych modeli, które nie zmieniają modelu (np. „SEAL U DM-I”, „TIGGO 7 HYBRID”)
SUFIKSY = {'DM-I', 'DM', 'DM-P', 'PHEV', 'HEV', 'HYBRID', 'HYBRYDA', 'EV', 'ELECTRIC', 'SUPER', 'SHS', 'E-HYBRID', 'PLUG-IN', 'EVO', 'TOURING', 'EM-I'}


def ladna_marka(m):
    return MARKI_LADNE.get(m, m.title())


def norm_marka(m, base):
    m = MARKI_ALIASY.get(m, m)
    if '/' in m and m not in MARKI_ALIASY.values():
        m = MARKI_ALIASY.get(m.split('/')[0], m.split('/')[0])  # np. VOLKSWAGEN/CARPOL (przeróbki)
    if '-' in m and m.split('-')[0] in ('FORD', 'OPEL', 'FIAT', 'RENAULT', 'VOLKSWAGEN', 'CITROEN', 'PEUGEOT', 'TOYOTA'):
        m = m.split('-')[0]  # np. FORD-CNG-TECHNIK
    if m == 'DAIMLERCHRYSLER':
        m = 'MERCEDES-BENZ' if re.match(r'^(A|B|C|E|S|G|V|ML|GL|CL|CLK|SLK|SL|CLS|SPRINTER|VITO|W\d)\b', base) else 'CHRYSLER'
    return m


# ================================================================ rodziny modeli
DWA_SLOWA = {'GRAND', 'RANGE', 'LAND', 'SANTA', 'NEW', 'MODEL', 'PT', 'SPACE', 'XSARA', 'GOLF', 'MEGANE', 'WAGON', 'YARIS', 'AYGO', 'COROLLA', 'KONA'}
DRUGIE_OK = {'PLUS', 'PICASSO', 'ROVER', 'CRUISER', 'CHEROKEE', 'FE', 'BEETLE', 'VITARA', 'SCENIC', 'C-MAX', 'VOYAGER', 'CARAVAN',
             'SPORTSVAN', 'GRANDTOUR', 'STAR', 'WAGON', 'RUNNER', 'R', 'R+', 'S', '3', 'X', 'Y', 'CROSS'}
# nowe modele, w których druga część nazwy to osobny model (IONIQ 5, ATTO 3, SEAL U, TIGGO 7…)
Z_LICZBA = {'BEIJING', 'IONIQ', 'ATTO', 'SEAL', 'SEALION', 'TIGGO', 'ARRIZO', 'GALAXY', 'ID.', 'EX', 'EZ', 'TANG', 'SONG'}
MERCEDES_KLASY = ['CLA', 'CLK', 'CLS', 'SLK', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'GLS', 'ML', 'GL', 'CL', 'SL', 'A', 'B', 'C', 'E', 'S', 'G', 'V']
PRZEDROSTKI = ('ALFA', 'ROMEO', 'POLSKI', 'FIAT', 'FSO', 'FSM', 'VW', 'VOLKSWAGEN', 'LADA', 'ŁADA', 'WAZ', 'VAZ', 'DAEWOO', 'B.')


def rodzina(marka, base):
    """Nazwa „rodziny” modelu (np. GOLF, C-MAX, Seria 3) z nazwy wpisanej w CEPiK."""
    b = re.sub(r'(\w)PLUS$', r'\1 PLUS', base.strip())  # X70PLUS → X70 PLUS
    for pref in {marka, marka.split(' ')[0], marka.split('-')[0]}:
        if b.startswith(pref + ' ') and len(b) > len(pref) + 1:
            b = b[len(pref) + 1:]
    if marka == 'BMW':
        m = re.match(r'^(\d)\d{2}', b)
        if m:
            return f'Seria {m.group(1)}'
        m = re.match(r'^SERIA ?(\d)|^(\d) ?ER|^(\d)$', b)
        if m:
            return f'Seria {next(g for g in m.groups() if g)}'
        m = re.match(r'^(X\d|Z\d|M\d|I\d)', b)
        return m.group(1) if m else b.split(' ')[0]
    if marka == 'MERCEDES-BENZ':
        for k in MERCEDES_KLASY:
            if re.match(rf'^{k}( ?\d|$| KLASA|-KLASSE| CLASS)', b) or b in (f'KLASA {k}', f'{k} KLASA', f'{k}-KLASSE'):
                return f'Klasa {k}'
        m = re.match(r'^W? ?(\d{3})', b)
        if m:
            n = int(m.group(1))
            if n == 123:
                return 'W123'
            if n == 124:
                return 'W124'
            if n == 190 or n == 201:
                return '190'
            if n == 210:
                return 'Klasa E'
            if 200 <= n <= 300:
                return '#NUM200'  # rozstrzygane po roczniku (W123 / W124)
        return b.split(' ')[0]
    if marka == 'SKODA':
        m = re.match(r'^S? ?(\d{3,4})', b)
        if m:
            n = m.group(1)
            if n[:3] in ('105', '120', '125', '130', '135', '136'):
                return '105/120'
            if n[:3] in ('100', '110') and len(n) == 3:
                return '100/110'
    if marka == 'LADA':
        t0 = b.replace('LADA ', '').replace('ŁADA ', '').strip()
        if re.search(r'SAMARA|^210[89]|^2109|^2113|^2114|^2115', t0):
            return 'SAMARA'
        if re.match(r'^210[57]|^2104', t0):
            return '2105/2107'
        if re.match(r'^210[1236]|^1[235]00', t0):
            return '2101–2106'
        if re.search(r'NIVA|^2121|^2131', t0):
            return 'NIVA'
    if marka == 'LEXUS':
        m = re.match(r'^([A-Z]{2,3}) ?\d{3}[A-Z+]*\b', b)
        if m:
            return m.group(1)
    if marka == 'ROVER':
        m = re.match(r'^([2468])\d{2}\b', b)
        if m:
            return m.group(1) + '00'

    t = b.split(' ')
    # nazwa marki na początku modelu (TOYOTA COROLLA, BYD SEAL U, MG ZS) i końcówki typu DM-I, HYBRID
    pierwsze = marka.split(' ')[0]
    while len(t) > 1 and t[0] in (pierwsze, marka):
        t = t[1:]
    while len(t) > 1 and t[-1] in SUFIKSY:
        t = t[:-1]
    m = re.match(r'^(MG|OMODA|JAECOO)(S?\d+)$', t[0])
    if m and marka in ('MG', 'OMODA', 'JAECOO'):
        return m.group(2)
    if marka in ('OMODA', 'JAECOO') and len(t) > 1 and t[0] == marka and t[1].isdigit():
        return t[1]
    m = re.match(r'^(TIGGO|ARRIZO)(\d+)$', t[0])
    if m:
        return m.group(1) + ' ' + m.group(2)
    if len(t) > 1 and t[0] in Z_LICZBA and (re.match(r'^\d+$', t[1]) or t[1] in ('U', 'SURF', 'PLUS')):
        return t[0] + ' ' + t[1]
    # łącznik: RANGE-ROVER → dwa słowa; ASTRA-G, CORSA-B → ASTRA, CORSA (oznaczenie generacji);
    # krótkie przedrostki zostawiamy (C-MAX, X-TRAIL, CR-V)
    if '-' in t[0]:
        czesci = t[0].split('-')
        if all(len(c) >= 4 and c.isalpha() for c in czesci):
            t = czesci + t[1:]
        elif len(czesci[0]) >= 4 and czesci[0].isalpha():
            t = [czesci[0]] + t[1:]
    if re.match(r'^[A-Z]{4,}\+$', t[0]):
        t = [t[0][:-1]] + t[1:]
    # nazwa marki powtórzona w modelu, np. „ALFA 159”, „POLSKI FIAT 126P”
    while len(t) > 1 and t[0] in PRZEDROSTKI:
        t = t[1:]
    # krótki przedrostek + liczba: „C 4” → C4, „XC 90” → XC90
    if len(t) > 1 and re.match(r'^[A-Z]{1,2}$', t[0]) and re.match(r'^\d{1,3}$', t[1]):
        return t[0] + t[1]
    # krótki przedrostek + słowo: „C MAX” → C-MAX, „CR V” → CR-V, „X TRAIL” → X-TRAIL
    if len(t) > 1 and re.match(r'^[A-Z]{1,2}$', t[0]) and re.match(r'^[A-Z]{1,6}\+?$', t[1]):
        return t[0] + '-' + t[1]
    if t[0] == 'TOWN':
        return 'TOWN & COUNTRY'
    if len(t) > 1 and t[0] in DWA_SLOWA and (t[1] in DRUGIE_OK or t[0] in {'GRAND', 'RANGE', 'LAND', 'SANTA', 'NEW', 'MODEL', 'PT', 'SPACE'}):
        return ' '.join(t[:2])
    return t[0]


# Łączenie rodzin, które w CEPiK występują pod różnymi nazwami: (marka, rodzina) → (marka, rodzina)
ALIASY = {
    ('MERCEDES-BENZ', '123D'): ('MERCEDES-BENZ', 'W123'),
    ('OPEL', 'RECORD'): ('OPEL', 'REKORD'),
    ('RENAULT', 'R19'): ('RENAULT', '19'), ('RENAULT', 'R5'): ('RENAULT', '5'), ('RENAULT', 'R11'): ('RENAULT', '11'),
    ('RENAULT', 'R21'): ('RENAULT', '21'), ('RENAULT', 'R9'): ('RENAULT', '9'), ('RENAULT', 'R25'): ('RENAULT', '25'),
    ('RENAULT', 'MEGANE SCENIC'): ('RENAULT', 'SCENIC'), ('RENAULT', 'MEGANE GRANDTOUR'): ('RENAULT', 'MEGANE'),
    ('SKODA', '6Y'): ('SKODA', 'FABIA'), ('SKODA', 'S'): ('SKODA', '105/120'),
    ('TRABANT', '601S'): ('TRABANT', '601'), ('TRABANT', 'P601'): ('TRABANT', '601'),
    ('WARTBURG', '353W'): ('WARTBURG', '353'), ('WARTBURG', '353S'): ('WARTBURG', '353'),
    ('ZAZ', 'TAWRIJA'): ('ZAZ', 'TAVRIA'), ('ZAZ', 'ZAZ-968M'): ('ZAZ', '968'), ('ZAZ', 'ZAPOROZEC'): ('ZAZ', '968'), ('ZAZ', '968M'): ('ZAZ', '968'),
    ('ZAZ', 'ZAZ'): ('ZAZ', '968'),
    ('DACIA', '1300'): ('DACIA', '1300/1310'), ('DACIA', '1310'): ('DACIA', '1300/1310'),
    ('AUDI', 'B4'): ('AUDI', '80'),
    ('VOLKSWAGEN', '17'): ('VOLKSWAGEN', 'GOLF'), ('VOLKSWAGEN', '1200'): ('VOLKSWAGEN', 'GARBUS'), ('VOLKSWAGEN', '1300'): ('VOLKSWAGEN', 'GARBUS'),
    ('VOLKSWAGEN', 'KAFER'): ('VOLKSWAGEN', 'GARBUS'), ('VOLKSWAGEN', 'KÄFER'): ('VOLKSWAGEN', 'GARBUS'),
    ('VOLKSWAGEN', 'T4'): ('VOLKSWAGEN', 'TRANSPORTER'), ('VOLKSWAGEN', 'T5'): ('VOLKSWAGEN', 'TRANSPORTER'), ('VOLKSWAGEN', 'T3'): ('VOLKSWAGEN', 'TRANSPORTER'),
    ('VOLKSWAGEN', 'T2'): ('VOLKSWAGEN', 'TRANSPORTER'), ('VOLKSWAGEN', 'KOMBI'): ('VOLKSWAGEN', 'TRANSPORTER'), ('VOLKSWAGEN', 'T6'): ('VOLKSWAGEN', 'TRANSPORTER'),
    ('MAZDA', '323F'): ('MAZDA', '323'), ('MAZDA', '323P'): ('MAZDA', '323'),
    ('TOYOTA', 'RAV'): ('TOYOTA', 'RAV4'), ('TOYOTA', 'RAV-4'): ('TOYOTA', 'RAV4'),
    ('VOLVO', '343'): ('VOLVO', '340/343'), ('VOLVO', '340'): ('VOLVO', '340/343'),
    ('MINI', 'COOPER'): ('MINI', 'ONE/COOPER'), ('MINI', 'ONE'): ('MINI', 'ONE/COOPER'), ('MINI', 'MINI'): ('MINI', 'ONE/COOPER'),
    ('FSM', '170/700'): ('FIAT', 'CINQUECENTO'), ('FSM', '170/900'): ('FIAT', 'CINQUECENTO'), ('FSM', 'CINQUECENTO'): ('FIAT', 'CINQUECENTO'),
    ('FIAT', '170/700'): ('FIAT', 'CINQUECENTO'), ('FIAT', '170/900'): ('FIAT', 'CINQUECENTO'), ('POLSKI FIAT', '170/700'): ('FIAT', 'CINQUECENTO'),
    ('POLSKI FIAT', '170/900'): ('FIAT', 'CINQUECENTO'), ('POLSKI FIAT', 'CINQUECENTO'): ('FIAT', 'CINQUECENTO'),
    ('FSO', 'ZASTAVA'): ('ZASTAVA', '1100'), ('ZASTAVA', '1100P'): ('ZASTAVA', '1100'),
    ('FSO', 'CARO'): ('FSO', 'POLONEZ'), ('FSO', 'ATU'): ('FSO', 'POLONEZ'), ('DAEWOO', 'POLONEZ'): ('FSO', 'POLONEZ'),
    ('FSO', 'WARSZAWA'): ('FSO', 'WARSZAWA'), ('FSO', 'M20'): ('FSO', 'WARSZAWA'), ('FSO', '223'): ('FSO', 'WARSZAWA'), ('FSO', '224'): ('FSO', 'WARSZAWA'),
    ('SUZUKI', 'WAGON'): ('SUZUKI', 'WAGON R+'), ('SUZUKI', 'WAGON R'): ('SUZUKI', 'WAGON R+'),
    ('HYUNDAI', 'SANTA-FE'): ('HYUNDAI', 'SANTA FE'),
    ('HONDA', 'CRX'): ('HONDA', 'CR-X'),
    ('CHRYSLER', 'GRAND VOYAGER'): ('CHRYSLER', 'VOYAGER'),
}
# Rodzin z tej listy nie publikujemy – nazwa nie mówi, jaki to model
POMIN = {'?', '', '-', 'FIAT', 'LADA', 'ŁADA', 'POLSKI', 'FSO', 'FSM', 'SAMOCHÓD', 'OSOBOWY', 'BRAK', 'INNY', '#NUM200', '1.5X'}

# Ładne nazwy wyświetlane na stronie
LADNE_NAZWY = {
    'CX3': 'CX-3', 'CX5': 'CX-5', 'CX7': 'CX-7', 'CX30': 'CX-30', 'MX5': 'MX-5', 'MX3': 'MX-3', 'IX20': 'ix20', 'IX35': 'ix35', 'IX55': 'ix55',
    'I10': 'i10', 'I20': 'i20', 'I30': 'i30', 'I40': 'i40', 'SANTA FE': 'Santa Fe', 'ASX': 'ASX', 'MPV': 'MPV', 'KA': 'Ka', 'RAV4': 'RAV4',
    'UP!': 'Up!', 'QASHQAI+2': 'Qashqai+2', 'SX4': 'SX4', 'CR-X': 'CR-X', 'W123': 'W123', 'W124': 'W124', '190': '190 (W201)',
    '105/120': '105 / 120', '100/110': '100 / 110', '2105/2107': '2105 / 2107', '1300/1310': '1300 / 1310', '340/343': '340 / 343',
    'ONE/COOPER': 'One / Cooper', 'GARBUS': 'Garbus (Käfer)', 'WAGON R+': 'Wagon R+', 'TOWN & COUNTRY': 'Town & Country',
    '126P': '126p', '125P': '125p', '127P': '127p', 'GT86': 'GT86', 'XC60': 'XC60', 'XC70': 'XC70', 'XC90': 'XC90', 'NIVA': 'Niva',
    'PT CRUISER': 'PT Cruiser', 'TT': 'TT', 'RX': 'RX', 'IS': 'IS', 'CC': 'CC', 'DS3': 'DS3', 'DS4': 'DS4', 'DS5': 'DS5',
    'ZS': 'ZS', 'HS': 'HS', 'EHS': 'EHS', 'T-ROC': 'T-Roc', 'T-CROSS': 'T-Cross', 'C-HR': 'C-HR', 'BZ4X': 'bZ4X', 'EV6': 'EV6', 'EV9': 'EV9',
    'XCEED': 'XCeed', 'PROCEED': 'ProCeed', 'IONIQ 5': 'Ioniq 5', 'IONIQ 6': 'Ioniq 6', 'IONIQ': 'Ioniq', 'MODEL 3': 'Model 3', 'MODEL Y': 'Model Y',
    'MODEL S': 'Model S', 'MODEL X': 'Model X', 'ID.3': 'ID.3', 'ID.4': 'ID.4', 'ID.5': 'ID.5', 'ID.7': 'ID.7', 'EQA': 'EQA', 'EQB': 'EQB',
    'EQC': 'EQC', 'EQE': 'EQE', 'EQS': 'EQS', 'SEAL U': 'Seal U', 'I3': 'i3', 'I4': 'i4', 'IX': 'iX', 'IX3': 'iX3', 'NX': 'NX', 'UX': 'UX', 'CT': 'CT', 'GS': 'GS', 'LS': 'LS', 'ES': 'ES', 'RZ': 'RZ', 'LBX': 'LBX', 'MUSTANG MACH-E': 'Mustang Mach-E'
}


def ladna_rodzina(r):
    if r.startswith('Seria') or r.startswith('Klasa'):
        return r
    if r in LADNE_NAZWY:
        return LADNE_NAZWY[r]

    def slowo(w):
        if re.search(r'\d', w) or len(w) <= 2:
            return w  # A4, XC90, ZX zostają bez zmian
        return w.capitalize()
    return ' '.join('-'.join(slowo(c) for c in w.split('-')) for w in r.split(' '))


def slug(s):
    s = unicodedata.normalize('NFKD', s.replace('ł', 'l').replace('Ł', 'L')).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


# ================================================================ etykiety
NADWOZIE = {'KARETA (SEDAN)': 'Sedan', 'HATCHBACK': 'Hatchback', 'KOMBI': 'Kombi', 'COUPE': 'Coupe', 'KABRIOLET': 'Kabriolet',
            'VAN': 'Van', 'WIELOZADANIOWY': 'Wielozadaniowy (SUV, minivan)', 'TERENOWY': 'Terenowy', 'FURGON': 'Furgon'}
NADWOZIE_RYS = {'KARETA (SEDAN)': 'sedan', 'HATCHBACK': 'hatchback', 'KOMBI': 'kombi', 'COUPE': 'coupe', 'KABRIOLET': 'kabriolet',
                'VAN': 'van', 'WIELOZADANIOWY': 'van', 'TERENOWY': 'suv'}
PALIWO = {'B': 'Benzyna', 'ON': 'Diesel', 'B+LPG': 'Benzyna + LPG', 'B+EL': 'Hybryda (benzyna + elektryczny)', 'ON+EL': 'Hybryda (diesel + elektryczny)',
          'EL': 'Elektryczny', 'HYB': 'Hybryda', 'H2': 'Wodór', 'H2+EL': 'Wodór', 'GAZ': 'Gaz', 'ON+LPG': 'Diesel + LPG'}
POCHODZENIE = {'UI': 'Sprowadzony z zagranicy (używany)', 'UK': 'Kupiony w Polsce jako używany', 'NK': 'Nowy z polskiego salonu', 'NI': 'Sprowadzony z zagranicy jako nowy'}


def parse_map(s):
    out = {}
    body = s.split(':', 1)[1]
    if not body:
        return out
    for part in body.split(','):
        if '=' in part:
            k, v = part.rsplit('=', 1)
            out[k] = out.get(k, 0) + int(v)
    return out


def dodaj(d, src):
    for k, v in src.items():
        d[k] = d.get(k, 0) + v


# ================================================================ wczytanie i grupowanie
def wczytaj():
    wiersze, surowe_wiersze, tot = [], [], {}
    with open(ZESTAWIENIE, encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n')
            if not line:
                continue
            p = line.split('\t')
            if p[0] == 'G':
                wiersze.append({
                    'marka_cepik': p[1], 'base': p[2], 'rok': p[3], 'n': int(p[4]), 'a': int(p[5]),
                    'W': parse_map(p[6]), 'D': parse_map(p[7]), 'P': parse_map(p[8]), 'J': parse_map(p[9]), 'O': parse_map(p[10])
                })
            elif p[0] == 'R':
                surowe_wiersze.append((p[1], p[2], p[3], int(p[4])))
            elif p[0] == 'T':
                tot = json.loads(p[1])
    for w in wiersze:
        w['nowe'] = 0; w['Y'] = {}
    # auta zarejestrowane po raz pierwszy w Polsce po dacie paczek (z API CEPiK)
    global STAN_NA, META_NOWE
    if os.path.exists(NOWE):
        with open(NOWE, encoding='utf-8') as f:
            for line in f:
                p = line.rstrip('\n').split('\t')
                if p[0] == 'G':
                    D = {('KARETA (SEDAN)' if k == 'KARETA SEDAN' else k): v for k, v in parse_map(p[7]).items()}
                    w = {'marka_cepik': p[1], 'base': p[2], 'rok': p[3], 'n': int(p[4]), 'a': int(p[4]), 'nowe': int(p[4]),
                         'W': parse_map(p[6]), 'D': D, 'P': parse_map(p[8]), 'J': parse_map(p[9]), 'O': parse_map(p[10]), 'Y': parse_map(p[11]),
                         'K': parse_map(p[12]) if len(p) > 12 else {}}
                    wiersze.append(w)
                    for t_, v in w['W'].items():
                        if t_ in tot:
                            tot[t_]['osobReg'] += v
                elif p[0] == 'R':
                    surowe_wiersze.append((p[1], p[2], p[3], int(p[4])))
                elif p[0] == 'M':
                    META_NOWE = json.loads(p[1])
        STAN_NA = META_NOWE.get('ostatniDzien') or META_NOWE.get('do') or STAN_NA
        # suma nowych rejestracji w pełnych miesiącach (do kafelków na stronie głównej)
        for w in wiersze:
            for m_, v in w.get('K', {}).items():
                MIESIACE_SUMA[m_] = MIESIACE_SUMA.get(m_, 0) + v
    return wiersze, surowe_wiersze, tot


def przypisz_rodzine(marka, base, rok, zgadywanie):
    """Zwraca (marka, rodzina) dla wiersza z CEPiK albo None, jeśli nie da się ustalić modelu."""
    marka = norm_marka(marka, base)
    if marka in BEZ_MARKI:
        marka = None
        for wzor, m in ZGADNIJ_MARKE:
            if re.search(wzor, base):
                marka = m
                break
        if marka is None:
            marka = zgadywanie.get(base.split(' ')[0])
        if marka is None:
            return None
    # warianty Malucha, Dużego Fiata i Cinquecento zapisane na dziesiątki sposobów
    if marka in ('POLSKI FIAT', 'FSM', 'FIAT', 'FSO'):
        if re.search(r'126', base):
            return ('POLSKI FIAT', '126P')
        if re.search(r'125', base) or (marka in ('POLSKI FIAT', 'FSO') and re.match(r'^1[35]00\b', base)):
            return ('POLSKI FIAT', '125P')
        if re.search(r'CINQUECENTO|170/', base):
            return ('FIAT', 'CINQUECENTO')
    r = rodzina(marka, base)
    if r == '#NUM200':
        if not rok.isdigit() or int(rok) > 1997:
            return None
        r = 'W123' if int(rok) <= 1985 else 'W124'
    marka, r = ALIASY.get((marka, r), (marka, r))
    if r in POMIN or r == marka:
        return None
    return (marka, r)


def zbuduj_zgadywanie(wiersze):
    """Słownik „pierwsze słowo nazwy modelu → marka” z wierszy, w których marka jest znana (np. ESCORT → FORD)."""
    licz = defaultdict(lambda: defaultdict(int))
    for w in wiersze:
        m = norm_marka(w['marka_cepik'], w['base'])
        if m in BEZ_MARKI:
            continue
        slowo = w['base'].split(' ')[0]
        if len(slowo) >= 4 and re.match(r'^[A-Z][A-Z\-]+$', slowo) and slowo not in PRZEDROSTKI:
            licz[slowo][m] += w['n']
    wynik = {}
    for slowo, marki in licz.items():
        suma = sum(marki.values())
        m, n = max(marki.items(), key=lambda x: x[1])
        if suma >= 200 and n / suma >= 0.95:
            wynik[slowo] = m
    return wynik


def zsumuj(wiersze):
    s = {'n': 0, 'a': 0, 'nowe': 0, 'W': {}, 'D': {}, 'P': {}, 'J': {}, 'O': {}, 'Y': {}, 'K': {}, 'lata': {}}
    for w in wiersze:
        s['n'] += w['n']; s['a'] += w['a']; s['nowe'] += w.get('nowe', 0)
        dodaj(s['Y'], w.get('Y', {}))
        dodaj(s['K'], w.get('K', {}))
        rok_ = int(w['rok']) if w['rok'].isdigit() else 0
        # paliwo „elektryczne” i „hybryda” przy starych rocznikach to zwykle błędne wpisy – nie liczymy ich
        if rok_ >= 2010:
            s['ev'] = s.get('ev', 0) + w['P'].get('EL', 0)
        if rok_ >= 1997:
            s['hyb'] = s.get('hyb', 0) + sum(v for k, v in w['P'].items() if k.endswith('+EL') or k == 'HYB')
        for k in 'WDPJO':
            dodaj(s[k], w[k])
        if w['rok'].isdigit():
            s['lata'][int(w['rok'])] = s['lata'].get(int(w['rok']), 0) + w['n']
    return s


def lista(d, etykiety=None, top=None, min_udzial=0.005, nieznane=('?', '---', 'XX', 'BRAK DANYCH', 'X', 'INNY', 'INNE')):
    suma = sum(d.values()) or 1
    items, inne = [], 0
    for k, v in sorted(d.items(), key=lambda x: -x[1]):
        if k in nieznane or v / suma < min_udzial or (top and len(items) >= top):
            inne += v
            continue
        items.append({'nazwa': (etykiety or {}).get(k, k), 'liczba': v})
    if inne:
        items.append({'nazwa': 'Inne / brak danych', 'liczba': inne})
    return items


def pojemnosci(d):
    out = {}
    for k, v in d.items():
        try:
            cc = int(float(k))
        except ValueError:
            cc = 0
        key = '?' if cc <= 0 else f'{cc / 1000:.1f} l'.replace('.', ',')
        out[key] = out.get(key, 0) + v
    return lista(out, top=8, min_udzial=0.01)


def roczniki(lata, od=None, do=None):
    if not lata:
        return []
    lo = od or min(lata); hi = do or max(lata)
    suma = sum(lata.values())
    ys = sorted(y for y, n in lata.items() if n / suma >= 0.002 and lo <= y <= hi and y > 1946)
    if not ys:
        return []
    return [{'rok': y, 'liczba': lata.get(y, 0)} for y in range(ys[0], ys[-1] + 1)]


def udzial(d, klucze, pomin=('?', 'X', '---', 'INNY', 'BRAK DANYCH', 'XX')):
    znane = sum(v for k, v in d.items() if k not in pomin and not k.startswith('?'))
    return (sum(d.get(k, 0) for k in klucze) / znane) if znane else 0


def sredni_rocznik(lata):
    ys = {y: n for y, n in lata.items() if y > 1946}
    s = sum(ys.values())
    return round(sum(y * n for y, n in ys.items()) / s, 1) if s else None


def model_json(slug_, marka, model, generacja, lata_txt, s, opis, jak, extra=None, daty=None):
    nad = max(((k, v) for k, v in s['D'].items() if k in NADWOZIE_RYS), key=lambda x: x[1], default=('KARETA (SEDAN)', 0))[0]
    nadwozia = [NADWOZIE_RYS[k] for k, _ in sorted(s['D'].items(), key=lambda x: -x[1]) if k in NADWOZIE_RYS and s['D'][k] / max(1, s['n']) >= 0.03]
    if not nadwozia:
        nadwozia = [NADWOZIE_RYS[nad]]
    nadwozia = list(dict.fromkeys(nadwozia))
    j = {
        'slug': slug_, 'marka': marka, 'model': model, 'generacja': generacja, 'lataProdukcji': lata_txt,
        'nadwozia': nadwozia, 'opisModelu': opis, 'daneTestowe': False,
        'cepik': {
            'stanNa': STAN_NA, 'jakLiczone': jak, 'liczbaWPolsce': s['n'], 'aktywne': s['a'],
            'wojewodztwa': [{'teryt': k, 'liczba': v} for k, v in sorted(s['W'].items()) if k in WOJ],
            'bezWojewodztwa': sum(v for k, v in s['W'].items() if k not in WOJ),
            'roczniki': roczniki(s['lata'], *(daty or (None, None))),
            'paliwa': lista(s['P'], PALIWO, top=6, min_udzial=0.01),
            'pojemnosci': pojemnosci(s['J']),
            'pochodzenie': lista(s['O'], POCHODZENIE),
            'nadwozia': lista(s['D'], NADWOZIE, top=6, min_udzial=0.01),
            'noweOdPaczki': s['nowe'],
            'hybrydy': s.get('hyb', 0),
            'elektryczne': s.get('ev', 0),
            'pierwszeRejestracje': [{'rok': int(k), 'liczba': v} for k, v in sorted(s['Y'].items()) if k.isdigit()],
            'rejestracjeMiesiecznie': [{'miesiac': m_, 'liczba': s['K'].get(m_, 0)} for m_ in sorted(PELNE_MIESIACE)]
        },
        'youtubeId': '',
        'zrodla': [ZRODLO_CEPIK],
        'dataAktualizacji': DATA_AKTUALIZACJI
    }
    if extra:
        for k, v in extra.items():
            if k == 'zrodla':
                j['zrodla'] = j['zrodla'] + v
            elif k != 'cepik':
                j[k] = v
    return j


def skaluj(w, f, nadwozia):
    """Zostawia tylko wybrane nadwozia; pozostałe zestawienia skaluje proporcjonalnie."""
    out = {'base': w['base'], 'rok': w['rok'], 'n': round(w['n'] * f), 'a': round(w['a'] * f), 'nowe': round(w.get('nowe', 0) * f),
           'Y': {a: round(v * f) for a, v in w.get('Y', {}).items()}, 'K': {a: round(v * f) for a, v in w.get('K', {}).items()}}
    for k in 'WPJO':
        out[k] = {a: round(v * f) for a, v in w[k].items()}
    out['D'] = {a: v for a, v in w['D'].items() if a in nadwozia}
    return out


def zapisz(sciezka, dane, wciecie=None):
    with open(sciezka, 'w', encoding='utf-8') as f:
        json.dump(dane, f, ensure_ascii=False, indent=wciecie, separators=None if wciecie else (',', ':'))


# ================================================================ główny program
def main():
    wiersze, surowe_wiersze, tot = wczytaj()
    global PELNE_MIESIACE
    PELNE_MIESIACE = pelne_miesiace()
    zgadywanie = zbuduj_zgadywanie(wiersze)

    rodziny = defaultdict(list)
    odzyskane = pominiete = 0
    for w in wiersze:
        k = przypisz_rodzine(w['marka_cepik'], w['base'], w['rok'], zgadywanie)
        if k is None:
            pominiete += w['n']
            continue
        if norm_marka(w['marka_cepik'], w['base']) in BEZ_MARKI:
            odzyskane += w['n']
        rodziny[k].append(w)

    surowe = defaultdict(lambda: defaultdict(int))
    for m, b, raw, n in surowe_wiersze:
        k = przypisz_rodzine(m, b, '2000', zgadywanie)
        if k:
            surowe[k][raw] += n

    os.makedirs(WYJSCIE, exist_ok=True)
    for f in glob.glob(os.path.join(WYJSCIE, '*.json')):
        os.remove(f)

    # rodziny, które dają ten sam adres karty (np. „206” i „206+”), łączymy w jedną
    po_slugu = defaultdict(list)
    for (marka, rod), ws in rodziny.items():
        po_slugu[slug(f'{marka} {ladna_rodzina(rod.rstrip("+"))}')].append(((marka, rod), ws))
    scalone = {}
    for sl, el in po_slugu.items():
        el.sort(key=lambda x: -sum(w['n'] for w in x[1]))
        glowna = el[0][0]
        scalone[glowna] = [w for _, ws in el for w in ws]
        for (m, r), _ in el[1:]:
            surowe[glowna].update({k: surowe[glowna].get(k, 0) + v for k, v in surowe[(m, r)].items()})
            rodziny[(m, r)] = []

    raport, karty = [], {}
    WSZ = {}  # wszystkie karty (zapisywane na końcu, po dodaniu powiązań)
    for (marka, rod), ws in scalone.items():
        s = zsumuj(ws)
        if s['n'] < MIN_AUT_RODZINA:
            continue
        lata = [y for y, n in s['lata'].items() if n / s['n'] >= 0.01 and y > 1946]
        lata_txt = f'{min(lata)}–{max(lata)}' if lata else ''
        sl = slug(f'{marka} {ladna_rodzina(rod.rstrip("+"))}')
        nazwy = sorted(surowe[(marka, rod)].items(), key=lambda x: -x[1])[:5]
        jak = (f'Wszystkie zarejestrowane samochody osobowe {ladna_marka(marka)} {ladna_rodzina(rod)} – wszystkie generacje razem. '
               + (f'To suma aut z paczek CEPiK (stan na listopad 2019) i {s["nowe"]:,} aut zarejestrowanych w Polsce po raz pierwszy później (API CEPiK). '.replace(',', ' ') if s['nowe'] else '')
               + f'W CEPiK nazwy wpisywane są ręcznie, więc łączymy różne zapisy (najczęstsze: {", ".join(n for n, _ in nazwy) or "—"}).')
        j = model_json(sl, ladna_marka(marka), ladna_rodzina(rod), '', lata_txt, s, '', jak)
        j['wszystkieGeneracje'] = True
        j['_klucz'] = (marka, rod); j['_s'] = s
        WSZ[sl] = j
        raport.append((s['n'], sl))
        karty[(marka, rod)] = {'slug': sl, 'nazwa': f'{ladna_marka(marka)} {ladna_rodzina(rod)}', 's': s, 'ws': ws, 'marka': marka}

    # ---------------------------------------------------- generacje opisane ręcznie
    for path in sorted(glob.glob(os.path.join(DEFINICJE, '*.json'))):
        d = json.load(open(path, encoding='utf-8'))
        marka = d['cepik']['marka']; rod = d['cepik']['rodzina']
        if (marka, rod) not in rodziny:
            print('UWAGA: brak rodziny', marka, rod, 'dla', path)
            continue
        wyklucz = re.compile(d['cepik']['wykluczNazwy']) if d['cepik'].get('wykluczNazwy') else None
        wyb = []
        for w in rodziny[(marka, rod)]:
            if not w['rok'].isdigit() or (wyklucz and wyklucz.search(w['base'])):
                continue
            y = int(w['rok'])
            for reg in d['cepik']['reguly']:
                if not (reg['rokOd'] <= y <= reg['rokDo']):
                    continue
                if 'nadwozia' in reg:
                    nd = sum(v for k, v in w['D'].items() if k in reg['nadwozia'])
                    if nd:
                        wyb.append(skaluj(w, nd / w['n'], reg['nadwozia']))
                else:
                    wyb.append(w)
                break
        s = zsumuj(wyb)
        j = model_json(d['slug'], d['marka'], d['model'], d['generacja'], d['lataProdukcji'], s, d.get('opisModelu', ''), d['cepik']['jakLiczone'],
                       d, daty=(d['cepik'].get('rokOdWykres'), d['cepik'].get('rokDoWykres')))
        j['wszystkieGeneracje'] = False
        j['_klucz'] = (marka, rod); j['_s'] = s; j['_rokOd'] = min(r_['rokOd'] for r_ in d['cepik']['reguly'])
        WSZ[d['slug']] = j
        raport.append((s['n'], d['slug'] + ' (generacja)'))

    # ---------------------------------------------------- adresy, generacje, konkurenci, miejsca w rankingu
    rodzinne = {j['_klucz']: j for j in WSZ.values() if j['wszystkieGeneracje']}
    for j in WSZ.values():
        if j['wszystkieGeneracje']:
            j['markaSlug'] = slug(j['marka']); j['modelSlug'] = slug(j['model'])
            j['adres'] = f"/marki/{j['markaSlug']}/{j['modelSlug']}/"
    for j in WSZ.values():
        if not j['wszystkieGeneracje']:
            r_ = rodzinne.get(j['_klucz'])
            j['markaSlug'] = r_['markaSlug'] if r_ else slug(j['marka'])
            j['modelSlug'] = r_['modelSlug'] if r_ else slug(j['model'])
            if r_:
                j['rodzic'] = r_['slug']
            j['generacjaSlug'] = slug(j['generacja'])
            j['adres'] = f"/marki/{j['markaSlug']}/{j['modelSlug']}/{j['generacjaSlug']}/"
    ADRES = {sl_: j['adres'] for sl_, j in WSZ.items()}
    nazwa_karty = lambda j: f"{j['marka']} {j['model']} {j['generacja']}".strip()
    ref = lambda j: {'slug': j['slug'], 'nazwa': nazwa_karty(j), 'adres': j['adres']}
    # generacje w obrębie modelu: lista na karcie modelu + poprzednik / następca
    gen_rodziny = defaultdict(list)
    for j in WSZ.values():
        if not j['wszystkieGeneracje']:
            gen_rodziny[j['_klucz']].append(j)
    for k_, gens in gen_rodziny.items():
        gens.sort(key=lambda j: j['_rokOd'])
        if k_ in rodzinne:
            rodzinne[k_]['generacjeLista'] = [dict(ref(g), lata=g['lataProdukcji']) for g in gens]
        for i, g in enumerate(gens):
            if i > 0:
                g['poprzednik'] = ref(gens[i - 1])
            if i < len(gens) - 1:
                g['nastepca'] = ref(gens[i + 1])
    # miejsce w rankingu popularności (karty zbiorcze)
    rodz_sort = sorted(rodzinne.values(), key=lambda j: -j['cepik']['liczbaWPolsce'])
    w_marce = defaultdict(int)
    for i, j in enumerate(rodz_sort):
        w_marce[j['markaSlug']] += 1
        j['cepik']['miejsce'] = i + 1
        j['cepik']['miejsceWMarce'] = w_marce[j['markaSlug']]
        j['cepik']['modeliWMarce'] = 0
    for j in rodz_sort:
        j['cepik']['modeliWMarce'] = w_marce[j['markaSlug']]
    for j in WSZ.values():
        j['cepik']['sredniRocznik'] = sredni_rocznik(j['_s']['lata'])
    # konkurenci w klasie: podobny rocznik, pojemność, nadwozie i udział diesla – inna marka
    def cechy(j):
        s_ = j['_s']
        cc_n = [(int(float(k)), v) for k, v in s_['J'].items() if re.match(r'^\d+(\.\d+)?$', k) and 600 <= float(k) <= 7000]
        cc = sum(c * v for c, v in cc_n) / max(1, sum(v for _, v in cc_n)) if cc_n else 0
        nad = max(((NADWOZIE_RYS.get(k), v) for k, v in s_['D'].items() if k in NADWOZIE_RYS), key=lambda x: x[1], default=(None, 0))[0]
        return {'rok': j['cepik']['sredniRocznik'] or 0, 'cc': cc, 'nad': nad, 'on': udzial(s_['P'], ['ON', 'ON+LPG', 'ON+EL']),
                'ev': (s_.get('ev', 0)) / max(1, s_['n']), 'n': s_['n']}
    kandydaci = [(j, cechy(j)) for j in WSZ.values() if j['_s']['n'] >= 1000]
    import math
    for j in WSZ.values():
        if j['_s']['n'] < 300:
            continue
        a = cechy(j)
        if not a['cc'] and a['ev'] < 0.5:
            continue
        wyniki = []
        for k_j, b in kandydaci:
            if k_j['_klucz'][0] == j['_klucz'][0] or k_j['_klucz'] == j['_klucz']:
                continue
            if k_j['wszystkieGeneracje'] != j['wszystkieGeneracje'] and not j['wszystkieGeneracje'] and False:
                continue
            d_ = abs(a['rok'] - b['rok']) / 2.5 + (abs(a['cc'] - b['cc']) / max(1, 0.15 * a['cc']) if a['cc'] and b['cc'] else 1)
            d_ += (0 if a['nad'] == b['nad'] else 1.5) + abs(a['on'] - b['on']) * 2 + abs(a['ev'] - b['ev']) * 3
            d_ -= 0.35 * math.log10(max(10, b['n']))
            wyniki.append((d_, k_j))
        wyniki.sort(key=lambda x: x[0])
        widziane, lista_k = set(), []
        for _, k_j in wyniki:
            if k_j['_klucz'] in widziane:
                continue
            widziane.add(k_j['_klucz'])
            lista_k.append(ref(k_j))
            if len(lista_k) == 5:
                break
        j['konkurenci'] = lista_k
    # strony marek
    marki = {}
    for j in rodz_sort:
        m_ = marki.setdefault(j['markaSlug'], {'slug': j['markaSlug'], 'nazwa': j['marka'], 'kod': j['_klucz'][0], 'auta': 0, 'nowe': 0, 'hybrydy': 0,
                                                 'elektryczne': 0, 'chinska': j['_klucz'][0] in CHINSKIE, 'W': {}, 'modele': []})
        c_ = j['cepik']
        m_['auta'] += c_['liczbaWPolsce']; m_['nowe'] += c_['noweOdPaczki']; m_['hybrydy'] += c_['hybrydy']; m_['elektryczne'] += c_['elektryczne']
        dodaj(m_['W'], j['_s']['W'])
        m_['modele'].append({'slug': j['slug'], 'nazwa': j['model'], 'adres': j['adres'], 'liczba': c_['liczbaWPolsce'], 'nowe': c_['noweOdPaczki'],
                             'lata': j['lataProdukcji'], 'generacje': [dict(ref(g), nazwa=f"{g['model']} {g['generacja']}") for g in gen_rodziny.get(j['_klucz'], [])]})
    for m_ in marki.values():
        m_['wojewodztwa'] = [{'teryt': k, 'liczba': v} for k, v in sorted(m_.pop('W').items()) if k in WOJ]
    zapisz(os.path.join(ROOT, 'data', 'marki.json'), {'stanNa': STAN_NA, 'marki': sorted(marki.values(), key=lambda m_: -m_['auta'])}, 1)

    # ---------------------------------------------------- tło: wszystkie osobówki w województwach
    tlo = {k: v['osobReg'] for k, v in tot.items() if k in WOJ}
    razem = sum(tlo.values())
    zapisz(os.path.join(ROOT, 'data', 'cepik', 'tlo.json'), {'stanNa': STAN_NA, 'razem': razem, 'wojewodztwa': tlo,
        'miesiace': [{'miesiac': m_, 'liczba': MIESIACE_SUMA.get(m_, 0)} for m_ in sorted(PELNE_MIESIACE)],
        'noweZakres': {'od': META_NOWE.get('od', '2019-11-09'), 'do': META_NOWE.get('ostatniDzien') or META_NOWE.get('do'), 'kompletne': bool(META_NOWE.get('kompletne', True))} if META_NOWE else None}, 1)

    # ---------------------------------------------------- strony województw
    woj_dane = {}
    for t, nazwa in WOJ.items():
        lata = defaultdict(int)
        modele = []
        for (marka, rod), k in karty.items():
            n = k['s']['W'].get(t, 0)
            if n:
                modele.append((n, k))
        for ws in rodziny.values():
            for w in ws:
                n = w['W'].get(t, 0)
                if n and w['rok'].isdigit() and int(w['rok']) > 1946:
                    lata[int(w['rok'])] += n
        auta = tlo.get(t, 0)
        top = sorted(modele, key=lambda x: -x[0])[:25]
        charakt = []
        for n, k in modele:
            if n >= 300 and k['s']['n'] >= 5000:
                indeks = (n / k['s']['n']) / (auta / razem)
                charakt.append((indeks, n, k))
        charakt.sort(key=lambda x: -x[0])
        suma_lat = sum(lata.values()) or 1
        dekady = defaultdict(int)
        for y, n in lata.items():
            dekady[min(2010, max(1960, y // 10 * 10))] += n
        woj_dane[t] = {
            'teryt': t, 'nazwa': nazwa, 'slug': slug(nazwa), 'auta': auta, 'naTysiacAutWPolsce': round(auta / razem * 1000, 1),
            'sredniRocznik': sredni_rocznik(lata),
            'dekady': [{'nazwa': ('przed 1970' if d == 1960 else f'{d}–{d + 9}' if d < 2010 else '2010 i nowsze'), 'liczba': n} for d, n in sorted(dekady.items())],
            'top': [{'slug': k['slug'], 'nazwa': k['nazwa'], 'liczba': n} for n, k in top],
            'charakterystyczne': [{'slug': k['slug'], 'nazwa': k['nazwa'], 'liczba': n, 'indeks': round(i, 2)} for i, n, k in charakt[:15]]
        }
    for w_ in woj_dane.values():
        for el in w_['top'] + w_['charakterystyczne']:
            el['adres'] = ADRES[el['slug']]
    zapisz(os.path.join(ROOT, 'data', 'wojewodztwa.json'), woj_dane, 1)

    # ---------------------------------------------------- rankingi
    duze = [k for k in karty.values() if k['s']['n'] >= 10000]

    def ranking(fn, opis_fn, n=15, odwrotnie=True, warunek=lambda k: True):
        el = [(fn(k), k) for k in duze if warunek(k)]
        el = [e for e in el if e[0] is not None]
        el.sort(key=lambda x: x[0], reverse=odwrotnie)
        return [{'slug': k['slug'], 'nazwa': k['nazwa'], 'wartosc': opis_fn(v, k), 'liczba': k['s']['n']} for v, k in el[:n]]

    proc = lambda v, k: f'{v * 100:.0f}%'.replace('.', ',')

    def max_indeks(k):
        s = k['s']
        best = max(((s['W'].get(t, 0) / s['n']) / (tlo[t] / razem), t) for t in WOJ if tlo.get(t))
        return best

    rankingi = [
        {'id': 'najpopularniejsze', 'tytul': 'Najpopularniejsze modele w Polsce', 'opis': 'Liczba zarejestrowanych samochodów osobowych (wszystkie generacje razem).',
         'pozycje': ranking(lambda k: k['s']['n'], lambda v, k: f'{v:,}'.replace(',', ' ') + ' szt.', n=25)},
        {'id': 'sprowadzane', 'tytul': 'Najczęściej sprowadzane z zagranicy', 'opis': 'Udział aut, które trafiły do polskiej rejestracji jako używane z zagranicy.',
         'pozycje': ranking(lambda k: udzial(k['s']['O'], ['UI']), proc)},
        {'id': 'z-salonu', 'tytul': 'Najczęściej z polskiego salonu', 'opis': 'Udział aut kupionych jako nowe w Polsce.',
         'pozycje': ranking(lambda k: udzial(k['s']['O'], ['NK']), proc)},
        {'id': 'lpg', 'tytul': 'Najczęściej z instalacją LPG', 'opis': 'Udział aut z wpisanym gazem (LPG) jako paliwem dodatkowym.',
         'pozycje': ranking(lambda k: udzial(k['s']['P'], ['B+LPG', 'ON+LPG', '?+LPG']), proc)},
        {'id': 'diesle', 'tytul': 'Modele, w których dominuje diesel', 'opis': 'Udział aut z silnikiem wysokoprężnym.',
         'pozycje': ranking(lambda k: udzial(k['s']['P'], ['ON', 'ON+LPG', 'ON+EL']), proc)},
        {'id': 'najstarsze', 'tytul': 'Najstarsze wciąż zarejestrowane', 'opis': 'Średni rok produkcji zarejestrowanych egzemplarzy.',
         'pozycje': ranking(lambda k: sredni_rocznik(k['s']['lata']), lambda v, k: f'średnio {v:.0f} r.', odwrotnie=False)},
        {'id': 'zywe', 'tytul': 'Starsze modele, którymi wciąż się handluje', 'opis': 'Modele ze średnim rocznikiem sprzed 2005 r. z największym udziałem aut, które od 2017 r. zmieniły właściciela albo zostały sprowadzone.',
         'pozycje': ranking(lambda k: k['s']['a'] / k['s']['n'], proc, warunek=lambda k: (sredni_rocznik(k['s']['lata']) or 3000) < 2005)},
        {'id': 'regionalne', 'tytul': 'Najbardziej „regionalne” modele', 'opis': 'Ile razy częściej niż średnio w Polsce dany model występuje w województwie, w którym jest najpopularniejszy.',
         'pozycje': ranking(lambda k: max_indeks(k)[0], lambda v, k: f'{v:.1f}× częściej – {WOJ[max_indeks(k)[1]].lower()}'.replace('.', ','))},
    ]
    # rankingi z nowych danych (auta zarejestrowane w Polsce po raz pierwszy od listopada 2019)
    if META_NOWE:
        wszystkie = list(karty.values())
        szt = lambda v, k: f'{v:,}'.replace(',', ' ') + ' szt.'
        def ranking_n(fn, opis_fn, n=25, prog=0, warunek=lambda k: True):
            el = [(fn(k), k) for k in wszystkie if warunek(k) and k['s']['nowe'] >= prog]
            el = [e for e in el if e[0]]
            el.sort(key=lambda x: -x[0])
            return [{'slug': k['slug'], 'nazwa': k['nazwa'], 'wartosc': opis_fn(v, k), 'liczba': k['s']['n']} for v, k in el[:n]]
        hyb = lambda k: k['s'].get('hyb', 0)
        rankingi[1:1] = [
            {'id': 'nowe-rejestracje', 'tytul': 'Najczęściej rejestrowane od 2020 r.', 'opis': 'Auta zarejestrowane w Polsce po raz pierwszy od listopada 2019 r. – nowe z salonu i sprowadzone.',
             'pozycje': ranking_n(lambda k: k['s']['nowe'], szt)},
            {'id': 'hybrydy', 'tytul': 'Najpopularniejsze hybrydy', 'opis': 'Liczba zarejestrowanych aut z napędem hybrydowym (benzyna lub diesel + silnik elektryczny, także plug-in).',
             'pozycje': ranking_n(hyb, szt)},
            {'id': 'elektryczne', 'tytul': 'Najpopularniejsze auta elektryczne', 'opis': 'Liczba zarejestrowanych aut w pełni elektrycznych.',
             'pozycje': ranking_n(lambda k: k['s'].get('ev', 0), szt)},
            {'id': 'chinskie', 'tytul': 'Chińskie marki w Polsce', 'opis': 'Najczęściej zarejestrowane modele chińskich marek (m.in. MG, BYD, Omoda, Jaecoo, Chery). Liczymy auta z rocznika 2019 i nowsze.',
             'pozycje': ranking_n(lambda k: sum(n for y, n in k['s']['lata'].items() if y >= 2019), szt, n=30, warunek=lambda k: k['marka'] in CHINSKIE)},
        ]
    for r_ in rankingi:
        for el in r_['pozycje']:
            el['adres'] = ADRES[el['slug']]
    zapisz(os.path.join(ROOT, 'data', 'rankingi.json'), {'stanNa': STAN_NA, 'rankingi': rankingi}, 1)
    # zapis kart
    for sl_, j in WSZ.items():
        zapisz(os.path.join(WYJSCIE, sl_ + '.json'), {k: v for k, v in j.items() if not k.startswith('_')}, 1)

    raport.sort(reverse=True)
    print(f'Zapisano {len(raport)} kart. Marka odzyskana z nazwy modelu dla {odzyskane:,} aut, pominięto {pominiete:,} aut bez rozpoznanego modelu.')
    for n, sl in raport[:12]:
        print(f'  {n:>9,}  {sl}')


if __name__ == '__main__':
    main()
