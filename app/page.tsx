'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EventCard from './components/EventCard';

const eventosDestacados = [
  {
    id: '1',
    titulo: 'Seminario de Tecnología Web 2026',
    descripcion: 'Aprende sobre las últimas tendencias en desarrollo web, frameworks modernos y mejores prácticas',
    fecha: new Date('2026-05-20T10:00:00'),
    ubicacion: 'Aula 101 - Edificio A',
    capacidad: 50,
    asistentes: 32,
    categoria: 'Tecnología',
    slug: 'seminario-tecnologia-web-2026',
    estado: 'PUBLICADO',
  },
  {
    id: '2',
    titulo: 'Networking Empresarial',
    descripcion: 'Conecta con profesionales de la industria y expande tu red de contactos profesionales',
    fecha: new Date('2026-05-25T14:00:00'),
    ubicacion: 'Salón de Eventos',
    capacidad: 100,
    asistentes: 78,
    categoria: 'Profesional',
    slug: 'networking-empresarial',
    estado: 'PUBLICADO',
  },
  {
    id: '3',
    titulo: 'Taller de Leadership y Liderazgo',
    descripcion: 'Desarrolla habilidades de liderazgo y gestión de equipos con expertos en el campo',
    fecha: new Date('2026-06-01T09:00:00'),
    ubicacion: 'Aula 205 - Edificio B',
    capacidad: 40,
    asistentes: 25,
    categoria: 'Desarrollo',
    slug: 'taller-leadership',
    estado: 'PUBLICADO',
  },
  {
    id: '4',
    titulo: 'Hackathon Universitario 2026',
    descripcion: 'Demuestra tus habilidades de programación en competencia con otros estudiantes',
    fecha: new Date('2026-06-15T08:00:00'),
    ubicacion: 'Campus Principal',
    capacidad: 150,
    asistentes: 120,
    categoria: 'Tecnología',
    slug: 'hackathon-2026',
    estado: 'PUBLICADO',
  },
  {
    id: '5',
    titulo: 'Charla: Emprendimiento Digital',
    descripcion: 'Conoce historias de éxito de emprendedores tecnológicos y cómo iniciar tu propio negocio',
    fecha: new Date('2026-06-10T16:00:00'),
    ubicacion: 'Auditorio Central',
    capacidad: 200,
    asistentes: 156,
    categoria: 'Profesional',
    slug: 'charla-emprendimiento',
    estado: 'PUBLICADO',
  },
  {
    id: '6',
    titulo: 'Torneo de Fútbol Universitario',
    descripcion: 'Participa en el torneo anual de fútbol entre facultades',
    fecha: new Date('2026-06-22T10:00:00'),
    ubicacion: 'Cancha de Fútbol',
    capacidad: 500,
    asistentes: 250,
    categoria: 'Deportes',
    slug: 'torneo-futbol',
    estado: 'PUBLICADO',
  },
];

interface Usuario {
  nombre: string;
  rol: string;
}

export default function Home() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsuario({
          nombre: payload.nombre,
          rol: payload.rol,
        });
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  const categorias = ['Todos', 'Tecnología', 'Profesional', 'Desarrollo', 'Deportes', 'Cultura'];

  const eventosFiltrados =
    filtroCategoria === 'Todos'
      ? eventosDestacados
      : eventosDestacados.filter(e => e.categoria === filtroCategoria);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar user={usuario} />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-6">
            <span className="text-6xl mb-4 block animate-bounce">🎓</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Descubre <span className="gradient-text animate-pulse">Eventos</span> <br />
            <span className="text-4xl md:text-5xl font-bold text-slate-300">Universitarios</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Tu plataforma completa para encontrar, crear y gestionar eventos en tu universidad
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/eventos"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10">✨ Explorar eventos</span>
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors"></div>
            </Link>
            {!usuario && (
              <Link
                href="/registro"
                className="bg-slate-700/50 backdrop-blur-sm hover:bg-slate-600/50 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-slate-500/25 transform hover:scale-105 border border-slate-600/50"
              >
                🚀 Crear tu cuenta
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ¿Por qué elegir <span className="gradient-text">EventHub</span>?
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Una experiencia completa para estudiantes, organizadores y administradores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card group">
              <div className="feature-icon">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fácil de usar</h3>
              <p className="text-slate-300">
                Interfaz intuitiva que te permite encontrar eventos en segundos
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Seguro y confiable</h3>
              <p className="text-slate-300">
                Autenticación robusta y protección de datos personales
              </p>
            </div>

            <div className="feature-card group">
              <div className="feature-icon">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Rápido y eficiente</h3>
              <p className="text-slate-300">
                Tecnología moderna para una experiencia fluida
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="stat-card group">
            <div className="stat-icon">
              <span className="text-3xl">📅</span>
            </div>
            <p className="stat-number">{eventosDestacados.length}</p>
            <p className="stat-label">Eventos disponibles</p>
          </div>
          <div className="stat-card group">
            <div className="stat-icon">
              <span className="text-3xl">👥</span>
            </div>
            <p className="stat-number">
              {eventosDestacados.reduce((sum, e) => sum + e.asistentes, 0)}
            </p>
            <p className="stat-label">Estudiantes registrados</p>
          </div>
          <div className="stat-card group">
            <div className="stat-icon">
              <span className="text-3xl">🏷️</span>
            </div>
            <p className="stat-number">
              {categorias.length - 1}
            </p>
            <p className="stat-label">Categorías de eventos</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Eventos <span className="gradient-text">Destacados</span>
          </h2>
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCategoria(cat)}
                className={`filter-button ${
                  filtroCategoria === cat
                    ? 'filter-button-active'
                    : 'filter-button-inactive'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de eventos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map(evento => (
              <EventCard key={evento.id} {...evento} />
            ))}
          </div>

          {eventosFiltrados.length === 0 && (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">📭</span>
              <p className="text-slate-400 text-lg">No hay eventos en esta categoría</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Quieres crear un evento?</h2>
          <p className="text-blue-100 mb-6 text-lg">
            Si eres organizador, puedes crear y gestionar tus propios eventos
          </p>
          <Link
            href={usuario ? '/dashboard' : '/registro'}
            className="bg-white hover:bg-blue-50 text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
          >
            {usuario ? 'Ir al dashboard' : 'Registrarse como organizador'}
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>🎓</span> EventosUni
              </h3>
              <p className="text-slate-400">
                La plataforma completa para gestión de eventos universitarios
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/eventos" className="hover:text-blue-400 transition-colors">
                    Ver eventos
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-blue-400 transition-colors">
                    Iniciar sesión
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-slate-400">
                <li>📧 eventos@universidad.edu</li>
                <li>📱 +34 900 123 456</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8">
            <p className="text-slate-400 text-center">
              © 2026 EventosUni. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
