'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface AssetConfig {
  id: string;
  name: string;
  color: string;
  defaultReturn: number;
  minReturn: number;
  maxReturn: number;
}

interface YearData {
  year: number;
  [key: string]: number;
}

const historicalReturns: Record<string, Record<number, number>> = {
  'msci-world': {
    2001: -16.52, 2002: -19.54, 2003: 33.76, 2004: 15.25, 2005: 10.02,
    2006: 20.65, 2007: 9.57, 2008: -40.33, 2009: 30.79, 2010: 12.34,
    2011: -5.54, 2012: 15.83, 2013: 26.68, 2014: 4.94, 2015: -0.87,
    2016: 7.51, 2017: 22.40, 2018: -8.71, 2019: 27.67, 2020: 15.90,
    2021: 21.82, 2022: -18.14, 2023: 23.79, 2024: 18.67
  },
  'nasdaq': {
    1995: 42.54, 1996: 42.54, 1997: 20.63, 1998: 85.30, 1999: 101.95,
    2000: -36.11, 2001: -33.34, 2002: -37.37, 2003: 49.67, 2004: 10.54,
    2005: 1.57, 2006: 7.14, 2007: 19.02, 2008: -41.73, 2009: 54.68,
    2010: 20.14, 2011: 3.47, 2012: 18.12, 2013: 36.63, 2014: 19.18,
    2015: 9.45, 2016: 7.10, 2017: 32.66, 2018: -0.12, 2019: 38.96,
    2020: 48.40, 2021: 27.42, 2022: -32.54, 2023: 53.81, 2024: 25.88
  },
  'sp500': {
    1995: 37.58, 1996: 22.96, 1997: 33.36, 1998: 28.58, 1999: 21.04,
    2000: -9.10, 2001: -11.89, 2002: -22.10, 2003: 28.68, 2004: 10.88,
    2005: 4.91, 2006: 15.79, 2007: 5.49, 2008: -37.00, 2009: 26.46,
    2010: 15.06, 2011: 2.11, 2012: 16.00, 2013: 32.39, 2014: 13.69,
    2015: 1.38, 2016: 11.96, 2017: 21.83, 2018: -4.38, 2019: 31.49,
    2020: 18.40, 2021: 28.71, 2022: -18.11, 2023: 26.29, 2024: 25.02
  },
  'msci-screened': {
    2015: 1.53, 2016: 7.08, 2017: 23.06, 2018: -6.83, 2019: 30.26,
    2020: 20.70, 2021: 26.56, 2022: -23.13, 2023: 28.09, 2024: 13.96
  },
  'bonds-agg': {
    1995: 18.5, 1996: 3.6, 1997: 9.7, 1998: 8.7, 1999: -0.8,
    2000: 11.6, 2001: 8.4, 2002: 10.3, 2003: 4.1, 2004: 4.3,
    2005: 2.4, 2006: 4.3, 2007: 7.0, 2008: 5.2, 2009: 5.9,
    2010: 6.5, 2011: 7.8, 2012: 4.2, 2013: -2.0, 2014: 6.0,
    2015: 0.5, 2016: 2.6, 2017: 3.5, 2018: 0.0, 2019: 8.7,
    2020: 7.5, 2021: -1.5, 2022: -13.0, 2023: 5.5, 2024: 1.7
  }
};

const historicalInflation: Record<number, number> = {
  1995: 4.7, 1996: 3.6, 1997: 2.0, 1998: 1.8, 1999: 2.3,
  2000: 3.4, 2001: 3.6, 2002: 3.5, 2003: 3.0, 2004: 3.0,
  2005: 3.4, 2006: 3.5, 2007: 2.8, 2008: 4.1, 2009: -0.3,
  2010: 1.8, 2011: 3.2, 2012: 2.4, 2013: 1.4, 2014: -0.2,
  2015: -0.5, 2016: -0.2, 2017: 2.0, 2018: 1.7, 2019: 0.7,
  2020: -0.3, 2021: 3.1, 2022: 8.4, 2023: 3.5, 2024: 2.8
};

