"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import IkonaMenu from "@/components/IkonaMenu";
import YouTubeIcon from "@/components/YouTubeIcon";
import type { GrupaMenu } from "@/lib/menu";

// Menu u góry strony: na komputerze rozwijane grupy, na telefonie przycisk ☰ i panel z całą listą.

function Plakietka() {
  return (
    <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider bg-rust-600 text-white rounded px-1 py-0.5 align-middle">
      nowe
    </span>
  );
}

export default function MenuGlowne({
  grupy,
  youtube,
  youtubeNazwa,
}: {
  grupy: GrupaMenu[];
  youtube: string;
  youtubeNazwa: string;
}) {
  const [otwarta, setOtwarta] = useState<string | null>(null);
  const [mobilne, setMobilne] = useState(false);
  const pasek = useRef<HTMLDivElement>(null);
  const sciezka = usePathname();

  // zamykanie: zmiana strony, klik poza menu, klawisz Esc
  useEffect(() => {
    setOtwarta(null);
    setMobilne(false);
  }, [sciezka]);
  useEffect(() => {
    const klik = (e: MouseEvent) => {
      if (pasek.current && !pasek.current.contains(e.target as Node))
        setOtwarta(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOtwarta(null);
        setMobilne(false);
      }
    };
    document.addEventListener("mousedown", klik);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", klik);
      document.removeEventListener("keydown", esc);
    };
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobilne ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobilne]);

  const aktywna = (g: GrupaMenu) =>
    g.pozycje.some((p) => sciezka?.startsWith(p.adres));

  return (
    <div ref={pasek} className="flex items-center gap-1">
      <nav
        aria-label="Menu główne"
        className="hidden xl:flex items-center gap-0.5 text-sm font-semibold"
      >
        {grupy.map((g, i) => (
          <div key={g.id} className="relative">
            <button
              type="button"
              aria-expanded={otwarta === g.id}
              aria-controls={`menu-${g.id}`}
              onClick={() => setOtwarta((o) => (o === g.id ? null : g.id))}
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                otwarta === g.id || aktywna(g)
                  ? "text-steel-700 dark:text-steel-300 bg-steel-50 dark:bg-slate-800"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {g.nazwa}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${otwarta === g.id ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {otwarta === g.id && (
              <div
                id={`menu-${g.id}`}
                className={`absolute ${i >= grupy.length - 2 ? "right-0" : "left-0"} top-full pt-2 z-50`}
              >
                <ul
                  className={`grid ${g.pozycje.length > 4 ? "grid-cols-2 w-[34rem]" : "grid-cols-1 w-80"} gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2`}
                >
                  {g.pozycje.map((p) => (
                    <li key={p.adres}>
                      <Link
                        href={p.adres}
                        className="flex items-start gap-3 rounded-xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <span className="w-9 h-9 flex-shrink-0 rounded-lg bg-steel-50 dark:bg-slate-800 text-steel-600 dark:text-steel-300 flex items-center justify-center">
                          <IkonaMenu ikona={p.ikona} />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-slate-900 dark:text-white">
                            {p.nazwa}
                            {p.nowe && <Plakietka />}
                          </span>
                          <span className="block text-xs font-normal text-slate-500">
                            {p.opis}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>

      <a
        href={youtube}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold transition-colors px-2 py-2"
        aria-label={`Kanał ${youtubeNazwa} na YouTube`}
      >
        <YouTubeIcon className="w-5 h-5" />
        <span className="hidden 2xl:inline text-sm">YouTube</span>
      </a>

      <button
        type="button"
        onClick={() => setMobilne((m) => !m)}
        aria-expanded={mobilne}
        aria-controls="menu-mobilne"
        className="xl:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-bold"
      >
        {mobilne ? (
          <X className="w-4 h-4" aria-hidden="true" />
        ) : (
          <Menu className="w-4 h-4" aria-hidden="true" />
        )}
        Menu
      </button>

      {mobilne &&
        createPortal(
          <div
            id="menu-mobilne"
            className="xl:hidden fixed inset-x-0 top-16 bottom-0 z-[60] overflow-y-auto bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800"
          >
            <nav
              aria-label="Menu główne"
              className="max-w-6xl mx-auto px-4 py-4 space-y-6"
            >
              {grupy.map((g) => (
                <section key={g.id}>
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-rust-600 mb-2">
                    {g.nazwa}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {g.pozycje.map((p) => (
                      <li key={p.adres}>
                        <Link
                          href={p.adres}
                          className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900"
                        >
                          <span className="w-9 h-9 flex-shrink-0 rounded-lg bg-steel-50 dark:bg-slate-800 text-steel-600 dark:text-steel-300 flex items-center justify-center">
                            <IkonaMenu ikona={p.ikona} />
                          </span>
                          <span>
                            <span className="block text-sm font-bold text-slate-900 dark:text-white">
                              {p.nazwa}
                              {p.nowe && <Plakietka />}
                            </span>
                            <span className="block text-xs text-slate-500">
                              {p.opis}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
