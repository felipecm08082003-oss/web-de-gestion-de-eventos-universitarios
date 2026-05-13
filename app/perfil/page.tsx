'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  matricula?: string | null;
  carrera?: string | null;
}

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [registrosCount, setRegistrosCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchPerfil = async () => {
      try {
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!meRes.ok) {
          router.push('/login');
          return;
        }

        const meData = await meRes.json();
        setUsuario(meData.usuario);

        const registrosRes = await fetch('/api/registros', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (registrosRes.ok) {
          const registrosData = await registrosRes.json();
          setRegistrosCount(registrosData.length || 0);
        }
      } catch (err) {
        console.error('Error cargando perfil:', err);
        setError('No se pudo cargar tu perfil. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Cargando perfil...</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={usuario} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 rounded-3xl border border-slate-700/70 shadow-xl shadow-slate-950/20 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Mi perfil</h1>
              <p className="text-slate-400">Aquí puedes ver tus datos y tu historial de registros.</p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-all"
            >
              Ir al dashboard
            </Link>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Información básica</h2>
                <div className="space-y-3 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nombre</span>
                    <span>{usuario.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Apellido</span>
                    <span>{usuario.apellido}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Correo</span>
                    <span>{usuario.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rol</span>
                    <span>{usuario.rol}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Detalles académicos</h2>
                <div className="space-y-3 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Matrícula</span>
                    <span>{usuario.matricula || 'No registrada'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Carrera</span>
                    <span>{usuario.carrera || 'No registrada'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/80 border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Actividad</h2>
              <div className="space-y-3 text-slate-300">
                <div className="flex justify-between items-center">
                  <span>Registros en eventos</span>
                  <span className="text-white font-bold">{registrosCount}</span>
                </div>
                <p className="text-slate-400">Tus registros se guardan en la base de datos y están disponibles en tu dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
