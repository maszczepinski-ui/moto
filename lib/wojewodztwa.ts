// Lista województw: kod TERYT, nazwa i adres strony
export const WOJEWODZTWA = [
  { teryt: '02', nazwa: 'Dolnośląskie', slug: 'dolnoslaskie', miejscownik: 'na Dolnym Śląsku' },
  { teryt: '04', nazwa: 'Kujawsko-pomorskie', slug: 'kujawsko-pomorskie', miejscownik: 'w kujawsko-pomorskim' },
  { teryt: '06', nazwa: 'Lubelskie', slug: 'lubelskie', miejscownik: 'w lubelskim' },
  { teryt: '08', nazwa: 'Lubuskie', slug: 'lubuskie', miejscownik: 'w lubuskim' },
  { teryt: '10', nazwa: 'Łódzkie', slug: 'lodzkie', miejscownik: 'w łódzkim' },
  { teryt: '12', nazwa: 'Małopolskie', slug: 'malopolskie', miejscownik: 'w Małopolsce' },
  { teryt: '14', nazwa: 'Mazowieckie', slug: 'mazowieckie', miejscownik: 'na Mazowszu' },
  { teryt: '16', nazwa: 'Opolskie', slug: 'opolskie', miejscownik: 'w opolskim' },
  { teryt: '18', nazwa: 'Podkarpackie', slug: 'podkarpackie', miejscownik: 'na Podkarpaciu' },
  { teryt: '20', nazwa: 'Podlaskie', slug: 'podlaskie', miejscownik: 'na Podlasiu' },
  { teryt: '22', nazwa: 'Pomorskie', slug: 'pomorskie', miejscownik: 'na Pomorzu' },
  { teryt: '24', nazwa: 'Śląskie', slug: 'slaskie', miejscownik: 'na Śląsku' },
  { teryt: '26', nazwa: 'Świętokrzyskie', slug: 'swietokrzyskie', miejscownik: 'w świętokrzyskim' },
  { teryt: '28', nazwa: 'Warmińsko-mazurskie', slug: 'warminsko-mazurskie', miejscownik: 'na Warmii i Mazurach' },
  { teryt: '30', nazwa: 'Wielkopolskie', slug: 'wielkopolskie', miejscownik: 'w Wielkopolsce' },
  { teryt: '32', nazwa: 'Zachodniopomorskie', slug: 'zachodniopomorskie', miejscownik: 'w zachodniopomorskim' }
] as const;

export const slugWojewodztwa = (teryt: string) => WOJEWODZTWA.find((w) => w.teryt === teryt)?.slug ?? teryt;
export const nazwaWojewodztwa = (teryt: string) => WOJEWODZTWA.find((w) => w.teryt === teryt)?.nazwa ?? teryt;
