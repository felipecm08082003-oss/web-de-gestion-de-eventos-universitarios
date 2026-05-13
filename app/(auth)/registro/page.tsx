'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    matricula: '',
    carrera: '',
    rol: 'ESTUDIANTE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          matricula: formData.matricula,
          carrera: formData.carrera,
          rol: formData.rol,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al crear cuenta');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎓</div>
            <h1 className="text-3xl font-bold text-white mb-2">EventosUni</h1>
            <p className="text-slate-400">Crea tu cuenta</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Pérez"
                  required
                  className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Correo
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
                Matrícula (Opcional)
              </label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleChange}
                placeholder="A00123456"
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Carrera (Opcional)
              </label>
              <input
                type="text"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                placeholder="Ingeniería en Software"
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Rol
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="ESTUDIANTE">Estudiante</option>
                <option value="ORGANIZADOR">Organizador</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Confirmar
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors mt-6"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors text-center"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
