import 'dotenv/config';
import { supabaseAdmin } from '../app/lib/supabase-server';

async function initDatabase() {
  if (!supabaseAdmin) {
    console.error('Supabase no configurado');
    return;
  }

  console.log('🔄 Inicializando base de datos...');

  try {
    // Verificar si las tablas existen consultándolas
    const { data: usuariosData, error: usuariosCheckError } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .limit(1);

    if (usuariosCheckError && usuariosCheckError.code === 'PGRST116') {
      console.log('⚠️  Tabla usuarios no existe, creando...');
      // La tabla no existe, pero no podemos crearla desde aquí
      // Necesitas ejecutar el SQL manualmente en Supabase
      console.log('📋 Ejecuta este SQL en Supabase SQL Editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  matricula TEXT UNIQUE,
  carrera TEXT,
  rol TEXT DEFAULT 'ESTUDIANTE',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha TIMESTAMPTZ NOT NULL,
  ubicacion TEXT,
  capacidad INTEGER,
  asistentes INTEGER DEFAULT 0,
  categoria TEXT,
  slug TEXT,
  estado TEXT DEFAULT 'PUBLICADO',
  organizador_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuarioId TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  eventoId UUID NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  estado TEXT DEFAULT 'REGISTRADO',
  fechaRegistro TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(usuarioId, eventoId)
);

CREATE INDEX IF NOT EXISTS idx_eventos_estado ON eventos(estado);
CREATE INDEX IF NOT EXISTS idx_eventos_organizador ON eventos(organizador_id);
CREATE INDEX IF NOT EXISTS idx_registros_usuario ON registros(usuarioId);
CREATE INDEX IF NOT EXISTS idx_registros_evento ON registros(eventoId);
      `);
      return;
    }

    console.log('✅ Tablas existen');

    // Insertar usuario de prueba si no existe
    const { data: existingUser } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', 'admin@uni.edu')
      .single();

    if (!existingUser) {
      const { error: insertUserError } = await supabaseAdmin
        .from('usuarios')
        .insert({
          id: 'admin-123',
          nombre: 'Admin',
          apellido: 'Sistema',
          email: 'admin@uni.edu',
          password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // password123
          rol: 'ORGANIZADOR',
        });

      if (insertUserError) {
        console.error('Error insertando usuario de prueba:', insertUserError);
      } else {
        console.log('✅ Usuario de prueba creado');
      }
    } else {
      console.log('✅ Usuario de prueba ya existe');
    }

    // Insertar evento de prueba si no existe
    const { data: existingEvent } = await supabaseAdmin
      .from('eventos')
      .select('id')
      .eq('titulo', 'Evento de Prueba')
      .single();

    if (!existingEvent) {
      const { error: insertEventError } = await supabaseAdmin
        .from('eventos')
        .insert({
          titulo: 'Evento de Prueba',
          descripcion: 'Este es un evento de prueba para verificar que todo funciona correctamente.',
          fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días en el futuro
          ubicacion: 'Auditorio Principal',
          capacidad: 100,
          categoria: 'Tecnología',
          slug: 'evento-de-prueba',
          organizador_id: 'admin-123',
        });

      if (insertEventError) {
        console.error('Error insertando evento de prueba:', insertEventError);
      } else {
        console.log('✅ Evento de prueba creado');
      }
    } else {
      console.log('✅ Evento de prueba ya existe');
    }

    console.log('🎉 Base de datos inicializada correctamente!');
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
  }
}

initDatabase();