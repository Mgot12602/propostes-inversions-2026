'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface YearData {
  year: number;
  propertyValue: number;
  rentalIncome: number;
  expenses: number;
  netCashFlow: number;
  accumulatedWealth: number;
  cagr: number;
}

const historicalPriceM2: Record<number, number> = {
  2000: 1335, 2001: 1453, 2002: 1667, 2003: 1931, 2004: 2286,
  2005: 2516, 2006: 2763, 2007: 2905, 2008: 2712, 2009: 2558,
  2010: 2476, 2011: 2376, 2012: 2212, 2013: 2043, 2014: 1943,
  2015: 1966, 2016: 2013, 2017: 2074, 2018: 2157, 2019: 2264,
  2020: 2282, 2021: 2343, 2022: 2543, 2023: 2682, 2024: 2860
};

const RealEstateCAGR = () => {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [propertyType, setPropertyType] = useState<'second-hand' | 'new'>('second-hand');
  const [hasMortgage, setHasMortgage] = useState(false);
  const [loanAmount, setLoanAmount] = useState(200000);

  const [notaryFeesPct, setNotaryFeesPct] = useState(0.7);
  const [hasLawyer, setHasLawyer] = useState(true);
  const [lawyerFeesPct, setLawyerFeesPct] = useState(1.0);
  const [gestoriaFee] = useState(450);

  const [yearsToHold, setYearsToHold] = useState(20);
  const [agentCommissionPct, setAgentCommissionPct] = useState(3);

  const [ibiRate, setIbiRate] = useState(0.4);
  const [communityFees, setCommunityFees] = useState(80);
  const [insurance, setInsurance] = useState(350);
  const [maintenancePct, setMaintenancePct] = useState(1.0);

  const [monthlyRent, setMonthlyRent] = useState(1000);
  const [isRented, setIsRented] = useState(true);
  const [hasAgency, setHasAgency] = useState(false);
  const [agencyRentalPct, setAgencyRentalPct] = useState(8);

  const [appreciationRate, setAppreciationRate] = useState(5);

  const [purchaseYear, setPurchaseYear] = useState(2015);

  const calculateBuyingCosts = () => {
    let itp = 0;
    let iva = 0;
    let ajd = 0;

    if (propertyType === 'second-hand') {
      if (propertyPrice <= 600000) {
        itp = propertyPrice * 0.10;
      } else if (propertyPrice <= 900000) {
        itp = 60000 + (propertyPrice - 600000) * 0.11;
      } else if (propertyPrice <= 1500000) {
        itp = 93000 + (propertyPrice - 900000) * 0.12;
      } else {
        itp = 165000 + (propertyPrice - 1500000) * 0.13;
      }
    } else {
      iva = propertyPrice * 0.10;
      ajd = propertyPrice * 0.015;
    }

    const notaryFees = propertyPrice * (notaryFeesPct / 100);
    const registryFees = propertyPrice * 0.002;
    const lawyerFees = hasLawyer ? propertyPrice * (lawyerFeesPct / 100) : 0;

    let mortgageCosts = 0;
    if (hasMortgage) {
      mortgageCosts = loanAmount * 0.01 + 400 + loanAmount * 0.015;
    }

    const totalBuyingCosts = itp + iva + ajd + notaryFees + registryFees + lawyerFees + gestoriaFee + mortgageCosts;
    const totalInvestment = propertyPrice + totalBuyingCosts;

    return { itp, iva, ajd, notaryFees, registryFees, lawyerFees, gestoriaFee, mortgageCosts, totalBuyingCosts, totalInvestment };
  };

  const calculateYearlyData = (): YearData[] => {
    const buyingCosts = calculateBuyingCosts();
    const yearlyData: YearData[] = [];

    const annualRent = monthlyRent * 12;
    const agencyFee = hasAgency ? annualRent * (agencyRentalPct / 100) : 0;
    const annualIBI = propertyPrice * (ibiRate / 100);
    const annualCommunity = communityFees * 12;
    const annualMaintenance = propertyPrice * (maintenancePct / 100);

    let accumulatedCashFlow = 0;

    for (let year = 1; year <= yearsToHold; year++) {
      const currentPropertyValue = propertyPrice * Math.pow(1 + appreciationRate / 100, year);

      const grossRentalIncome = isRented ? annualRent : 0;
      const totalExpenses = annualIBI + insurance + annualMaintenance + annualCommunity + agencyFee;

      const netIncome = grossRentalIncome - totalExpenses;
      const taxOnIncome = netIncome > 0 ? netIncome * 0.25 : 0;
      const netCashFlow = netIncome - taxOnIncome;

      accumulatedCashFlow += netCashFlow;

      const agentCommission = currentPropertyValue * (agentCommissionPct / 100);
      const capitalGain = currentPropertyValue - propertyPrice;
      const capitalGainsTax = capitalGain > 0 ? capitalGain * 0.25 : 0;
      const notarySelling = currentPropertyValue * 0.003;
      const registrySelling = currentPropertyValue * 0.001;
      const totalSellingCosts = agentCommission + capitalGainsTax + notarySelling + registrySelling;

      const netPropertyValue = currentPropertyValue - totalSellingCosts;
      const totalValue = netPropertyValue + accumulatedCashFlow;

      const accumulatedWealth = totalValue - buyingCosts.totalInvestment;

      const cagr = totalValue > 0
        ? (Math.pow(totalValue / buyingCosts.totalInvestment, 1 / year) - 1) * 100
        : -100;

      yearlyData.push({
        year,
        propertyValue: currentPropertyValue,
        rentalIncome: grossRentalIncome,
        expenses: totalExpenses,
        netCashFlow,
        accumulatedWealth,
        cagr
      });
    }

    return yearlyData;
  };

  const historicalChartData = useMemo(() => {
    const years = Object.keys(historicalPriceM2).map(Number).sort((a, b) => a - b);
    const buyingCostsPct = propertyType === 'second-hand' ? 0.10 : 0.115;
    const sellingCostsPct = (agentCommissionPct / 100) + 0.003 + 0.001;

    return years.map((year, idx) => {
      const price = historicalPriceM2[year];
      const yoy = idx > 0 ? ((price - historicalPriceM2[years[idx - 1]]) / historicalPriceM2[years[idx - 1]]) * 100 : 0;

      let compoundCagr: number | undefined = undefined;
      if (year > purchaseYear && historicalPriceM2[purchaseYear]) {
        const purchasePrice = historicalPriceM2[purchaseYear];
        const totalInitial = purchasePrice * (1 + buyingCostsPct);
        const elapsed = year - purchaseYear;
        const grossValue = price;
        const capitalGain = grossValue - purchasePrice;
        const capitalGainsTax = capitalGain > 0 ? capitalGain * 0.25 : 0;
        const sellingCosts = grossValue * sellingCostsPct;
        const netValue = grossValue - capitalGainsTax - sellingCosts;
        compoundCagr = ((netValue / totalInitial) ** (1 / elapsed) - 1) * 100;
      }
      if (year === purchaseYear) {
        compoundCagr = 0;
      }

      return {
        year,
        price,
        yoy: idx === 0 ? undefined : yoy,
        compoundCagr
      };
    });
  }, [purchaseYear, propertyType, agentCommissionPct]);

  const buyingCosts = calculateBuyingCosts();
  const yearlyData = calculateYearlyData();

  const finalYear = yearlyData[yearlyData.length - 1];
  const inflacionEspana = 2.4;

  return (
    <div className="w-full space-y-3">
      <div className="bg-slate-800 rounded-xl p-3">
        <h2 className="text-xl font-bold text-white mb-3">Calculadora Catalunya</h2>

        <div className="grid grid-cols-4 gap-2 text-xs mb-3">
          <div className="space-y-1">
            <label className="text-slate-300">Preu: €{propertyPrice.toLocaleString()}</label>
            <input type="range" min="100000" max="1000000" step="10000" value={propertyPrice} onChange={(e) => setPropertyPrice(parseFloat(e.target.value))} className="w-full h-1" />
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value as 'second-hand' | 'new')} className="w-full px-2 py-1 bg-slate-700 text-white rounded text-xs">
              <option value="second-hand">2a mà</option>
              <option value="new">Nova</option>
            </select>
            <label className="flex items-center space-x-1">
              <input type="checkbox" checked={hasMortgage} onChange={(e) => setHasMortgage(e.target.checked)} className="w-3 h-3" />
              <span className="text-slate-300">Hipoteca</span>
            </label>
            {hasMortgage && (
              <>
                <label className="text-slate-300">Préstec: €{loanAmount.toLocaleString()}</label>
                <input type="range" min="50000" max={propertyPrice * 0.8} step="5000" value={loanAmount} onChange={(e) => setLoanAmount(parseFloat(e.target.value))} className="w-full h-1" />
              </>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Notaria: {notaryFeesPct}%</label>
            <input type="range" min="0.5" max="1.5" step="0.1" value={notaryFeesPct} onChange={(e) => setNotaryFeesPct(parseFloat(e.target.value))} className="w-full h-1" />
            <label className="flex items-center space-x-1">
              <input type="checkbox" checked={hasLawyer} onChange={(e) => setHasLawyer(e.target.checked)} className="w-3 h-3" />
              <span className="text-slate-300">Advocat {lawyerFeesPct}%</span>
            </label>
            {hasLawyer && <input type="range" min="0.5" max="2" step="0.1" value={lawyerFeesPct} onChange={(e) => setLawyerFeesPct(parseFloat(e.target.value))} className="w-full h-1" />}
            <label className="text-slate-300">IBI: {ibiRate}%</label>
            <input type="range" min="0.4" max="1.1" step="0.1" value={ibiRate} onChange={(e) => setIbiRate(parseFloat(e.target.value))} className="w-full h-1" />
            <label className="text-slate-300">Comunitat: €{communityFees}/mes</label>
            <input type="range" min="0" max="200" step="10" value={communityFees} onChange={(e) => setCommunityFees(parseFloat(e.target.value))} className="w-full h-1" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Assegurança: €{insurance}/any</label>
            <input type="range" min="200" max="600" step="50" value={insurance} onChange={(e) => setInsurance(parseFloat(e.target.value))} className="w-full h-1" />
            <label className="text-slate-300">Manteniment: {maintenancePct}%</label>
            <input type="range" min="0.5" max="2" step="0.1" value={maintenancePct} onChange={(e) => setMaintenancePct(parseFloat(e.target.value))} className="w-full h-1" />
            <label className="flex items-center space-x-1">
              <input type="checkbox" checked={isRented} onChange={(e) => setIsRented(e.target.checked)} className="w-3 h-3" />
              <span className="text-slate-300">Llogada</span>
            </label>
            {isRented && (
              <>
                <label className="text-slate-300">Lloguer: €{monthlyRent}/mes</label>
                <input type="range" min="500" max="3000" step="50" value={monthlyRent} onChange={(e) => setMonthlyRent(parseFloat(e.target.value))} className="w-full h-1" />
                <label className="flex items-center space-x-1">
                  <input type="checkbox" checked={hasAgency} onChange={(e) => setHasAgency(e.target.checked)} className="w-3 h-3" />
                  <span className="text-slate-300">Immobiliària {agencyRentalPct}%</span>
                </label>
                {hasAgency && <input type="range" min="5" max="12" step="0.5" value={agencyRentalPct} onChange={(e) => setAgencyRentalPct(parseFloat(e.target.value))} className="w-full h-1" />}
              </>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Anys: {yearsToHold}</label>
            <input type="range" min="1" max="30" step="1" value={yearsToHold} onChange={(e) => setYearsToHold(parseFloat(e.target.value))} className="w-full h-1" />
            <label className="text-slate-300">Comissió venda: {agentCommissionPct}%</label>
            <input type="range" min="0" max="5" step="0.5" value={agentCommissionPct} onChange={(e) => setAgentCommissionPct(parseFloat(e.target.value))} className="w-full h-1" />
            <label className="text-slate-300">Revalorització: {appreciationRate}%</label>
            <input type="range" min="2" max="9" step="0.5" value={appreciationRate} onChange={(e) => setAppreciationRate(parseFloat(e.target.value))} className="w-full h-1" />
            <div className="bg-purple-900/30 p-2 rounded mt-2">
              <div className="text-slate-400 text-[10px]">CAGR</div>
              <div className="text-lg font-bold text-white">{finalYear?.cagr.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-3">
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
            <Line type="monotone" dataKey="cagr" stroke="#3b82f6" strokeWidth={2} name="CAGR" dot={false} />
            <Line type="monotone" dataKey={() => inflacionEspana} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" name="Inflació 2.4%" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-xl font-bold text-white mb-3">Resum Inversió</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-900/30 p-3 rounded-lg">
            <div className="text-sm text-slate-300">Inversió Total</div>
            <div className="text-xl font-bold text-white">€{buyingCosts.totalInvestment.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Preu + impostos + despeses</div>
          </div>
          <div className="bg-green-900/30 p-3 rounded-lg">
            <div className="text-sm text-slate-300">Riquesa Acumulada (Any {yearsToHold})</div>
            <div className="text-xl font-bold text-white">€{finalYear?.accumulatedWealth.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Valor propietat + fluxos nets</div>
          </div>
          <div className="bg-purple-900/30 p-3 rounded-lg">
            <div className="text-sm text-slate-300">CAGR Real</div>
            <div className="text-xl font-bold text-white">{finalYear?.cagr.toFixed(2)}%</div>
            <div className="text-xs text-slate-400 mt-1">Creixement anual compost</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-xl font-bold text-white mb-3">Costos de Compra Detallats</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Preu propietat:</span>
              <span className="font-semibold text-white">€{propertyPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>{propertyType === 'second-hand' ? 'ITP (10%)' : 'IVA (10%)'}:</span>
              <span className="font-semibold text-white">€{(propertyType === 'second-hand' ? buyingCosts.itp : buyingCosts.iva).toLocaleString()}</span>
            </div>
            {propertyType === 'new' && (
              <div className="flex justify-between text-slate-300">
                <span>AJD (1.5%):</span>
                <span className="font-semibold text-white">€{buyingCosts.ajd.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span>Notaria ({notaryFeesPct}%):</span>
              <span className="font-semibold text-white">€{buyingCosts.notaryFees.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Registre (0.2%):</span>
              <span className="font-semibold text-white">€{buyingCosts.registryFees.toLocaleString()}</span>
            </div>
            {hasLawyer && (
              <div className="flex justify-between text-slate-300">
                <span>Advocat ({lawyerFeesPct}%):</span>
                <span className="font-semibold text-white">€{buyingCosts.lawyerFees.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span>Gestor:</span>
              <span className="font-semibold text-white">€{gestoriaFee}</span>
            </div>
            {hasMortgage && (
              <div className="flex justify-between text-slate-300">
                <span>Costos hipoteca:</span>
                <span className="font-semibold text-white">€{buyingCosts.mortgageCosts.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold border-t border-slate-600 pt-2">
              <span>TOTAL COSTOS:</span>
              <span>€{buyingCosts.totalBuyingCosts.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">Històric Preu/m² Espanya (2000-2024)</h3>
          <div className="flex items-center gap-2 text-xs">
            <label className="text-slate-300">Any compra: {purchaseYear}</label>
            <input type="range" min="2000" max="2023" step="1" value={purchaseYear} onChange={(e) => setPurchaseYear(parseInt(e.target.value))} className="w-32 h-1" />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={historicalChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="year" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip
              formatter={(value: number | undefined, name?: string) => {
                if (value === undefined) return '';
                if (name === 'Preu €/m²') return `€${value.toLocaleString()}`;
                return `${value.toFixed(2)}%`;
              }}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#475569" />
            <Line type="monotone" dataKey="yoy" stroke="#f97316" strokeWidth={2} name="Variació anual %" dot={false} connectNulls />
            <Line type="monotone" dataKey="compoundCagr" stroke="#10b981" strokeWidth={2} name={`CAGR des de ${purchaseYear}`} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-2 p-2 bg-blue-900/30 rounded-lg border border-blue-500/30 text-xs text-slate-300">
          <p><strong>Font:</strong> Ministerio de Transportes / INE - Preu mitjà €/m² habitatge construït a Espanya.</p>
          <p className="mt-1"><strong>Línia taronja:</strong> Variació interanual del preu/m². <strong>Línia verda:</strong> CAGR compost net (descomptant costos compra {propertyType === 'second-hand' ? '10% ITP' : '11.5% IVA+AJD'}, venda {agentCommissionPct}% comissió + 25% IS sobre guanys) si haguéssim comprat al {purchaseYear}.</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-xl font-bold text-white mb-3">Taula Detallada per Any</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-700 text-slate-200">
              <tr>
                <th className="px-4 py-3">Any</th>
                <th className="px-4 py-3">Valor Propietat</th>
                <th className="px-4 py-3">Ingressos Lloguer</th>
                <th className="px-4 py-3">Despeses</th>
                <th className="px-4 py-3">Flux Net</th>
                <th className="px-4 py-3">Riquesa Acumulada</th>
                <th className="px-4 py-3">CAGR</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map((data) => (
                <tr key={data.year} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium">{data.year}</td>
                  <td className="px-4 py-3">€{data.propertyValue.toLocaleString()}</td>
                  <td className="px-4 py-3">€{data.rentalIncome.toLocaleString()}</td>
                  <td className="px-4 py-3">€{data.expenses.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold">{data.netCashFlow >= 0 ? '+' : ''}€{data.netCashFlow.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-green-400">€{data.accumulatedWealth.toLocaleString()}</td>
                  <td className="px-4 py-3 font-bold text-blue-400">{data.cagr.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
        <h3 className="font-semibold text-white mb-2">📊 Explicació del CAGR</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p>El CAGR mostra el creixement anual compost real de la teva inversió, tenint en compte:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>La inversió inicial total (preu + tots els impostos i despeses de compra)</li>
            <li>El valor actual de la propietat (amb revalorització del {appreciationRate}% anual)</li>
            <li>Tots els fluxos de caixa nets acumulats (lloguers - despeses - impostos)</li>
            {hasAgency && <li>Comissió immobiliària de gestió de lloguer ({agencyRentalPct}% dels ingressos)</li>}
          </ul>
          <p className="mt-2"><strong>Fórmula:</strong> CAGR = ((Riquesa Final / Inversió Inicial)^(1/anys) - 1) × 100</p>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCAGR;
