"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as LMapa, LayerGroup, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Search,
  LocateFixed,
  Navigation,
  Loader2,
  AlertCircle,
  ArrowRight,
  X,
} from "lucide-react";
import {
  znajdzMiejsce,
  overpass,
  km,
  nawigacja,
  KAFELKI_MAPY,
  ATRYBUCJA,
  Punkt,
  zPlikow,
} from "@/lib/osm";
import {
  zapytanie,
  zapytanieTrasy,
  przetworz,
  Obiekt,
  Tryb,
  KOLORY,
} from "@/lib/obiekty-mapy";
import { stylMapy, webglDziala, ATRYBUCJA_OFM } from "@/lib/styl-mapy";
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
    { id: "Tesla", nazwa: "Tesla" },
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

// --- wygląd znaczników ---

const SVG_IKONY = {
  // błyskawica
  ladowarka: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" fill="#fff"/>',
  // aparat
  fotoradar: '<path d="M4 8h3l2-2.5h6L17 8h3v11H4z" fill="#fff"/><circle cx="12" cy="13.2" r="3.4" fill="currentColor"/>',
  // dwie flagi – początek i koniec odcinka
  odcinkowy: '<path d="M6 4v16M6 5h9l-2 3 2 3H6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linejoin="round"/>',
};

function rodzajIkony(o: Obiekt): keyof typeof SVG_IKONY {
  return o.znaczniki.includes("fotoradar") ? "fotoradar" : o.znaczniki.includes("odcinkowy") ? "odcinkowy" : "ladowarka";
}

/** Pinezka w kolorze obiektu z białą ikoną; wybrana jest większa i z obwódką */
function htmlPinezki(o: Obiekt, wybrany: boolean) {
  const s = wybrany ? 44 : 34;
  return `<div class="mr-pin${wybrany ? " mr-pin-wybrany" : ""}" style="--k:${o.kolor};width:${s}px;height:${s * 1.22}px">
    <svg viewBox="0 0 40 49" width="${s}" height="${s * 1.22}" aria-hidden="true">
      <path d="M20 48c-1.2 0-16-16.3-16-28A16 16 0 0 1 36 20c0 11.7-14.8 28-16 28z" fill="${o.kolor}" stroke="#fff" stroke-width="2.5"/>
      <g transform="translate(8 8)" color="${o.kolor}">${SVG_IKONY[rodzajIkony(o)]}</g>
    </svg></div>`;
}

const MOC_Z_OPISU = /^(Złącza:|Moc do )/;

