'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BrazilRealEstateCAGR = () => {
  const [revalorizacion, setRevalorizacion] = useState(10);
  
  const terrenoReais = 600000;
  const construccionReais = 3740000;
  const piscinaJardinesReais = 250000;
  const licenciasReais = 200000;
  const inversionTotalReais = terrenoReais + construccionReais + piscinaJardinesReais + licenciasReais;
  
  const tasaCambio = 0.159;
  const inversionTotalEuros = inversionTotalReais * tasaCambio;
  
  const habitaciones = 18;
  const diariaPorHabitacion = 400;
  const ocupacionAnual = 0.45;
  
  const ingresosBrutosAnuales = habitaciones * diariaPorHabitacion * 365 * ocupacionAnual;
  
  const impuestosCompraBrasil = 0.04;
  const impuestoVentaBrasil = 0.15;
  const simplesNacional = 0.11;
  const retencionRepatriacion = 0.15;
  const impuestoSociedadesEspana = 0.25;
  
  const costosOperativosAnuales = 0.35;
  
  const gastosMantenimientoAnuales = 50000;
  const gestoriaExtraAnual = 12000;
  
  const calcularRentabilidadBruta = () => {
    const rendimientoAlquiler = (ingresosBrutosAnuales / inversionTotalReais) * 100;
    return revalorizacion + rendimientoAlquiler;
  };
  
  const calcularRentabilidadNeta = (años: number) => {
    const revalorizacionDecimal = revalorizacion / 100;
    
    const valorInmueble = inversionTotalReais * Math.pow(1 + revalorizacionDecimal, años);
    
    let flujoAcumuladoReais = 0;
    
    for (let i = 1; i <= años; i++) {
      const ingresosBrutos = ingresosBrutosAnuales;
      
      const impuestoSimples = ingresosBrutos * simplesNacional;
      
      const costosOperativos = ingresosBrutos * costosOperativosAnuales;
      
      const beneficioBrutoAnual = ingresosBrutos - impuestoSimples - costosOperativos - gastosMantenimientoAnuales - gestoriaExtraAnual;
      
      const retencionBrasil = beneficioBrutoAnual > 0 ? beneficioBrutoAnual * retencionRepatriacion : 0;
      
      const beneficioTrasRetencion = beneficioBrutoAnual - retencionBrasil;
      
      const impuestoEspana = beneficioTrasRetencion > 0 ? beneficioTrasRetencion * impuestoSociedadesEspana : 0;
      
      const flujoNetoAnual = beneficioTrasRetencion - impuestoEspana;
      
      flujoAcumuladoReais += flujoNetoAnual;
    }
    
    const costosCompraTotales = inversionTotalReais * impuestosCompraBrasil;
    const inversionConCostosCompra = inversionTotalReais + costosCompraTotales;
    
    const gananciaCapital = valorInmueble - inversionTotalReais;
    const impuestoGananciaBrasil = gananciaCapital > 0 ? gananciaCapital * impuestoVentaBrasil : 0;
    
    const ingresoVentaNeto = valorInmueble - impuestoGananciaBrasil;
    
    const valorFinalTotal = ingresoVentaNeto + flujoAcumuladoReais;
    
    const valorFinalEuros = valorFinalTotal * tasaCambio;
    
    const cagrNeto = (Math.pow(valorFinalEuros / inversionTotalEuros, 1 / años) - 1) * 100;
    
    return cagrNeto;
  };
  
  const data = [];
  for (let año = 1; año <= 25; año++) {
    data.push({
      año: año,
      neta: calcularRentabilidadNeta(año),
      bruta: calcularRentabilidadBruta()
    });
  }
  
  return (
    <div className="w-full p-6 bg-slate-800 rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Rentabilitat Pousada Sol e Lua (Brasil) - Bruta vs Neta
        </h2>
        <div className="text-sm text-slate-300 space-y-1 mb-4">
          <p><strong>Inversió total:</strong> {inversionTotalReais.toLocaleString()} R$ (~{Math.round(inversionTotalEuros).toLocaleString()}€)</p>
          <p className="ml-4">• Terreny: {terrenoReais.toLocaleString()} R$ (650 m²)</p>
          <p className="ml-4">• Construcció: {construccionReais.toLocaleString()} R$ (1.100 m², 18 habitacions)</p>
          <p className="ml-4">• Piscina/jardins: {piscinaJardinesReais.toLocaleString()} R$</p>
          <p className="ml-4">• Llicències/projecte: {licenciasReais.toLocaleString()} R$</p>
          <p><strong>Ingressos estimats:</strong> {Math.round(ingresosBrutosAnuales).toLocaleString()} R$/any (18 hab × 400 R$/nit × 45% ocupació)</p>
          <p><strong>Impostos Brasil:</strong> Compra 4% | Simples Nacional 11% | Venda 15%</p>
          <p><strong>Impostos Espanya:</strong> Retenció repatriació 15% | Societats 25%</p>
          <p><strong>Costos extra:</strong> Gestoria internacional {gestoriaExtraAnual.toLocaleString()} R$/any</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Revalorització anual Paracuru: {revalorizacion}%
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="18"
              step="0.5"
              value={revalorizacion}
              onChange={(e) => setRevalorizacion(parseFloat(e.target.value))}
              className="w-64"
            />
            <div className="text-sm text-slate-300">
              <button onClick={() => setRevalorizacion(8)} className="px-3 py-1 bg-blue-600 rounded mr-2 hover:bg-blue-700">8% (conservador)</button>
              <button onClick={() => setRevalorizacion(12)} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">12% (històric)</button>
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
            stroke="#fdba74" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="BRUTA (sense impostos)"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="neta" 
            stroke="#f97316" 
            strokeWidth={3}
            name="NETA (real en €)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
        <h3 className="font-semibold text-white mb-2">Interpretació (Empresa Catalana operant al Brasil):</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• <strong>Línia puntejada (BRUTA):</strong> Revalorització {revalorizacion}% + rendiment lloguer ~{((ingresosBrutosAnuales / inversionTotalReais) * 100).toFixed(1)}% sense impostos</li>
          <li>• <strong>Línia sòlida (NETA):</strong> Rendiment real en € després de TOTS els impostos (Brasil + Espanya) i costos</li>
          <li>• <strong>Impostos Brasil:</strong> 4% compra + 11% Simples Nacional sobre facturació + 15% sobre guany capital venda</li>
          <li>• <strong>Doble imposició:</strong> 15% retenció Brasil en repatriar beneficis + 25% impost societats Espanya (amb compensació parcial)</li>
          <li>• <strong>Costos operatius:</strong> 35% sobre facturació + {gastosMantenimientoAnuales.toLocaleString()} R$/any manteniment + {gestoriaExtraAnual.toLocaleString()} R$/any gestoria internacional</li>
          <li>• <strong>Risc cambi:</strong> Càlcul en € assumeix tipus de canvi constant (1 R$ = {tasaCambio}€). Variacions poden afectar rendiment real</li>
          <li>• La inversió inicial alta ({Math.round(inversionTotalEuros).toLocaleString()}€) es dilueix amb els anys gràcies a la revalorització composta</li>
          <li>• Paracuru és zona costanera en creixement turístic (kitesurf), amb revaloritzacions històriques del 8-15% anual</li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-orange-900/30 rounded-lg border border-orange-500/30">
        <h3 className="font-semibold text-white mb-2">⚠️ Consideracions fiscals importants:</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• <strong>Estructura legal:</strong> Empresa catalana amb filial brasilera o sucursal (afecta fiscalitat)</li>
          <li>• <strong>Conveni doble imposició Espanya-Brasil:</strong> Permet compensar impostos pagats al Brasil, però no elimina totalment la doble tributació</li>
          <li>• <strong>Repatriació beneficis:</strong> 15% retenció Brasil + declaració a Espanya (amb crèdit fiscal parcial)</li>
          <li>• <strong>Gestoria especialitzada:</strong> Necessària per complir amb Receita Federal (Brasil) i AEAT (Espanya) - cost estimat {gestoriaExtraAnual.toLocaleString()} R$/any</li>
          <li>• <strong>Risc regulatori:</strong> Canvis en legislació fiscal brasilera o espanyola poden afectar rendiments</li>
        </ul>
      </div>
    </div>
  );
};

export default BrazilRealEstateCAGR;
