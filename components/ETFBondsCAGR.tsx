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
    2004: 15.2, 2005: 9.5, 2006: 20.1, 2007: 9.0, 2008: -40.3,
    2009: 30.0, 2010: 11.8, 2011: -5.0, 2012: 15.8, 2013: 26.7,
    2014: 4.9, 2015: -0.3, 2016: 7.5, 2017: 22.4, 2018: -8.2,
    2019: 27.7, 2020: 15.9, 2021: 21.8, 2022: -17.7, 2023: 23.8, 2024: 18.2
  },
  'nasdaq': {
    2004: 8.6, 2005: 1.4, 2006: 9.5, 2007: 19.2, 2008: -41.9,
    2009: 43.9, 2010: 19.2, 2011: 2.7, 2012: 17.5, 2013: 38.3,
    2014: 19.2, 2015: 9.7, 2016: 7.5, 2017: 32.0, 2018: -0.1,
    2019: 38.7, 2020: 47.6, 2021: 26.6, 2022: -32.5, 2023: 54.8, 2024: 28.6
  },
  'sp500': {
    2004: 10.9, 2005: 4.9, 2006: 15.8, 2007: 5.5, 2008: -37.0,
    2009: 26.5, 2010: 15.1, 2011: 2.1, 2012: 16.0, 2013: 32.4,
    2014: 13.7, 2015: 1.4, 2016: 12.0, 2017: 21.8, 2018: -4.4,
    2019: 31.5, 2020: 18.4, 2021: 28.7, 2022: -18.1, 2023: 26.3, 2024: 24.2
  },
  'msci-screened': {
    2016: 7.2, 2017: 21.8, 2018: -8.5, 2019: 27.2, 2020: 15.4,
    2021: 21.3, 2022: -18.1, 2023: 23.2, 2024: 17.8
  },
  'bonds-aaa': {
    2004: 7.3, 2005: 3.4, 2006: 1.2, 2007: 2.8, 2008: 8.5,
    2009: 5.2, 2010: 4.1, 2011: 6.8, 2012: 7.2, 2013: 2.1,
    2014: 8.5, 2015: 1.2, 2016: 3.4, 2017: 0.8, 2018: 1.5,
    2019: 5.8, 2020: 4.1, 2021: -3.2, 2022: -16.2, 2023: 6.4, 2024: 3.2
  }
};

const historicalInflation: Record<number, number> = {
  2004: 3.0, 2005: 3.4, 2006: 3.5, 2007: 2.8, 2008: 4.1,
  2009: -0.3, 2010: 1.8, 2011: 3.2, 2012: 2.4, 2013: 1.4,
  2014: -0.2, 2015: -0.5, 2016: -0.2, 2017: 2.0, 2018: 1.7,
  2019: 0.7, 2020: -0.3, 2021: 3.1, 2022: 8.4, 2023: 3.5, 2024: 2.8
};

