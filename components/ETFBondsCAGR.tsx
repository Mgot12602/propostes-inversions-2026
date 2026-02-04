'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface HistoricalDataPoint {
  year: number;
  [key: string]: number;
}

const ETFBondsCAGR = () => {
  // Asset configurations
  const assets: AssetConfig[] = [
    { id: 'msci-world', name: 'MSCI World', color: '#3b82f6', defaultReturn: 8.5, minReturn: 5, maxReturn: 12 },
    { id: 'nasdaq', name: 'Nasdaq-100', color: '#10b981', defaultReturn: 13, minReturn: 8, maxReturn: 18 },
    { id: 'sp500', name: 'S&P 500', color: '#f97316', defaultReturn: 10.5, minReturn: 6, maxReturn: 15 },
    { id: 'msci-screened', name: 'MSCI World SRI', color: '#a855f7', defaultReturn: 7.5, minReturn: 4, maxReturn: 11 },
    { id: 'bonds-aaa', name: 'Bons AAA EUR', color: '#6b7280', defaultReturn: 2.5, minReturn: 1, maxReturn: 5 }
  ];

  // Historical returns data (2004-2024) - Real data from indices
  const historicalData: HistoricalDataPoint[] = [
    { year: 2004, 'msci-world': 15.2, 'nasdaq': 8.6, 'sp500': 10.9, 'bonds-aaa': 7.3 },
    { year: 2005, 'msci-world': 9.5, 'nasdaq': 1.4, 'sp500': 4.9, 'bonds-aaa': 3.4 },
    { year: 2006, 'msci-world': 20.1, 'nasdaq': 9.5, 'sp500': 15.8, 'bonds-aaa': 1.2 },
    { year: 2007, 'msci-world': 9.0, 'nasdaq': 19.2, 'sp500': 5.5, 'bonds-aaa': 2.8 },
    { year: 2008, 'msci-world': -40.3, 'nasdaq': -41.9, 'sp500': -37.0, 'bonds-aaa': 8.5 },
    { year: 2009, 'msci-world': 30.0, 'nasdaq': 43.9, 'sp500': 26.5, 'bonds-aaa': 5.2 },
    { year: 2010, 'msci-world': 11.8, 'nasdaq': 19.2, 'sp500': 15.1, 'bonds-aaa': 4.1 },
    { year: 2011, 'msci-world': -5.0, 'nasdaq': 2.7, 'sp500': 2.1, 'bonds-aaa': 6.8 },
    { year: 2012, 'msci-world': 15.8, 'nasdaq': 17.5, 'sp500': 16.0, 'bonds-aaa': 7.2 },
    { year: 2013, 'msci-world': 26.7, 'nasdaq': 38.3, 'sp500': 32.4, 'bonds-aaa': 2.1 },
    { year: 2014, 'msci-world': 4.9, 'nasdaq': 19.2, 'sp500': 13.7, 'bonds-aaa': 8.5 },
    { year: 2015, 'msci-world': -0.3, 'nasdaq': 9.7, 'sp500': 1.4, 'bonds-aaa': 1.2 },
    { year: 2016, 'msci-world': 7.5, 'nasdaq': 7.5, 'sp500': 12.0, 'msci-screened': 7.2, 'bonds-aaa': 3.4 },
    { year: 2017, 'msci-world': 22.4, 'nasdaq': 32.0, 'sp500': 21.8, 'msci-screened': 21.8, 'bonds-aaa': 0.8 },
    { year: 2018, 'msci-world': -8.2, 'nasdaq': -0.1, 'sp500': -4.4, 'msci-screened': -8.5, 'bonds-aaa': 1.5 },
    { year: 2019, 'msci-world': 27.7, 'nasdaq': 38.7, 'sp500': 31.5, 'msci-screened': 27.2, 'bonds-aaa': 5.8 },
    { year: 2020, 'msci-world': 15.9, 'nasdaq': 47.6, 'sp500': 18.4, 'msci-screened': 15.4, 'bonds-aaa': 4.1 },
    { year: 2021, 'msci-world': 21.8, 'nasdaq': 26.6, 'sp500': 28.7, 'msci-screened': 21.3, 'bonds-aaa': -3.2 },
    { year: 2022, 'msci-world': -17.7, 'nasdaq': -32.5, 'sp500': -18.1, 'msci-screened': -18.1, 'bonds-aaa': -16.2 },
    { year: 2023, 'msci-world': 23.8, 'nasdaq': 54.8, 'sp500': 26.3, 'msci-screened': 23.2, 'bonds-aaa': 6.4 },
    { year: 2024, 'msci-world': 18.2, 'nasdaq': 28.6, 'sp500': 24.2, 'msci-screened': 17.8, 'bonds-aaa': 3.2 }
  ];

  const [initialInvestment, setInitialInvestment] = useState(50000);
  const [yearsToHold, setYearsToHold] = useState(20);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['msci-world', 'sp500']);
  const [assetReturns, setAssetReturns] = useState<Record<string, number>>({
    'msci-world': 8.5,
    'nasdaq': 13,
    'sp500': 10.5,
    'msci-screened': 7.5,
    'bonds-aaa': 2.5
  });

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

  const toggleAsset = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const yearlyData = calculateYearlyData();
  const finalYear = yearlyData[yearlyData.length - 1];
  const inflacionEspana = 2.4;

  const buyingCost = calculateMyInvestorCost(initialInvestment);
  const netInitial = initialInvestment - buyingCost;

  return (
    <div className="w-full space-y-3">
      <div className="bg-slate-800 rounded-xl p-3">
        <h2 className="text-xl font-bold text-white mb-3">Calculadora ETFs i Bons</h2>
        
        <div className="grid grid-cols-4 gap-2 text-xs mb-3">
          <div className="space-y-1">
            <label className="text-slate-300">Inversió: €{initialInvestment.toLocaleString()}</label>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(parseFloat(e.target.value))}
              className="w-full h-1"
            />
            <label className="text-slate-300">Anys: {yearsToHold}</label>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={yearsToHold}
              onChange={(e) => setYearsToHold(parseFloat(e.target.value))}
              className="w-full h-1"
            />
            <div className="bg-blue-900/30 p-2 rounded mt-2">
              <div className="text-slate-400 text-[10px]">Cost MyInvestor</div>
              <div className="text-sm font-bold text-white">€{(buyingCost * 2).toFixed(2)}</div>
              <div className="text-[10px] text-slate-400">Compra + Venda</div>
            </div>
          </div>

          {assets.slice(0, 3).map((asset) => (
            <div key={asset.id} className="space-y-1">
              <label className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={selectedAssets.includes(asset.id)}
                  onChange={() => toggleAsset(asset.id)}
                  className="w-3 h-3"
                />
                <span className="text-slate-300 font-semibold" style={{ color: asset.color }}>
                  {asset.name}
                </span>
              </label>
              {selectedAssets.includes(asset.id) && (
                <>
                  <label className="text-slate-300">Rentabilitat: {assetReturns[asset.id]}%</label>
                  <input
                    type="range"
                    min={asset.minReturn}
                    max={asset.maxReturn}
                    step="0.5"
                    value={assetReturns[asset.id]}
                    onChange={(e) => setAssetReturns(prev => ({ ...prev, [asset.id]: parseFloat(e.target.value) }))}
                    className="w-full h-1"
                  />
                  <div className="bg-purple-900/30 p-2 rounded">
                    <div className="text-slate-400 text-[10px]">CAGR Any {yearsToHold}</div>
                    <div className="text-sm font-bold text-white">
                      {finalYear?.[asset.id]?.toFixed(2) || '0.00'}%
                    </div>
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
                <input
                  type="checkbox"
                  checked={selectedAssets.includes(asset.id)}
                  onChange={() => toggleAsset(asset.id)}
                  className="w-3 h-3"
                />
                <span className="text-slate-300 font-semibold" style={{ color: asset.color }}>
                  {asset.name}
                </span>
              </label>
              {selectedAssets.includes(asset.id) && (
                <>
                  <label className="text-slate-300">Rentabilitat: {assetReturns[asset.id]}%</label>
                  <input
                    type="range"
                    min={asset.minReturn}
                    max={asset.maxReturn}
                    step="0.5"
                    value={assetReturns[asset.id]}
                    onChange={(e) => setAssetReturns(prev => ({ ...prev, [asset.id]: parseFloat(e.target.value) }))}
                    className="w-full h-1"
                  />
                  <div className="bg-purple-900/30 p-2 rounded">
                    <div className="text-slate-400 text-[10px]">CAGR Any {yearsToHold}</div>
                    <div className="text-sm font-bold text-white">
                      {finalYear?.[asset.id]?.toFixed(2) || '0.00'}%
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-3">
        <h3 className="text-lg font-bold text-white mb-2">Comparativa CAGR</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="year" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" label={{ value: 'CAGR (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(2)}%` : ''}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            />
            <Legend />
            {assets.map(asset => 
              selectedAssets.includes(asset.id) && (
                <Line
                  key={asset.id}
                  type="monotone"
                  dataKey={asset.id}
                  stroke={asset.color}
                  strokeWidth={2}
                  name={asset.name}
                  dot={false}
                />
              )
            )}
            <Line
              type="monotone"
              dataKey={() => inflacionEspana}
              stroke="#ef4444"
              strokeWidth={1}
              strokeDasharray="3 3"
              name="Inflació 2.4%"
              dot={false}
            />
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
        <h3 className="text-xl font-bold text-white mb-3">Rentabilitats Històriques Reals (2004-2024)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="year" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" label={{ value: 'Rentabilitat Anual (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: number | undefined) => value !== undefined ? `${value.toFixed(1)}%` : ''}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            />
            <Legend />
            {assets.map(asset => {
              const hasData = historicalData.some(d => d[asset.id] !== undefined);
              return hasData && selectedAssets.includes(asset.id) && (
                <Line
                  key={`hist-${asset.id}`}
                  type="monotone"
                  dataKey={asset.id}
                  stroke={asset.color}
                  strokeWidth={2}
                  name={asset.name}
                  dot={false}
                  connectNulls
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30 text-xs text-slate-300">
          <p><strong>Font de dades:</strong> Rentabilitats anuals reals dels índexs MSCI World, Nasdaq-100, S&P 500, MSCI World SRI i Bons EUR AAA.</p>
          <p className="mt-1"><strong>Nota:</strong> Les rentabilitats passades no garanteixen rendiments futurs. La volatilitat és inherent als mercats financers.</p>
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
