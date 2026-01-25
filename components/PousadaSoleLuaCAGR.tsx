'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PousadaSoleLuaCAGR = () => {
  const [revalorizacion, setRevalorizacion] = useState(10);
  
  const precioCompraEuros = 340000;
  
  const impuestosCompraBrasil = 0.04;
  const impuestoVentaBrasil = 0.15;
  const inversionTotalEuros = precioCompraEuros * (1 + impuestosCompraBrasil);
  
  const habitaciones = 15;
  const diariaPorHabitacion = 50;
  const ocupacionAnual = 0.55;
  
  const ingresosBrutosAnuales = habitaciones * diariaPorHabitacion * 365 * ocupacionAnual;
  
  const simplesNacional = 0.11;
  const costosOperativos = 0.40;
  const gastosMantenimiento = 8000;
  const gestoriaAnual = 2000;
  const retencionRepatriacion = 0.15;
  const impuestoSociedadesEspana = 0.25;
  
  const calcularRentabilidadInmuebleBruta = () => {
    return revalorizacion;
  };
  
  const calcularRentabilidadInmuebleNeta = (años: number) => {
    const revalorizacionDecimal = revalorizacion / 100;
    const valorInmueble = precioCompraEuros * Math.pow(1 + revalorizacionDecimal, años);
    
    const gananciaCapital = valorInmueble - precioCompraEuros;
    const impuestoGanancia = gananciaCapital > 0 ? gananciaCapital * impuestoVentaBrasil : 0;
    
    const valorVentaNeto = valorInmueble - impuestoGanancia;
    
    const cagrInmueble = (Math.pow(valorVentaNeto / inversionTotalEuros, 1 / años) - 1) * 100;
    
    return cagrInmueble;
  };
  
  const crecimientoNegocioAnual = 0.05;
  
  const calcularRentabilidadNegocioBruta = (años: number) => {
    const ingresosConCrecimiento = ingresosBrutosAnuales * Math.pow(1 + crecimientoNegocioAnual, años - 1);
    return (ingresosConCrecimiento / precioCompraEuros) * 100;
  };
  
  const calcularRentabilidadNegocioNeta = (años: number) => {
    let valorAcumulado = precioCompraEuros;
    
    for (let i = 1; i <= años; i++) {
      const ingresosAno = ingresosBrutosAnuales * Math.pow(1 + crecimientoNegocioAnual, i - 1);
      const impuestoSimples = ingresosAno * simplesNacional;
      const costos = ingresosAno * costosOperativos;
      
      const beneficioBruto = ingresosAno - impuestoSimples - costos - gastosMantenimiento - gestoriaAnual;
      
      const retencionBrasil = beneficioBruto > 0 ? beneficioBruto * retencionRepatriacion : 0;
      const beneficioTrasRetencion = beneficioBruto - retencionBrasil;
      
      const impuestoEspana = beneficioTrasRetencion > 0 ? beneficioTrasRetencion * impuestoSociedadesEspana : 0;
      const beneficioNeto = beneficioTrasRetencion - impuestoEspana;
      
      valorAcumulado += beneficioNeto;
    }
    
    const cagrNegocio = (Math.pow(valorAcumulado / precioCompraEuros, 1 / años) - 1) * 100;
    return cagrNegocio;
  };
  
  const calcularRentabilidadCombinada = (años: number) => {
    const rentInmueble = calcularRentabilidadInmuebleNeta(años);
    const rentNegocio = calcularRentabilidadNegocioNeta(años);
    
    return rentInmueble + rentNegocio;
  };
  
  const inflacionEspana50Anos = 2.4;
  
  const data = [];
  for (let año = 1; año <= 25; año++) {
    data.push({
      año: año,
      inmuebleBruta: calcularRentabilidadInmuebleBruta(),
      inmuebleNeta: calcularRentabilidadInmuebleNeta(año),
      negocioBruta: calcularRentabilidadNegocioBruta(año),
      negocioNeta: calcularRentabilidadNegocioNeta(año),
      combinadaNeta: calcularRentabilidadCombinada(año),
      inflacion: inflacionEspana50Anos
    });
  }
  
  return (
    <div className="w-full p-6 bg-slate-800 rounded-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Rentabilitat Pousada Sol e Lua (Negoci Existent)
        </h2>
        <div className="text-sm text-slate-300 space-y-1 mb-4">
          <p><strong>Preu compra:</strong> {precioCompraEuros.toLocaleString()}€</p>
          <p><strong>Inversió total (amb impostos compra 4%):</strong> {Math.round(inversionTotalEuros).toLocaleString()}€</p>
          <p><strong>Pousada operativa:</strong> {habitaciones} habitacions</p>
          <p><strong>Ingressos estimats:</strong> {Math.round(ingresosBrutosAnuales).toLocaleString()}€/any ({habitaciones} hab × {diariaPorHabitacion}€/nit × {ocupacionAnual * 100}% ocupació)</p>
          <p><strong>Creciment negoci:</strong> 5% anual compost sobre ingressos acumulats</p>
          <p><strong>Impostos Brasil:</strong> Simples Nacional 11% | Venda 15%</p>
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
            name="Inflació Espanya 50 anys (2,4%)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
        <h3 className="font-semibold text-white mb-2">Interpretació:</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li>• <strong>Immoble BRUT (blau clar):</strong> Revalorització {revalorizacion}% anual sense impostos</li>
          <li>• <strong>Immoble NET (blau):</strong> Revalorització després d&apos;impostos compra (4%) i venda (15%)</li>
          <li>• <strong>Negoci BRUT (taronja clar):</strong> Ingressos bruts / inversió amb creixement 5% anual compost</li>
          <li>• <strong>Negoci NET (taronja):</strong> Benefici net després de Simples Nacional (11%), costos operatius (40%), manteniment, gestoria, retenció Brasil (15%) i impostos Espanya (25%) amb creixement compost</li>
          <li>• <strong>TOTAL NET (verd):</strong> Suma de rendiment immoble + rendiment negoci = rendiment total real</li>
          <li>• El rendiment del negoci és constant (línia horitzontal) mentre que el de l&apos;immoble millora amb els anys per dilució dels costos inicials</li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
        <h3 className="font-semibold text-white mb-2">📊 Resum rendiments actuals:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <p><strong>Rendiment immoble net (any 10):</strong> {calcularRentabilidadInmuebleNeta(10).toFixed(2)}%</p>
            <p><strong>Rendiment negoci net (any 10):</strong> {calcularRentabilidadNegocioNeta(10).toFixed(2)}%</p>
          </div>
          <div>
            <p><strong>Rendiment total net (any 10):</strong> {calcularRentabilidadCombinada(10).toFixed(2)}%</p>
            <p><strong>Benefici net anual (any 10):</strong> ~{Math.round((calcularRentabilidadNegocioNeta(10) / 100) * precioCompraEuros).toLocaleString()}€</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PousadaSoleLuaCAGR;
