'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { InvestmentCategory } from '@/types/investment';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [investmentData, setInvestmentData] = useState<InvestmentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/investments')
      .then(res => res.json())
      .then(data => {
        setInvestmentData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading investments:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Navbar />
        <div className="text-white text-xl">Carregant...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      
      <div className="ml-20">
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073')] bg-cover bg-center"></div>
          
          <div className="relative z-20 container mx-auto px-8 max-w-7xl">
            <div className="text-center">
              <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                Idees per Inversions 2026
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 py-16 max-w-7xl">

          <div className="mb-12">
            <Accordion type="single" collapsible className="space-y-6">
              {investmentData.map((category) => (
                <AccordionItem
                  key={category.id}
                  value={category.id}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-8 py-6 hover:bg-slate-700/50 text-3xl font-bold text-white transition-all">
                    {category.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-8">
                    <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                      {category.ideas.map((idea) => (
                        <Card key={idea.id} className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-slate-600 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          <CardHeader className="relative">
                            <CardTitle className="text-xl text-white group-hover:text-blue-300 transition-colors">{idea.title}</CardTitle>
                            <CardDescription className="line-clamp-2 text-slate-300">
                              {idea.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="relative">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                                <span className="text-sm font-medium text-slate-400">Inversió:</span>
                                <span className="text-xl font-bold text-white">{idea.investment}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                                <span className="text-sm font-medium text-slate-400">Retorn anual:</span>
                                <Badge variant="default" className="bg-gradient-to-r from-green-600 to-green-500 text-white text-base px-3 py-1">
                                  {idea.annualReturn}
                                </Badge>
                              </div>
                              <Link href={`/idea/${idea.id}`}>
                                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg">
                                  Veure detalls
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
