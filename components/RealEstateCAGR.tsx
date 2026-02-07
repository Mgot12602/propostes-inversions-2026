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
  1995: 601, 1996: 614, 1997: 637, 1998: 700, 1999: 795,
  2000: 906, 2001: 1050, 2002: 1220, 2003: 1430, 2004: 1650,
  2005: 1824, 2006: 1990, 2007: 2085, 2008: 2018, 2009: 1892,
  2010: 1825, 2011: 1701, 2012: 1531, 2013: 1466, 2014: 1456,
  2015: 1490, 2016: 1512, 2017: 1558, 2018: 1618, 2019: 1651,
  2020: 1641, 2021: 1687, 2022: 1815, 2023: 1921, 2024: 2094
};

const historicalInflation: Record<number, number> = {
  1995: 4.7, 1996: 3.6, 1997: 2.0, 1998: 1.8, 1999: 2.3,
  2000: 3.4, 2001: 3.6, 2002: 3.5, 2003: 3.0, 2004: 3.0,
  2005: 3.4, 2006: 3.5, 2007: 2.8, 2008: 4.1, 2009: -0.3,
  2010: 1.8, 2011: 3.2, 2012: 2.4, 2013: 1.4, 2014: -0.2,
  2015: -0.5, 2016: -0.2, 2017: 2.0, 2018: 1.7, 2019: 0.7,
  2020: -0.3, 2021: 3.1, 2022: 8.4, 2023: 3.5, 2024: 2.8
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
  const [hasAgencySale, setHasAgencySale] = useState(true);
  const [agentCommissionPct, setAgentCommissionPct] = useState(3);

  const [ibiRate, setIbiRate] = useState(0.4);
  const [communityFees, setCommunityFees] = useState(80);
  const [insurance, setInsurance] = useState(350);
  const [maintenancePct, setMaintenancePct] = useState(1.0);

  const [monthlyRent, setMonthlyRent] = useState(1000);
  const [isRented, setIsRented] = useState(true);

  const [appreciationRate, setAppreciationRate] = useState(5);

  const [purchaseYear, setPurchaseYear] = useState(2015);
  const [historicalRentalYield, setHistoricalRentalYield] = useState(4.0);
  const [historicalIsRented, setHistoricalIsRented] = useState(true);

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
    const annualIBI = propertyPrice * (ibiRate / 100);
    const annualCommunity = communityFees * 12;
    const annualMaintenance = propertyPrice * (maintenancePct / 100);

    let accumulatedCashFlow = 0;

    for (let year = 1; year <= yearsToHold; year++) {
      const currentPropertyValue = propertyPrice * Math.pow(1 + appreciationRate / 100, year);

      const grossRentalIncome = isRented ? annualRent : 0;
      const totalExpenses = annualIBI + insurance + annualMaintenance + annualCommunity;

      const netIncome = grossRentalIncome - totalExpenses;
      const taxOnIncome = netIncome > 0 ? netIncome * 0.25 : 0;
      const netCashFlow = netIncome - taxOnIncome;

      accumulatedCashFlow += netCashFlow;

      const agentCommission = hasAgencySale ? currentPropertyValue * (agentCommissionPct / 100) : 0;
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
    const sellingCostsPct = (hasAgencySale ? agentCommissionPct / 100 : 0) + 0.003 + 0.001;
    const expenseRatioPct = 0.02;

    return years.map((year, idx) => {
      const price = historicalPriceM2[year];
      const yoy = idx > 0 ? ((price - historicalPriceM2[years[idx - 1]]) / historicalPriceM2[years[idx - 1]]) * 100 : 0;

      let compoundCagr: number | undefined = undefined;
      let finalValuePerM2: number | undefined = undefined;
      if (year > purchaseYear && historicalPriceM2[purchaseYear]) {
        const purchasePrice = historicalPriceM2[purchaseYear];
        const totalInitial = purchasePrice * (1 + buyingCostsPct);
        const elapsed = year - purchaseYear;

        let accumulatedNetRental = 0;
        if (historicalIsRented) {
          for (let y = purchaseYear + 1; y <= year; y++) {
            const priceAtY = historicalPriceM2[y] || price;
            const grossRental = priceAtY * (historicalRentalYield / 100);
            const expenses = priceAtY * expenseRatioPct;
            const netIncome = grossRental - expenses;
            const taxOnIncome = netIncome > 0 ? netIncome * 0.25 : 0;
            accumulatedNetRental += netIncome - taxOnIncome;
          }
        }

        const capitalGain = price - purchasePrice;
        const capitalGainsTax = capitalGain > 0 ? capitalGain * 0.25 : 0;
        const sellingCosts = price * sellingCostsPct;
        const netPropertyValue = price - capitalGainsTax - sellingCosts;
        const totalFinalValue = netPropertyValue + accumulatedNetRental;
        finalValuePerM2 = totalFinalValue;

        compoundCagr = totalFinalValue > 0
          ? ((totalFinalValue / totalInitial) ** (1 / elapsed) - 1) * 100
          : -100;
      }
      if (year === purchaseYear) {
        compoundCagr = 0;
        finalValuePerM2 = historicalPriceM2[purchaseYear];
      }

      return {
        year,
        price,
        yoy: idx === 0 ? undefined : yoy,
        compoundCagr,
        finalValuePerM2
      };
    });
  }, [purchaseYear, propertyType, agentCommissionPct, hasAgencySale, historicalRentalYield, historicalIsRented]);

  const historicalAverages = useMemo(() => {
    const years = Object.keys(historicalPriceM2).map(Number).sort((a, b) => a - b);
    const periodYears = years.filter(y => y > purchaseYear);
    if (periodYears.length === 0) return { avgInflation: 0, avgAppreciation: 0 };

    let sumInflation = 0;
    let countInflation = 0;
    for (const y of periodYears) {
      if (historicalInflation[y] !== undefined) {
        sumInflation += historicalInflation[y];
        countInflation++;
      }
    }

    let sumAppreciation = 0;
    let countAppreciation = 0;
    for (const y of periodYears) {
      const prev = y - 1;
      if (historicalPriceM2[prev] && historicalPriceM2[y]) {
        sumAppreciation += ((historicalPriceM2[y] - historicalPriceM2[prev]) / historicalPriceM2[prev]) * 100;
        countAppreciation++;
      }
    }

    return {
      avgInflation: countInflation > 0 ? sumInflation / countInflation : 0,
      avgAppreciation: countAppreciation > 0 ? sumAppreciation / countAppreciation : 0
    };
  }, [purchaseYear]);

  const fullPeriodAvgAppreciation = useMemo(() => {
    const years = Object.keys(historicalPriceM2).map(Number).sort((a, b) => a - b);
    let sum = 0;
    let count = 0;
    for (let i = 1; i < years.length; i++) {
      sum += ((historicalPriceM2[years[i]] - historicalPriceM2[years[i - 1]]) / historicalPriceM2[years[i - 1]]) * 100;
      count++;
    }
    return { avg: count > 0 ? sum / count : 0, from: years[0], to: years[years.length - 1] };
  }, []);

  const buyingCosts = calculateBuyingCosts();
  const yearlyData = calculateYearlyData();

  const finalYear = yearlyData[yearlyData.length - 1];

  const lastHistorical = historicalChartData[historicalChartData.length - 1];

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
              </>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Anys: {yearsToHold}</label>
            <input type="range" min="1" max="30" step="1" value={yearsToHold} onChange={(e) => setYearsToHold(parseFloat(e.target.value))} className="w-full h-1" />
            <label className="flex items-center space-x-1">
              <input type="checkbox" checked={hasAgencySale} onChange={(e) => setHasAgencySale(e.target.checked)} className="w-3 h-3" />
              <span className="text-slate-300">Immobiliària venda {hasAgencySale ? `${agentCommissionPct}%` : ''}</span>
            </label>
            {hasAgencySale && <input type="range" min="1" max="5" step="0.5" value={agentCommissionPct} onChange={(e) => setAgentCommissionPct(parseFloat(e.target.value))} className="w-full h-1" />}
            <label className="text-slate-300">Revalorització: {appreciationRate}%</label>
            <input type="range" min="2" max="9" step="0.5" value={appreciationRate} onChange={(e) => setAppreciationRate(parseFloat(e.target.value))} className="w-full h-1" />
            <div className="text-[10px] text-slate-400">Mitjana hist. ({fullPeriodAvgAppreciation.from}-{fullPeriodAvgAppreciation.to}): <span className="text-white">{fullPeriodAvgAppreciation.avg.toFixed(1)}%</span></div>
            <div className="bg-purple-900/30 p-2 rounded mt-1">
              <div className="text-slate-400 text-[10px]">CAGR</div>
              <div className="text-lg font-bold text-white">{finalYear?.cagr.toFixed(2)}%</div>
            </div>
            <div className="bg-amber-900/30 p-2 rounded">
              <div className="text-slate-400 text-[10px]">IS 25% sobre plusvàlua</div>
              <div className="text-[10px] text-slate-300">Només sobre guany (venda - compra)</div>
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
            <ReferenceLine y={historicalAverages.avgInflation} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Inflació ${historicalAverages.avgInflation.toFixed(1)}%`, fill: '#ef4444', fontSize: 10, position: 'right' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-xl font-bold text-white mb-3">Resum Inversió (simulació {yearsToHold} anys)</h3>
        {finalYear && (() => {
          const finalPropertyValue = propertyPrice * Math.pow(1 + appreciationRate / 100, yearsToHold);
          const capitalGain = finalPropertyValue - propertyPrice;
          const isTax = capitalGain > 0 ? capitalGain * 0.25 : 0;
          return (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-900/30 p-3 rounded-lg">
                <div className="text-sm text-slate-300">Inversió Total</div>
                <div className="text-xl font-bold text-white">€{buyingCosts.totalInvestment.toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-1">Preu + impostos + despeses</div>
              </div>
              <div className="bg-green-900/30 p-3 rounded-lg">
                <div className="text-sm text-slate-300">Valor Final Net</div>
                <div className="text-xl font-bold text-white">€{(finalYear.accumulatedWealth + buyingCosts.totalInvestment).toLocaleString()}</div>
                <div className="text-xs text-slate-400 mt-1">IS plusvàlua: €{Math.round(isTax).toLocaleString()} | Guany net: €{finalYear.accumulatedWealth.toLocaleString()}</div>
              </div>
              <div className="bg-purple-900/30 p-3 rounded-lg">
                <div className="text-sm text-slate-300">CAGR Net</div>
                <div className="text-xl font-bold text-white">{finalYear.cagr.toFixed(2)}%</div>
                <div className="text-xs text-slate-400 mt-1">Després de tots els costos i IS 25%</div>
              </div>
            </div>
          );
        })()}
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
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-xl font-bold text-white">Històric Retorn Total Vivenda Espanya (1995-2024)</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <label className="text-slate-300">Any compra: {purchaseYear}</label>
              <input type="range" min="1995" max="2023" step="1" value={purchaseYear} onChange={(e) => setPurchaseYear(parseInt(e.target.value))} className="w-24 h-1" />
            </div>
            <label className="flex items-center space-x-1">
              <input type="checkbox" checked={historicalIsRented} onChange={(e) => setHistoricalIsRented(e.target.checked)} className="w-3 h-3" />
              <span className="text-slate-300">Lloguer</span>
            </label>
            {historicalIsRented && (
              <div className="flex items-center gap-2">
                <label className="text-slate-300">Yield: {historicalRentalYield}%</label>
                <input type="range" min="2" max="7" step="0.5" value={historicalRentalYield} onChange={(e) => setHistoricalRentalYield(parseFloat(e.target.value))} className="w-20 h-1" />
              </div>
            )}
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
            <ReferenceLine y={historicalAverages.avgInflation} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Inflació mitjana ${historicalAverages.avgInflation.toFixed(1)}%`, fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={historicalAverages.avgAppreciation} stroke="#60a5fa" strokeDasharray="5 5" label={{ value: `Revalorització mitjana ${historicalAverages.avgAppreciation.toFixed(1)}%`, fill: '#60a5fa', fontSize: 10, position: 'insideBottomRight' }} />
            <Line type="monotone" dataKey="yoy" stroke="#f97316" strokeWidth={2} name="Variació anual %" dot={false} connectNulls />
            <Line type="monotone" dataKey="compoundCagr" stroke="#10b981" strokeWidth={2} name={`CAGR des de ${purchaseYear}`} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
        {lastHistorical?.compoundCagr !== undefined && (
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <div className="bg-green-900/30 p-3 rounded-lg">
              <div className="text-slate-300">CAGR al 2024</div>
              <div className="text-xl font-bold text-white">{lastHistorical.compoundCagr.toFixed(2)}%</div>
              <div className="text-xs text-slate-400">Des de {purchaseYear} ({2024 - purchaseYear} anys)</div>
            </div>
            <div className="bg-blue-900/30 p-3 rounded-lg">
              <div className="text-slate-300">Valor final net per m²</div>
              <div className="text-xl font-bold text-white">€{lastHistorical.finalValuePerM2?.toFixed(0)}</div>
              <div className="text-xs text-slate-400">Inicial: €{historicalPriceM2[purchaseYear]} × {(1 + (propertyType === 'second-hand' ? 0.10 : 0.115)).toFixed(3)} = €{(historicalPriceM2[purchaseYear] * (1 + (propertyType === 'second-hand' ? 0.10 : 0.115))).toFixed(0)}</div>
            </div>
            <div className="bg-purple-900/30 p-3 rounded-lg">
              <div className="text-slate-300">Guany net per m²</div>
              <div className={`text-xl font-bold ${(lastHistorical.finalValuePerM2 || 0) - historicalPriceM2[purchaseYear] * (1 + (propertyType === 'second-hand' ? 0.10 : 0.115)) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                €{((lastHistorical.finalValuePerM2 || 0) - historicalPriceM2[purchaseYear] * (1 + (propertyType === 'second-hand' ? 0.10 : 0.115))).toFixed(0)}
              </div>
              <div className="text-xs text-slate-400">Valor final - inversió total</div>
            </div>
          </div>
        )}
        <div className="mt-2 p-2 bg-blue-900/30 rounded-lg border border-blue-500/30 text-xs text-slate-300">
          <p><strong>Font:</strong> Ministerio de Transportes - Valor tasado de vivienda libre (€/m²). Inflació: INE (IPC).</p>
          <p className="mt-1"><strong>Línia taronja:</strong> Variació interanual del preu/m². <strong>Línia verda:</strong> CAGR net (retorn total anualitzat){historicalIsRented ? `, incloent lloguer brut ${historicalRentalYield}% - ~2% despeses, net d'IS 25%` : ' sense lloguer'}. Descompta costos compra ({propertyType === 'second-hand' ? '10% ITP' : '11.5% IVA+AJD'}), venda ({hasAgencySale ? `${agentCommissionPct}%` : '0%'} comissió + notari/registre) i 25% IS sobre plusvàlua.</p>
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
            {hasAgencySale && <li>Comissió immobiliària de venda ({agentCommissionPct}%)</li>}
          </ul>
          <p className="mt-2"><strong>Fórmula:</strong> CAGR = ((Riquesa Final / Inversió Inicial)^(1/anys) - 1) × 100</p>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCAGR;
