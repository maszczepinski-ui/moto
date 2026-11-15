import type { OpisMarki as Opis } from '@/lib/opisy-marek';
import { formatDate } from '@/lib/format';
import { pokazModul } from '@/lib/panel';
import { Ubezpieczenia } from '@/components/Monetyzacja';

export default function OpisMarki({ opis, marka, slug }: { opis: Opis; marka: string; slug: string }) {
  const K = { slug: `marka-${slug}`, marka, model: '' };
  const h2 = 'text-2xl font-bold text-slate-900 dark:text-white';
  const p = 'text-base text-slate-700 dark:text-slate-300 leading-relaxed';
  return (
    <article className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 space-y-8">
          {opis.sekcje.map((s) => (
            <section key={s.h2} className="space-y-3">
              <h2 className={h2}>{s.h2}</h2>
              {s.akapity.map((a, i) => (
                <p key={i} className={p}>
                  {a}
                </p>
              ))}
              {s.lista && (
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  {s.lista.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        {opis.zdjecie && (
          <figure className="lg:col-span-2 lg:sticky lg:top-20 space-y-2">
            <div className="rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={opis.zdjecie.src} alt={opis.zdjecie.alt} width={opis.zdjecie.szer} height={opis.zdjecie.wys} className="w-full h-auto" loading="eager" />
            </div>
            <figcaption className="text-xs text-slate-500">{opis.zdjecie.podpis}</figcaption>
          </figure>
        )}
      </div>

      {opis.oferta && (
        <section className="space-y-4">
          <h2 className={h2}>{opis.oferta.h2}</h2>
          <p className={p}>{opis.oferta.wstep}</p>
          {/* telefon: karty */}
          <ul className="sm:hidden space-y-3">
            {opis.oferta.modele.map((x) => (
              <li key={x.nazwa} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  {x.adres ? (
                    <a href={x.adres} className="text-steel-600 dark:text-steel-400 hover:underline">
                      {x.nazwa}
                    </a>
                  ) : (
                    x.nazwa
                  )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{x.typ}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{x.naped}</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{x.cena || 'cena w salonie'}</div>
              </li>
            ))}
          </ul>
          {/* komputer: tabela */}
          <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-left text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-semibold">Model</th>
                  <th className="px-4 py-3 font-semibold">Rodzaj auta</th>
                  <th className="px-4 py-3 font-semibold">Silnik i skrzynia</th>
                  <th className="px-4 py-3 font-semibold">Cena</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {opis.oferta.modele.map((x) => (
                  <tr key={x.nazwa}>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {x.adres ? (
                        <a href={x.adres} className="text-steel-600 dark:text-steel-400 hover:underline">
                          {x.nazwa}
                        </a>
                      ) : (
                        x.nazwa
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{x.typ}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{x.naped}</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white">{x.cena || '–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500">
            {opis.oferta.uwaga} Ceny sprawdzone {formatDate(opis.sprawdzono)}.
          </p>
        </section>
      )}

      {opis.plusy && opis.minusy && (
        <section className="space-y-4">
          <h2 className={h2}>Czy warto kupić {marka}? Plusy i minusy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30 p-5">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2">Za</h3>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                {opis.plusy.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span aria-hidden="true" className="text-emerald-600">+</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-rust-200 dark:border-rust-900 bg-rust-50/60 dark:bg-rust-900/30 p-5">
              <h3 className="font-bold text-rust-800 dark:text-rust-300 mb-2">Przeciw</h3>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                {opis.minusy.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span aria-hidden="true" className="text-rust-600">–</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {pokazModul('ubezpieczenia', K) && <Ubezpieczenia k={K} tytul={`Ile kosztuje OC dla auta ${marka}?`} />}

      <section className="space-y-3">
        <h2 className={h2}>Najczęstsze pytania o {marka}</h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
          {opis.faq.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white list-none flex justify-between gap-4">
                {f.q}
                <span className="text-slate-400 group-open:rotate-45 transition-transform" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Źródła</h2>
        <ul className="text-sm space-y-1">
          {opis.zrodla.map((z) => (
            <li key={z.url}>
              <a href={z.url} target="_blank" rel="noopener" className="text-steel-600 dark:text-steel-400 hover:underline">
                {z.nazwa}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
