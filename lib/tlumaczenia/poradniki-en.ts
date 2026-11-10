// Poradniki po angielsku – tłumaczenie i adaptacja polskich oryginałów (lib/poradniki.ts).
// Polskie nazwy urzędów i formularzy zostawiamy w nawiasach – te słowa czytelnik zobaczy w urzędzie.
// Przy zmianie przepisów w polskim poradniku zaktualizuj też tę wersję (i datę „aktualizacja”).
import type { Tlumaczenie } from './typy';

export const PORADNIKI_EN: Tlumaczenie[] = [
  {
    pl: 'kupilem-auto-co-dalej',
    slug: 'bought-a-car-in-poland-what-next',
    tytul: 'Bought a car in Poland – what next? Tax, registration, OC insurance',
    krotko: 'Bought a car – what next',
    opis: 'Three things you must do after buying a used car from a private seller in Poland, the deadlines and the fines for being late.',
    seoTytul: 'Bought a car in Poland? Tax, registration, OC',
    seoOpis: 'What to do after buying a used car in Poland: PCC-3 tax within 14 days (2%), registration within 30 days or a 500 zł fine, and what happens to the seller’s OC.',
    skrot: [
      'Within 14 days: file the PCC-3 return and pay 2% of the market value – not needed when you buy from a business with a VAT invoice.',
      'Within 30 days: apply for registration. Being late costs 500 zł, and after 180 days 1,000 zł.',
      'The seller’s OC insurance covers you until it ends, but it won’t renew itself – note the date.'
    ],
    liczby: [
      { w: '14 days', o: 'for PCC-3 (2% of market value)' },
      { w: '30 days', o: 'to apply for registration' },
      { w: '500 zł', o: 'fine for late registration' }
    ],
    sekcje: [
      {
        id: 'kolejno',
        t: 'Step by step, from the day you sign the contract',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              {
                t: 'Within 14 days: PCC-3 tax',
                o: 'File the PCC-3 tax return and pay 2% of the car’s market value. The easiest way is the e-Urząd Skarbowy online service (log in with profil zaufany, your bank or mObywatel). Keep the confirmation (UPO). You don’t pay if the car is worth up to 1,000 zł, or if you bought it from a business with a VAT or VAT-margin invoice.'
              },
              {
                t: 'Right away: check the OC insurance',
                o: 'The seller’s OC policy passes to you together with the car and covers you until the end of its term. It does not renew itself – you must buy a new one before it ends. You can also cancel it earlier and buy your own straight away (Art. 31 of the compulsory insurance act).'
              },
              {
                t: 'Within 30 days: apply for registration',
                o: 'Apply at the vehicle registration office (wydział komunikacji) for your place of residence – many offices also accept applications online. You need: the contract or invoice, the registration certificate (dowód rejestracyjny), the vehicle card (karta pojazdu, if one was issued), the number plates and your ID. The plates usually stay with the car – even if you live in a different county than the previous owner.'
              }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'The fine for not applying for registration within 30 days is 500 zł, and after 180 days 1,000 zł. The PCC deadline runs separately from registration.'
          }
        ]
      },
      {
        id: 'zwolnienia',
        t: 'When you don’t pay PCC',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'you buy from a business and the sale is subject to VAT (including the VAT margin scheme),',
              'the car’s market value doesn’t exceed 1,000 zł,',
              'you are a person with a disability buying a passenger car for your own use – on the terms set out in the PCC act.'
            ]
          },
          {
            typ: 'p',
            t: 'Watch out at car dealers: if the dealer is only an intermediary and the seller in the contract is a private person, you usually have to pay PCC. A gift (e.g. from a parent) is a separate matter – it’s reported on the SD-Z2 form, not PCC-3.'
          }
        ]
      },
      {
        id: 'spoznienie',
        t: 'Late with PCC?',
        bloki: [
          {
            typ: 'p',
            t: 'File the overdue return and pay the tax with interest as soon as possible. Together with the return you can submit a voluntary disclosure (czynny żal) – it works as long as the tax office hasn’t opened a case itself.'
          }
        ]
      }
    ],
    faq: [
      { q: 'How long do I have to register a car after buying it in Poland?', a: '30 days from the date of purchase. Being late means an administrative fine of 500 zł, and after 180 days 1,000 zł.' },
      { q: 'How long do I have to pay PCC after buying a car?', a: '14 days from signing the contract. The tax is 2% of the car’s market value if it exceeds 1,000 zł.' },
      { q: 'Is the previous owner’s OC insurance valid?', a: 'Yes, it passes to the buyer and is valid until the end of the insurance period. It doesn’t renew automatically – after it ends you need your own policy.' }
    ],
    aktualizacja: '2026-11-08'
  },
  {
    pl: 'umowa-kupna-sprzedazy-samochodu',
    slug: 'car-sale-contract-poland',
    tytul: 'Car sale contract in Poland – what it must include',
    krotko: 'Car sale contract',
    opis: 'What must be in the contract, what to check when signing, and why it’s best to write the contract in Polish.',
    seoTytul: 'Car sale contract in Poland – what to include',
    seoOpis: 'Car purchase contract in Poland: what it must contain, seller’s liability (rękojmia), PCC tax and a printable template in Polish.',
    skrot: [
      'You write the contract yourselves – no notary needed, two signed copies are enough.',
      'The date on the contract starts the deadlines: 14 days for PCC-3 and 30 days for registration and reporting the sale.',
      'Between private persons the seller’s liability can be excluded, but this doesn’t protect a seller who hid a defect.'
    ],
    liczby: [
      { w: '2 copies', o: 'one for each party' },
      { w: '14 days', o: 'for the buyer’s PCC-3' },
      { w: '30 days', o: 'for registration and reporting the sale' }
    ],
    sekcje: [
      {
        id: 'co-musi-zawierac',
        t: 'What the contract must include',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'date and place of signing – the deadlines for tax, registration and reporting the sale run from this date,',
              'details of the seller and buyer (name, address, ID number or PESEL),',
              'car details: make, model, year, VIN, registration number and mileage at the time of sale,',
              'price and method of payment,',
              'the seller’s statement that the car is theirs and has no legal encumbrances (e.g. a lien or bailiff seizure),',
              'a list of documents and keys handed over,',
              'signatures of both parties.'
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Don’t understate the price. PCC is calculated on the car’s market value, and the tax office can challenge an amount that is too low. An understated price also makes it harder to get your money back if the car turns out to be faulty.'
          },
          {
            typ: 'uwaga',
            t: 'A contract in another language (e.g. English) will need a sworn translation at the registration office. It’s easiest to write the contract in Polish or as a bilingual document from the start.'
          }
        ]
      },
      {
        id: 'rekojmia',
        t: 'Seller’s liability (rękojmia) – is the seller responsible for defects?',
        bloki: [
          {
            typ: 'p',
            t: 'The seller is liable to the buyer for physical defects of the car (rękojmia under the Polish Civil Code). In a sale between private persons, the parties can limit or exclude this liability in the contract (Art. 558 of the Civil Code). The exclusion doesn’t apply if the seller deliberately concealed a defect.'
          },
          {
            typ: 'p',
            t: 'If you buy from a business (dealer) as a consumer, this liability cannot be excluded or limited – consumer rights rules apply.'
          }
        ]
      },
      {
        id: 'przy-podpisaniu',
        t: 'When signing – check',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'VIN in the documents and on the car', o: 'The number in the registration certificate must match the number on the body and under the windscreen.' },
              { t: 'Whether the seller is the owner', o: 'Compare the details on their ID with the registration certificate. If there are several owners, all of them must sign.' },
              { t: 'The car’s history', o: 'Free: historiapojazdu.gov.pl (mileage from inspections, OC validity). More detail: a damage history report by VIN.' },
              { t: 'Documents to hand over', o: 'Registration certificate, vehicle card (if issued), OC policy, keys, number plates.' }
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'Does a car sale contract in Poland have to be signed before a notary?', a: 'No. A simple written contract signed by both parties, in two copies, is enough.' },
      { q: 'Who pays PCC tax when buying a car?', a: 'The buyer – 2% of the car’s market value within 14 days of signing, if the value exceeds 1,000 zł. No PCC when you buy from a business with a VAT invoice (including VAT margin).' },
      { q: 'Can the seller’s liability be excluded between private persons?', a: 'Yes, Art. 558 of the Civil Code allows it. But the exclusion doesn’t protect a seller who deliberately concealed a defect.' }
    ],
    aktualizacja: '2026-11-08'
  },
  {
    pl: 'kolizja-bez-policji',
    slug: 'car-collision-without-police',
    tytul: 'Minor collision in Poland without police – what to do and how to write the at-fault statement',
    krotko: 'Collision – at-fault statement',
    opis: 'When you can settle a minor collision without the police, when you must call them, and what to write in the statement so the insurer pays out.',
    seoTytul: 'Car collision in Poland without police',
    seoOpis: 'Minor car collision in Poland with no injuries? When you don’t need the police, what to do at the scene and how to write the at-fault driver’s statement (oświadczenie sprawcy).',
    skrot: [
      'Nobody injured, the at-fault driver is sober, admits fault and has OC? No police needed.',
      'Take photos before moving the cars – then clear the road, the law requires it.',
      'A statement in 2 copies signed by both drivers is enough for a payout from the at-fault driver’s OC.'
    ],
    liczby: [
      { w: '112', o: 'emergency number' },
      { w: '0 zł', o: 'fine if you write a statement' },
      { w: '2 copies', o: 'of the statement – one each' }
    ],
    sekcje: [
      {
        id: 'na-miejscu',
        t: 'At the scene, step by step',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Stop and secure the scene', o: 'Turn on the hazard lights, put on a hi-vis vest if you get out outside a built-up area, and set up the warning triangle.' },
              { t: 'Check that nobody is injured', o: 'If anyone is injured, it’s an accident (wypadek). Call 112 and don’t move the cars.' },
              { t: 'Take photos before moving the cars', o: 'Positions of the cars, damage, number plates, road signs and marks on the road. Photograph from several sides.' },
              { t: 'Clear the road', o: 'If nobody is injured, the drivers must move the cars away as quickly as possible so they don’t block traffic (Art. 44 of the Road Traffic Act).' },
              { t: 'Write the at-fault statement', o: 'Two copies, signed by both drivers. Check the at-fault driver’s documents: ID, driving licence, registration certificate.' },
              { t: 'Check the at-fault driver’s OC policy', o: 'On ufg.pl, using the registration number and the date of the incident. You report the claim to the at-fault driver’s insurer.' }
            ]
          },
          {
            typ: 'uwaga',
            t: 'The statement can be handwritten. Polish is best – the insurer will ask for a translation of a document in another language anyway. A printable template is on the Polish page (link below).'
          }
        ]
      },
      {
        id: 'kiedy-policja',
        t: 'When you must call the police',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'someone is injured or killed – that’s an accident, not a collision,',
              'the at-fault driver fled or refuses to give their details,',
              'the at-fault driver has no valid OC,',
              'one of the drivers seems drunk or under the influence of drugs,',
              'the at-fault driver has no driving licence, registration certificate or ID,',
              'you don’t agree who is at fault,',
              'public property is damaged (a sign, barrier, traffic light) – a police report is useful then too.'
            ]
          },
          {
            typ: 'uwaga',
            t: 'If the police come, the at-fault driver will usually get a fine and penalty points. Writing a statement is not a crime or “covering up” a collision – it’s the legal way to settle a minor collision with no injuries.'
          }
        ]
      },
      {
        id: 'zagraniczne',
        t: 'A foreign-registered car is involved',
        bloki: [
          {
            typ: 'p',
            t: 'Write down the Green Card or policy number and the name of the foreign insurer. In Poland, such claims are handled by that insurer’s correspondent or by the Polish Motor Insurers’ Bureau (PBUK, tel. +48 22 551 51 00). If you drive a car with foreign plates, always carry a valid Green Card or insurance certificate.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Do I have to call the police after a minor collision in Poland?', a: 'No, if nobody is injured, the at-fault driver admits fault, is sober and has documents and valid OC. A written statement signed by both drivers is enough.' },
      { q: 'What must the at-fault driver’s statement include?', a: 'Date, time and place, details of both drivers and cars, the at-fault driver’s OC policy number and insurer, a description of what happened, the damage, an admission of fault and both signatures.' },
      { q: 'Where do I report the damage after a collision?', a: 'To the at-fault driver’s OC insurer – by phone, online or at a branch. Attach the statement and photos.' }
    ],
    aktualizacja: '2026-11-08'
  },
  {
    pl: 'kontrola-drogowa-prawa-kierowcy',
    slug: 'police-traffic-stop-poland',
    tytul: 'Police traffic stop in Poland – your rights and duties, documents, fines',
    krotko: 'Police traffic stop',
    opis: 'How to behave when Polish police stop you, which documents to carry, who can stop you at all, and what happens if you refuse a fine.',
    seoTytul: 'Police traffic stop in Poland – your rights',
    seoOpis: 'How to behave at a police traffic stop in Poland, which documents a driver with a foreign licence needs, and what happens if you refuse to accept a fine (mandat).',
    skrot: [
      'Stay in the car, lower the window and keep your hands on the wheel. Get out only when told to.',
      'If you drive on a foreign licence, always carry it together with your passport or residence card.',
      'You can refuse a fine – then a court decides. An accepted fine is final immediately.'
    ],
    liczby: [
      { w: 'plain clothes', o: 'officers may stop you only in built-up areas' },
      { w: '7 days', o: 'to challenge an accepted fine (only in exceptions)' },
      { w: 'court', o: 'decides if you refuse the fine' }
    ],
    sekcje: [
      {
        id: 'zatrzymanie',
        t: 'How to behave',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Stop in a safe place', o: 'Slow down, pull over onto the hard shoulder or a lay-by and turn on the hazard lights.' },
              { t: 'Stay in the car', o: 'Get out only when told to. Lower the window and keep your hands on the wheel so the officer can see them.' },
              { t: 'Listen to the reason for the stop', o: 'The officer introduces themselves, gives their rank and the reason for stopping you. You have the right to ask to see their police ID.' },
              { t: 'Show your documents', o: 'Your ID (passport, residence card or the mObywatel app), and if your driving licence was not issued in Poland – that too. Stay calm and don’t argue – you can raise objections later.' }
            ]
          }
        ]
      },
      {
        id: 'kto-moze',
        t: 'Who can stop you',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'a uniformed police officer – anywhere,',
              'a plain-clothes officer – only in a built-up area; they must show their ID immediately and at night use a signal disc or a torch with a red light,',
              'at night outside built-up areas – only a uniformed officer next to a marked police car,',
              'other services too, e.g. the Road Transport Inspection (ITD) or the Border Guard – within their powers.'
            ]
          }
        ]
      },
      {
        id: 'dokumenty',
        t: 'Which documents you need',
        bloki: [
          {
            typ: 'p',
            t: 'A driver with a Polish licence only needs an ID in Poland – the police check the licence, registration and OC in the CEPiK database. Foreign driving licences are not in that database, so if your licence was issued in another country, always carry it with you.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'For a car with foreign plates, also carry the registration certificate and proof of insurance (Green Card or OC policy). Whether you may drive in Poland on a foreign licence depends on the issuing country and your status – if in doubt, check on gov.pl.'
          }
        ]
      },
      {
        id: 'mandat',
        t: 'A fine – accept it or not?',
        bloki: [
          {
            typ: 'p',
            t: 'You have the right to refuse a fine (mandat). The police then send a request for punishment to a court, which hears the case – and may impose a lower or higher penalty than the fine, plus court costs.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'An accepted fine is final immediately. A court can cancel it only if the act was not an offence at all – the application must be filed within 7 days.'
          },
          {
            typ: 'p',
            t: 'The officer may also just give you a warning. If you believe the officer broke the rules, you can file a complaint – in writing or electronically, ideally with a description and evidence.'
          }
        ]
      }
    ],
    faq: [
      { q: 'Which documents do I need at a police traffic stop in Poland?', a: 'An ID. If your driving licence was not issued in Poland – that as well, and for a car with foreign plates also the registration certificate and proof of insurance.' },
      { q: 'Can a plain-clothes police officer stop a driver?', a: 'Only in a built-up area, and they must show their ID immediately. At night outside built-up areas only a uniformed officer can stop you.' },
      { q: 'What happens if I don’t accept the fine?', a: 'The case goes to court. The court may impose a lower or higher penalty than the fine and charge the costs of the proceedings.' }
    ],
    aktualizacja: '2026-11-08'
  },
  {
    pl: 'przeglad-techniczny-terminy-koszt',
    slug: 'car-roadworthiness-test-poland',
    tytul: 'Car roadworthiness test in Poland – when, 2026 price, and what if the car fails',
    krotko: 'Roadworthiness test',
    opis: 'When to have the technical inspection (badanie techniczne) done, what it costs in 2026, what happens if the car fails and the risks of driving without a valid test.',
    seoTytul: 'Car inspection in Poland 2026 – price, dates',
    seoOpis: 'How much the car inspection costs in Poland in 2026 (149 zł, with LPG 245 zł), when a new car needs it, what happens if it fails and the penalties.',
    skrot: [
      'The test for a passenger car costs 149 zł, with an LPG system 245 zł – there’s no extra charge for being late.',
      'New car: first test after 3 years, second after 2, then every year. Cars with LPG – always every year.',
      'Without a valid test you risk a fine and the registration being retained, and your AC insurer may refuse to pay.'
    ],
    liczby: [
      { w: '149 zł', o: 'test for a passenger car' },
      { w: '245 zł', o: 'car with an LPG system' },
      { w: '3 → 2 → 1', o: 'years between tests of a new car' }
    ],
    sekcje: [
      {
        id: 'terminy',
        t: 'When to have the test',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'New car: after 3 years', o: 'First test before 3 years have passed since first registration.' },
              { t: 'Then: after 2 years', o: 'Second test before another 2 years have passed.' },
              { t: 'After that: every year', o: 'Every following test – once a year.' },
              { t: 'Car with LPG: always every year', o: 'Regardless of the car’s age, because the gas system is tested too.' }
            ]
          },
          {
            typ: 'p',
            t: 'You’ll find the date of the next test in the mObywatel app, on historiapojazdu.gov.pl or on the certificate from the test station. You can go to any vehicle inspection station (stacja kontroli pojazdów) in Poland, not only in your town.'
          },
          { typ: 'uwaga', t: 'A test done early shortens its validity – the next date is counted from the day of the test, not from the old date.' },
          {
            typ: 'uwaga',
            t: 'A car registered abroad is tested in its country of registration. Polish stations test cars registered in Poland and cars before their first registration in Poland.'
          }
        ]
      },
      {
        id: 'koszt',
        t: 'How much the test costs in 2026',
        bloki: [
          {
            typ: 'p',
            t: 'The test for a passenger car costs 149 zł, and with an LPG system 245 zł (149 zł plus 96 zł for checking the LPG). You pay before the test and don’t get the money back if the car fails. There’s no extra fee for a late test – the much-talked-about “double price” is still only a proposal.'
          }
        ]
      },
      {
        id: 'negatywny-wynik',
        t: 'The car failed the test',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'The inspector records the faults', o: 'You get information on what needs fixing. If a fault poses a serious danger, the inspector may forbid further driving.' },
              { t: 'Fix it and come back', o: 'At the re-test you pay only for checking the repaired items (e.g. brakes, lights). These fees together won’t exceed the price of a full test.' }
            ]
          }
        ]
      },
      {
        id: 'bez-przegladu',
        t: 'Driving without a valid test',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'you risk a fine, and the police can retain the registration certificate – today usually electronically, by an entry in the system,',
              'if the car is a danger to safety, it can be towed away at the owner’s expense,',
              'your AC (own-damage) insurer may reduce or refuse a payout if the fault contributed to the damage,',
              'the injured party will still be paid from OC – but with an obvious fault (e.g. brakes) things can get complicated.'
            ]
          }
        ]
      }
    ],
    faq: [
      { q: 'How much does the car inspection cost in Poland in 2026?', a: '149 zł for a passenger car and 245 zł for a car with an LPG system.' },
      { q: 'How often does a new car need the inspection?', a: 'First before 3 years from registration, the second after another 2 years, then every year. Cars with LPG – every year.' },
      { q: 'Is a late inspection more expensive?', a: 'No, the price is the same. But driving without a valid test risks a fine and the registration certificate being retained.' }
    ],
    aktualizacja: '2026-11-08'
  },
  {
    pl: 'ile-kosztuje-oc',
    slug: 'how-much-is-oc-insurance',
    tytul: 'How much does OC car insurance cost in Poland and what affects the price',
    krotko: 'How much is OC',
    opis: 'The average price of compulsory OC insurance in Poland is about 660 zł a year, but the same policy can cost several times more or less. What raises the premium, what lowers it and when to compare offers.',
    seoTytul: 'How much is OC car insurance in Poland 2026',
    seoOpis: 'The average OC car insurance in Poland in 2026 costs about 660 zł, young drivers pay about 1,500 zł. What the premium depends on and how to pay less.',
    skrot: [
      'Average OC in Q3 2026 cost 657 zł, but your price depends on age, no-claims discount, where you live and the car.',
      'OC cover is the same everywhere, so for OC alone the price matters most.',
      'The policy renews itself – compare offers 2–3 weeks before it ends.'
    ],
    liczby: [
      { w: '657 zł', o: 'average OC in Q3 2026 (CUK)' },
      { w: '1,504 zł', o: 'average paid by drivers aged 18–24' },
      { w: '551 zł', o: 'average paid by drivers aged 55–64' }
    ],
    sekcje: [
      {
        id: 'srednia-cena',
        t: 'Average OC price in 2026',
        bloki: [
          {
            typ: 'p',
            t: 'According to the CUK Ubezpieczenia report, the average premium for OC alone was 667 zł in Q2 2026 and 657 zł in Q3. That’s a national average – your price can be much lower or several times higher, because insurers calculate the risk separately for each driver and each car.'
          },
          {
            typ: 'p',
            t: 'Age shows it best. In the same report, drivers aged 18–24 paid on average 1,504 zł for OC, and drivers aged 55–64 paid 551 zł. That’s almost three times more, although both groups buy exactly the same statutory cover.'
          },
          {
            typ: 'uwaga',
            ton: 'info',
            t: 'OC cover is the same at every insurer – it’s set by law. What differs is the price, claims handling and extras (e.g. assistance). That’s why for OC alone, price is the main criterion.'
          }
        ]
      },
      {
        id: 'od-czego-zalezy',
        t: 'What the OC price depends on',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Driver’s age and experience', o: 'Young drivers and those with a new licence statistically cause more claims, so they pay the most. The premium usually drops noticeably after age 25–26.' },
              {
                t: 'Claims history and no-claims discount',
                o: 'Each year without an at-fault claim means a higher discount. One claim can push you back several levels and raise the price for years. Some insurers take your insurance history from abroad into account – ask about it and get a certificate from your previous insurer.'
              },
              { t: 'Where you live', o: 'Big cities and busy regions have more collisions, so premiums are higher. In the CUK report, differences between cities reached several hundred złoty.' },
              { t: 'The car: engine size, power, make', o: 'More powerful cars that are expensive to repair mean higher OC. The car’s age and how often the model is involved in claims also matter.' },
              { t: 'How the car is used', o: 'Annual mileage, driving abroad, a young driver using the car, a garage or street parking – all of this goes into the calculation.' }
            ]
          }
        ]
      },
      {
        id: 'jak-placic-mniej',
        t: 'How to pay less for OC',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'compare offers every year, 2–3 weeks before the policy ends – automatic renewal is often more expensive than an offer for a new customer,',
              'pay in one go if you can – instalments usually increase the total cost,',
              'give true information about drivers and mileage – understating the risk can end with an extra premium to pay,',
              'check your history in UFG and your discounts with the new insurer – sometimes the system doesn’t “see” them and you need to send a certificate,',
              'take an OC + AC bundle only if you really need AC – a bundle isn’t always cheaper,',
              'before buying a car, check the OC price for that model – two similar cars can differ by several hundred złoty.'
            ]
          },
          {
            typ: 'link',
            t: 'Compare OC and AC prices in the calculator',
            o: 'Offers from many insurers in a few minutes – have your registration certificate and PESEL ready. The calculator is in Polish.',
            href: '/ubezpieczenie-oc/'
          }
        ]
      },
      {
        id: 'automatyczne-przedluzenie',
        t: 'OC renews itself – when that’s good and when it isn’t',
        bloki: [
          {
            typ: 'p',
            t: 'If you don’t cancel the policy by the day before the end of the insurance period at the latest, OC renews automatically for another 12 months. It’s convenient, but the insurer can change the price. Many drivers pay more simply because they didn’t check competitors’ offers.'
          },
          {
            typ: 'p',
            t: 'The safe order is: compare prices, buy the new OC starting the day after the old one expires, then send a cancellation (wypowiedzenie) of the old policy. If you forget to cancel and end up with two policies, you can cancel the one that renewed automatically.'
          },
          {
            typ: 'link',
            t: 'Cancelling OC – printable template',
            o: 'Fill in the fields in your browser, print and send it to the insurer. The template is in Polish.',
            href: '/poradniki/wypowiedzenie-oc/'
          }
        ]
      },
      {
        id: 'kara-za-brak',
        t: 'No OC costs many times more than a policy',
        bloki: [
          {
            typ: 'liczby',
            elementy: [
              { w: '1,920 zł', o: 'for 1–3 days without OC (passenger car, 2026)' },
              { w: '4,810 zł', o: 'for a 4–14 day gap' },
              { w: '9,610 zł', o: 'for more than 14 days without OC' }
            ]
          },
          {
            typ: 'p',
            t: 'The fines are imposed by the Insurance Guarantee Fund (UFG) and depend on the minimum wage, so they rise every year. If you cause an accident without OC, UFG pays the victims and then demands the whole amount back from you.'
          }
        ]
      }
    ],
    faq: [
      { q: 'How much does OC cost on average in 2026?', a: 'According to the CUK Ubezpieczenia report, the average OC premium was 667 zł in Q2 and 657 zł in Q3 2026. Young drivers (18–24) paid on average about 1,500 zł.' },
      { q: 'Why did my OC go up even though I had no claims?', a: 'Insurers change their rates every year – they factor in, among other things, rising repair and compensation costs. With automatic renewal you get a new price without comparing it with competitors, so check offers before your policy ends.' },
      { q: 'Is OC cheaper in instalments?', a: 'Usually not. Paying in instalments most often increases the total cost. If you can, pay the whole premium at once.' },
      { q: 'Does OC cover differ between insurers?', a: 'No. The scope and minimum sums insured are set by law, so the cover is the same. Price, claims handling and extra services differ.' }
    ],
    aktualizacja: '2026-11-08'
  },
  {
    pl: 'sprowadzenie-auta-z-zagranicy',
    slug: 'importing-a-car-to-poland',
    tytul: 'Importing a car to Poland from Germany and the EU – excise, registration, costs',
    krotko: 'Importing a car',
    opis: 'From the contract abroad to Polish plates: how to bring the car over, how much excise duty is, which documents to translate and which deadlines to meet.',
    seoTytul: 'Importing a car to Poland – excise, registration',
    seoOpis: 'How to import a car from Germany or the EU to Poland: excise 3.1% or 18.6% (declaration within 14 days), translations, inspection and registration within 30 days.',
    skrot: [
      'Declare excise within 14 days and pay it within 30 days of bringing the car into Poland: 3.1% for engines up to 2.0 l, 18.6% above, less for hybrids, 0% for EVs.',
      'To register you need sworn translations, proof of excise payment and a Polish roadworthiness test.',
      'You have 30 days from bringing the car into Poland to register it – being late costs 500 zł.'
    ],
    liczby: [
      { w: '14 days', o: 'for the AKC-U/S excise declaration' },
      { w: '3.1% / 18.6%', o: 'excise: engine up to 2.0 l / above' },
      { w: '30 days', o: 'to register from entering Poland' }
    ],
    sekcje: [
      {
        id: 'zanim-kupisz',
        t: 'Before you buy',
        bloki: [
          {
            typ: 'lista',
            elementy: [
              'check the car’s history by VIN – mileage and damage from abroad are the most common trap with imports,',
              'the contract or invoice must include the VIN, details of both parties and the price – you’ll need it for excise and registration,',
              'take the original vehicle documents (in Germany, both parts of the registration certificate) and all keys,',
              'calculate the excise before buying – for engines over 2.0 l it can change whether the deal is worth it.'
            ]
          }
        ]
      },
      {
        id: 'transport',
        t: 'How to bring the car to Poland',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Driving it – on export plates', o: 'The car must be roadworthy, have temporary (export) plates and short-term insurance. Such a policy usually covers up to 30 days – until registration in Poland.' },
              { t: 'On a tow truck or trailer', o: 'When the car has no plates or isn’t roadworthy. Get transport documents from the carrier – they may help at registration.' }
            ]
          },
          { typ: 'uwaga', t: 'By the day of registration at the latest you must have Polish OC insurance. A foreign policy stops working once the car is registered in Poland.' }
        ]
      },
      {
        id: 'akcyza',
        t: 'Excise duty – how much and by when',
        bloki: [
          {
            typ: 'liczby',
            elementy: [
              { w: '3.1%', o: 'engine up to 2,000 cm³' },
              { w: '18.6%', o: 'engine over 2,000 cm³' },
              { w: '1.55%', o: 'hybrid up to 2,000 cm³' },
              { w: '0%', o: 'EV, plug-in hybrid up to 2,000 cm³' }
            ]
          },
          {
            typ: 'p',
            t: 'Excise is calculated on the price you paid (the tax office may use the market value if the price looks too low), converted into złoty at the average NBP exchange rate. Hybrids from 2,001 to 3,500 cm³ pay 9.3%, and plug-in hybrids up to 2,000 cm³ are exempt until the end of 2029. You file the AKC-U/S declaration within 14 days and pay the tax within 30 days – usually counted from the day the car entered Poland, and always no later than registration. The PUESC portal is the easiest way to file. Proof of payment (with the VIN) is needed for registration.'
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'An excise exemption (e.g. for an EV) also has to be confirmed by the tax office – without that document the registration office won’t register the car.'
          }
        ]
      },
      {
        id: 'rejestracja',
        t: 'Registration in Poland',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'VAT', o: 'For a used car from the European Union you no longer need a VAT certificate – VAT-25 was abolished in 2015. The exception is a new car (up to 6 months since first use or up to 6,000 km): then you file a VAT-23 notice with the tax office and pay VAT in Poland within 14 days.' },
              { t: 'Sworn translations', o: 'Have the contract or invoice and other foreign-language documents translated by a sworn translator (tłumacz przysięgły). One page of a contract usually costs around 70–100 zł.' },
              { t: 'Roadworthiness test in Poland', o: 'Before its first registration the car must pass a test at a Polish vehicle inspection station – even if it has a valid test from abroad.' },
              {
                t: 'Application at the registration office',
                o: 'You have 30 days from bringing the car into Poland. Take: the contract with translation, vehicle documents (with translation), the plates or a statement that there are none, proof of excise payment, the test certificate, your ID and the OC policy.'
              }
            ]
          },
          {
            typ: 'uwaga',
            ton: 'ostrzezenie',
            t: 'Not applying for registration within 30 days means a 500 zł fine, and after 180 days 1,000 zł. When buying from a private person abroad you usually don’t pay PCC.'
          }
        ]
      }
    ],
    faq: [
      { q: 'How much is the excise duty on a car from Germany?', a: '3.1% of the market value for engines up to 2,000 cm³ and 18.6% above. Hybrids have lower rates (1.55% and 9.3%), and EVs and plug-in hybrids up to 2,000 cm³ are exempt.' },
      { q: 'How long do I have to register a car imported from abroad?', a: '30 days from bringing the car into Poland. Being late costs 500 zł, and after 180 days 1,000 zł.' },
      { q: 'Do I have to translate the documents of a car from Germany?', a: 'Yes – foreign-language documents, including the contract or invoice, must be translated by a sworn translator.' }
    ],
    aktualizacja: '2026-11-08'
  },
  {
    pl: 'zgubiony-dowod-rejestracyjny-prawo-jazdy',
    slug: 'lost-registration-certificate-driving-licence',
    tytul: 'Lost your car registration certificate or driving licence in Poland – what to do',
    krotko: 'Lost car documents',
    opis: 'Lost your Polish registration certificate or driving licence, or had it stolen? Where to report it, how to get a duplicate and whether you can drive in the meantime.',
    seoTytul: 'Lost driving licence or car documents in Poland',
    seoOpis: 'What to do after losing a Polish registration certificate or driving licence: where to report it, how much a duplicate costs (100 zł for a licence) and how long it takes.',
    skrot: [
      'Duplicate registration certificate: apply within 30 days, with a temporary permit while you wait.',
      'Duplicate Polish driving licence: 100 zł, apply online or at the office, usually up to 9 working days.',
      'Report a theft to the police first. A document issued in another country is replaced by that country.'
    ],
    liczby: [
      { w: '30 days', o: 'to apply for a duplicate registration certificate' },
      { w: '100 zł', o: 'duplicate driving licence' },
      { w: 'up to 9', o: 'working days for a new licence' }
    ],
    sekcje: [
      {
        id: 'dowod',
        t: 'Registration certificate (dowód rejestracyjny)',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Stolen? Police first', o: 'If the document (or the plates) was stolen, report it to the police.' },
              { t: 'Apply for a duplicate within 30 days', o: 'At the registration office where the car is registered. Bring your ID and sign a statement about the loss.' },
              { t: 'Temporary permit', o: 'While you wait you can get a temporary permit (pozwolenie czasowe) valid for 30 days – you hand it back when you collect the new certificate.' },
              { t: 'Collection', o: 'The new certificate is usually ready within 30 days. Check the status on info-car.pl.' }
            ]
          },
          {
            typ: 'p',
            t: 'Example fees (Warsaw): 54 zł for the new certificate and 18.50 zł for the temporary permit. Fees may change – check them at your office before you go.'
          },
          {
            typ: 'uwaga',
            t: 'In Poland you don’t have to carry the registration certificate of a Polish-registered car – the police check the data in the system. But you can’t go abroad without the paper document (or the temporary permit).'
          }
        ]
      },
      {
        id: 'prawo-jazdy',
        t: 'Driving licence (prawo jazdy)',
        bloki: [
          {
            typ: 'kroki',
            elementy: [
              { t: 'Apply for a duplicate', o: 'Online (the “Wydanie wtórnika prawa jazdy” service, with profil zaufany) or at the office – the county office (starostwo), city or district office.' },
              { t: 'Prepare a photo and the fee', o: 'The fee is 100 zł. Online you need the photo as a file – the requirements are described on gov.pl.' },
              { t: 'Wait for the document', o: 'Usually up to 9 working days. Check whether it’s ready on info-car.pl.' }
            ]
          },
          { typ: 'uwaga', ton: 'ostrzezenie', t: 'You may not drive without a valid driving licence. Better leave the car until you collect the duplicate.' },
          {
            typ: 'uwaga',
            t: 'This procedure applies to documents issued in Poland. If you lost a licence issued in another country, report the loss to the police and contact the authorities of the country that issued it (e.g. via its consulate).'
          }
        ]
      }
    ],
    faq: [
      { q: 'How much is a duplicate registration certificate?', a: 'In Warsaw 54 zł for the certificate and 18.50 zł for a temporary permit while you wait. Check the fees at your office.' },
      { q: 'How much is a duplicate Polish driving licence and how long does it take?', a: '100 zł. The office usually issues it within 9 working days.' },
      { q: 'Do I have to carry the registration certificate?', a: 'For a Polish-registered car, in Poland – no, the police check the data in the system. Abroad, and for foreign-registered cars, you need the paper document.' }
    ],
    aktualizacja: '2026-11-08'
  }
];
