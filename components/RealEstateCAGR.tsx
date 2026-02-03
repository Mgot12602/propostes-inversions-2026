'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface YearData {
  year: number;
  propertyValue: number;
  rentalIncome: number;
  expenses: number;
  netCashFlow: number;
  accumulatedWealth: number;
  cagr: number;
}

const RealEstateCAGR = () => {
  const [propertyPrice, setPropertyPrice] = useState(300000);
  const [propertyType, setPropertyType] = useState<'second-hand' | 'new'>('second-hand');
  const [hasMortgage, setHasMortgage] = useState(false);
  const [loanAmount, setLoanAmount] = useState(200000);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanYears, setLoanYears] = useState(25);
  
  const [notaryFeesPct, setNotaryFeesPct] = useState(0.7);
  const [hasLawyer, setHasLawyer] = useState(true);
  const [lawyerFeesPct, setLawyerFeesPct] = useState(1.0);
  const [gestoriaFee, setGestoriaFee] = useState(450);
  
  const [yearsToHold, setYearsToHold] = useState(10);
  const [agentCommissionPct, setAgentCommissionPct] = useState(3);
  
  const [ibiRate, setIbiRate] = useState(0.7);
  const [cadastralValuePct, setCadastralValuePct] = useState(60);
  const [communityFees, setCommunityFees] = useState(80);
  const [insurance, setInsurance] = useState(350);
  const [maintenancePct, setMaintenancePct] = useState(1.0);
  const [managementHours, setManagementHours] = useState(2);
  const [hourlyRate, setHourlyRate] = useState(36);
  
  const [monthlyRent, setMonthlyRent] = useState(1000);
  const [isRented, setIsRented] = useState(true);
  
  const [appreciationRate, setAppreciationRate] = useState(5);
  
  
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
    
    return {
      itp,
      iva,
      ajd,
      notaryFees,
      registryFees,
      lawyerFees,
      gestoriaFee,
      mortgageCosts,
      totalBuyingCosts,
      totalInvestment
    };
  };
  
  const calculateYearlyData = (): YearData[] => {
    const buyingCosts = calculateBuyingCosts();
    const yearlyData: YearData[] = [];
    
    const cadastralValue = propertyPrice * (cadastralValuePct / 100);
    const annualRent = monthlyRent * 12;
    const annualIBI = cadastralValue * (ibiRate / 100);
    const annualCommunity = communityFees * 12;
    const annualMaintenance = propertyPrice * (maintenancePct / 100);
    const annualManagement = managementHours * 12 * hourlyRate;
    
    let accumulatedCashFlow = 0;
    
    for (let year = 1; year <= yearsToHold; year++) {
      const currentPropertyValue = propertyPrice * Math.pow(1 + appreciationRate / 100, year);
      
      const grossRentalIncome = isRented ? annualRent : 0;
      const totalExpenses = annualIBI + insurance + annualMaintenance + annualManagement + annualCommunity;
      
      const netIncome = grossRentalIncome - totalExpenses;
      const taxOnIncome = netIncome > 0 ? netIncome * 0.25 : 0;
      const netCashFlow = netIncome - taxOnIncome;
      
      accumulatedCashFlow += netCashFlow;
      
      const accumulatedWealth = currentPropertyValue + accumulatedCashFlow - buyingCosts.totalInvestment;
      const cagr = accumulatedWealth > 0 
        ? (Math.pow(accumulatedWealth / buyingCosts.totalInvestment, 1 / year) - 1) * 100
        : 0;
      
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
  
  const calculateSellingCosts = () => {
    const finalPropertyValue = propertyPrice * Math.pow(1 + appreciationRate / 100, yearsToHold);
    const agentCommission = finalPropertyValue * (agentCommissionPct / 100);
    const capitalGain = finalPropertyValue - propertyPrice;
    const capitalGainsTax = capitalGain > 0 ? capitalGain * 0.25 : 0;
    const notarySelling = finalPropertyValue * 0.003;
    const registrySelling = finalPropertyValue * 0.001;
    
    return {
      agentCommission,
      capitalGainsTax,
      notarySelling,
      registrySelling,
      totalSellingCosts: agentCommission + capitalGainsTax + notarySelling + registrySelling
    };
  };
  
  const buyingCosts = calculateBuyingCosts();
  const yearlyData = calculateYearlyData();
  const sellingCosts = calculateSellingCosts();
  
  const finalYear = yearlyData[yearlyData.length - 1];
  const inflacionEspana = 2.4;
  
  return (
    <div className="w-full space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <h2 className="text-3xl font-bold text-white mb-6">
          Calculadora Inversió Immobiliària Catalunya
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Paràmetres de Compra</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Preu propietat: €{propertyPrice.toLocaleString()}
              </label>
              <input
                type="range"
                min="100000"
                max="1000000"
                step="10000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Tipus de propietat
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as 'second-hand' | 'new')}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded"
              >
                <option value="second-hand">Segona mà (ITP 10%)</option>
                <option value="new">Nova (IVA 10%)</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={hasMortgage}
                  onChange={(e) => setHasMortgage(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Hipoteca</span>
              </label>
            </div>
            
            {hasMortgage && (
              <div className="ml-6 space-y-3">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Import préstec: €{loanAmount.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max={propertyPrice * 0.8}
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Notaria: {notaryFeesPct}%
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={notaryFeesPct}
                onChange={(e) => setNotaryFeesPct(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-slate-200">
                <input
                  type="checkbox"
                  checked={hasLawyer}
                  onChange={(e) => setHasLawyer(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Advocat ({lawyerFeesPct}%)</span>
              </label>
              {hasLawyer && (
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={lawyerFeesPct}
                  onChange={(e) => setLawyerFeesPct(parseFloat(e.target.value))}
                  className="w-full mt-2"
                />
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Despeses Anuals</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                IBI: {ibiRate}% valor cadastral
              </label>
              <input
                type="range"
                min="0.4"
                max="1.1"
                step="0.1"
                value={ibiRate}
                onChange={(e) => setIbiRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Valor cadastral: {cadastralValuePct}% del preu
              </label>
              <input
                type="range"
                min="50"
                max="70"
                step="5"
                value={cadastralValuePct}
                onChange={(e) => setCadastralValuePct(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Comunitat: €{communityFees}/mes
              </label>
              <input
                type="range"
                min="0"
                max="200"
                step="10"
                value={communityFees}
                onChange={(e) => setCommunityFees(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Assegurança: €{insurance}/any
              </label>
              <input
                type="range"
                min="200"
                max="600"
                step="50"
                value={insurance}
                onChange={(e) => setInsurance(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Manteniment: {maintenancePct}% anual
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={maintenancePct}
                onChange={(e) => setMaintenancePct(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Gestió: {managementHours}h/mes × €{hourlyRate}/h
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={managementHours}
                onChange={(e) => setManagementHours(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Ingressos</h3>
            
            <div>
              <label className="flex items-center space-x-2 text-slate-200 mb-3">
                <input
                  type="checkbox"
                  checked={isRented}
                  onChange={(e) => setIsRented(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Llogada</span>
              </label>
            </div>
            
            {isRented && (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Lloguer mensual: €{monthlyRent}
                </label>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="50"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Venda</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Anys a mantenir: {yearsToHold}
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={yearsToHold}
                onChange={(e) => setYearsToHold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Comissió immobiliària: {agentCommissionPct}%
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={agentCommissionPct}
                onChange={(e) => setAgentCommissionPct(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Revalorització anual: {appreciationRate}%
              </label>
              <input
                type="range"
                min="2"
                max="9"
                step="0.5"
                value={appreciationRate}
                onChange={(e) => setAppreciationRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Resum Inversió</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-900/30 p-4 rounded-lg">
            <div className="text-sm text-slate-300">Inversió Total</div>
            <div className="text-2xl font-bold text-white">€{buyingCosts.totalInvestment.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Preu + impostos + despeses</div>
          </div>
          <div className="bg-green-900/30 p-4 rounded-lg">
            <div className="text-sm text-slate-300">Riquesa Acumulada (Any {yearsToHold})</div>
            <div className="text-2xl font-bold text-white">€{finalYear?.accumulatedWealth.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Valor propietat + fluxos nets</div>
          </div>
          <div className="bg-purple-900/30 p-4 rounded-lg">
            <div className="text-sm text-slate-300">CAGR Real</div>
            <div className="text-2xl font-bold text-white">{finalYear?.cagr.toFixed(2)}%</div>
            <div className="text-xs text-slate-400 mt-1">Creixement anual compost</div>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Costos de Compra Detallats</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
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
      
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Evolució Any per Any</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={yearlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="year" stroke="#cbd5e1" label={{ value: 'Anys', position: 'insideBottom', offset: -5, fill: '#cbd5e1' }} />
            <YAxis stroke="#cbd5e1" label={{ value: 'CAGR (%)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }} />
            <Tooltip 
              formatter={(value: number) => `${value.toFixed(2)}%`}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Legend />
            <Line type="monotone" dataKey="cagr" stroke="#3b82f6" strokeWidth={3} name="CAGR Real" dot={false} />
            <Line type="monotone" dataKey={() => inflacionEspana} stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" name="Inflació (2.4%)" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Taula Detallada per Any</h3>
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
      
      <div className="bg-blue-900/30 rounded-xl p-6 border border-blue-500/30">
        <h3 className="font-semibold text-white mb-3">📊 Explicació del CAGR (Compound Annual Growth Rate)</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p>El CAGR mostra el creixement anual compost real de la teva inversió, tenint en compte:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>La inversió inicial total (preu + tots els impostos i despeses de compra)</li>
            <li>El valor actual de la propietat (amb revalorització del {appreciationRate}% anual)</li>
            <li>Tots els fluxos de caixa nets acumulats (lloguers - despeses - impostos)</li>
          </ul>
          <p className="mt-3"><strong>Important:</strong> Aquest càlcul reflecteix el creixement compost, no la mitjana simple. Si guanyes un 10% el primer any i un 10% el segon any sobre la nova base, el CAGR serà exactament 10%, però l'increment absolut del segon any serà superior.</p>
          <p className="mt-2"><strong>Fórmula:</strong> CAGR = ((Riquesa Final / Inversió Inicial)^(1/anys) - 1) × 100</p>
        </div>
      </div>
    </div>
  );
};

export default RealEstateCAGR;
