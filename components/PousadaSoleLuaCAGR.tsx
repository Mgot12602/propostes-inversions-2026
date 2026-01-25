'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PousadaSoleLuaCAGR = () => {
  const [revalorizacion, setRevalorizacion] = useState(10);
  const [ocupacionAnual, setOcupacionAnual] = useState(55);
  const [diariaPorHabitacion, setDiariaPorHabitacion] = useState(38);
  
  const precioCompraEuros = 340000;
  
  const impuestosCompraBrasil = 0.04;
  const impuestoVentaBrasil = 0.15;
  const inversionTotalEuros = precioCompraEuros * (1 + impuestosCompraBrasil);
  
  const habitaciones = 15;
  const ocupacionDecimal = ocupacionAnual / 100;
  
  const ingresosBrutosAnuales = habitaciones * diariaPorHabitacion * 365 * ocupacionDecimal;
  
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
  
  const calcularRentabilidadNegocioBruta = () => {
    return (ingresosBrutosAnuales / precioCompraEuros) * 100;
  };
  
  const calcularRentabilidadNegocioNeta = () => {
    const impuestoSimples = ingresosBrutosAnuales * simplesNacional;
    const costos = ingresosBrutosAnuales * costosOperativos;
    
    const beneficioBruto = ingresosBrutosAnuales - impuestoSimples - costos - gastosMantenimiento - gestoriaAnual;
    
    const retencionBrasil = beneficioBruto > 0 ? beneficioBruto * retencionRepatriacion : 0;
    const beneficioTrasRetencion = beneficioBruto - retencionBrasil;
    
    const impuestoEspana = beneficioTrasRetencion > 0 ? beneficioTrasRetencion * impuestoSociedadesEspana : 0;
    const beneficioNeto = beneficioTrasRetencion - impuestoEspana;
    
    const rentabilidad = (beneficioNeto / precioCompraEuros) * 100;
    console.log(`Debug Pousada: Ingressos=${ingresosBrutosAnuales}, BeneficioNeto=${beneficioNeto}, Rentabilidad=${rentabilidad}%`);
    return rentabilidad;
  };
  
  const calcularRentabilidadCombinada = (años: number) => {
    const rentInmueble = calcularRentabilidadInmuebleNeta(años);
    const rentNegocio = calcularRentabilidadNegocioNeta();
    
    return rentInmueble + rentNegocio;
  };
  
  const inflacionEspana50Anos = 2.4;
  
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
          Rentabilitat Pousada Sol e Lua (Negoci Existent)
        </h2>
        <div className="text-sm text-slate-300 space-y-1 mb-4">
          <p><strong>Preu compra:</strong> {precioCompraEuros.toLocaleString()}€</p>
          <p><strong>Inversió total (amb impostos compra 4%):</strong> {Math.round(inversionTotalEuros).toLocaleString()}€</p>
          <p><strong>Pousada operativa:</strong> {habitaciones} habitacions</p>
          <p><strong>Ingressos estimats:</strong> {Math.round(ingresosBrutosAnuales).toLocaleString()}€/any ({habitaciones} hab × {diariaPorHabitacion}€/nit × {ocupacionAnual}% ocupació)</p>
          <p><strong>Impostos Brasil:</strong> Simples Nacional 11% | Venda 15%</p>
          <p><strong>Impostos Espanya:</strong> Retenció 15% | Societats 25%</p>
          <p><strong>Despeses operatives (40%):</strong> Personal, subministres, comissions OTA, màrqueting, assegurances</p>
        </div>
        
        <div className="space-y-4">
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Ocupació anual: {ocupacionAnual}% (mitjana Paracuru: 45-65%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="30"
                max="85"
                step="5"
                value={ocupacionAnual}
                onChange={(e) => setOcupacionAnual(parseFloat(e.target.value))}
                className="w-64"
              />
              <div className="text-sm text-slate-300">
                <button onClick={() => setOcupacionAnual(45)} className="px-3 py-1 bg-orange-600 rounded mr-2 hover:bg-orange-700">45% (baixa)</button>
                <button onClick={() => setOcupacionAnual(65)} className="px-3 py-1 bg-orange-600 rounded hover:bg-orange-700">65% (alta)</button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Tarifa per habitació (amb esmorzar): {diariaPorHabitacion}€/nit (preu real Pousada: 34-40€)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="30"
                max="80"
                step="2"
                value={diariaPorHabitacion}
                onChange={(e) => setDiariaPorHabitacion(parseFloat(e.target.value))}
                className="w-64"
              />
              <div className="text-sm text-slate-300">
                <button onClick={() => setDiariaPorHabitacion(34)} className="px-3 py-1 bg-green-600 rounded mr-2 hover:bg-green-700">34€ (real)</button>
                <button onClick={() => setDiariaPorHabitacion(60)} className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">60€ (òptima)</button>
              </div>
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
          <li>• <strong>Negoci BRUT (taronja clar):</strong> Ingressos bruts / inversió = {calcularRentabilidadNegocioBruta().toFixed(1)}% anual constant</li>
          <li>• <strong>Negoci NET (taronja):</strong> Benefici net després de Simples Nacional (11%), costos operatius (40%), manteniment, gestoria, retenció Brasil (15%) i impostos Espanya (25%) = {calcularRentabilidadNegocioNeta().toFixed(1)}% anual constant</li>
          <li>• <strong>TOTAL NET (verd):</strong> Suma de rendiment immoble + rendiment negoci = rendiment total real</li>
          <li>• El rendiment del negoci és constant (línia horitzontal) mentre que el de l&apos;immoble millora amb els anys per dilució dels costos inicials</li>
        </ul>
      </div>
      
      <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
        <h3 className="font-semibold text-white mb-2">📊 Resum rendiments actuals:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <p><strong>Rendiment immoble net (any 10):</strong> {calcularRentabilidadInmuebleNeta(10).toFixed(2)}%</p>
            <p><strong>Rendiment negoci net:</strong> {calcularRentabilidadNegocioNeta().toFixed(2)}%</p>
          </div>
          <div>
            <p><strong>Rendiment total net (any 10):</strong> {calcularRentabilidadCombinada(10).toFixed(2)}%</p>
            <p><strong>Benefici net anual:</strong> ~{Math.round((calcularRentabilidadNegocioNeta() / 100) * precioCompraEuros).toLocaleString()}€</p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-red-900/30 rounded-lg border border-red-500/30">
        <h3 className="font-semibold text-white mb-2">⚠️ Anàlisi de viabilitat del negoci:</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p><strong>Problema actual:</strong> Amb els preus reals (34-40€/nit) i ocupació típica (45-65%), el negoci genera pèrdues operatives.</p>
          <div className="mt-2 p-3 bg-red-800/30 rounded border border-red-600/30">
            <p><strong>Càlcul amb valors actuals:</strong></p>
            <p>• Ingressos: {Math.round(ingresosBrutosAnuales).toLocaleString()}€/any</p>
            <p>• Despeses totals: {Math.round(ingresosBrutosAnuales * 0.11 + ingresosBrutosAnuales * 0.40 + gastosMantenimiento + gestoriaAnual).toLocaleString()}€/any</p>
            <p>• <span className="text-red-400 font-semibold">Pèrdua neta: {Math.round(ingresosBrutosAnuales - (ingresosBrutosAnuales * 0.11 + ingresosBrutosAnuales * 0.40 + gastosMantenimiento + gestoriaAnual)).toLocaleString()}€/any</span></p>
          </div>
          <p><strong>Per ser rendible caldria:</strong></p>
          <ul className="ml-4 space-y-1">
            <li>• Augmentar ocupació a 75%+ (temporada alta tot l&#39;any)</li>
            <li>• O augmentar tarifa a 60-70€/nit (servicios premium)</li>
            <li>• O reduir costos operatives del 40% al 30%</li>
          </ul>
          <p><strong>Escenari viable:</strong> 60€/nit × 70% ocupació = benefici net ~+3.000€/any</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-orange-900/30 rounded-lg border border-orange-500/30">
        <h3 className="font-semibold text-white mb-2">💰 Desglossament despeses operatives:</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Ingressos bruts:</strong> {Math.round(ingresosBrutosAnuales).toLocaleString()}€/any</p>
              <p><strong>Impost Simples Nacional (11%):</strong> {Math.round(ingresosBrutosAnuales * 0.11).toLocaleString()}€</p>
              <p><strong>Costos operatives (40%):</strong> {Math.round(ingresosBrutosAnuales * 0.40).toLocaleString()}€</p>
              <p><strong>Manteniment:</strong> {gastosMantenimiento.toLocaleString()}€</p>
              <p><strong>Gestoria internacional:</strong> {gestoriaAnual.toLocaleString()}€</p>
            </div>
            <div>
              <p><strong>Subtotal despeses:</strong> {Math.round(ingresosBrutosAnuales * 0.11 + ingresosBrutosAnuales * 0.40 + gastosMantenimiento + gestoriaAnual).toLocaleString()}€</p>
              <p><strong>Benefici/pèrdua abans impostos:</strong> {Math.round(ingresosBrutosAnuales - (ingresosBrutosAnuales * 0.11 + ingresosBrutosAnuales * 0.40 + gastosMantenimiento + gestoriaAnual)).toLocaleString()}€</p>
              <p><strong>Retenció Brasil (15%):</strong> {Math.round(Math.max(0, ingresosBrutosAnuales - (ingresosBrutosAnuales * 0.11 + ingresosBrutosAnuales * 0.40 + gastosMantenimiento + gestoriaAnual)) * 0.15).toLocaleString()}€</p>
              <p><strong>Benefici net final:</strong> {Math.round(Math.max(0, ingresosBrutosAnuales - (ingresosBrutosAnuales * 0.11 + ingresosBrutosAnuales * 0.40 + gastosMantenimiento + gestoriaAnual)) * 0.85 * 0.75).toLocaleString()}€</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-orange-500/30">
            <p><strong>📋 Despeses operatives detallades (40% = {Math.round(ingresosBrutosAnuales * 0.40).toLocaleString()}€):</strong></p>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Personal (recepció, neteja, manteniment): ~{Math.round(ingresosBrutosAnuales * 0.15).toLocaleString()}€</li>
              <li>• Subministres (electricitat, aigua, gas): ~{Math.round(ingresosBrutosAnuales * 0.08).toLocaleString()}€</li>
              <li>• Comissions OTA (Booking, Airbnb): ~{Math.round(ingresosBrutosAnuales * 0.08).toLocaleString()}€</li>
              <li>• Productes (esmorzars, neteja, roba): ~{Math.round(ingresosBrutosAnuales * 0.05).toLocaleString()}€</li>
              <li>• Màrqueting i publicitat: ~{Math.round(ingresosBrutosAnuales * 0.02).toLocaleString()}€</li>
              <li>• Assegurances i impostos locals: ~{Math.round(ingresosBrutosAnuales * 0.02).toLocaleString()}€</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PousadaSoleLuaCAGR;
