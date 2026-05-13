'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import EventCard from '@/app/components/EventCard';
import Link from 'next/link';

interface Usuario {
  id: string;
  nombre: string;
  rol: string;
}

interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  capacidad: number;
  asistentes: number;
  categoria: string;
  slug: string;
  estado: string;
  organizadorId: string;
}

export default function EventosPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState('proximos');
  const [misEventos, setMisEventos] = useState(false);

  const categorias = ['Todos', 'Tecnología', 'Profesional', 'Desarrollo', 'Deportes', 'Cultura'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsuario({
          id: payload.id,
          nombre: payload.nombre,
          rol: payload.rol,
        });
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  useEffect(() => {
    cargarEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [misEventos]);

  const cargarEventos = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = misEventos ? '/api/eventos?misEventos=true' : '/api/eventos';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error cargando eventos');
        setEventos([]);
      } else {
        setEventos(data);
      }
    } catch (err) {
      console.error('Error cargando eventos:', err);
      setError('No se pudieron cargar los eventos. Intenta de nuevo.');
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarEvento = async (eventoId: string) => {
    if (!confirm('¿Seguro que quieres eliminar este evento?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/eventos/${eventoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.error || 'No se pudo eliminar el evento');
        return;
      }

      cargarEventos();
      alert('Evento eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Error al eliminar el evento');
    }
  };

  const eventosFiltrados = eventos
    .filter(evento => {
      const matchCategoria = filtroCategoria === 'Todos' || evento.categoria === filtroCategoria;
      const matchBusqueda =
        evento.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return matchCategoria && matchBusqueda;
    })
    .sort((a, b) => {
      if (ordenar === 'proximos') {
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      }
      return b.asistentes - a.asistentes;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={usuario} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {misEventos ? 'Mis eventos' : 'Explora eventos'}
            </h1>
            <p className="text-slate-400 max-w-2xl">
              {misEventos
                ? 'Gestiona tus eventos creados y modifícalos cuando lo necesites.'
                : 'Ve todos los eventos públicos registrados en el sistema.'
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {usuario?.rol === 'ORGANIZADOR' && (
              <button
                onClick={() => setMisEventos(!misEventos)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  misEventos ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {misEventos ? 'Ver todos' : 'Mis eventos'}
              </button>
            )}
            {usuario?.rol === 'ORGANIZADOR' && (
              <button
                onClick={() => router.push('/crear-evento')}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                + Nuevo evento
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-3xl border border-slate-700/70 shadow-xl shadow-slate-950/20 p-6 mb-8">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-white font-semibold mb-2">Buscar</label>
                <input
                  type="text"
                  placeholder="Busca por nombre o descripción..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Ordenar por</label>
                <select
                  value={ordenar}
                  onChange={e => setOrdenar(e.target.value)}
                  className="w-full bg-slate-700 text-white rounded-2xl px-4 py-3 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="proximos">Próximos primero</option>
                  <option value="poblados">Más registrados</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
              <div>
                <label className="block text-white font-semibold mb-2">Filtrar por categoría</label>
                <div className="flex flex-wrap items-start gap-2">
                  {categorias.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFiltroCategoria(cat)}
                      className={`inline-flex flex-none whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                        filtroCategoria === cat
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end">
                <span className="text-slate-400 text-sm">
                  {eventos.length} evento{eventos.length !== 1 ? 's' : ''} cargado{eventos.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-slate-700 mx-auto mb-4"></div>
              <p className="text-slate-300">Cargando eventos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-6 text-center text-red-100">
            {error}
          </div>
        ) : eventosFiltrados.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-slate-800 border border-slate-700/70">
            <span className="text-6xl mb-4 block">😕</span>
            <h2 className="text-2xl font-bold text-white mb-2">No encontramos ningún evento</h2>
            <p className="text-slate-400 mb-6">
              Ajusta el filtro o prueba otra búsqueda.
            </p>
            <button
              onClick={() => {
                setBusqueda('');
                setFiltroCategoria('Todos');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-all"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {eventosFiltrados.map(evento => (
              <div key={evento.id} className="relative">
                <EventCard {...evento} />
                {usuario?.rol === 'ORGANIZADOR' && misEventos && evento.organizadorId === usuario.id && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Link
                      href={`/editar-evento/${evento.id}`}
                      className="bg-slate-900/90 text-white p-2 rounded-xl border border-blue-500/30 shadow-lg hover:bg-blue-600 transition-colors"
                      title="Editar evento"
                    >
                      ✏️
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEliminarEvento(evento.id)}
                      className="bg-slate-900/90 text-white p-2 rounded-xl border border-red-500/30 shadow-lg hover:bg-red-600 transition-colors"
                      title="Eliminar evento"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-slate-400 text-center">© 2026 EventosUni. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
