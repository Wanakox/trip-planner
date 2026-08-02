-- TripPlanner - Modelo relacional inicial
-- Basado en el diagrama E-R.
-- PostgreSQL 17

DROP TABLE IF EXISTS
    actividad,
    transporte,
    gasto,
    participante,
    alojamiento,
    nota,
    archivo,
    tarea,
    destino,
    viaje,
    usuario
CASCADE;

BEGIN;

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    foto_perfil VARCHAR(500),
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    moneda_predeterminada CHAR(3) NOT NULL DEFAULT 'EUR',
    contrasena_hash VARCHAR(255) NOT NULL,

    CONSTRAINT ck_usuario_nombre_no_vacio CHECK (BTRIM(nombre) <> ''),
    CONSTRAINT ck_usuario_apellido_no_vacio CHECK (BTRIM(apellido) <> ''),
    CONSTRAINT ck_usuario_nombre_usuario_no_vacio CHECK (BTRIM(nombre_usuario) <> ''),
    CONSTRAINT ck_usuario_correo_no_vacio CHECK (BTRIM(correo_electronico) <> ''),
    CONSTRAINT ck_usuario_moneda_longitud CHECK (CHAR_LENGTH(moneda_predeterminada) = 3)
);

CREATE TABLE viaje (
    id BIGSERIAL PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    origen VARCHAR(150) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    descripcion TEXT,
    presupuesto NUMERIC(12, 2),
    moneda CHAR(3) NOT NULL,
    valoracion SMALLINT,
    estado VARCHAR(30) NOT NULL,

    CONSTRAINT fk_viaje_usuario FOREIGN KEY (id_usuario)
        REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT ck_viaje_nombre_no_vacio CHECK (BTRIM(nombre) <> ''),
    CONSTRAINT ck_viaje_fechas CHECK (fecha_fin >= fecha_inicio),
    CONSTRAINT ck_viaje_presupuesto CHECK (presupuesto IS NULL OR presupuesto >= 0),
    CONSTRAINT ck_viaje_moneda_longitud CHECK (CHAR_LENGTH(moneda) = 3),
    CONSTRAINT ck_viaje_valoracion CHECK (valoracion IS NULL OR valoracion BETWEEN 1 AND 5)
);

CREATE TABLE destino (
    id BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    pais VARCHAR(100) NOT NULL,
    ciudad VARCHAR(120) NOT NULL,
    orden INTEGER NOT NULL,
    moneda CHAR(3) NOT NULL,

    CONSTRAINT fk_destino_viaje FOREIGN KEY (id_viaje)
        REFERENCES viaje(id) ON DELETE CASCADE,
    CONSTRAINT uq_destino_viaje_orden UNIQUE (id_viaje, orden),
    CONSTRAINT ck_destino_orden CHECK (orden > 0),
    CONSTRAINT ck_destino_moneda_longitud CHECK (CHAR_LENGTH(moneda) = 3)
);

CREATE TABLE tarea (
    id BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    orden INTEGER NOT NULL,
    prioridad VARCHAR(20) NOT NULL,
    completado BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_tarea_viaje FOREIGN KEY (id_viaje)
        REFERENCES viaje(id) ON DELETE CASCADE,
    CONSTRAINT uq_tarea_viaje_orden UNIQUE (id_viaje, orden),
    CONSTRAINT ck_tarea_nombre_no_vacio CHECK (BTRIM(nombre) <> ''),
    CONSTRAINT ck_tarea_orden CHECK (orden > 0)
);

CREATE TABLE archivo (
    id BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    ruta VARCHAR(1000) NOT NULL,
    extension VARCHAR(20) NOT NULL,
    tamano BIGINT NOT NULL,

    CONSTRAINT fk_archivo_viaje FOREIGN KEY (id_viaje)
        REFERENCES viaje(id) ON DELETE CASCADE,
    CONSTRAINT ck_archivo_nombre_no_vacio CHECK (BTRIM(nombre) <> ''),
    CONSTRAINT ck_archivo_tamano CHECK (tamano >= 0)
);

CREATE TABLE nota (
    id BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    texto TEXT NOT NULL,
    num_dia INTEGER NOT NULL,

    CONSTRAINT fk_nota_viaje FOREIGN KEY (id_viaje)
        REFERENCES viaje(id) ON DELETE CASCADE,
    CONSTRAINT ck_nota_titulo_no_vacio CHECK (BTRIM(titulo) <> ''),
    CONSTRAINT ck_nota_num_dia CHECK (num_dia > 0)
);

