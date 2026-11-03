"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as LMapa, LayerGroup } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  LocateFixed,
  Navigation,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  znajdzMiejsce,
  overpass,
  km,
  nawigacja,
  KAFELKI_MAPY,
  ATRYBUCJA,
  Punkt,
} from "@/lib/osm";
import {
  zapytanie,
  zapytanieTrasy,
  przetworz,
  Obiekt,
  Tryb,
} from "@/lib/obiekty-mapy";
import { miasto, MIASTA } from "@/lib/miasta";
import { sledz } from "@/lib/sledz";

// Mapa ładowarek albo fotoradarów: wpisz miejscowość (albo użyj swojej lokalizacji) → mapa i lista obiektów w promieniu.

const SZYBKIE = [
  "Warszawa",
  "Kraków",
  "Wrocław",
  "Poznań",
  "Gdańsk",
  "Łódź",
  "Lublin",
  "Katowice",
];
const PROMIENIE = [5, 10, 25];
const PASY = [2, 5, 10];
const pole =
  "w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-steel-500 focus:outline-none";

const FILTRY: Record<Tryb, { id: string; nazwa: string }[]> = {
  ladowarki: [
    { id: "", nazwa: "Wszystkie" },
    { id: "szybka", nazwa: "Szybkie (50 kW+)" },
    { id: "CCS", nazwa: "CCS" },
    { id: "Typ 2", nazwa: "Typ 2" },
    { id: "CHAdeMO", nazwa: "CHAdeMO" },
  ],
  fotoradary: [
    { id: "", nazwa: "Wszystkie" },
    { id: "fotoradar", nazwa: "Fotoradary" },
    { id: "odcinkowy", nazwa: "Odcinkowe pomiary" },
  ],
};

/** Polska odmiana: 1 ładowarka, 2–4 ładowarki, 5+ ładowarek */
function odmiana(n: number, [jeden, kilka, wiele]: [string, string, string]) {
  if (n === 1) return jeden;
  const r10 = n % 10,
    r100 = n % 100;
  return r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14) ? kilka : wiele;
}

/** Treść dymka budujemy z elementów DOM (a nie z HTML), bo opisy w OpenStreetMap wpisują wolontariusze */
function dymek(o: Obiekt): HTMLElement {
  const d = document.createElement("div");
  const h = document.createElement("strong");
  h.textContent = o.tytul;
  d.appendChild(h);
  for (const l of o.opis) {
    const p = document.createElement("div");
    p.textContent = l;
    p.style.fontSize = "12px";
    d.appendChild(p);
  }
  const a = document.createElement("a");
  a.href = nawigacja(o.lat, o.lon);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = "Nawiguj →";
  a.style.fontWeight = "700";
  d.appendChild(a);
  return d;
}

