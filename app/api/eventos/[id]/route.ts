import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayloadFromRequest } from '../data';
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

// GET /api/eventos/[id] - Obtener evento específico
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'ID de evento requerido' }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    return NextResponse.json(mapEvento(data));
  } catch (error) {
    console.error('Error obteniendo evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT /api/eventos/[id] - Actualizar evento
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'ID de evento requerido' }, { status: 400 });
    }
    const auth = getAuthPayloadFromRequest(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
    }

    const { data: evento, error: fetchError } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    if ((evento.organizador_id ?? evento.organizadorId) !== auth.payload.id) {
      return NextResponse.json({ error: 'No tienes permisos para editar este evento' }, { status: 403 });
    }

    const body = await request.json();
    const { titulo, descripcion, fecha, hora, ubicacion, capacidad, categoria, estado } = body;
    const updateData: any = {};

    if (titulo) updateData.titulo = titulo;
    if (descripcion) updateData.descripcion = descripcion;
    if (fecha && hora) updateData.fecha = new Date(`${fecha}T${hora}:00`).toISOString();
    if (ubicacion) updateData.ubicacion = ubicacion;
    if (capacidad) updateData.capacidad = parseInt(capacidad, 10);
    if (categoria) updateData.categoria = categoria;
    if (estado) updateData.estado = estado;
    if (titulo) {
      updateData.slug = titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const { data: updatedEvento, error: updateError } = await supabase
      .from('eventos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedEvento) {
      console.error('Error actualizando evento:', updateError);
      return NextResponse.json({ error: 'Error actualizando evento' }, { status: 500 });
    }

    return NextResponse.json(mapEvento(updatedEvento));
  } catch (error) {
    console.error('Error actualizando evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE /api/eventos/[id] - Eliminar evento
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'ID de evento requerido' }, { status: 400 });
    }
    const auth = getAuthPayloadFromRequest(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
    }

    const { data: evento, error: fetchError } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    if ((evento.organizador_id ?? evento.organizadorId) !== auth.payload.id) {
      return NextResponse.json({ error: 'No tienes permisos para eliminar este evento' }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error eliminando evento:', deleteError);
      return NextResponse.json({ error: 'Error eliminando evento' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}