CREATE TABLE alojamiento (
    id BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    direccion VARCHAR(500) NOT NULL,
    fecha_checkin DATE NOT NULL,
    fecha_checkout DATE NOT NULL,
    hora_checkin TIME,
    hora_checkout TIME,
    precio NUMERIC(12, 2),

    CONSTRAINT fk_alojamiento_viaje FOREIGN KEY (id_viaje)
        REFERENCES viaje(id) ON DELETE CASCADE,
    CONSTRAINT ck_alojamiento_fechas CHECK (fecha_checkout >= fecha_checkin),
    CONSTRAINT ck_alojamiento_precio CHECK (precio IS NULL OR precio >= 0)
);

CREATE TABLE participante (
    id BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    nombre VARCHAR(150) NOT NULL,

    CONSTRAINT fk_participante_viaje FOREIGN KEY (id_viaje)
        REFERENCES viaje(id) ON DELETE CASCADE,
    CONSTRAINT ck_participante_nombre_no_vacio CHECK (BTRIM(nombre) <> '')
);

CREATE TABLE gasto (
    id BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    id_participante BIGINT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    cantidad NUMERIC(12, 2) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    moneda CHAR(3) NOT NULL,

    CONSTRAINT fk_gasto_viaje FOREIGN KEY (id_viaje)
        REFERENCES viaje(id) ON DELETE CASCADE,
    CONSTRAINT fk_gasto_participante FOREIGN KEY (id_participante)
        REFERENCES participante(id) ON DELETE CASCADE,
    CONSTRAINT ck_gasto_nombre_no_vacio CHECK (BTRIM(nombre) <> ''),
    CONSTRAINT ck_gasto_cantidad CHECK (cantidad >= 0),
    CONSTRAINT ck_gasto_moneda_longitud CHECK (CHAR_LENGTH(moneda) = 3)
);

CREATE TABLE transporte (
    id BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    precio NUMERIC(12, 2),
    fecha_salida DATE NOT NULL,
    fecha_llegada DATE NOT NULL,
    hora_salida TIME,
    hora_llegada TIME,
    origen VARCHAR(200) NOT NULL,
    destino VARCHAR(200) NOT NULL,
    fecha_checkin DATE,
    id_evento_calendario VARCHAR(255),

    CONSTRAINT fk_transporte_viaje FOREIGN KEY (id_viaje)
        REFERENCES viaje(id) ON DELETE CASCADE,
    CONSTRAINT ck_transporte_fechas CHECK (fecha_llegada >= fecha_salida),
    CONSTRAINT ck_transporte_precio CHECK (precio IS NULL OR precio >= 0)
);

CREATE TABLE actividad (
    id BIGSERIAL PRIMARY KEY,
    id_viaje BIGINT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    ubicacion VARCHAR(500),
    completado BOOLEAN NOT NULL DEFAULT FALSE,
    num_dia INTEGER NOT NULL,
    orden INTEGER NOT NULL,
    hora TIME,

    CONSTRAINT fk_actividad_viaje FOREIGN KEY (id_viaje)
        REFERENCES viaje(id) ON DELETE CASCADE,
    CONSTRAINT uq_actividad_viaje_dia_orden UNIQUE (id_viaje, num_dia, orden),
    CONSTRAINT ck_actividad_nombre_no_vacio CHECK (BTRIM(nombre) <> ''),
    CONSTRAINT ck_actividad_num_dia CHECK (num_dia > 0),
    CONSTRAINT ck_actividad_orden CHECK (orden > 0)
);

CREATE INDEX ix_viaje_id_usuario ON viaje(id_usuario);
CREATE INDEX ix_destino_id_viaje ON destino(id_viaje);
CREATE INDEX ix_tarea_id_viaje ON tarea(id_viaje);
CREATE INDEX ix_archivo_id_viaje ON archivo(id_viaje);
CREATE INDEX ix_nota_id_viaje ON nota(id_viaje);
CREATE INDEX ix_alojamiento_id_viaje ON alojamiento(id_viaje);
CREATE INDEX ix_participante_id_viaje ON participante(id_viaje);
CREATE INDEX ix_gasto_id_viaje ON gasto(id_viaje);
CREATE INDEX ix_gasto_id_participante ON gasto(id_participante);
CREATE INDEX ix_transporte_id_viaje ON transporte(id_viaje);
CREATE INDEX ix_actividad_id_viaje ON actividad(id_viaje);

-- El diagrama limita cada viaje a un máximo de 10 archivos.
CREATE OR REPLACE FUNCTION comprobar_limite_archivos_viaje()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM archivo
        WHERE id_viaje = NEW.id_viaje
    ) >= 10 THEN
        RAISE EXCEPTION 'Un viaje no puede almacenar más de 10 archivos';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_limite_archivos_viaje
