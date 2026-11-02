// Drobne zabezpieczenia używane w wielu miejscach strony.

/** JSON do znacznika <script type="application/ld+json">: zamiana „<” uniemożliwia „wyjście” ze znacznika (np. tytuł z „</script>”) */
export function bezpiecznyJson(dane: unknown): string {
  return JSON.stringify(dane)
    .replace(/</g, '\\u003c')
    .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028')
    .replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');
}

/** Tylko adresy https:// albo ścieżki na tej stronie (/…). Inne (np. „javascript:”) zamieniamy na pusty. */
export function bezpiecznyUrl(u: string | undefined | null, tylkoHttps = false): string {
  const s = (u || '').trim();
  if (/^https:\/\//i.test(s)) return s;
  if (!tylkoHttps && /^http:\/\//i.test(s)) return s;
  if (!tylkoHttps && /^\/(?!\/)/.test(s)) return s;
  return '';
}