export default function MapaObiektow({ tryb }: { tryb: Tryb }) {
  const kontener = useRef<HTMLDivElement>(null);
  const mapa = useRef<LMapa | null>(null);
  const warstwa = useRef<LayerGroup | null>(null);
  const L = useRef<typeof import("leaflet") | null>(null);
  const przerwij = useRef<AbortController | null>(null);

  const [tekst, setTekst] = useState("");
  const [srodek, setSrodek] = useState<Punkt | null>(null);
  const [promien, setPromien] = useState(10);
  const [obiekty, setObiekty] = useState<Obiekt[]>([]);
  const [filtr, setFiltr] = useState("");
  const [laduje, setLaduje] = useState(false);
  const [blad, setBlad] = useState("");
  const [gotowa, setGotowa] = useState(false);
  const [rodzaj, setRodzaj] = useState<"okolica" | "trasa">("okolica");
  const [skad, setSkad] = useState("");
  const [dokad, setDokad] = useState("");
  const [trasa, setTrasa] = useState<{ a: Punkt; b: Punkt } | null>(null);
  const [pas, setPas] = useState(5);

  // mapa tworzy się dopiero w przeglądarce
  useEffect(() => {
    let zniszczona = false;
    import("leaflet").then((mod) => {
      if (zniszczona || !kontener.current || mapa.current) return;
      L.current = mod;
      const m = mod
        .map(kontener.current, { scrollWheelZoom: false })
        .setView([52.07, 19.48], 6);
      mod
        .tileLayer(KAFELKI_MAPY, { maxZoom: 19, attribution: ATRYBUCJA })
        .addTo(m);
      warstwa.current = mod.layerGroup().addTo(m);
      mapa.current = m;
      setGotowa(true);
    });
    return () => {
      zniszczona = true;
      mapa.current?.remove();
      mapa.current = null;
    };
  }, []);

  const pobierz = useCallback(
    async (p: Punkt, r: number) => {
      przerwij.current?.abort();
      const ac = new AbortController();
      przerwij.current = ac;
      setLaduje(true);
      setBlad("");
      try {
        const el = await overpass(zapytanie(tryb, p.lat, p.lon, r), ac.signal);
        const lista = przetworz(tryb, el).sort((a, b) => km(p, a) - km(p, b));
        setObiekty(lista);
        sledz(tryb === "ladowarki" ? "mapa_ladowarek" : "mapa_fotoradarow", {
          miejsce: p.nazwa,
          wynikow: lista.length,
        });
      } catch (e) {
        if ((e as Error).name !== "AbortError")
          setBlad(
            "Serwer z danymi map chwilowo nie odpowiada. Spróbuj ponownie za minutę.",
          );
      } finally {
        if (przerwij.current === ac) setLaduje(false);
      }
    },
    [tryb],
  );

  const pobierzTrase = useCallback(
    async (a: Punkt, b: Punkt, szer: number) => {
      przerwij.current?.abort();
      const ac = new AbortController();
      przerwij.current = ac;
      setTrasa({ a, b });
      setSrodek(null);
      setLaduje(true);
      setBlad("");
      const Lm = L.current;
      if (Lm && mapa.current)
        mapa.current.fitBounds(
          Lm.latLngBounds([a.lat, a.lon], [b.lat, b.lon]),
          { padding: [30, 30] },
        );
      try {
        const el = await overpass(zapytanieTrasy(tryb, a, b, szer), ac.signal);
        setObiekty(przetworz(tryb, el).sort((x, y) => km(a, x) - km(a, y)));
        sledz(tryb === "ladowarki" ? "trasa_ladowarki" : "trasa_fotoradary", {
          trasa: `${a.nazwa}-${b.nazwa}`,
        });
      } catch (e) {
        if ((e as Error).name !== "AbortError")
          setBlad(
            "Serwer z danymi map chwilowo nie odpowiada. Spróbuj ponownie za minutę albo zawęź pas.",
          );
      } finally {
        if (przerwij.current === ac) setLaduje(false);
      }
    },
    [tryb],
  );

  const szukajTrasy = async () => {
    setBlad("");
    try {
      const [a, b] = await Promise.all([
        znajdzMiejsce(skad),
        znajdzMiejsce(dokad),
      ]);
      if (!a || !b)
        return setBlad(
          "Nie znaleźliśmy jednej z miejscowości. Sprawdź pisownię.",
        );
      pobierzTrase(a, b, pas);
    } catch {
      setBlad(
        "Wyszukiwarka miejscowości chwilowo nie odpowiada. Wybierz miasta z podpowiedzi.",
      );
    }
  };

  const ustawSrodek = useCallback(
    (p: Punkt, r = promien) => {
      setTrasa(null);
      setSrodek(p);
      mapa.current?.setView([p.lat, p.lon], r <= 5 ? 13 : r <= 10 ? 12 : 10);
      pobierz(p, r);
    },
    [pobierz, promien],
  );

  const szukaj = async (q: string) => {
    if (!q.trim()) return;
    setBlad("");
    try {
      const p = await znajdzMiejsce(q);
      if (!p) setBlad(`Nie znaleźliśmy miejscowości „${q}”. Sprawdź pisownię.`);
      else ustawSrodek(p);
    } catch {
      setBlad(
        "Wyszukiwarka miejscowości chwilowo nie odpowiada. Wybierz miasto z listy poniżej.",
      );
    }
  };

  const mojaLokalizacja = () => {
    if (!navigator.geolocation)
      return setBlad("Twoja przeglądarka nie udostępnia lokalizacji.");
    navigator.geolocation.getCurrentPosition(
      (poz) =>
        ustawSrodek({
          lat: poz.coords.latitude,
          lon: poz.coords.longitude,
          nazwa: "Twoja okolica",
        }),
      () =>
        setBlad(
          "Nie udało się pobrać lokalizacji – zezwól na nią w przeglądarce albo wpisz miejscowość.",
        ),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  // start z adresu ?miasto=lublin (np. z kalkulatora trasy)
  useEffect(() => {
    if (!gotowa) return;
    const q = new URLSearchParams(window.location.search);
    const s = q.get("miasto");
    const m = s ? miasto(s) : undefined;
    const ma = miasto(q.get("skad") || ""),
      mb = miasto(q.get("dokad") || "");
    if (ma && mb) {
      setRodzaj("trasa");
      setSkad(ma.nazwa);
      setDokad(mb.nazwa);
      pobierzTrase(
        { lat: ma.lat, lon: ma.lon, nazwa: ma.nazwa },
        { lat: mb.lat, lon: mb.lon, nazwa: mb.nazwa },
        pas,
      );
    } else if (m) {
      setTekst(m.nazwa);
      ustawSrodek({ lat: m.lat, lon: m.lon, nazwa: m.nazwa });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gotowa]);

  const widoczne = useMemo(
    () =>
      filtr ? obiekty.filter((o) => o.znaczniki.includes(filtr)) : obiekty,
    [obiekty, filtr],
  );

  // rysowanie znaczników
  useEffect(() => {
    const Lm = L.current;
    if (!Lm || !warstwa.current) return;
    warstwa.current.clearLayers();
    if (srodek)
      Lm.circle([srodek.lat, srodek.lon], {
        radius: promien * 1000,
        color: "#336699",
        weight: 1,
        fillOpacity: 0.04,
      }).addTo(warstwa.current);
    if (trasa) {
      Lm.polyline(
        [
          [trasa.a.lat, trasa.a.lon],
          [trasa.b.lat, trasa.b.lon],
        ],
        { color: "#336699", weight: 3, opacity: 0.6, dashArray: "2 8" },
      ).addTo(warstwa.current);
      for (const p of [trasa.a, trasa.b])
        Lm.circleMarker([p.lat, p.lon], {
          radius: 6,
          color: "#336699",
          weight: 3,
          fillColor: "#fff",
          fillOpacity: 1,
        })
          .bindTooltip(p.nazwa)
          .addTo(warstwa.current);
    }
    for (const o of widoczne) {
      if (o.linia)
        Lm.polyline(o.linia, {
          color: o.kolor,
          weight: 4,
          dashArray: "8 6",
        }).addTo(warstwa.current);
      Lm.circleMarker([o.lat, o.lon], {
        radius: 8,
        color: "#fff",
        weight: 2,
        fillColor: o.kolor,
        fillOpacity: 1,
      })
        .bindPopup(() => dymek(o))
        .addTo(warstwa.current);
    }
  }, [widoczne, srodek, promien, trasa]);

  const pokazNaMapie = (o: Obiekt) => {
    mapa.current?.setView([o.lat, o.lon], 16);
    kontener.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const nazwa =
    tryb === "ladowarki" ? "ładowarek" : "fotoradarów i odcinkowych pomiarów";

  return (
    <div className="space-y-4">
      <div
        className="inline-flex rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden text-sm font-bold"
        role="tablist"
      >
        {(
          [
            ["okolica", "W okolicy miejscowości"],
            ["trasa", "Wzdłuż trasy"],
          ] as const
        ).map(([id, n]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={rodzaj === id}
            onClick={() => setRodzaj(id)}
            className={`px-4 py-2 ${rodzaj === id ? "bg-steel-600 text-white" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"}`}
          >
            {n}
          </button>
        ))}
      </div>

      {rodzaj === "okolica" ? (
        <>
          <form
            className="flex flex-col sm:flex-row gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              szukaj(tekst);
            }}
          >
            <label htmlFor={`mapa-${tryb}`} className="sr-only">
              Miejscowość
            </label>
            <input
              id={`mapa-${tryb}`}
              value={tekst}
              onChange={(e) => setTekst(e.target.value)}
              placeholder="Wpisz miejscowość, np. Zamość"
              className={`${pole} flex-1`}
              autoComplete="off"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-rust-600 hover:bg-rust-700 text-white font-bold px-5 py-2.5 rounded-xl"
              >
                <Search className="w-4 h-4" aria-hidden="true" /> Szukaj
              </button>
              <button
                type="button"
                onClick={mojaLokalizacja}
                className="inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 font-semibold px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-200"
                title="Użyj mojej lokalizacji"
              >
                <LocateFixed className="w-4 h-4" aria-hidden="true" />{" "}
                <span className="sm:hidden lg:inline">Moja lokalizacja</span>
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {SZYBKIE.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setTekst(s);
                  szukaj(s);
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-steel-400"
              >
                {s}
              </button>
            ))}
          </div>
        </>
      ) : (
        <form
          className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto] gap-2 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            szukajTrasy();
          }}
        >
          <datalist id={`miasta-${tryb}`}>
            {MIASTA.map((m) => (
              <option key={m.slug} value={m.nazwa} />
            ))}
          </datalist>
          <label className="sr-only" htmlFor={`skad-${tryb}`}>
            Skąd
          </label>
          <input
            id={`skad-${tryb}`}
            list={`miasta-${tryb}`}
            value={skad}
            onChange={(e) => setSkad(e.target.value)}
            placeholder="Skąd, np. Lublin"
            className={pole}
            autoComplete="off"
          />
          <ArrowRight
            className="hidden sm:block w-4 h-4 text-slate-400 justify-self-center"
            aria-hidden="true"
          />
          <label className="sr-only" htmlFor={`dokad-${tryb}`}>
            Dokąd
          </label>
          <input
            id={`dokad-${tryb}`}
            list={`miasta-${tryb}`}
            value={dokad}
            onChange={(e) => setDokad(e.target.value)}
            placeholder="Dokąd, np. Gdańsk"
            className={pole}
            autoComplete="off"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-rust-600 hover:bg-rust-700 text-white font-bold px-5 py-2.5 rounded-xl"
          >
            <Search className="w-4 h-4" aria-hidden="true" /> Pokaż
          </button>
        </form>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="text-slate-500">
            {rodzaj === "trasa" ? "Odległość od trasy:" : "Promień:"}
          </span>
          {(rodzaj === "trasa" ? PASY : PROMIENIE).map((r) => {
            const wybrany = rodzaj === "trasa" ? pas === r : promien === r;
            return (
              <button
                key={r}
                type="button"
                aria-pressed={wybrany}
                onClick={() => {
                  if (rodzaj === "trasa") {
                    setPas(r);
                    if (trasa) pobierzTrase(trasa.a, trasa.b, r);
                  } else {
                    setPromien(r);
                    if (srodek) ustawSrodek(srodek, r);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold ${wybrany ? "bg-steel-600 text-white" : "bg-slate-100 dark:bg-slate-800"}`}
              >
                {rodzaj === "trasa" ? `do ${r} km` : `${r} km`}
              </button>
            );
          })}
        </span>
        <span className="inline-flex flex-wrap items-center gap-2">
          {FILTRY[tryb].map((f) => (
            <button
              key={f.id || "wszystkie"}
              type="button"
              aria-pressed={filtr === f.id}
              onClick={() => setFiltr(f.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold ${filtr === f.id ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800"}`}
            >
              {f.nazwa}
            </button>
          ))}
        </span>
      </div>

      {blad && (
        <p
          role="alert"
          className="flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-xl p-3"
        >
          <AlertCircle
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            aria-hidden="true"
          />{" "}
          {blad}
        </p>
      )}

      <div className="relative">
        <div
          ref={kontener}
          className="h-[420px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-0 bg-slate-100 dark:bg-slate-800"
        />
        {laduje && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500] inline-flex items-center gap-2 bg-white text-slate-900 shadow rounded-full px-4 py-2 text-sm font-semibold">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />{" "}
            Szukam {nazwa}…
          </div>
        )}
        {!srodek && !trasa && gotowa && (
          <div className="absolute inset-0 z-[400] flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 dark:bg-slate-900/95 shadow rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
              {rodzaj === "trasa"
                ? `Wpisz skąd i dokąd jedziesz, żeby zobaczyć ${nazwa} po drodze`
                : `Wpisz miejscowość, żeby zobaczyć mapę ${nazwa}`}
            </span>
          </div>
        )}
      </div>

      {(srodek || trasa) && !laduje && (
        <div className="space-y-2">
          <h2
            className="text-lg font-bold text-slate-900 dark:text-white"
            aria-live="polite"
          >
            {widoczne.length
              ? `${widoczne.length} ${odmiana(widoczne.length, tryb === "ladowarki" ? ["ładowarka", "ładowarki", "ładowarek"] : ["urządzenie", "urządzenia", "urządzeń"])} ${
                  trasa
                    ? `na trasie ${trasa.a.nazwa} → ${trasa.b.nazwa} (do ${pas} km od linii)`
                    : `do ${promien} km od: ${srodek!.nazwa}`
                }`
              : trasa
                ? `Brak ${nazwa} przy tej trasie – poszerz pas.`
                : `Brak ${nazwa} w promieniu ${promien} km – zwiększ promień.`}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {widoczne.slice(0, 60).map((o) => (
              <li
                key={o.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-3"
              >
                <span
                  className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: o.kolor }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => pokazNaMapie(o)}
                      className="text-left font-bold text-slate-900 dark:text-white hover:underline"
                    >
                      {o.tytul}
                    </button>
                    <span className="text-xs text-slate-500 whitespace-nowrap tabular-nums">
                      {trasa
                        ? `${Math.round(km(trasa.a, o))} km od startu`
                        : `${km(srodek!, o).toLocaleString("pl-PL", { maximumFractionDigits: 1 })} km`}
                    </span>
                  </div>
                  {o.opis.map((l) => (
                    <p
                      key={l}
                      className="text-xs text-slate-600 dark:text-slate-400"
                    >
                      {l}
                    </p>
                  ))}
                  <a
                    href={nawigacja(o.lat, o.lon)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-steel-700 dark:text-steel-300 hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" aria-hidden="true" />{" "}
                    Nawiguj
                  </a>
                </div>
              </li>
            ))}
          </ul>
          {widoczne.length > 60 && (
            <p className="text-xs text-slate-500">
              Na liście pokazujemy pierwsze 60 – wszystkie są na mapie.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
