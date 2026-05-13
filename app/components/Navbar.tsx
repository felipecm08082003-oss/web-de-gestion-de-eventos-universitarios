'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  user?: {
    nombre: string;
    rol: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Inicio', icon: '🏠' },
    { href: '/eventos', label: 'Eventos', icon: '📅' },
  ];

  const userLinks = user
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/perfil', label: 'Perfil', icon: '👤' },
        { action: handleLogout, label: 'Salir', icon: '🚪' },
      ]
    : [
        { href: '/login', label: 'Iniciar sesión', icon: '🔓' },
        { href: '/registro', label: 'Registrarse', icon: '✍️' },
      ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group hover:scale-105 transform transition-transform"
          >
            <div className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              🎓
            </div>
            <span className="font-black text-xl bg-gradient-text hidden sm:inline">
              EventosUni
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-blue-400 transition-all duration-300 flex items-center gap-2 font-semibold text-sm relative group"
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="relative group hidden md:block">
            {user ? (
              <div>
                <button className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold">
                  <span className="text-lg">👤</span>
                  <span className="hidden sm:inline">{user.nombre}</span>
                  <span className="text-xs ml-2">▼</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-700/50 hidden group-hover:block overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-900 to-slate-800">
                    <p className="text-white font-bold text-sm">{user.nombre}</p>
                    <p className="text-slate-400 text-xs mt-1 bg-gradient-text font-semibold">{user.rol}</p>
                  </div>
                  {userLinks.map((link, index) => (
                    link.action ? (
                      <button
                        key={index}
                        onClick={link.action}
                        className="w-full text-left block px-4 py-3 text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 transition-all duration-300 text-sm font-medium border-b border-slate-700/30 last:border-0"
                      >
                        <span className="mr-2">{link.icon}</span>
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-3 text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 transition-all duration-300 text-sm font-medium border-b border-slate-700/30 last:border-0"
                      >
                        <span className="mr-2">{link.icon}</span>
                        {link.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-blue-400 transition-all duration-300 font-semibold text-sm relative group"
                >
                  Iniciar sesión
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/registro"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl hover:bg-slate-700 p-2 rounded-lg transition-colors"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700/50 animate-in fade-in slide-in-from-top">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 transition-all duration-300 rounded font-medium"
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-700/50 mt-4 pt-4">
              {userLinks.map((link, index) => (
                link.action ? (
                  <button
                    key={index}
                    onClick={link.action}
                    className="w-full text-left block px-4 py-3 text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 transition-all duration-300 rounded font-medium"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-slate-300 hover:bg-blue-600/20 hover:text-blue-400 transition-all duration-300 rounded font-medium"
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
