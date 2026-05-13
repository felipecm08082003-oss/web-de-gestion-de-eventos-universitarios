'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

interface Usuario {
  id: string;
  nombre: string;
  rol: string;
}

export default function CrearEventoPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '10:00',
    ubicacion: '',
    capacidad: '',
    categoria: 'Tecnología',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.rol !== 'ORGANIZADOR') {
        router.push('/dashboard');
        return;
      }
      setUsuario({
        id: payload.id,
        nombre: payload.nombre,
        rol: payload.rol,
      });
    } catch (error) {
      console.error('Error parsing token:', error);
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'No se pudo crear el evento.');
        return;
      }

      router.push('/eventos?misEventos=true');
    } catch (error) {
      console.error('Error creando evento:', error);
      setError('Ocurrió un error al crear el evento.');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return null;
  }

  const categorias = ['Tecnología', 'Profesional', 'Desarrollo', 'Deportes', 'Cultura', 'Otro'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={usuario} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/eventos" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4">
            ← Volver a eventos
          </Link>
          <h1 className="text-4xl font-bold text-white">Crear nuevo evento</h1>
          <p className="text-slate-400 mt-2">Registra un evento nuevo y aparecerá inmediatamente en la lista pública.</p>
        </div>

        <div className="bg-slate-800 rounded-3xl shadow-xl border border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-100">{error}</div>}
            <div>
              <label className="block text-white font-semibold mb-2">Título del evento *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: Seminario de Tecnología Web"
                required
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe tu evento en detalle..."
                required
                rows={5}
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Fecha *</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700 text-white rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Hora *</label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-700 text-white rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Ubicación *</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                placeholder="Ej: Aula 101 - Edificio A"
                required
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold mb-2">Capacidad *</label>
                <input
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  placeholder="Ej: 50"
                  required
                  min="1"
                  className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Categoría *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full bg-slate-700 text-white rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Creando evento...' : 'Crear evento'}
              </button>
              <Link
                href="/eventos"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-2xl text-center transition-all"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-slate-950 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-slate-400 text-center">© 2026 EventosUni. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
