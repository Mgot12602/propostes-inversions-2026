import { InvestmentCategory } from '@/types/investment';

export const investmentData: InvestmentCategory[] = [
  {
    id: 'propietats',
    title: 'Propietats',
    ideas: [
      {
        id: 'hotel-pousada',
        title: 'Hotel Pousada Sol e Lua',
        category: 'propietats',
        description: 'Oportunitat única d\'adquirir un hotel boutique a la costa brasilera amb gran potencial turístic. Ubicació privilegiada amb vistes al mar i accés directe a la platja.',
        investment: '€850.000',
        annualReturn: '12-15%',
        pros: [
          'Ubicació privilegiada amb vistes al mar',
          'Negoci en funcionament amb clientela establerta',
          'Alt potencial de creixement turístic a la zona',
          'Infraestructura completa i en bon estat',
          'Possibilitat d\'expansió'
        ],
        cons: [
          'Requereix gestió activa o contractació de personal',
          'Dependència de la temporada turística',
          'Inversió inicial elevada',
          'Risc de canvi de divisa'
        ],
        images: ['/placeholder-hotel.jpg']
      },
      {
        id: 'casa-pousada',
        title: 'Casa costat Pousada',
        category: 'propietats',
        description: 'Propietat residencial adjacent a la Pousada, ideal per a ampliació del negoci hoteler o com a residència privada de luxe.',
        investment: '€320.000',
        annualReturn: '8-10%',
        pros: [
          'Proximitat a negoci hoteler existent',
          'Potencial per a lloguer vacacional',
          'Zona en desenvolupament',
          'Inversió més accessible'
        ],
        cons: [
          'Necessita renovació parcial',
          'Menor rendibilitat que l\'hotel',
          'Dependència del mercat local'
        ],
        images: ['/placeholder-house.jpg']
      },
      {
        id: 'terreny-mar',
        title: 'Terreny costat del mar',
        category: 'propietats',
        description: 'Parcel·la de terreny amb accés directe al mar, ideal per a desenvolupament immobiliari o projecte turístic exclusiu.',
        investment: '€450.000',
        annualReturn: '15-20%',
        pros: [
          'Primera línia de mar',
          'Gran potencial de revalorització',
          'Flexibilitat de desenvolupament',
          'Zona amb alta demanda turística',
          'Possibilitat de projecte ecològic'
        ],
        cons: [
          'Requereix inversió addicional per desenvolupar',
          'Procés de permisos pot ser llarg',
          'No genera ingressos immediats',
          'Risc regulatori'
        ],
        images: ['/placeholder-land.jpg']
      },
      {
        id: 'inversio-catalunya',
        title: 'Inversió Immobiliària a Catalunya',
        category: 'propietats',
        description: 'Inversió en habitatge residencial a Catalunya per a lloguer de llarga durada. Anàlisi detallat de rentabilitat bruta vs neta considerant tots els impostos i despeses del mercat espanyol.',
        investment: '€300.000',
        annualReturn: '3-5% (net)',
        pros: [
          'Mercat immobiliari estable i madur',
          'Demanda constant de lloguer residencial',
          'Revalorització històrica del 5-9% anual',
          'Fiscalitat coneguda i previsible',
          'Protecció contra inflació',
          'Actiu tangible amb valor intrínsec'
        ],
        cons: [
          'Impostos elevats (ITP 12%, guanys capital 21%)',
          'Despeses recurrents significatives',
          'Baixa liquiditat de l\'actiu',
          'Necessitat de gestió activa',
          'Risc d\'impagament de llogaters',
          'Regulacions de lloguer restrictives'
        ],
        images: ['/placeholder-apartment.jpg']
      }
    ]
  },
  {
    id: 'productes-financers',
    title: 'Productes Financers',
    ideas: [
      {
        id: 'etf-msci-world',
        title: 'ETF MSCI World',
        category: 'productes-financers',
        description: 'Fons cotitzat que replica l\'índex MSCI World, oferint diversificació global en més de 1.500 empreses de països desenvolupats.',
        investment: '€50.000',
        annualReturn: '7-9%',
        pros: [
          'Diversificació global automàtica',
          'Costos de gestió molt baixos',
          'Alta liquiditat',
          'Historial de rendiment sòlid',
          'Inversió passiva sense gestió activa',
          'Accessible per a qualsevol inversor'
        ],
        cons: [
          'Exposició a volatilitat del mercat global',
          'Rendiments moderats',
          'No protegeix contra caigudes del mercat',
          'Concentració en mercats desenvolupats'
        ],
        images: ['/placeholder-etf.jpg']
      },
      {
        id: 'bonos-aaa',
        title: 'Bons d\'Estat AAA',
        category: 'productes-financers',
        description: 'Bons sobirans de països amb qualificació creditícia AAA, oferint seguretat i rendiments estables amb risc mínim.',
        investment: '€100.000',
        annualReturn: '3-4%',
        pros: [
          'Risc mínim - màxima seguretat',
          'Rendiments predictibles',
          'Protecció del capital',
          'Liquiditat elevada',
          'Diversificació de cartera'
        ],
        cons: [
          'Rendiments baixos',
          'Risc d\'inflació',
          'Sensibilitat als tipus d\'interès',
          'Oportunitat de cost respecte altres inversions'
        ],
        images: ['/placeholder-bonds.jpg']
      }
    ]
  },
  {
    id: 'industria',
    title: 'Indústria',
    ideas: [
      {
        id: 'reciclatge',
        title: 'Planta de Reciclatge',
        category: 'industria',
        description: 'Inversió en planta de reciclatge de plàstics amb tecnologia avançada, aprofitant la creixent demanda de solucions sostenibles i economia circular.',
        investment: '€1.200.000',
        annualReturn: '18-22%',
        pros: [
          'Sector en creixement exponencial',
          'Incentius governamentals i subvencions',
          'Demanda creixent de materials reciclats',
          'Impacte ambiental positiu',
          'Contractes a llarg termini amb empreses',
          'Barreres d\'entrada elevades'
        ],
        cons: [
          'Inversió inicial molt elevada',
          'Complexitat operativa',
          'Dependència de regulacions ambientals',
          'Necessitat d\'expertise tècnic',
          'Risc tecnològic',
          'Temps de retorn més llarg'
        ],
        images: ['/placeholder-recycling.jpg']
      }
    ]
  }
];
