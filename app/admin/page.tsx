'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { investmentData } from '@/data/investments';
import { InvestmentIdea } from '@/types/investment';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ArrowLeft, Edit, Upload, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingIdea, setEditingIdea] = useState<InvestmentIdea | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleEditClick = (idea: InvestmentIdea) => {
    setEditingIdea(idea);
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const investment = formData.get('investment') as string;
    const annualReturn = formData.get('return') as string;
    const pros = (formData.get('pros') as string).split('\n').filter(p => p.trim());
    const cons = (formData.get('cons') as string).split('\n').filter(c => c.trim());

    if (!editingIdea) return;

    try {
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: editingIdea.category,
          ideaId: editingIdea.id,
          updatedIdea: {
            title,
            description,
            investment,
            annualReturn,
            pros,
            cons,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      setIsDialogOpen(false);
      toast.success('Canvis desats correctament!', {
        description: 'Les dades s\'han actualitzat permanentment.',
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error('Error al desar els canvis', {
        description: 'Si us plau, torna-ho a intentar.',
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`${files.length} fitxer(s) seleccionat(s)`, {
        description: Array.from(files).map(f => f.name).join(', '),
      });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2026') {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      toast.success('Autenticació correcta!');
    } else {
      toast.error('Contrasenya incorrecta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    toast.success('Sessió tancada');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Navbar />
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Accés Administrador</CardTitle>
            <CardDescription>Introdueix la contrasenya per accedir al panell d&apos;administració</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Contrasenya</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introdueix la contrasenya"
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Tornar
                </Button>
              </Link>
            </form>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Contrasenya per defecte: admin2026
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="ml-20">
        <div className="container mx-auto px-8 py-12 max-w-7xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-bold text-white mb-3">Panell d&apos;Administració</h1>
              <p className="text-slate-300 text-lg">Gestiona el contingut de les idees d&apos;inversió</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleLogout} variant="outline" className="bg-red-600 text-white border-red-500 hover:bg-red-700">
                Tancar sessió
              </Button>
              <Link href="/">
                <Button variant="outline" className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Tornar
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            {investmentData.map((category) => (
              <Card key={category.id} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-3xl text-white">{category.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-base">{category.ideas.length} idees en aquesta categoria</CardDescription>
                </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                    >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-white">{idea.title}</h3>
                          <p className="text-sm text-slate-300 mt-1">{idea.description.substring(0, 100)}...</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-xs text-slate-400">Inversió: {idea.investment}</span>
                            <span className="text-xs text-slate-400">Retorn: {idea.annualReturn}</span>
                          </div>
                        </div>
                      <div className="flex gap-2 ml-4">
                        <Dialog open={isDialogOpen && editingIdea?.id === idea.id} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700"
                              onClick={() => handleEditClick(idea)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Editar: {idea.title}</DialogTitle>
                              <DialogDescription>
                                Modifica els camps que vulguis actualitzar
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSaveChanges} className="space-y-4 py-4">
                              <div>
                                <Label htmlFor="title">Títol</Label>
                                <Input id="title" name="title" defaultValue={idea.title} />
                              </div>
                              <div>
                                <Label htmlFor="description">Descripció</Label>
                                <Textarea id="description" name="description" defaultValue={idea.description} rows={4} />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="investment">Inversió</Label>
                                  <Input id="investment" name="investment" defaultValue={idea.investment} />
                                </div>
                                <div>
                                  <Label htmlFor="return">Retorn Anual</Label>
                                  <Input id="return" name="return" defaultValue={idea.annualReturn} />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="pros">Avantatges (un per línia)</Label>
                                <Textarea id="pros" name="pros" defaultValue={idea.pros.join('\n')} rows={5} />
                              </div>
                              <div>
                                <Label htmlFor="cons">Inconvenients (un per línia)</Label>
                                <Textarea id="cons" name="cons" defaultValue={idea.cons.join('\n')} rows={5} />
                              </div>
                              <div>
                                <Label>Galeria d&apos;imatges</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  {idea.images.map((img, idx) => (
                                    <div
                                      key={idx}
                                      className="aspect-video bg-slate-200 rounded flex items-center justify-center relative group"
                                    >
                                      <span className="text-xs text-slate-500">Imatge {idx + 1}</span>
                                      <button type="button" className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                  <button 
                                    onClick={handleUploadClick}
                                    type="button"
                                    className="aspect-video bg-blue-100 rounded flex items-center justify-center border-2 border-dashed border-blue-300 hover:bg-blue-200 transition-colors"
                                  >
                                    <Upload className="h-6 w-6 text-blue-600" />
                                  </button>
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                  />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                  Clica per pujar noves imatges o vídeos
                                </p>
                              </div>
                              <Button type="submit" className="w-full">Desar canvis</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                          <Link href={`/idea/${idea.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-600">
                              Veure
                            </Button>
                          </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-dashed border-2 border-blue-500 bg-blue-900/20">
            <CardContent className="flex items-center justify-center py-12">
              <Button variant="outline" className="text-blue-400 border-blue-500 hover:bg-blue-900/50">
                + Afegir nova idea d&apos;inversió
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
