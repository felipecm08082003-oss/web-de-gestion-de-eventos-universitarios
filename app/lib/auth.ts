import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion';

export interface TokenPayload {
  id: string;
  email: string;
  rol: string;
  nombre: string;
}

export async function createToken(payload: TokenPayload): Promise<string> {
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = jwt.verify(token, secret) as TokenPayload;
    return verified;
  } catch (error) {
    return null;
  }
}

// Función para hashear contraseñas (en producción usar bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const hashedPassword = await hashPassword(password);
  return hashedPassword === hash;
}
