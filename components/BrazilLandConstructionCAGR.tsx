'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BrazilLandConstructionCAGR = () => {
  const [revalorizacion, setRevalorizacion] = useState(10);
  
  const terrenoEuros = 100000;
  const construccionEuros = 595000;
  const piscinaJardinesEuros = 40000;
  const licenciasEuros = 32000;
  const inversionConstruccionTotal = terrenoEuros + construccionEuros + piscinaJardinesEuros + licenciasEuros;
  
  const impuestosCompraBrasil = 0.04;
  const impuestoVentaBrasil = 0.15;
  const inversionTotalEuros = inversionConstruccionTotal * (1 + impuestosCompraBrasil);
  
  const habitaciones = 18;
  const diariaPorHabitacion = 250;
  const ocupacionAnual = 0.45;
  
  const ingresosBrutosAnuales = habitaciones * diariaPorHabitacion * 365 * ocupacionAnual;
  
  const simplesNacional = 0.11;
  const costosOperativos = 0.35;
  const gastosMantenimiento = 12000;
  const gestoriaAnual = 2000;
  const retencionRepatriacion = 0.15;
  const impuestoSociedadesEspana = 0.25;
  
  const calcularRentabilidadInmuebleBruta = () => {
    return revalorizacion;
  };
  
  const calcularRentabilidadInmuebleNeta = (años: number) => {
    const revalorizacionDecimal = revalorizacion / 100;
    const valorInmueble = inversionConstruccionTotal * Math.pow(1 + revalorizacionDecimal, años);
    
    const gananciaCapital = valorInmueble - inversionConstruccionTotal;
    const impuestoGanancia = gananciaCapital > 0 ? gananciaCapital * impuestoVentaBrasil : 0;
    
    const valorVentaNeto = valorInmueble - impuestoGanancia;
    
    const cagrInmueble = (Math.pow(valorVentaNeto / inversionTotalEuros, 1 / años) - 1) * 100;
    
    return cagrInmueble;
  };
  
  const calcularRentabilidadNegocioBruta = () => {
    return (ingresosBrutosAnuales / inversionConstruccionTotal) * 100;
  };
  
  const calcularRentabilidadNegocioNeta = () => {
    const impuestoSimples = ingresosBrutosAnuales * simplesNacional;
    const costos = ingresosBrutosAnuales * costosOperativos;
    
    const beneficioBruto = ingresosBrutosAnuales - impuestoSimples - costos - gastosMantenimiento - gestoriaAnual;
    
    const retencionBrasil = beneficioBruto > 0 ? beneficioBruto * retencionRepatriacion : 0;
    const beneficioTrasRetencion = beneficioBruto - retencionBrasil;
    
    const impuestoEspana = beneficioTrasRetencion > 0 ? beneficioTrasRetencion * impuestoSociedadesEspana : 0;
    const beneficioNeto = beneficioTrasRetencion - impuestoEspana;
    
    return (beneficioNeto / inversionConstruccionTotal) * 100;
  };
  
  const calcularRentabilidadCombinada = (años: number) => {
    const rentInmueble = calcularRentabilidadInmuebleNeta(años);
    const rentNegocio = calcularRentabilidadNegocioNeta();
    
    return rentInmueble + rentNegocio;
  };
  
  const inflacionEspana50Anos = 4.8;
  
  const data = [];
  for (let año = 1; año <= 25; año++) {
    data.push({
      año: año,
      inmuebleBruta: calcularRentabilidadInmuebleBruta(),
      inmuebleNeta: calcularRentabilidadInmuebleNeta(año),
      negocioBruta: calcularRentabilidadNegocioBruta(),
      negocioNeta: calcularRentabilidadNegocioNeta(),
      combinadaNeta: calcularRentabilidadCombinada(año),
      inflacion: inflacionEspana50Anos
    });
  }
  
  return (
    <div className="w-full p-6 bg-slate-800 rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Rentabilitat Projecte Construcció Pousada (Terreny + Construcció)
        </h2>
        <div className="text-sm text-slate-300 space-y-1 mb-4">
          <p><strong>Inversió total:</strong> {inversionConstruccionTotal.toLocaleString()}€</p>
          <p className="ml-4">• Terreny (650 m²): {terrenoEuros.toLocaleString()}€</p>
          <p className="ml-4">• Construcció (1.100 m²): {construccionEuros.toLocaleString()}€</p>
          <p className="ml-4">• Piscina/jardins: {piscinaJardinesEuros.toLocaleString()}€</p>
          <p className="ml-4">• Llicències/projecte: {licenciasEuros.toLocaleString()}€</p>
          <p><strong>Amb impostos compra (4%):</strong> {Math.round(inversionTotalEuros).toLocaleString()}€</p>
          <p><strong>Pousada nova:</strong> {habitaciones} habitacions de luxe</p>
          <p><strong>Ingressos estimats:</strong> {Math.round(ingresosBrutosAnuales).toLocaleString()}€/any ({habitaciones} hab × {diariaPorHabitacion}€/nit × {ocupacionAnual * 100}% ocupació)</p>
          <p><strong>Impostos Brasil:</strong> Compra 4% | Simples Nacional 11% | Venda 15%</p>
          <p><strong>Impostos Espanya:</strong> Retenció 15% | Societats 25%</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Revalorització anual immoble Paracuru: {revalorizacion}%
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
            label={{ value: 'Rendiment anual (%)', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }}
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
            dataKey="inmuebleBruta" 
            stroke="#93c5fd" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Immoble BRUT"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="inmuebleNeta" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Immoble NET"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="negocioBruta" 
            stroke="#fdba74" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Negoci BRUT"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="negocioNeta" 
            stroke="#f97316" 
            strokeWidth={2}
            name="Negoci NET"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="combinadaNeta" 
            stroke="#22c55e" 
            strokeWidth={3}
            name="TOTAL NET (Immoble + Negoci)"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="inflacion" 
            stroke="#ef4444" 
            strokeWidth={2}
            strokeDasharray="3 3"
            name="Inflació Espanya 50 anys (4,8%)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
        <h3 className="font-semibold text-white mb-2">Interpretació:</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• <strong>Immoble BRUT (blau clar):</strong> Revalorització {revalorizacion}% anual sense impostos</li>
          <li>• <strong>Immoble NET (blau):</strong> Revalorització després d&apos;impostos compra (4%) i venda (15%)</li>
          <li>• <strong>Negoci BRUT (taronja clar):</strong> Ingressos bruts / inversió = {calcularRentabilidadNegocioBruta().toFixed(1)}% anual</li>
          <li>• <strong>Negoci NET (taronja):</strong> Benefici net després de tots els impostos i costos = {calcularRentabilidadNegocioNeta().toFixed(1)}% anual</li>
          <li>• <strong>TOTAL NET (verd):</strong> Rendiment combinat immoble + negoci = rendiment total real</li>
          <li>• Projecte de construcció nova amb major inversió però també major potencial de rendiment per tarifes premium</li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
        <h3 className="font-semibold text-white mb-2">📊 Resum rendiments projecte construcció:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <p><strong>Rendiment immoble net (any 10):</strong> {calcularRentabilidadInmuebleNeta(10).toFixed(2)}%</p>
            <p><strong>Rendiment negoci net:</strong> {calcularRentabilidadNegocioNeta().toFixed(2)}%</p>
          </div>
          <div>
            <p><strong>Rendiment total net (any 10):</strong> {calcularRentabilidadCombinada(10).toFixed(2)}%</p>
            <p><strong>Benefici net anual:</strong> ~{Math.round((calcularRentabilidadNegocioNeta() / 100) * inversionConstruccionTotal).toLocaleString()}€</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-orange-900/30 rounded-lg border border-orange-500/30">
        <h3 className="font-semibold text-white mb-2">⚠️ Consideracions projecte nou:</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• <strong>Temps construcció:</strong> 12-18 mesos sense ingressos durant obra</li>
          <li>• <strong>Risc construcció:</strong> Possibles sobrecostos o retards</li>
          <li>• <strong>Plusvàlua construcció:</strong> Valor final pot superar cost construcció si ben executat (20-40% potencial)</li>
          <li>• <strong>Posicionament:</strong> Pousada nova de luxe permet tarifes més altes que propietat existent</li>
        </ul>
      </div>
    </div>
  );
};

export default BrazilLandConstructionCAGR;