const ETFBondsCAGR = () => {
  const assets: AssetConfig[] = [
    { id: 'msci-world', name: 'MSCI World', color: '#3b82f6', defaultReturn: 8.5, minReturn: 5, maxReturn: 12 },
    { id: 'nasdaq', name: 'Nasdaq-100', color: '#10b981', defaultReturn: 13, minReturn: 8, maxReturn: 18 },
    { id: 'sp500', name: 'S&P 500', color: '#f97316', defaultReturn: 10.5, minReturn: 6, maxReturn: 15 },
    { id: 'msci-screened', name: 'MSCI World SRI', color: '#a855f7', defaultReturn: 7.5, minReturn: 4, maxReturn: 11 },
    { id: 'bonds-aaa', name: 'Bons AAA EUR', color: '#6b7280', defaultReturn: 2.5, minReturn: 1, maxReturn: 5 }
  ];

  const [initialInvestment, setInitialInvestment] = useState(50000);
  const [yearsToHold, setYearsToHold] = useState(20);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['msci-world', 'sp500']);
  const [assetReturns, setAssetReturns] = useState<Record<string, number>>({
    'msci-world': 8.5, 'nasdaq': 13, 'sp500': 10.5, 'msci-screened': 7.5, 'bonds-aaa': 2.5
  });
  const [investmentYear, setInvestmentYear] = useState(2010);

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

      if (year === investmentYear) {
        selectedAssets.forEach(assetId => {
          if (historicalReturns[assetId]?.[investmentYear] !== undefined) {
            point[`${assetId}-cagr`] = 0;
          }
        });
        return point;
      }

      selectedAssets.forEach(assetId => {
        const assetData = historicalReturns[assetId];
        if (!assetData || assetData[investmentYear] === undefined) return;

        let cumulativeGrowth = 1;
        let allDataAvailable = true;
        for (let y = investmentYear; y < year; y++) {
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

        const elapsed = year - investmentYear;
        const cagr = ((netFinal / 1) ** (1 / elapsed) - 1) * 100;
        point[`${assetId}-cagr`] = cagr;
      });

      return point;
    });
  }, [selectedAssets, investmentYear]);

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
  const netInitial = initialInvestment - buyingCost;

  return (
    <div className="w-full space-y-3">
      <div className="bg-slate-800 rounded-xl p-3">
        <h2 className="text-xl font-bold text-white mb-3">Calculadora ETFs i Bons</h2>

        <div className="grid grid-cols-4 gap-2 text-xs mb-3">
          <div className="space-y-1">
            <label className="text-slate-300">Inversió: €{initialInvestment.toLocaleString()}</label>
            <input type="range" min="10000" max="500000" step="5000" value={initialInvestment} onChange={(e) => setInitialInvestment(parseFloat(e.target.value))} className="w-full h-1" />
            <label className="text-slate-300">Anys: {yearsToHold}</label>
            <input type="range" min="1" max="30" step="1" value={yearsToHold} onChange={(e) => setYearsToHold(parseFloat(e.target.value))} className="w-full h-1" />
            <div className="bg-blue-900/30 p-2 rounded mt-2">
              <div className="text-slate-400 text-[10px]">Cost MyInvestor</div>
              <div className="text-sm font-bold text-white">€{(buyingCost * 2).toFixed(2)}</div>
              <div className="text-[10px] text-slate-400">Compra + Venda</div>
            </div>
          </div>

          {assets.slice(0, 3).map((asset) => (
            <div key={asset.id} className="space-y-1">
              <label className="flex items-center space-x-1">
                <input type="checkbox" checked={selectedAssets.includes(asset.id)} onChange={() => toggleAsset(asset.id)} className="w-3 h-3" />
                <span className="font-semibold" style={{ color: asset.color }}>{asset.name}</span>
              </label>
              {selectedAssets.includes(asset.id) && (
                <>
                  <label className="text-slate-300">Rentabilitat: {assetReturns[asset.id]}%</label>
                  <input type="range" min={asset.minReturn} max={asset.maxReturn} step="0.5" value={assetReturns[asset.id]} onChange={(e) => setAssetReturns(prev => ({ ...prev, [asset.id]: parseFloat(e.target.value) }))} className="w-full h-1" />
                  <div className="bg-purple-900/30 p-2 rounded">
                    <div className="text-slate-400 text-[10px]">CAGR Any {yearsToHold}</div>
                    <div className="text-sm font-bold text-white">{finalYear?.[asset.id]?.toFixed(2) || '0.00'}%</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {assets.slice(3).map((asset) => (
            <div key={asset.id} className="space-y-1">
              <label className="flex items-center space-x-1">
                <input type="checkbox" checked={selectedAssets.includes(asset.id)} onChange={() => toggleAsset(asset.id)} className="w-3 h-3" />
                <span className="font-semibold" style={{ color: asset.color }}>{asset.name}</span>
              </label>
              {selectedAssets.includes(asset.id) && (
                <>
                  <label className="text-slate-300">Rentabilitat: {assetReturns[asset.id]}%</label>
                  <input type="range" min={asset.minReturn} max={asset.maxReturn} step="0.5" value={assetReturns[asset.id]} onChange={(e) => setAssetReturns(prev => ({ ...prev, [asset.id]: parseFloat(e.target.value) }))} className="w-full h-1" />
                  <div className="bg-purple-900/30 p-2 rounded">
                    <div className="text-slate-400 text-[10px]">CAGR Any {yearsToHold}</div>
                    <div className="text-sm font-bold text-white">{finalYear?.[asset.id]?.toFixed(2) || '0.00'}%</div>
                  </div>
                </>
              )}
            </div>
          ))}
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
        <h3 className="text-xl font-bold text-white mb-3">Resum Inversió</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <div className="text-slate-300">Inversió Inicial</div>
            <div className="text-xl font-bold text-white">€{initialInvestment.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Cost compra: €{buyingCost.toFixed(2)}</div>
          </div>
          <div className="bg-green-900/30 p-3 rounded-lg">
            <div className="text-slate-300">Inversió Neta</div>
            <div className="text-xl font-bold text-white">€{netInitial.toLocaleString()}</div>
            <div className="text-xs text-slate-400">Després de costos MyInvestor</div>
          </div>
          <div className="bg-purple-900/30 p-3 rounded-lg">
            <div className="text-slate-300">Impostos</div>
            <div className="text-xl font-bold text-white">25%</div>
            <div className="text-xs text-slate-400">Impost Societats sobre guanys</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-xl font-bold text-white mb-3">Variació Interanual Històrica (2004-2024)</h3>
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
            <input type="range" min="2004" max="2023" step="1" value={investmentYear} onChange={(e) => setInvestmentYear(parseInt(e.target.value))} className="w-32 h-1" />
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
              const elapsed = 2024 - investmentYear;
              const finalValue = initialInvestment * Math.pow(1 + cagr / 100, elapsed);
              return (
                <div key={`final-${assetId}`} className="p-3 rounded-lg" style={{ backgroundColor: `${asset.color}15`, borderLeft: `3px solid ${asset.color}` }}>
                  <div className="text-slate-300 text-xs">{asset.name} ({investmentYear}-2024)</div>
                  <div className="text-lg font-bold text-white">CAGR: {cagr.toFixed(2)}%</div>
                  <div className="text-sm text-slate-300">€{initialInvestment.toLocaleString()} → €{Math.round(finalValue).toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-2 p-2 bg-blue-900/30 rounded-lg border border-blue-500/30 text-xs text-slate-300">
          <p><strong>CAGR net:</strong> Descomptant costos MyInvestor (0.12% compra + 0.12% venda) i Impost de Societats (25% sobre guanys). Mostra la rendibilitat anual composta real si haguéssim invertit al {investmentYear}. Font inflació: INE (IPC).</p>
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
