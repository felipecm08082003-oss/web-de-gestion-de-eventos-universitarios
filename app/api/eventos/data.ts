import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion';

export interface Evento {
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
  createdAt: string;
}

export function verifyToken(token?: string) {
  if (!token) {
    return { error: 'Token requerido', status: 401 };
  }

  try {
    const payload = jwt.verify(token, secret) as any;
    return { payload };
  } catch (error) {
    return { error: 'Token inválido', status: 401 };
  }
}

export function getAuthPayloadFromRequest(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  return verifyToken(token);
}
