'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎓</div>
            <h1 className="text-3xl font-bold text-white mb-2">EventosUni</h1>
            <p className="text-slate-400">Inicia sesión en tu cuenta</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                required
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors mt-6"
            >
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">¿No tienes cuenta?</span>
            </div>
          </div>

          <Link
            href="/registro"
            className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors text-center"
          >
            Crear cuenta
          </Link>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center text-slate-400 text-sm">
          <p className="font-semibold mb-2">Prueba con datos de demostración:</p>
          <p>📧 admin@uni.edu</p>
          <p>🔑 password123</p>
        </div>
      </div>
    </div>
  );
}