export default function MapaObiektow({ tryb }: { tryb: Tryb }) {
  const kontener = useRef<HTMLDivElement>(null);
  const mapa = useRef<LMapa | null>(null);
  const warstwa = useRef<LayerGroup | null>(null);
  const grupa = useRef<LayerGroup | null>(null);
  const znaczniki = useRef<Map<string, Marker>>(new Map());
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
  const [dataDanych, setDataDanych] = useState('');
  const [rodzaj, setRodzaj] = useState<"okolica" | "trasa">("okolica");
  const [skad, setSkad] = useState("");
  const [dokad, setDokad] = useState("");
  const [trasa, setTrasa] = useState<{ a: Punkt; b: Punkt } | null>(null);
  const [pas, setPas] = useState(5);
  const [wybrany, setWybrany] = useState<Obiekt | null>(null);

  // mapa tworzy się dopiero w przeglądarce
  useEffect(() => {
    let zniszczona = false;
    let sprzatnij = () => {};
    (async () => {
      const mod = await import("leaflet");
      // wtyczka grupowania znaczników szuka biblioteki pod globalną nazwą „L”
      const Lb = ((mod as unknown as { default?: typeof mod }).default ?? mod) as typeof mod;
      (window as unknown as { L: typeof mod }).L = Lb;
      await import("leaflet.markercluster");
      if (zniszczona || !kontener.current || mapa.current) return;
      L.current = Lb;
      const m = Lb.map(kontener.current, { scrollWheelZoom: false, zoomControl: false, maxZoom: 19, minZoom: 5 }).setView([52.07, 19.48], 6);
      Lb.control.zoom({ position: "topright" }).addTo(m);
      m.attributionControl.setPrefix(false);
      mapa.current = m;
      warstwa.current = Lb.layerGroup().addTo(m);
      grupa.current = (Lb as unknown as { markerClusterGroup: (o: object) => LayerGroup })
        .markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 50,
          spiderfyOnMaxZoom: true,
          disableClusteringAtZoom: 16,
          iconCreateFunction: (c: { getChildCount: () => number; getAllChildMarkers: () => { options: { szybka?: boolean } }[] }) => {
            const n = c.getChildCount();
            const s = n < 10 ? 36 : n < 100 ? 44 : 52;
            const szybkie = c.getAllChildMarkers().some((x) => x.options.szybka);
            return Lb.divIcon({
              html: `<div class="mr-grupa${szybkie ? " mr-grupa-szybka" : ""}" style="width:${s}px;height:${s}px">${n}</div>`,
              className: "",
              iconSize: [s, s],
            });
          },
        })
        .addTo(m);
      m.on("click", () => setWybrany(null));

      // podkład: przemalowana mapa OpenFreeMap (WebGL), a gdy się nie uda – zwykłe kafelki OpenStreetMap
      const zapasowy = () => {
        if (zniszczona || !mapa.current) return;
        Lb.tileLayer(KAFELKI_MAPY, { maxZoom: 19, attribution: ATRYBUCJA }).addTo(m);
      };
      const ciemny = window.matchMedia("(prefers-color-scheme: dark)");
      if (!webglDziala()) zapasowy();
      else
        try {
          const [{ maplibreGL }, styl] = await Promise.all([import("@maplibre/maplibre-gl-leaflet"), stylMapy(ciemny.matches)]);
          if (zniszczona) return;
          const podklad = maplibreGL({
            style: styl as never,
            attributionControl: { customAttribution: ATRYBUCJA_OFM },
          } as never).addTo(m);
          const gl = podklad.getMaplibreMap();
          // gdy kafelki nie wczytają się w 10 s – przełączamy na zwykłą mapę, żeby nie zostało puste tło
          let wczytana = false;
          gl.once("load", () => (wczytana = true));
          const czas = window.setTimeout(() => {
            if (!wczytana && !zniszczona) {
              m.removeLayer(podklad);
              zapasowy();
            }
          }, 10000);
          const zmianaMotywu = async () => {
            try {
              gl.setStyle((await stylMapy(ciemny.matches)) as never);
            } catch {
              /* zostaje poprzedni wygląd */
            }
          };
          ciemny.addEventListener("change", zmianaMotywu);
          sprzatnij = () => {
            window.clearTimeout(czas);
            ciemny.removeEventListener("change", zmianaMotywu);
          };
        } catch {
          zapasowy();
        }
      setGotowa(true);
    })();
    return () => {
      zniszczona = true;
      sprzatnij();
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
        const lok = await zPlikow(tryb, p, r);
        if (ac.signal.aborted) return;
        setDataDanych(lok?.data || '');
        const el = lok ? lok.el : await overpass(zapytanie(tryb, p.lat, p.lon, r), ac.signal);
        const lista = przetworz(tryb, el).sort((a, b) => km(p, a) - km(p, b));
        setObiekty(lista);
        sledz(tryb === "ladowarki" ? "mapa_ladowarek" : "mapa_fotoradarow", {
          miejsce: p.nazwa,
          wynikow: lista.length,
        });
      } catch (e) {
        if ((e as Error).name !== "AbortError")
          setBlad(
            "Serwery z danymi map chwilowo nie odpowiadają. Spróbuj ponownie za kilka minut.",
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
        const lok = await zPlikow(tryb, a, szer, b);
        if (ac.signal.aborted) return;
        setDataDanych(lok?.data || '');
        const el = lok ? lok.el : await overpass(zapytanieTrasy(tryb, a, b, szer), ac.signal);
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
    const g = grupa.current;
    g?.clearLayers();
    znaczniki.current.clear();
    for (const o of widoczne) {
      if (o.linia)
        Lm.polyline(o.linia, {
          color: o.kolor,
          weight: 4,
          dashArray: "8 6",
        }).addTo(warstwa.current);
      const mk = Lm.marker([o.lat, o.lon], {
        icon: Lm.divIcon({ html: htmlPinezki(o, false), className: "", iconSize: [34, 41], iconAnchor: [17, 41] }),
        title: o.tytul,
        keyboard: true,
        szybka: (o.moc || 0) >= 50,
      } as never).on("click", (ev) => {
        Lm.DomEvent.stopPropagation(ev);
        setWybrany(o);
      });
      znaczniki.current.set(o.id, mk);
      g?.addLayer(mk);
    }
    setWybrany((w) => (w && widoczne.some((o) => o.id === w.id) ? w : null));
  }, [widoczne, srodek, promien, trasa]);

  // wybrana pinezka – większa; poprzednia wraca do zwykłej
  useEffect(() => {
    const Lm = L.current;
    if (!Lm || !wybrany) return;
    const mk = znaczniki.current.get(wybrany.id);
    if (!mk) return;
    mk.setIcon(Lm.divIcon({ html: htmlPinezki(wybrany, true), className: "", iconSize: [44, 54], iconAnchor: [22, 54] }));
    mk.setZIndexOffset(1000);
    return () => {
      mk.setIcon(Lm.divIcon({ html: htmlPinezki(wybrany, false), className: "", iconSize: [34, 41], iconAnchor: [17, 41] }));
      mk.setZIndexOffset(0);
    };
  }, [wybrany]);

  const pokazNaMapie = (o: Obiekt) => {
    const mk = znaczniki.current.get(o.id);
    const g = grupa.current as unknown as { zoomToShowLayer?: (m: Marker, cb: () => void) => void } | null;
    mapa.current?.setView([o.lat, o.lon], Math.max(mapa.current.getZoom(), 16));
    if (mk && g?.zoomToShowLayer) g.zoomToShowLayer(mk, () => setWybrany(o));
    else setWybrany(o);
    kontener.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const odleglosc = (o: Obiekt) =>
    trasa
      ? `${Math.round(km(trasa.a, o))} km od startu`
      : srodek
        ? `${km(srodek, o).toLocaleString("pl-PL", { maximumFractionDigits: 1 })} km`
        : "";

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
        {tryb === "ladowarki" && gotowa && (
          <div className="absolute top-3 left-3 z-[450] hidden sm:flex flex-col gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-xl shadow px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 pointer-events-none">
            {(
              [
                [KOLORY.szybka, "Szybka (50 kW i więcej)"],
                [KOLORY.zwykla, "Zwykła"],
                [KOLORY.nieznana, "Moc nieznana"],
              ] as const
            ).map(([k, n]) => (
              <span key={n} className="inline-flex items-center gap-2">
                <span className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900" style={{ background: k }} aria-hidden="true" />
                {n}
              </span>
            ))}
          </div>
        )}
        {wybrany && (
          <div
            role="dialog"
            aria-label={wybrany.tytul}
            className="absolute z-[600] left-2 right-2 bottom-2 sm:left-3 sm:right-auto sm:bottom-3 sm:w-[360px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl ring-1 ring-slate-200 dark:ring-slate-700 p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: wybrany.kolor }} aria-hidden="true">
                <svg viewBox="0 0 24 24" className="w-6 h-6" style={{ color: wybrany.kolor }} dangerouslySetInnerHTML={{ __html: SVG_IKONY[rodzajIkony(wybrany)] }} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white leading-snug">{wybrany.tytul}</p>
                <p className="text-xs text-slate-500">
                  {[wybrany.moc ? `do ${wybrany.moc} kW` : tryb === "ladowarki" ? "moc nieznana" : "", odleglosc(wybrany)].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWybrany(null)}
                className="flex-shrink-0 -m-1 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Zamknij"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {wybrany.znaczniki.filter((z) => z !== "szybka" && z !== "fotoradar" && z !== "odcinkowy").length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {wybrany.znaczniki
                  .filter((z) => z !== "szybka" && z !== "fotoradar" && z !== "odcinkowy")
                  .map((z) => (
                    <span key={z} className="px-2 py-0.5 rounded-md text-xs font-bold bg-steel-50 text-steel-700 dark:bg-slate-800 dark:text-steel-300">
                      {z}
                    </span>
                  ))}
              </div>
            )}
            {wybrany.opis.filter((l) => !MOC_Z_OPISU.test(l)).length > 0 && (
              <ul className="space-y-0.5 text-xs text-slate-600 dark:text-slate-400">
                {wybrany.opis
                  .filter((l) => !MOC_Z_OPISU.test(l))
                  .map((l) => (
                    <li key={l}>{l}</li>
                  ))}
              </ul>
            )}
            <a
              href={nawigacja(wybrany.lat, wybrany.lon)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sledz("nawigacja_mapa", { tryb })}
              className="flex items-center justify-center gap-2 w-full bg-rust-600 hover:bg-rust-700 text-white font-bold py-2.5 rounded-xl"
            >
              <Navigation className="w-4 h-4" aria-hidden="true" /> Prowadź (Google Maps)
            </a>
          </div>
        )}
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
                    <span className="text-xs text-slate-500 whitespace-nowrap tabular-nums">{odleglosc(o)}</span>
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
                    Prowadź
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
          {dataDanych && (
            <p className="text-xs text-slate-500">
              Dane z OpenStreetMap z {new Date(dataDanych).toLocaleDateString('pl-PL')} – odświeżane co tydzień.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