BEFORE INSERT ON archivo
FOR EACH ROW
EXECUTE FUNCTION comprobar_limite_archivos_viaje();


-- ============================================================
-- DATOS DE PRUEBA
-- Tres registros lógicos por tabla
-- ============================================================


-- ------------------------------------------------------------
-- USUARIOS
-- ------------------------------------------------------------

-- {
--   "name": "Juan",
--   "surname": "García Moreno",
--   "profile_photo": "/uploads/profiles/juan.jpg",
--   "username": "wanakox",
--   "email": "juan.garcia@example.com",
--   "default_currency": "EUR",
--   "password": "Juan1234!"
-- }

-- {
--   "name": "Jimena",
--   "surname": "Rodríguez Martín",
--   "profile_photo": "/uploads/profiles/jimena.jpg",
--   "username": "jimena_rm",
--   "email": "jimena.rodriguez@example.com",
--   "default_currency": "EUR",
--   "password": "Jimena1234!"
-- }

-- {
--   "name": "Nikos",
--   "surname": "Papadakis",
--   "profile_photo": null,
--   "username": "nikos_p",
--   "email": "nikos.papadakis@example.com",
--   "default_currency": "USD",
--   "password": "Nikos1234!"
-- }


-- ------------------------------------------------------------
-- VIAJES
-- ------------------------------------------------------------

INSERT INTO viaje (
    id_usuario,
    nombre,
    origen,
    fecha_inicio,
    fecha_fin,
    descripcion,
    presupuesto,
    moneda,
    valoracion,
    estado
)
VALUES
(
    (
        SELECT id
        FROM usuario
        WHERE nombre_usuario = 'wanakox'
    ),
    'Viaje a Creta',
    'Málaga',
    '2026-05-10',
    '2026-05-17',
    'Viaje de una semana para conocer Heraclión y varias playas de Creta.',
    950.00,
    'EUR',
    5,
    'completed'
),
(
    (
        SELECT id
        FROM usuario
        WHERE nombre_usuario = 'jimena_rm'
    ),
    'Escapada a París',
    'Madrid',
    '2026-09-04',
    '2026-09-08',
    'Escapada de cuatro noches para visitar los principales monumentos de París.',
    1200.00,
    'EUR',
    NULL,
    'planning'
),
(
    (
        SELECT id
        FROM usuario
        WHERE nombre_usuario = 'nikos_p'
    ),
    'Ruta por Croacia',
    'Atenas',
    '2026-07-20',
    '2026-07-28',
    'Ruta por Zagreb, Split, Hvar y Dubrovnik.',
    1500.00,
    'EUR',
    NULL,
    'in_progress'
);


-- ------------------------------------------------------------
-- DESTINOS
-- ------------------------------------------------------------

INSERT INTO destino (
    id_viaje,
    pais,
    ciudad,
    orden,
    moneda
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'Grecia',
    'Heraclión',
    1,
    'EUR'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Escapada a París'
    ),
    'Francia',
    'París',
    1,
    'EUR'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Ruta por Croacia'
    ),
    'Croacia',
    'Split',
    1,
    'EUR'
);


-- ------------------------------------------------------------
-- TAREAS
-- ------------------------------------------------------------

INSERT INTO tarea (
    id_viaje,
    nombre,
    orden,
    prioridad,
    completado
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'Comprobar la documentación de viaje',
    1,
    'alta',
    TRUE
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Escapada a París'
    ),
    'Reservar entradas para el Museo del Louvre',
    1,
    'alta',
    FALSE
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Ruta por Croacia'
    ),
    'Descargar los billetes de autobús',
    1,
    'media',
    TRUE
);


-- ------------------------------------------------------------
-- ARCHIVOS
-- ------------------------------------------------------------

INSERT INTO archivo (
    id_viaje,
    nombre,
    ruta,
    extension,
    tamano
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'billete_vuelo_creta.pdf',
    '/uploads/trips/creta/billete_vuelo_creta.pdf',
    'pdf',
    245760
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'reserva_alojamiento.pdf',
    '/uploads/trips/creta/reserva_alojamiento.pdf',
    'pdf',
    184320
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'playa_balós.jpg',
    '/uploads/trips/creta/playa_balos.jpg',
    'jpg',
    2097152
);


-- ------------------------------------------------------------
-- NOTAS
-- ------------------------------------------------------------

INSERT INTO nota (
    id_viaje,
    titulo,
    texto,
    num_dia
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'Llegada a Heraclión',
    'Llegamos por la tarde, dejamos el equipaje y paseamos por el centro histórico.',
    1
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'Excursión a Balós',
    'La carretera fue complicada, pero las vistas y la playa merecieron la pena.',
    4
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'Último día',
    'Visitamos el puerto veneciano antes de dirigirnos al aeropuerto.',
    8
);


