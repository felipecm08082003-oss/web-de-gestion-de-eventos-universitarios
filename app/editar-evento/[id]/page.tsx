'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

interface Usuario {
  id: string;
  nombre: string;
  rol: string;
}

interface FormData {
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ubicacion: string;
  capacidad: string;
  categoria: string;
}

export default function EditarEventoPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [eventoNoEncontrado, setEventoNoEncontrado] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
        router.push('/eventos');
        return;
      }

      setUsuario({
        id: payload.id,
        nombre: payload.nombre,
        rol: payload.rol,
      });
    } catch (err) {
      console.error('Error parsing token:', err);
      router.push('/login');
    }
  }, [router]);

  const params = useParams() as { id?: string };

  useEffect(() => {
    if (!usuario) return;

    const cargarEvento = async () => {
      if (!params?.id) {
        setError('ID de evento inválido.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setEventoNoEncontrado(false);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/eventos/${params.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setEventoNoEncontrado(true);
          } else {
            const data = await response.json();
            setError(data.error || 'No se pudo cargar el evento.');
          }
          return;
        }

        const evento = await response.json();
        const fecha = new Date(evento.fecha);
        const hora = fecha.toISOString().slice(11, 16);

        setFormData({
          titulo: evento.titulo || '',
          descripcion: evento.descripcion || '',
          fecha: fecha.toISOString().slice(0, 10),
          hora,
          ubicacion: evento.ubicacion || '',
          capacidad: evento.capacidad?.toString() || '',
          categoria: evento.categoria || 'Tecnología',
        });
      } catch (err) {
        console.error('Error cargando evento:', err);
        setError('Ocurrió un error al cargar el evento.');
      } finally {
        setLoading(false);
      }
    };

    cargarEvento();
  }, [usuario, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/eventos/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          fecha: formData.fecha,
          hora: formData.hora,
          ubicacion: formData.ubicacion,
          capacidad: formData.capacidad,
          categoria: formData.categoria,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'No se pudo actualizar el evento.');
        return;
      }

      router.push('/eventos?misEventos=true');
    } catch (err) {
      console.error('Error actualizando evento:', err);
      setError('Ocurrió un error al actualizar el evento.');
    } finally {
      setSaving(false);
    }
  };

  if (!usuario) {
    return null;
  }

  if (!params?.id) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-xl bg-slate-900 rounded-3xl border border-slate-700 p-10 text-center">
          <h1 className="text-3xl font-bold mb-4">ID de evento inválido</h1>
          <p className="text-slate-400 mb-6">No se encontró el identificador del evento.</p>
          <Link href="/eventos" className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all">
            Volver a eventos
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-slate-700 mx-auto mb-4"></div>
          <p>Cargando datos del evento...</p>
        </div>
      </div>
    );
  }

  if (eventoNoEncontrado) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="max-w-xl bg-slate-900 rounded-3xl border border-slate-700 p-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Evento no encontrado</h1>
          <p className="text-slate-400 mb-6">El evento que intentas editar no existe o fue eliminado.</p>
          <Link href="/eventos" className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all">
            Volver a eventos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={usuario} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/eventos" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-4">
            ← Volver a eventos
          </Link>
          <h1 className="text-4xl font-bold text-white">Editar evento</h1>
          <p className="text-slate-400 mt-2">Actualiza la información del evento y guarda los cambios.</p>
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
                required
                className="w-full bg-slate-700 text-white rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Descripción *</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={5}
                required
                className="w-full bg-slate-700 text-white rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
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
                required
                className="w-full bg-slate-700 text-white rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
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
                  required
                  min="1"
                  className="w-full bg-slate-700 text-white rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
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
                  <option value="Tecnología">Tecnología</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Desarrollo">Desarrollo</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? 'Guardando cambios...' : 'Guardar cambios'}
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
