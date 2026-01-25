'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RealEstateCAGR = () => {
  const [revalorizacion, setRevalorizacion] = useState(5);
  
  const precioCompra = 300000;
  const costesCompra = precioCompra * 0.12;
  const inversionTotal = precioCompra + costesCompra;
  
  const alquilerMensual = 1000;
  const alquilerAnual = alquilerMensual * 12;
  
  const gastosAnuales = 3500;
  const gestionAnual = 2 * 12 * 36;
  
  const revalorizacionAnual = revalorizacion / 100;
  const impuestoSociedades = 0.25;
  const costesVentaPct = 0.05;
  
  const calcularRentabilidadBruta = (conAlquiler: boolean) => {
    if (conAlquiler) {
      const rendimientoAlquiler = (alquilerAnual / precioCompra) * 100;
      return revalorizacion + rendimientoAlquiler;
    } else {
      return revalorizacion;
    }
  };
  
  const calcularRentabilidadNeta = (conAlquiler: boolean, años: number) => {
    const valorVivienda = precioCompra * Math.pow(1 + revalorizacionAnual, años);
    
    let flujoAcumulado = 0;
    
    for (let i = 1; i <= años; i++) {
      if (conAlquiler) {
        const beneficioBruto = alquilerAnual - gastosAnuales - gestionAnual;
        const impuestos = beneficioBruto * impuestoSociedades;
        const flujoNetoAnual = beneficioBruto - impuestos;
        flujoAcumulado += flujoNetoAnual;
      } else {
        flujoAcumulado -= gastosAnuales;
      }
    }
    
    const costesVentaTotal = valorVivienda * costesVentaPct;
    const gananciaCapital = valorVivienda - precioCompra;
    const impuestoGanancia = gananciaCapital > 0 ? gananciaCapital * 0.21 : 0;
    
    const ingresoVentaNeto = valorVivienda - costesVentaTotal - impuestoGanancia;
    
    const valorFinalTotal = ingresoVentaNeto + flujoAcumulado;
    
    const cagrNeto = (Math.pow(valorFinalTotal / inversionTotal, 1 / años) - 1) * 100;
    
    return cagrNeto;
  };
  
  const data = [];
  for (let año = 1; año <= 25; año++) {
    data.push({
      año: año,
      vaciaNeta: calcularRentabilidadNeta(false, año),
      alquiladaNeta: calcularRentabilidadNeta(true, año),
      vaciaBruta: calcularRentabilidadBruta(false),
      alquiladaBruta: calcularRentabilidadBruta(true)
    });
  }
  
  return (
    <div className="w-full p-6 bg-slate-800 rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Rentabilitat Inversió Immobiliària Catalunya - Bruta vs Neta
        </h2>
        <div className="text-sm text-slate-300 space-y-1 mb-4">
          <p><strong>Inversió:</strong> 300.000€ (cost total amb impostos: 336.000€)</p>
          <p><strong>Lloguer:</strong> 1.000€/mes (12.000€/any = 4% sobre preu compra)</p>
          <p><strong>Despeses anuals:</strong> 3.500€ (IBI, manteniment, comunitat, assegurança)</p>
          <p><strong>Gestió:</strong> 864€/any (2h/mes × 36€/h)</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Revalorització anual: {revalorizacion}%
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="2"
              max="9"
              step="0.5"
              value={revalorizacion}
              onChange={(e) => setRevalorizacion(parseFloat(e.target.value))}
              className="w-64"
            />
            <div className="text-sm text-slate-300">
              <button onClick={() => setRevalorizacion(5)} className="px-3 py-1 bg-blue-600 rounded mr-2 hover:bg-blue-700">5% (conservador)</button>
              <button onClick={() => setRevalorizacion(9)} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">9% (històric 50 anys)</button>
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
            formatter={(value: number) => `${value.toFixed(2)}%`}
            labelFormatter={(label) => `Any ${label}`}
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="vaciaBruta" 
            stroke="#93c5fd" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Buida BRUTA (sense impostos)"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="vaciaNeta" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Buida NETA (real)"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="alquiladaBruta" 
            stroke="#fdba74" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Llogada BRUTA (sense impostos)"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="alquiladaNeta" 
            stroke="#f97316" 
            strokeWidth={3}
            name="Llogada NETA (real)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
        <h3 className="font-semibold text-white mb-2">Interpretació:</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• <strong>Línies puntejades (BRUTA):</strong> Rentabilitat sense considerar impostos ni despeses. Amb {revalorizacion}% revalorització + 4% lloguer = ~{revalorizacion + 4}% anual</li>
          <li>• <strong>Línies sòlides (NETA):</strong> Rentabilitat real després d&apos;impostos de compra (12%), venda (5%), guany capital (21%), societats (25%) i totes les despeses</li>
          <li>• <strong>La diferència</strong> entre bruta i neta mostra l&apos;impacte d&apos;impostos i despeses a Catalunya</li>
          <li>• Amb {revalorizacion}% revalorització, l&apos;habitatge llogat assoleix ~{((revalorizacion + 4) * 0.55).toFixed(1)}% CAGR neta a llarg termini (≈55-60% de la bruta)</li>
          <li>• Els costos inicials alts (36.000€) expliquen per què la rentabilitat neta triga anys a ser positiva</li>
        </ul>
      </div>
    </div>
  );
};

export default RealEstateCAGR;
