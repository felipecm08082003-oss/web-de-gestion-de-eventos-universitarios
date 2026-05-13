import Link from 'next/link';
import { formatDate, formatTime, getCapacityPercentage, getCapacityStatus, isEventSoon } from '@/app/lib/utils';

interface EventCardProps {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date | string;
  ubicacion: string;
  capacidad: number;
  asistentes: number;
  categoria: string;
  imagen?: string;
  slug: string;
  estado?: string;
}

export default function EventCard({
  id,
  titulo,
  descripcion,
  fecha,
  ubicacion,
  capacidad,
  asistentes,
  categoria,
  imagen,
}: EventCardProps) {
  const percentage = getCapacityPercentage(asistentes, capacidad);
  const capacityStatus = getCapacityStatus(percentage);
  const isSoon = isEventSoon(fecha);

  const statusColors: { [key: string]: string } = {
    danger: 'bg-gradient-to-r from-red-500 to-red-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    safe: 'bg-gradient-to-r from-green-500 to-emerald-600',
  };

  const categoryColors: { [key: string]: string } = {
    'Tecnología': 'from-blue-500 to-cyan-500',
    'Profesional': 'from-purple-500 to-pink-500',
    'Desarrollo': 'from-violet-500 to-purple-500',
    'Deportes': 'from-red-500 to-orange-500',
    'Cultura': 'from-amber-500 to-orange-500',
  };

  const bgGradient = categoryColors[categoria] || 'from-blue-500 to-purple-500';

  return (
    <div className="group h-full bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-1 hover:scale-105 fade-in-up">
      <div className={`h-40 flex items-center justify-center bg-gradient-to-br ${bgGradient} relative overflow-hidden`} style={imagen ? { backgroundImage: `url(${imagen})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
        {!imagen && <span className="text-6xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">📅</span>}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
        {isSoon && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            ⚡ ¡Próximo!
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4 gap-2">
          <span className={`text-xs bg-gradient-to-r ${bgGradient} text-white px-3 py-1 rounded-full font-bold shadow-md`}>
            🏷️ {categoria}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-bold text-white ${statusColors[capacityStatus]} shadow-md`}>
            {percentage}%
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 transition-all duration-300">
          {titulo}
        </h3>

        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow transition-colors duration-300">
          {descripcion}
        </p>

        <div className="space-y-2 text-sm text-slate-400 mb-4">
          <p className="flex items-center gap-2 transition-colors duration-300">
            <span className="text-base">📍</span>
            <span className="truncate">{ubicacion}</span>
          </p>
          <p className="flex items-center gap-2 transition-colors duration-300">
            <span className="text-base">📅</span>
            <span>{formatDate(fecha)}</span>
          </p>
          <p className="flex items-center gap-2 transition-colors duration-300">
            <span className="text-base">🕐</span>
            <span>{formatTime(fecha)}</span>
          </p>
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-semibold">
            <span>Registrados</span>
            <span className="text-slate-300 font-bold">{asistentes}/{capacidad}</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden border border-slate-600/50">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${statusColors[capacityStatus]}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <Link
          href={`/eventos/${id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-2.5 rounded-lg text-center shadow-lg transition-all duration-300 shadow-blue-500/20 hover:opacity-90"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
