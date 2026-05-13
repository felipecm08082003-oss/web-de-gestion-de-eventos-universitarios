import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './app/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');

  // Rutas públicas
  const publicRoutes = ['/', '/login', '/registro', '/eventos'];
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Rutas protegidas
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Verificar acceso por rol
    if (request.nextUrl.pathname.startsWith('/crear-evento')) {
      if (payload.rol !== 'ORGANIZADOR' && payload.rol !== 'ADMINISTRADOR') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // Agregar usuario al header para acceso en la ruta
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-Id', payload.id);
    requestHeaders.set('X-User-Role', payload.rol);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