-- ------------------------------------------------------------
-- ALOJAMIENTOS
-- ------------------------------------------------------------

INSERT INTO alojamiento (
    id_viaje,
    nombre,
    direccion,
    fecha_checkin,
    fecha_checkout,
    hora_checkin,
    hora_checkout,
    precio
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'Heraklion Central Apartment',
    '25 August Street, Heraclión',
    '2026-05-10',
    '2026-05-17',
    '15:00',
    '11:00',
    420.00
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Escapada a París'
    ),
    'Hôtel du Centre',
    '15 Rue de Rivoli, París',
    '2026-09-04',
    '2026-09-08',
    '14:00',
    '11:00',
    640.00
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Ruta por Croacia'
    ),
    'Split Old Town Rooms',
    'Ulica Domovinskog rata 12, Split',
    '2026-07-22',
    '2026-07-25',
    '15:30',
    '10:30',
    310.00
);


-- ------------------------------------------------------------
-- PARTICIPANTES
-- ------------------------------------------------------------

INSERT INTO participante (
    id_viaje,
    nombre
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'Juan García'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Escapada a París'
    ),
    'Jimena Rodríguez'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Ruta por Croacia'
    ),
    'Nikos Papadakis'
);


-- ------------------------------------------------------------
-- GASTOS
-- ------------------------------------------------------------

INSERT INTO gasto (
    id_viaje,
    id_participante,
    nombre,
    cantidad,
    categoria,
    moneda
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    (
        SELECT p.id
        FROM participante p
        JOIN viaje v ON v.id = p.id_viaje
        WHERE
            v.nombre = 'Viaje a Creta'
            AND p.nombre = 'Juan García'
    ),
    'Cena en el puerto',
    32.50,
    'restauracion',
    'EUR'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Escapada a París'
    ),
    (
        SELECT p.id
        FROM participante p
        JOIN viaje v ON v.id = p.id_viaje
        WHERE
            v.nombre = 'Escapada a París'
            AND p.nombre = 'Jimena Rodríguez'
    ),
    'Entradas para el Louvre',
    44.00,
    'ocio',
    'EUR'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Ruta por Croacia'
    ),
    (
        SELECT p.id
        FROM participante p
        JOIN viaje v ON v.id = p.id_viaje
        WHERE
            v.nombre = 'Ruta por Croacia'
            AND p.nombre = 'Nikos Papadakis'
    ),
    'Autobús de Split a Dubrovnik',
    28.90,
    'transporte',
    'EUR'
);


-- ------------------------------------------------------------
-- TRANSPORTES
-- ------------------------------------------------------------

INSERT INTO transporte (
    id_viaje,
    tipo,
    precio,
    fecha_salida,
    fecha_llegada,
    hora_salida,
    hora_llegada,
    origen,
    destino,
    fecha_checkin,
    id_evento_calendario
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'avion',
    185.40,
    '2026-05-10',
    '2026-05-10',
    '09:30',
    '14:10',
    'Aeropuerto de Málaga',
    'Aeropuerto de Heraclión',
    '2026-05-09',
    'google-calendar-creta-flight-001'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Escapada a París'
    ),
    'avion',
    210.00,
    '2026-09-04',
    '2026-09-04',
    '08:15',
    '10:20',
    'Aeropuerto Adolfo Suárez Madrid-Barajas',
    'Aeropuerto Charles de Gaulle',
    '2026-09-03',
    NULL
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Ruta por Croacia'
    ),
    'autobus',
    28.90,
    '2026-07-25',
    '2026-07-25',
    '08:00',
    '12:30',
    'Estación de autobuses de Split',
    'Estación de autobuses de Dubrovnik',
    NULL,
    NULL
);


-- ------------------------------------------------------------
-- ACTIVIDADES
-- ------------------------------------------------------------

INSERT INTO actividad (
    id_viaje,
    nombre,
    ubicacion,
    completado,
    num_dia,
    orden,
    hora
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'Visitar el Palacio de Cnosos',
    'Palacio de Cnosos, Heraclión',
    TRUE,
    2,
    1,
    '10:00'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Escapada a París'
    ),
    'Visitar la Torre Eiffel',
    'Champ de Mars, París',
    FALSE,
    2,
    1,
    '09:30'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Ruta por Croacia'
    ),
    'Recorrer el Palacio de Diocleciano',
    'Palacio de Diocleciano, Split',
    TRUE,
    3,
    1,
    '11:00'
);

COMMIT;
