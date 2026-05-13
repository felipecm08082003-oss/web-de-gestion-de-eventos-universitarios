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
    .from('registros')
    .select('id,estado,fecharegistro,eventos(id,titulo,fecha)')
    .eq('usuarioid', auth.payload.id)
    .order('fecharegistro', { ascending: false });

  if (error) {
    console.error('Error obteniendo registros:', error);
    return NextResponse.json({ error: 'Error obteniendo registros' }, { status: 500 });
  }

  const registros = (data || []).map((registro: any) => {
    const { fecharegistro, eventos, ...rest } = registro;
    return {
      ...rest,
      fechaRegistro: fecharegistro,
      evento: eventos,
    };
  });

  return NextResponse.json(registros);
}

export async function POST(request: NextRequest) {
  const auth = getAuthPayloadFromRequest(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
  }

  try {
    const { eventoId } = await request.json();

    if (!eventoId) {
      return NextResponse.json({ error: 'Evento requerido' }, { status: 400 });
    }

    const { data: evento, error: eventoError } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', eventoId)
      .single();

    if (eventoError || !evento) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
    }

    if (evento.estado !== 'PUBLICADO') {
      return NextResponse.json({ error: 'No se puede registrar en un evento no publicado' }, { status: 400 });
    }

    if (evento.asistentes >= evento.capacidad) {
      return NextResponse.json({ error: 'El evento ya está lleno' }, { status: 400 });
    }

    const { data: existing, error: existingError } = await supabase
      .from('registros')
      .select('id')
      .eq('usuarioid', auth.payload.id)
      .eq('eventoid', eventoId)
      .single();

    if (existing && !existingError) {
      return NextResponse.json({ error: 'Ya estás registrado en este evento' }, { status: 400 });
    }

    const { data: registro, error: registroError } = await supabase
      .from('registros')
      .insert({
        usuarioid: auth.payload.id,
        eventoid: eventoId,
        estado: 'REGISTRADO',
      })
      .select()
      .single();

    if (registroError || !registro) {
      console.error('Error creando registro:', registroError);
      return NextResponse.json({ error: 'Error al registrar el evento' }, { status: 500 });
    }

    const mappedRegistro = {
      id: registro.id,
      usuarioId: registro.usuarioid,
      eventoId: registro.eventoid,
      estado: registro.estado,
      fechaRegistro: registro.fecharegistro,
      createdAt: registro.created_at,
    };

    const { error: updateError } = await supabase
      .from('eventos')
      .update({ asistentes: (evento.asistentes || 0) + 1 })
      .eq('id', eventoId);

    if (updateError) {
      console.error('Error actualizando asistentes:', updateError);
    }

    return NextResponse.json(mappedRegistro, { status: 201 });
  } catch (error) {
    console.error('Error en registro de evento:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
