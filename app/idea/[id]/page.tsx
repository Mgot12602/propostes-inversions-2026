'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { InvestmentCategory, InvestmentIdea } from '@/types/investment';
import RealEstateCAGR from '@/components/RealEstateCAGR';
import FinancialProductsCAGR from '@/components/FinancialProductsCAGR';
import PousadaSoleLuaCAGR from '@/components/PousadaSoleLuaCAGR';
import BrazilLandConstructionCAGR from '@/components/BrazilLandConstructionCAGR';

export default function IdeaPage({ params }: { params: Promise<{ id: string }> }) {
  const [idea, setIdea] = useState<InvestmentIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const loadIdea = async () => {
      try {
        const response = await fetch('/api/investments');
        const data: InvestmentCategory[] = await response.json();
        const allIdeas = data.flatMap((category) => category.ideas);
        const foundIdea = allIdeas.find((i) => i.id === id);
        setIdea(foundIdea || null);
        setLoading(false);
      } catch (error) {
        console.error('Error loading idea:', error);
        setLoading(false);
      }
    };

    loadIdea();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Navbar />
        <div className="text-white text-xl">Carregant...</div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Navbar />
        <div className="text-white text-xl">Idea no trobada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="ml-20">
        <div className="container mx-auto px-8 py-12 max-w-6xl">
          <Link href="/">
            <Button variant="ghost" className="mb-8 text-white hover:bg-slate-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tornar a la pàgina principal
            </Button>
          </Link>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 px-10 py-16 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 relative z-10">{idea.title}</h1>
              <div className="flex flex-wrap gap-4 items-center relative z-10">
                <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white text-xl px-6 py-3 border border-white/30">
                  Inversió: {idea.investment}
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xl px-6 py-3 shadow-lg">
                  Retorn: {idea.annualReturn}
                </Badge>
              </div>
            </div>

            <div className="px-10 py-10">
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6">Descripció</h2>
                <p className="text-xl text-slate-300 leading-relaxed">{idea.description}</p>
              </section>

              {idea.id === 'inversio-catalunya' && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6">Anàlisi de Rentabilitat</h2>
                  <RealEstateCAGR />
                </section>
              )}

              {idea.id === 'etf-msci-world' && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6">Anàlisi de Rentabilitat</h2>
                  <FinancialProductsCAGR productType="etf" />
                </section>
              )}

              {idea.id === 'bonos-aaa' && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6">Anàlisi de Rentabilitat</h2>
                  <FinancialProductsCAGR productType="bonds" />
                </section>
              )}

              {idea.id === 'hotel-pousada' && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6">Anàlisi de Rentabilitat</h2>
                  <PousadaSoleLuaCAGR />
                </section>
              )}

              {idea.id === 'terreny-mar' && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6">Anàlisi de Rentabilitat</h2>
                  <BrazilLandConstructionCAGR />
                </section>
              )}

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-8">Anàlisi</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-green-500/30 bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-green-400 flex items-center gap-3 text-2xl">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Check className="h-6 w-6" />
                        </div>
                        Avantatges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {idea.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-4">
                            <Check className="h-6 w-6 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-200 text-lg">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-red-500/30 bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-red-400 flex items-center gap-3 text-2xl">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <X className="h-6 w-6" />
                        </div>
                        Inconvenients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {idea.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-4">
                            <X className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-200 text-lg">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </section>


              <div className="flex justify-center pt-8">
                <Link href="/">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-6 text-lg shadow-xl">
                    Explorar més inversions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
