import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayloadFromRequest } from '@/app/api/eventos/data';
import { supabaseAdmin } from '@/app/lib/supabase-server';

function getSupabase() {
  if (!supabaseAdmin) {
    return null;
  }
  return supabaseAdmin;
}

export async function GET(request: NextRequest) {
  const auth = getAuthPayloadFromRequest(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', auth.payload.id)
    .single();

  if (error || !data) {
    console.error('Error obteniendo usuario:', error);
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  return NextResponse.json({
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
}
