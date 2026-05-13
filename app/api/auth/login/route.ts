import { NextRequest, NextResponse } from 'next/server';
import { createToken, verifyPassword } from '@/app/lib/auth';
import { supabaseAdmin } from '@/app/lib/supabase-server';

function getSupabase() {
  if (!supabaseAdmin) {
    return null;
  }
  return supabaseAdmin;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ message: 'Supabase no configurado' }, { status: 500 });
    }

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return NextResponse.json(
        { message: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const passwordMatches = await verifyPassword(password, usuario.password);
    if (!passwordMatches) {
      return NextResponse.json(
        { message: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
    });

    return NextResponse.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        matricula: usuario.matricula,
        carrera: usuario.carrera,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