const ETFBondsCAGR = () => {
  const assets: AssetConfig[] = [
    { id: 'msci-world', name: 'MSCI World', color: '#3b82f6', defaultReturn: 8.0, minReturn: 4, maxReturn: 14 },
    { id: 'nasdaq', name: 'Nasdaq-100', color: '#10b981', defaultReturn: 12.0, minReturn: 6, maxReturn: 20 },
    { id: 'sp500', name: 'S&P 500', color: '#f97316', defaultReturn: 10.0, minReturn: 5, maxReturn: 16 },
    { id: 'msci-screened', name: 'MSCI World SRI', color: '#a855f7', defaultReturn: 8.0, minReturn: 4, maxReturn: 14 },
    { id: 'bonds-agg', name: 'Bloomberg US Agg Bond', color: '#6b7280', defaultReturn: 3.5, minReturn: 0, maxReturn: 8 }
  ];

  const [initialInvestment, setInitialInvestment] = useState(50000);
  const [yearsToHold, setYearsToHold] = useState(20);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['msci-world', 'nasdaq', 'sp500', 'msci-screened', 'bonds-agg']);
  const [assetReturns, setAssetReturns] = useState<Record<string, number>>({
    'msci-world': 8.0, 'nasdaq': 12.0, 'sp500': 10.0, 'msci-screened': 8.0, 'bonds-agg': 3.5
  });
  const [investmentYear, setInvestmentYear] = useState(2004);

  const calculateMyInvestorCost = (amount: number): number => {
    const cost = amount * 0.0012;
    return Math.max(1, Math.min(25, cost));
  };

  const calculateYearlyData = (): YearData[] => {
    const yearlyData: YearData[] = [];
    const buyingCost = calculateMyInvestorCost(initialInvestment);
    const netInitialInvestment = initialInvestment - buyingCost;

    for (let year = 1; year <= yearsToHold; year++) {
      const dataPoint: YearData = { year };

      selectedAssets.forEach(assetId => {
        const annualReturn = assetReturns[assetId] / 100;
        const grossValue = netInitialInvestment * Math.pow(1 + annualReturn, year);

        const sellingCost = calculateMyInvestorCost(grossValue);
        const capitalGain = grossValue - initialInvestment;
        const capitalGainsTax = capitalGain > 0 ? capitalGain * 0.25 : 0;

        const netValue = grossValue - sellingCost - capitalGainsTax;
        const cagr = ((netValue / initialInvestment) ** (1 / year) - 1) * 100;

        dataPoint[assetId] = cagr;
      });

      yearlyData.push(dataPoint);
    }

    return yearlyData;
  };

  const historicalYoYData = useMemo(() => {
    const allYears = new Set<number>();
    Object.values(historicalReturns).forEach(data => {
      Object.keys(data).forEach(y => allYears.add(Number(y)));
    });
    const years = Array.from(allYears).sort((a, b) => a - b);

    return years.map(year => {
      const point: Record<string, number | undefined> = { year };
      selectedAssets.forEach(assetId => {
        const ret = historicalReturns[assetId]?.[year];
        if (ret !== undefined) {
          point[`${assetId}-yoy`] = ret;
        }
      });
      return point;
    });
  }, [selectedAssets]);

  const historicalCompoundData = useMemo(() => {
    const allYears = new Set<number>();
    Object.values(historicalReturns).forEach(data => {
      Object.keys(data).forEach(y => allYears.add(Number(y)));
    });
    const years = Array.from(allYears).sort((a, b) => a - b);

    const buyingCostPct = 0.0012;
    const sellingCostPct = 0.0012;

    return years.filter(y => y >= investmentYear).map(year => {
      const point: Record<string, number | undefined> = { year };

      selectedAssets.forEach(assetId => {
        const assetData = historicalReturns[assetId];
        if (!assetData) return;

        const assetYears = Object.keys(assetData).map(Number).sort((a, b) => a - b);
        const assetStart = Math.max(investmentYear, assetYears[0]);

        if (year < assetStart) return;
        if (year === assetStart) {
          point[`${assetId}-cagr`] = 0;
          return;
        }

        let cumulativeGrowth = 1;
        let allDataAvailable = true;
        for (let y = assetStart; y < year; y++) {
          const ret = assetData[y];
          if (ret === undefined) { allDataAvailable = false; break; }
          cumulativeGrowth *= (1 + ret / 100);
        }
        if (!allDataAvailable) return;

        const netInitial = 1 * (1 - buyingCostPct);
        const grossFinal = netInitial * cumulativeGrowth;
        const capitalGain = grossFinal - 1;
        const tax = capitalGain > 0 ? capitalGain * 0.25 : 0;
        const sellingCost = grossFinal * sellingCostPct;
        const netFinal = grossFinal - tax - sellingCost;

        const elapsed = year - assetStart;
        const cagr = ((netFinal / 1) ** (1 / elapsed) - 1) * 100;
        point[`${assetId}-cagr`] = cagr;
      });

      return point;
    });
  }, [selectedAssets, investmentYear]);

  const fullPeriodAvgReturns = useMemo(() => {
    const result: Record<string, { cagr: number; avg: number; from: number; to: number }> = {};
    Object.entries(historicalReturns).forEach(([assetId, data]) => {
      const years = Object.keys(data).map(Number).sort((a, b) => a - b);
      if (years.length < 2) return;
      let cumulative = 1;
      let sum = 0;
      for (const y of years) {
        cumulative *= (1 + data[y] / 100);
        sum += data[y];
      }
      const cagr = (Math.pow(cumulative, 1 / years.length) - 1) * 100;
      const avg = sum / years.length;
      result[assetId] = { cagr, avg, from: years[0], to: years[years.length - 1] };
    });
    return result;
  }, []);

  const toggleAsset = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const etfHistoricalAverages = useMemo(() => {
    const periodYears = Object.keys(historicalInflation).map(Number).filter(y => y > investmentYear && y <= 2024);
    if (periodYears.length === 0) return { avgInflation: 0, avgReturns: {} as Record<string, number> };

    let sumInflation = 0;
    let countInflation = 0;
    for (const y of periodYears) {
      if (historicalInflation[y] !== undefined) {
        sumInflation += historicalInflation[y];
        countInflation++;
      }
    }

    const avgReturns: Record<string, number> = {};
    selectedAssets.forEach(assetId => {
      const data = historicalReturns[assetId];
      if (!data) return;
      let sum = 0;
      let count = 0;
      for (const y of periodYears) {
        if (data[y] !== undefined) {
          sum += data[y];
          count++;
        }
      }
      if (count > 0) avgReturns[assetId] = sum / count;
    });

    return {
      avgInflation: countInflation > 0 ? sumInflation / countInflation : 0,
      avgReturns
    };
  }, [investmentYear, selectedAssets]);

  const lastCompoundData = historicalCompoundData[historicalCompoundData.length - 1];

  const yearlyData = calculateYearlyData();
  const finalYear = yearlyData[yearlyData.length - 1];

  const buyingCost = calculateMyInvestorCost(initialInvestment);

  return (
    <div className="w-full space-y-3">
      <div className="bg-slate-800 rounded-xl p-3">
        <h2 className="text-xl font-bold text-white mb-3">Calculadora ETFs i Bons</h2>

        <div className="grid grid-cols-2 gap-3 text-xs mb-3">
          <div className="space-y-2">
            <label className="text-slate-300">Inversió: €{initialInvestment.toLocaleString()}</label>
            <input type="range" min="10000" max="500000" step="5000" value={initialInvestment} onChange={(e) => setInitialInvestment(parseFloat(e.target.value))} className="w-full h-1" />
            <label className="text-slate-300">Anys: {yearsToHold}</label>
            <input type="range" min="1" max="30" step="1" value={yearsToHold} onChange={(e) => setYearsToHold(parseFloat(e.target.value))} className="w-full h-1" />
            <div className="bg-blue-900/30 p-2 rounded mt-1">
              <div className="text-slate-400 text-[10px]">Cost MyInvestor (compra + venda)</div>
              <div className="text-sm font-bold text-white">€{(buyingCost * 2).toFixed(2)}</div>
            </div>
            <div className="bg-amber-900/30 p-2 rounded">
              <div className="text-slate-400 text-[10px]">IS 25% sobre plusvàlua</div>
              <div className="text-[10px] text-slate-300">Només es paga sobre el guany (preu venda - preu compra). No sobre el total.</div>
            </div>
          </div>

          <div className="space-y-2">
            {assets.map((asset) => (
              <div key={asset.id} className="space-y-1 p-2 rounded" style={{ backgroundColor: `${asset.color}10` }}>
                <label className="flex items-center space-x-1">
                  <input type="checkbox" checked={selectedAssets.includes(asset.id)} onChange={() => toggleAsset(asset.id)} className="w-3 h-3" />
                  <span className="font-semibold" style={{ color: asset.color }}>{asset.name}</span>
                  {selectedAssets.includes(asset.id) && finalYear?.[asset.id] !== undefined && (
                    <span className="ml-auto text-slate-400 text-[10px]">CAGR {yearsToHold}a: <span className="text-white font-bold">{finalYear[asset.id].toFixed(1)}%</span></span>
                  )}
                </label>
                {selectedAssets.includes(asset.id) && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 whitespace-nowrap">Retorn brut: {assetReturns[asset.id]}%</span>
                      <input type="range" min={asset.minReturn} max={asset.maxReturn} step="0.5" value={assetReturns[asset.id]} onChange={(e) => setAssetReturns(prev => ({ ...prev, [asset.id]: parseFloat(e.target.value) }))} className="w-full h-1" />
                    </div>
                    {fullPeriodAvgReturns[asset.id] && (
                      <div className="text-[10px] text-slate-400">Hist. ({fullPeriodAvgReturns[asset.id].from}-{fullPeriodAvgReturns[asset.id].to}): CAGR <span className="text-white">{fullPeriodAvgReturns[asset.id].cagr.toFixed(1)}%</span> · Mitjana <span className="text-white">{fullPeriodAvgReturns[asset.id].avg.toFixed(1)}%</span></div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-3">
        <h3 className="text-lg font-bold text-white mb-2">Comparativa CAGR (simulació)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="year" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(2)}%` : ''}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            />
            <Legend />
            {assets.map(asset =>
              selectedAssets.includes(asset.id) && (
                <Line key={asset.id} type="monotone" dataKey={asset.id} stroke={asset.color} strokeWidth={2} name={asset.name} dot={false} />
              )
            )}
            <ReferenceLine y={etfHistoricalAverages.avgInflation} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Inflació ${etfHistoricalAverages.avgInflation.toFixed(1)}%`, fill: '#ef4444', fontSize: 10, position: 'right' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-xl font-bold text-white mb-3">Resum Inversió (simulació {yearsToHold} anys)</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {selectedAssets.map(assetId => {
            const asset = assets.find(a => a.id === assetId);
            if (!asset || finalYear?.[assetId] === undefined) return null;
            const annualReturn = assetReturns[assetId] / 100;
            const netInv = initialInvestment - buyingCost;
            const grossValue = netInv * Math.pow(1 + annualReturn, yearsToHold);
            const sellingCost = calculateMyInvestorCost(grossValue);
            const capitalGain = grossValue - initialInvestment;
            const tax = capitalGain > 0 ? capitalGain * 0.25 : 0;
            const netFinal = grossValue - sellingCost - tax;
            return (
              <div key={`sim-${assetId}`} className="p-3 rounded-lg" style={{ backgroundColor: `${asset.color}15`, borderLeft: `3px solid ${asset.color}` }}>
                <div className="font-semibold text-white text-sm">{asset.name}</div>
                <div className="text-lg font-bold text-white">€{Math.round(netFinal).toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">CAGR net: {finalYear[assetId].toFixed(2)}% | IS: €{Math.round(tax).toLocaleString()} | Guany: €{Math.round(netFinal - initialInvestment).toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-xl font-bold text-white mb-3">Variació Interanual Històrica</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalYoYData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="year" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(1)}%` : ''}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#475569" />
            <ReferenceLine y={etfHistoricalAverages.avgInflation} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Inflació ${etfHistoricalAverages.avgInflation.toFixed(1)}%`, fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            {assets.map(asset =>
              selectedAssets.includes(asset.id) && (
                <Line key={`yoy-${asset.id}`} type="monotone" dataKey={`${asset.id}-yoy`} stroke={asset.color} strokeWidth={2} name={`${asset.name} (YoY%)`} dot={false} connectNulls />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">CAGR Compost Real des de Any d&apos;Inversió</h3>
          <div className="flex items-center gap-2 text-xs">
            <label className="text-slate-300">Any inversió: {investmentYear}</label>
            <input type="range" min="1995" max="2023" step="1" value={investmentYear} onChange={(e) => setInvestmentYear(parseInt(e.target.value))} className="w-32 h-1" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalCompoundData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="year" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(2)}%` : ''}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#475569" />
            <ReferenceLine y={etfHistoricalAverages.avgInflation} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Inflació ${etfHistoricalAverages.avgInflation.toFixed(1)}%`, fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            {assets.map(asset =>
              selectedAssets.includes(asset.id) && (
                <Line key={`cagr-${asset.id}`} type="monotone" dataKey={`${asset.id}-cagr`} stroke={asset.color} strokeWidth={2} name={`${asset.name} CAGR`} dot={false} connectNulls />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
        {lastCompoundData && (
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            {selectedAssets.map(assetId => {
              const asset = assets.find(a => a.id === assetId);
              const cagr = lastCompoundData[`${assetId}-cagr`] as number | undefined;
              if (!asset || cagr === undefined) return null;

              const assetYears = Object.keys(historicalReturns[assetId] || {}).map(Number).sort((a, b) => a - b);
              const assetStart = Math.max(investmentYear, assetYears[0] || investmentYear);
              const isExtrapolated = assetStart > investmentYear;
              const totalElapsed = 2024 - investmentYear;
              const finalValue = initialInvestment * Math.pow(1 + cagr / 100, totalElapsed);

              return (
                <div key={`final-${assetId}`} className="p-3 rounded-lg" style={{ backgroundColor: `${asset.color}15`, borderLeft: `3px solid ${asset.color}` }}>
                  <div className="text-slate-300 text-xs">{asset.name} ({assetStart}-2024){isExtrapolated && ' *'}</div>
                  <div className="text-lg font-bold text-white">CAGR: {cagr.toFixed(2)}%</div>
                  <div className="text-sm text-slate-300">€{initialInvestment.toLocaleString()} → €{Math.round(finalValue).toLocaleString()}{isExtrapolated && ' (extrapol.)'}</div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-2 p-2 bg-blue-900/30 rounded-lg border border-blue-500/30 text-xs text-slate-300">
          <p><strong>CAGR net:</strong> Descomptant costos MyInvestor (0.12% compra + 0.12% venda) i IS 25% sobre guanys. (*) Valor extrapol.: per actius amb dades des de data posterior, el valor final s&apos;extrapola aplicant el seu CAGR al període complet per permetre comparació. Fonts: S&amp;P 500 total return (slickcharts.com), Nasdaq-100 total return amb dividends (upmyinterest.com), MSCI World net return USD (msci.com), MSCI World SRI net return USD (msci.com), Bloomberg US Agg Bond (upmyinterest.com). Inflació: INE (IPC Espanya).</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-xl font-bold text-white mb-3">Costos MyInvestor</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Comissió compra/venda:</span>
              <span className="font-semibold text-white">0.12%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Mínim per operació:</span>
              <span className="font-semibold text-white">€1</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Màxim per operació:</span>
              <span className="font-semibold text-white">€25</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Comissió custòdia:</span>
              <span className="font-semibold text-white">€0</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Cost compra ({initialInvestment.toLocaleString()}€):</span>
              <span className="font-semibold text-white">€{buyingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold border-t border-slate-600 pt-2">
              <span>TOTAL COSTOS:</span>
              <span>€{(buyingCost * 2).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
        <h3 className="font-semibold text-white mb-2">📊 Explicació del CAGR</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p>El CAGR (Compound Annual Growth Rate) mostra el creixement anual compost real de la teva inversió:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Inversió neta inicial (després de costos MyInvestor de compra)</li>
            <li>Creixement compost amb la rentabilitat seleccionada</li>
            <li>Costos de venda (0.12% amb MyInvestor)</li>
            <li>Impost de Societats (25%) sobre guanys de capital</li>
          </ul>
          <p className="mt-3"><strong>Fórmula:</strong> CAGR = ((Valor Net Final / Inversió Inicial)^(1/anys) - 1) × 100</p>
          <p className="mt-2"><strong>Avantatge fiscal:</strong> Els ETFs d&apos;acumulació no tributen fins a la venda, permetent diferir impostos i maximitzar el creixement compost.</p>
        </div>
      </div>
    </div>
  );
};

export default ETFBondsCAGR;
