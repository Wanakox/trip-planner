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
--   "password": "juan1234"
-- }

-- {
--   "name": "Jimena",
--   "surname": "Rubia Jimenez",
--   "profile_photo": "/uploads/profiles/jimena.jpg",
--   "username": "jimena_rj",
--   "email": "jimena.rubia@example.com",
--   "default_currency": "EUR",
--   "password": "jimena1234"
-- }

-- {
--   "name": "Fusa",
--   "surname": "Fusilla",
--   "profile_photo": null,
--   "username": "fusax",
--   "email": "fusa.fusilla@example.com",
--   "default_currency": "USD",
--   "password": "fusa1234"
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
        WHERE nombre_usuario = 'jimena_rj'
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
        WHERE nombre_usuario = 'fusax'
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
    'high',
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
    'high',
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
    'medium',
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
    moneda,
    fecha
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
    'food',
    'EUR',
    '2026-05-11'
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
    'leisure',
    'EUR',
    '2026-09-05'
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
    'transport',
    'EUR',
    '2026-07-25'
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
    fecha_checkin
)
VALUES
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Viaje a Creta'
    ),
    'flight',
    185.40,
    '2026-05-10',
    '2026-05-10',
    '09:30',
    '14:10',
    'Aeropuerto de Málaga',
    'Aeropuerto de Heraclión',
    '2026-05-09'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Escapada a París'
    ),
    'flight',
    210.00,
    '2026-09-04',
    '2026-09-04',
    '08:15',
    '10:20',
    'Aeropuerto Adolfo Suárez Madrid-Barajas',
    'Aeropuerto Charles de Gaulle',
    '2026-09-03'
),
(
    (
        SELECT id
        FROM viaje
        WHERE nombre = 'Ruta por Croacia'
    ),
    'bus',
    28.90,
    '2026-07-25',
    '2026-07-25',
    '08:00',
    '12:30',
    'Estación de autobuses de Split',
    'Estación de autobuses de Dubrovnik',
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