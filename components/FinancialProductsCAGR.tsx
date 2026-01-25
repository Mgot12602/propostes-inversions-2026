'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialProductsCAGRProps {
  productType: 'etf' | 'bonds';
}

const FinancialProductsCAGR = ({ productType }: FinancialProductsCAGRProps) => {
  const isETF = productType === 'etf';
  
  const [rentabilidadAnual, setRentabilidadAnual] = useState(isETF ? 8 : 3.5);
  
  const inversionInicial = isETF ? 50000 : 100000;
  
  const comisionCustodia = 0.0015;
  const impuestoBeneficios = 0.21;
  
  const calcularRentabilidadBruta = () => {
    return rentabilidadAnual;
  };
  
  const calcularRentabilidadNeta = () => {
    const rentabilidadBrutaDecimal = rentabilidadAnual / 100;
    const comisionDecimal = comisionCustodia;
    
    const rentabilidadDespuesComision = rentabilidadBrutaDecimal - comisionDecimal;
    
    const factorImpuesto = 1 - impuestoBeneficios;
    
    const rentabilidadNetaAproximada = rentabilidadDespuesComision * factorImpuesto;
    
    return rentabilidadNetaAproximada * 100;
  };
  
  const data = [];
  for (let año = 1; año <= 25; año++) {
    data.push({
      año: año,
      bruta: calcularRentabilidadBruta(),
      neta: calcularRentabilidadNeta()
    });
  }
  
  const productName = isETF ? 'ETF MSCI World' : 'Bons d\'Estat AAA';
  const minReturn = isETF ? 5 : 2;
  const maxReturn = isETF ? 12 : 5;
  const defaultLow = isETF ? 7 : 3;
  const defaultHigh = isETF ? 9 : 4;
  
  return (
    <div className="w-full p-6 bg-slate-800 rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Rentabilitat {productName} - Bruta vs Neta
        </h2>
        <div className="text-sm text-slate-300 space-y-1 mb-4">
          <p><strong>Inversió:</strong> {inversionInicial.toLocaleString()}€</p>
          <p><strong>Comissió custòdia:</strong> 0.15% anual</p>
          <p><strong>Impost sobre beneficis:</strong> 21% (a la venda)</p>
          <p><strong>Impostos compra/venda:</strong> 0% (no aplica a Espanya)</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Rentabilitat anual esperada: {rentabilidadAnual}%
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={minReturn}
              max={maxReturn}
              step="0.5"
              value={rentabilidadAnual}
              onChange={(e) => setRentabilidadAnual(parseFloat(e.target.value))}
              className="w-64"
            />
            <div className="text-sm text-slate-300">
              <button 
                onClick={() => setRentabilidadAnual(defaultLow)} 
                className="px-3 py-1 bg-blue-600 rounded mr-2 hover:bg-blue-700"
              >
                {defaultLow}% (conservador)
              </button>
              <button 
                onClick={() => setRentabilidadAnual(defaultHigh)} 
                className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
              >
                {defaultHigh}% (històric)
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="año" 
            stroke="#cbd5e1"
            label={{ value: 'Anys d\'inversió', position: 'insideBottom', offset: -5, fill: '#cbd5e1' }}
          />
          <YAxis 
            stroke="#cbd5e1"
            label={{ value: 'CAGR (%)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }}
          />
          <Tooltip 
            formatter={(value) => typeof value === 'number' ? `${value.toFixed(2)}%` : ''}
            labelFormatter={(label) => `Any ${label}`}
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="bruta" 
            stroke="#93c5fd" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="BRUTA (sense impostos)"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="neta" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="NETA (real)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
        <h3 className="font-semibold text-white mb-2">Interpretació:</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• <strong>Línia puntejada (BRUTA):</strong> Rentabilitat nominal de {rentabilidadAnual}% anual sense considerar impostos ni comissions</li>
          <li>• <strong>Línia sòlida (NETA):</strong> Rentabilitat real després de comissions de custòdia (0.15% anual) i impostos sobre beneficis (21%)</li>
          <li>• <strong>CAGR Net constant:</strong> {calcularRentabilidadNeta().toFixed(2)}% anual (independent dels anys d&apos;inversió)</li>
          <li>• <strong>Càlcul:</strong> ({rentabilidadAnual}% - 0.15%) × (1 - 21%) = {calcularRentabilidadNeta().toFixed(2)}%</li>
          <li>• {isETF 
            ? 'Els ETFs tenen avantatges fiscals: no tributen fins a la venda i permeten diferir impostos'
            : 'Els bons tenen fiscalitat similar però menor volatilitat i rendiments més predictibles'
          }</li>
          <li>• La comissió de custòdia (0.15%) s&apos;aplica anualment, reduint la rentabilitat de forma constant</li>
        </ul>
      </div>
    </div>
  );
};

export default FinancialProductsCAGR;
