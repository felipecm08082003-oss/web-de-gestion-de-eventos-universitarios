import { NextRequest, NextResponse } from 'next/server';
import { createToken, hashPassword } from '@/app/lib/auth';
import { supabaseAdmin } from '@/app/lib/supabase-server';
import { randomUUID } from 'crypto';

function getSupabase() {
  if (!supabaseAdmin) {
    return null;
  }
  return supabaseAdmin;
}

export async function POST(request: NextRequest) {
  try {
    const {
      nombre,
      apellido,
      email,
      password,
      matricula,
      carrera,
      rol,
    } = await request.json();

    if (!nombre || !apellido || !email || !password) {
      return NextResponse.json(
        { message: 'Campos requeridos faltantes' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ message: 'Supabase no configurado' }, { status: 500 });
    }

    const hashedPassword = await hashPassword(password);
    const userId = randomUUID();

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        id: userId,
        nombre,
        apellido,
        email,
        password: hashedPassword,
        matricula: matricula || null,
        carrera: carrera || null,
        rol: rol || 'ESTUDIANTE',
      })
      .select()
      .single();

    if (error) {
      console.error('Error registrando usuario:', error);
      return NextResponse.json(
        { message: error.message || 'Error al crear usuario' },
        { status: 500 }
      );
    }

    const token = await createToken({
      id: data.id,
      email: data.email,
      nombre: data.nombre,
      rol: data.rol,
    });

    return NextResponse.json({
      token,
      usuario: {
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        rol: data.rol,
        matricula: data.matricula,
        carrera: data.carrera,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
