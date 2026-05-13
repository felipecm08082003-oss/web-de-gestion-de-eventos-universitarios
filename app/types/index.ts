// Tipos comunes de la aplicación

export type RolUsuario = 'ADMINISTRADOR' | 'ORGANIZADOR' | 'ESTUDIANTE';

export type EstadoEvento = 'BORRADOR' | 'PUBLICADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';

export type EstadoRegistro = 'REGISTRADO' | 'ASISTIO' | 'NO_ASISTIO' | 'CANCELADO';

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  fotoPerfil?: string;
  carrera?: string;
  matricula?: string;
  telefono?: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  slug: string;
  imagen?: string;
  fecha: Date;
  fechaFin?: Date;
  ubicacion: string;
  capacidad: number;
  asistentes: number;
  categoria: string;
  subcategoria?: string;
  tags: string[];
  organizadorId: string;
  organizador?: Usuario;
  estado: EstadoEvento;
  responsableId?: string;
  requiereAprobacion: boolean;
  requiereDocumento: boolean;
  requiereEncuesta: boolean;
  mostrarRegistrados: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Registro {
  id: string;
  usuarioId: string;
  usuario?: Usuario;
  eventoId: string;
  evento?: Evento;
  estado: EstadoRegistro;
  fechaRegistro: Date;
  fechaConfirmacion?: Date;
  documento?: string;
  aceptoTerminos: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comentario {
  id: string;
  contenido: string;
  usuarioId: string;
  usuario?: Usuario;
  eventoId: string;
  evento?: Evento;
  createdAt: Date;
  updatedAt: Date;
}

export interface Calificacion {
  id: string;
  puntuacion: number; // 1-5
  comentario?: string;
  usuarioId: string;
  usuario?: Usuario;
  eventoId: string;
  evento?: Evento;
  createdAt: Date;
}

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'evento' | 'registro' | 'recordatorio';
  leida: boolean;
  usuarioId: string;
  usuario?: Usuario;
  createdAt: Date;
}

export interface TokenPayload {
  id: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
