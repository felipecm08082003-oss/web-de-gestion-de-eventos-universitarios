import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayloadFromRequest } from './data';
import { supabaseAdmin } from '@/app/lib/supabase-server';

function getSupabase() {
  if (!supabaseAdmin) {
    return null;
  }
  return supabaseAdmin;
}

function mapEvento(row: any) {
  return {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion,
    fecha: row.fecha,
    ubicacion: row.ubicacion,
    capacidad: row.capacidad,
    asistentes: row.asistentes,
    categoria: row.categoria,
    slug: row.slug,
    estado: row.estado,
    organizadorId: row.organizador_id ?? row.organizadorId,
    createdAt: row.created_at ?? row.createdAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const misEventos = searchParams.get('misEventos');

    if (misEventos === 'true') {
      const auth = getAuthPayloadFromRequest(request);
      if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
      }

      const supabase = getSupabase();
      if (!supabase) {
        return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
      }

      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('organizador_id', auth.payload.id)
        .order('fecha', { ascending: true });

      if (error) {
        console.error('Error obteniendo mis eventos:', error);
        return NextResponse.json({ error: 'Error obteniendo eventos' }, { status: 500 });
      }

      return NextResponse.json(data.map(mapEvento));
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('estado', 'PUBLICADO')
      .order('fecha', { ascending: true });

    if (error) {
      console.error('Error obteniendo eventos públicos:', error);
      return NextResponse.json({ error: 'Error obteniendo eventos' }, { status: 500 });
    }

    return NextResponse.json(data.map(mapEvento));
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthPayloadFromRequest(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (auth.payload.rol !== 'ORGANIZADOR') {
      return NextResponse.json({ error: 'Solo organizadores pueden crear eventos' }, { status: 403 });
    }

    const body = await request.json();
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad, categoria } = body;

    if (!titulo || !descripcion || !fecha || !ubicacion || !capacidad || !hora) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const fechaCompleta = new Date(`${fecha}T${hora}:00`).toISOString();
    const slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
    }

    const { data, error } = await supabase.from('eventos').insert({
      titulo,
      descripcion,
      fecha: fechaCompleta,
      ubicacion,
      capacidad: parseInt(capacidad, 10),
      asistentes: 0,
      categoria,
      slug,
      estado: 'PUBLICADO',
      organizador_id: auth.payload.id,
    }).select().single();

    if (error) {
      console.error('Error creando evento:', error);
      return NextResponse.json({ error: 'Error creando evento' }, { status: 500 });
    }

    return NextResponse.json(mapEvento(data), { status: 201 });
  } catch (error) {
    console.error('Error creando evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
