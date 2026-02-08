---
description: Guide for implementing financial product calculator pages (ETFs, real estate, etc.)
---

# Guia d'Implementació de Pàgines de Productes Financers

## Principis Fonamentals

### 1. Inversió = Pressupost Total
- El slider d'**inversió** representa el pressupost total disponible (diners que surten de la butxaca).
- El preu de l'actiu es **deriva** restant els costos de compra del pressupost.
- Això permet comparar productes en igualtat de condicions: €300k en immobles vs €300k en ETFs.
- Exemple immoble: `propertyPrice = (totalInvestment - fixedCosts) / (1 + pctCostsOverPrice)`
- Exemple ETF: `netInvested = totalInvestment - buyingCommission`

### 2. Fiscalitat (Societat Limitada)
- **Impost de Societats (IS) 25%** s'aplica sobre:
  - **Plusvàlua en venda**: `(preuVenda - preuCompra) * 0.25` — només sobre el guany, NO sobre el total.
  - **Rendiments nets anuals** (lloguers, dividends): tributen any a any al 25%.
- **No hi ha doble imposició**: la plusvàlua i els rendiments es graven per separat.
- Tots els productes han de mostrar el CAGR **net d'IS**.
- A la UI, mostrar una targeta `bg-amber-900/30` amb text "IS 25% sobre plusvàlua" explicant que només es paga sobre el guany.

### 3. CAGR (Compound Annual Growth Rate)
- Fórmula: `CAGR = ((ValorFinalNet / InversióTotal) ^ (1/anys) - 1) × 100`
- El CAGR sempre ha de ser **net**: després de TOTS els costos (compra, venda, impostos, despeses).
- `ValorFinalNet` = valor actiu - costos venda - IS plusvàlua + rendiments nets acumulats.
- `InversióTotal` = pressupost total (el que l'inversor posa).

## Estructura d'un Component Calculadora

### Estats (useState)
```
totalInvestment     — Pressupost total (slider principal)
yearsToHold         — Anys de manteniment
appreciationRate    — % revalorització anual (simulació)
[params específics]  — Paràmetres propis del producte (lloguer, comissions, etc.)
purchaseYear        — Any de compra per al gràfic històric
```

### Dades Històriques (constants fora del component)
```
historicalReturns   — Retorns anuals per actiu/producte (font oficial única)
historicalInflation — IPC Espanya (INE), mateixos anys que les dades de retorn
```

### Càlculs (useMemo / funcions)
1. **deriveAssetPrice(budget)** — Calcula el preu real de l'actiu a partir del pressupost.
2. **calculateBuyingCosts()** — Desglossa tots els costos de compra.
3. **calculateYearlyData()** — Simulació any per any amb el % de revalorització seleccionat.
4. **historicalChartData** (useMemo) — CAGR compost real amb dades històriques, net d'IS.
5. **historicalAverages** (useMemo) — Mitjana inflació i revalorització per al període seleccionat.
6. **fullPeriodAvgReturn** (useMemo) — Mitjana històrica estable (tot el període disponible), no depèn del slider d'any.

### Seccions UI (ordre)
1. **Controls** — Sliders i paràmetres en grid compacte.
   - Cada slider de rendibilitat/revalorització ha de mostrar la **mitjana històrica estable** a sota (fullPeriodAvg).
   - Targeta IS 25% amb explicació.
   - CAGR resultant de la simulació.
2. **Gràfic Simulació CAGR** — LineChart amb línia CAGR + ReferenceLine inflació.
3. **Resum Inversió** — Cards amb: Inversió Total, Valor Final Net (amb IS i guany), CAGR Net.
4. **Desglossament Inversió** — Taula detallada de costos de compra. Total = totalInvestment.
5. **Gràfic Històric YoY%** — Variació interanual amb ReferenceLine inflació mitjana.
6. **Gràfic Històric CAGR Compost** — CAGR net des d'any seleccionable.
   - Slider `purchaseYear` (únic control propi del gràfic històric).
   - Tots els altres paràmetres (lloguer, despeses, etc.) venen de la secció de controls.
   - ReferenceLine: inflació mitjana + revalorització mitjana del període.
   - Cards sota el gràfic: CAGR, valor final, guany net.
7. **Taula Detallada** — Any per any amb tots els fluxos.
8. **Explicació CAGR** — Text explicatiu amb fórmula.

## Regles de Consistència entre Productes

### Paràmetres compartits
- `totalInvestment` — Mateix slider, mateix rang, mateixa semàntica.
- `yearsToHold` — Mateix slider.
- IS 25% — Mateixa lògica, mateixa visualització.
- Inflació — Mateixa font (INE IPC), mateixa visualització (ReferenceLine vermella discontínua).

### Gràfics històrics
- Han d'usar els **mateixos paràmetres** que la simulació (no controls separats).
- L'únic control propi és el slider d'any de compra/inversió.
- Mostrar mitjana inflació i mitjana retorn com a línies horitzontals discontínues.
- Mostrar valor final i guany net sota el gràfic.

### Indicador de mitjana històrica
- Sota cada slider de rendibilitat/revalorització, mostrar:
  `Mitjana hist. (YYYY-YYYY): X.X%`
- Aquesta mitjana és **estable**: calculada sobre TOT el període de dades disponible.
- No canvia amb el slider d'any d'inversió (és una referència fixa).

## Fonts de Dades Oficials

### Immobles
- **Preus**: Ministerio de Transportes — "Valor tasado de vivienda libre" (€/m², mitjana anual).
- **Sèrie**: 1995-2024 (font única i coherent).

### ETFs / Índexs
- **MSCI World**: Total return (USD), font MSCI.
- **S&P 500**: Total return (USD), font S&P Dow Jones.
- **Nasdaq-100**: Total return (USD), font Nasdaq.
- **Bons AAA EUR**: Bloomberg Euro Aggregate AAA.
- **Sèrie**: 2004-2024 (o des de quan hi hagi dades coherents).

### Inflació
- **Font**: INE — IPC interanual (desembre).
- **Sèrie**: Ha de cobrir el mateix rang que les dades de retorn.

## Checklist per Nou Producte

1. [ ] Crear component `[ProductName]CAGR.tsx` a `/components/`.
2. [ ] Definir dades històriques de retorn (font oficial única).
3. [ ] Afegir dades d'inflació si no estan ja compartides.
4. [ ] Implementar `deriveAssetPrice()` per calcular preu real des del pressupost.
5. [ ] Implementar `calculateBuyingCosts()` amb tots els costos específics.
6. [ ] Implementar `calculateYearlyData()` amb IS 25% sobre rendiments i plusvàlua.
7. [ ] Implementar `historicalChartData` amb CAGR net (IS inclòs).
8. [ ] Implementar `fullPeriodAvgReturn` (mitjana estable).
9. [ ] Afegir targeta IS 25% als controls.
10. [ ] Afegir mitjana històrica sota sliders de rendibilitat.
11. [ ] Verificar que gràfics històrics usen paràmetres de simulació (no controls separats).
12. [ ] Verificar que INVERSIÓ TOTAL = pressupost (no pressupost + costos).
13. [ ] Afegir component a `app/idea/[id]/page.tsx` amb condicional per `idea.id`.
14. [ ] Afegir producte a `data/investments.ts`.
15. [ ] Lint + Build + Test visual.
