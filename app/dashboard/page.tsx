'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import EventStats from '@/app/components/EventStats';
import Link from 'next/link';

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  id: string;
  carrera?: string | null;
  matricula?: string | null;
}

interface MisEvento {
  id: string;
  titulo: string;
  fecha: string;
  asistentes: number;
  capacidad: number;
  estado: string;
}

interface RegistroItem {
  id: string;
  estado: string;
  fechaRegistro: string;
  evento: {
    id: string;
    titulo: string;
    fecha: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [misEventos, setMisEventos] = useState<MisEvento[]>([]);
  const [misRegistros, setMisRegistros] = useState<RegistroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumen');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const authRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!authRes.ok) {
          router.push('/login');
          return;
        }

        const authData = await authRes.json();
        setUsuario(authData.usuario);

        if (authData.usuario.rol === 'ORGANIZADOR') {
          const eventosRes = await fetch('/api/eventos?misEventos=true', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const eventosData = await eventosRes.json();
          setMisEventos(eventosData || []);
        }

        const registrosRes = await fetch('/api/registros', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (registrosRes.ok) {
          const registrosData = await registrosRes.json();
          setMisRegistros(Array.isArray(registrosData) ? registrosData : []);
        } else {
          console.error('Error cargando registros:', await registrosRes.text());
          setMisRegistros([]);
        }
      } catch (err) {
        console.error('Error cargando dashboard:', err);
        setError('No se pudo cargar tu información. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={usuario} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            ¡Hola, {usuario.nombre}! 👋
          </h1>
          <p className="text-slate-400">Bienvenido a tu dashboard</p>
          {error && (
            <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200">
              {error}
            </div>
          )}
        </div>

        {usuario.rol === 'ORGANIZADOR' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <EventStats
              label="Mis eventos"
              value={misEventos.length}
              icon="📅"
              color="blue"
            />
            <EventStats
              label="Total de registros"
              value={misEventos.reduce((sum, e) => sum + e.asistentes, 0)}
              icon="👥"
              color="green"
            />
            <EventStats
              label="Eventos publicados"
              value={misEventos.filter(e => e.estado === 'PUBLICADO').length}
              icon="✅"
              color="purple"
            />
            <EventStats
              label="Capacidad total"
              value={misEventos.reduce((sum, e) => sum + e.capacidad, 0)}
              icon="📊"
              color="orange"
            />
          </div>
        )}

        {usuario.rol === 'ESTUDIANTE' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <EventStats
              label="Eventos registrados"
              value={misRegistros.length}
              icon="🎫"
              color="blue"
            />
            <EventStats
              label="Eventos próximos"
              value={misRegistros.filter(reg => new Date(reg.evento.fecha) >= new Date()).length}
              icon="📅"
              color="green"
            />
            <EventStats
              label="Registros activos"
              value={misRegistros.filter(reg => reg.estado === 'REGISTRADO').length}
              icon="✅"
              color="purple"
            />
          </div>
        )}

        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'resumen'
                ? 'text-blue-400 border-blue-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            📊 Resumen
          </button>
          {usuario.rol === 'ORGANIZADOR' ? (
            <>
              <button
                onClick={() => setActiveTab('eventos')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'eventos'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                📅 Mis Eventos
              </button>
              <button
                onClick={() => setActiveTab('estadisticas')}
                className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'estadisticas'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                📈 Estadísticas
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveTab('registros')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'registros'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              🎫 Mis Registros
            </button>
          )}
        </div>

        {activeTab === 'resumen' && (
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Resumen general</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Nombre</span>
                <span className="text-white font-semibold">{usuario.nombre}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Apellido</span>
                <span className="text-white font-semibold">{usuario.apellido}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Correo</span>
                <span className="text-blue-400 font-semibold">{usuario.email}</span>
              </div>
              {usuario.matricula && (
                <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                  <span className="text-slate-300">Matrícula</span>
                  <span className="text-white font-semibold">{usuario.matricula}</span>
                </div>
              )}
              {usuario.carrera && (
                <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                  <span className="text-slate-300">Carrera</span>
                  <span className="text-white font-semibold">{usuario.carrera}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'eventos' && usuario.rol === 'ORGANIZADOR' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Mis eventos</h2>
              <Link
                href="/crear-evento"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                + Crear evento
              </Link>
            </div>

            {misEventos.length > 0 ? (
              <div className="space-y-4">
                {misEventos.map(evento => (
                  <div key={evento.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{evento.titulo}</h3>
                        <p className="text-slate-400 text-sm">📅 {new Date(evento.fecha).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        evento.estado === 'PUBLICADO'
                          ? 'bg-green-900/30 text-green-200'
                          : 'bg-yellow-900/30 text-yellow-200'
                      }`}>
                        {evento.estado}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                          <span>Registrados</span>
                          <span>{evento.asistentes}/{evento.capacidad}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${(evento.asistentes / evento.capacidad) * 100}%` }}
                          />
                        </div>
                      </div>
                      <Link
                        href={`/eventos/${evento.id}`}
                        className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Ver evento
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
                <span className="text-5xl mb-4 block">📭</span>
                <p className="text-slate-400 mb-6">Aún no has creado eventos</p>
                <Link
                  href="/crear-evento"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-block"
                >
                  Crear mi primer evento
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'registros' && usuario.rol === 'ESTUDIANTE' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Mis registros</h2>
            {misRegistros.length > 0 ? (
              <div className="space-y-4">
                {misRegistros.map(registro => (
                  <div key={registro.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-white">{registro.evento.titulo}</h3>
                        <p className="text-slate-400 text-sm">📅 {new Date(registro.evento.fecha).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-green-900/30 text-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                        {registro.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
                <span className="text-5xl mb-4 block">🎫</span>
                <p className="text-slate-400 mb-6">No estás registrado en ningún evento</p>
                <Link
                  href="/eventos"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-block"
                >
                  Explorar eventos
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'estadisticas' && usuario.rol === 'ORGANIZADOR' && (
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Estadísticas detalladas</h2>
            <p className="text-slate-400">Las estadísticas detalladas aparecerán aquí cuando tengas eventos publicados.</p>
          </div>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-slate-400 text-center">
            © 2026 EventosUni. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
