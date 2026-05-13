'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

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
}

export default function EventoDetallePage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registrado, setRegistrado] = useState(false);
  const [registrando, setRegistrando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      if (!params?.id) {
        setError('ID de evento inválido');
        setLoading(false);
        return;
      }

      try {
        const [eventoRes, meRes] = await Promise.all([
          fetch(`/api/eventos/${params.id}`),
          token
            ? fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
            : Promise.resolve({ ok: false } as Response),
        ]);

        if (!eventoRes.ok) {
          const data = await eventoRes.json();
          setError(data.error || 'Evento no encontrado');
          setLoading(false);
          return;
        }

        const eventoData = await eventoRes.json();
        setEvento(eventoData);

        if (token && meRes.ok) {
          const meData = await meRes.json();
          setUsuario(meData.usuario);

          const registrosRes = await fetch('/api/registros', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (registrosRes.ok) {
            const registrosData = await registrosRes.json();
            if (Array.isArray(registrosData)) {
              setRegistrado(registrosData.some((reg: any) => reg.evento?.id === params.id));
            }
          } else {
            console.error('Error cargando registros de usuario:', await registrosRes.text());
          }
        }
      } catch (err) {
        console.error('Error cargando evento:', err);
        setError('No se pudo cargar el evento. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleRegistro = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (!params?.id || !evento) return;
    setRegistrando(true);
    setSuccess('');
    setError('');

    try {
      const res = await fetch('/api/registros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventoId: evento.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al registrarse al evento');
        return;
      }

      setRegistrado(true);
      setSuccess('Te registraste correctamente en el evento.');
      setEvento({ ...evento, asistentes: evento.asistentes + 1 });
    } catch (err) {
      console.error('Error registrando evento:', err);
      setError('No se pudo completar el registro. Intenta de nuevo.');
    } finally {
      setRegistrando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Cargando evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="bg-slate-800 rounded-3xl border border-red-500/30 p-10 text-center max-w-lg">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => router.push('/eventos')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full"
          >
            Volver a eventos
          </button>
        </div>
      </div>
    );
  }

  if (!evento) {
    return null;
  }

  const estaLleno = evento.asistentes >= evento.capacidad;
  const canRegister = usuario?.rol === 'ESTUDIANTE' && !registrado && !estaLleno;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={usuario} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 rounded-3xl border border-slate-700/70 shadow-xl shadow-slate-950/20 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm text-blue-400 font-semibold mb-2">{evento.categoria}</p>
              <h1 className="text-4xl font-bold text-white mb-4">{evento.titulo}</h1>
              <p className="text-slate-400 max-w-3xl">{evento.descripcion}</p>
            </div>
            <div className="space-y-4 text-right">
              <div className="rounded-3xl bg-slate-900/80 p-5 border border-slate-700 shadow-sm">
                <p className="text-slate-400 text-sm">Fecha</p>
                <p className="text-white font-semibold">{new Date(evento.fecha).toLocaleString()}</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-5 border border-slate-700 shadow-sm">
                <p className="text-slate-400 text-sm">Ubicación</p>
                <p className="text-white font-semibold">{evento.ubicacion}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto] items-start">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-900/80 p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400">Asistentes</span>
                  <span className="text-white font-semibold">{evento.asistentes}/{evento.capacidad}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all" style={{ width: `${Math.min((evento.asistentes / evento.capacidad) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900/80 p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-3">Detalles del evento</h2>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex justify-between">
                    <span>Estado</span>
                    <span>{evento.estado}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Categoría</span>
                    <span>{evento.categoria}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Slug</span>
                    <span>{evento.slug}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/80 p-6 border border-slate-700 shadow-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Participación</h2>
              {usuario ? (
                <>
                  {registrado && (
                    <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-4 text-green-200">
                      Ya estás registrado en este evento.
                    </div>
                  )}
                  {estaLleno && (
                    <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-red-200">
                      El evento está lleno.
                    </div>
                  )}
                  {success && <p className="text-green-300">{success}</p>}
                  {error && <p className="text-red-300">{error}</p>}
                  {canRegister ? (
                    <button
                      onClick={handleRegistro}
                      disabled={registrando}
                      className="w-full rounded-full bg-emerald-500 px-5 py-3 text-white font-semibold hover:bg-emerald-600 transition-all disabled:bg-slate-600"
                    >
                      {registrando ? 'Registrando...' : 'Registrarse en el evento'}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {usuario.rol !== 'ESTUDIANTE' && (
                        <p className="text-slate-300">Solo estudiantes pueden registrarse en el evento.</p>
                      )}
                      {!usuario && (
                        <button
                          onClick={() => router.push('/login')}
                          className="w-full rounded-full bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition-all"
                        >
                          Inicia sesión para registrarte
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="w-full rounded-full bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition-all"
                >
                  Inicia sesión para registrarte
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
