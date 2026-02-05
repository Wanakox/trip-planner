# TripPlanner – Aplicación Web de Gestión de Viajes (TFG)

## Funcionalidades

### Bloque 1 · Gestión y planificación de viajes
Este bloque se encarga de la creación, modificación y organización general de los viajes, actuando como núcleo principal de la aplicación.

- Crear viajes incluyendo los siguientes atributos: nombre, descripción, fechas de inicio y fin, estado del viaje (planificando, completado o cancelado), presupuesto, moneda principal, documentación principal, medios de transporte asociados con su precio, alojamiento con su precio, lugar de estancia y número de noches.
- Cálculo automático de la duración del viaje en días.
- Cálculo del gasto mínimo total a partir de los costes de transporte y alojamiento.
- Comparación automática entre el gasto real y el presupuesto definido.
- Editar viajes existentes para modificar cualquiera de sus atributos.
- Eliminar viajes mediante eliminación lógica, permitiendo su restauración opcional.
- Marcar viajes como favoritos para un acceso rápido.
- Gestionar los destinos asociados al viaje (países, ciudades, lugares o monumentos).
- Guardar lugares favoritos a nivel de viaje.
- Planificar el viaje por días, creando bloques diarios con descripción y actividades o lugares a visitar.

---

### Bloque 2 · Checklist
Este bloque permite la gestión de listas de tareas asociadas a un viaje, facilitando la planificación y organización previa.

- Crear checklists asociadas a un viaje.
- Crear tareas dentro de cada checklist.
- Gestionar el estado de las tareas (pendiente o completada).
- Gestionar prioridades de las tareas (alta, media, baja).

---

### Bloque 3 · Gastos
Este bloque gestiona los gastos variables generados durante el viaje.

- Registrar gastos variables asociados al viaje (supermercados, bares, restaurantes u otros gastos imprevistos).
- Recalcular automáticamente el gasto real total del viaje.
- Comparar el gasto real con el presupuesto definido.
- Conversión automática a la moneda principal si se añade un gasto en otra divisa.

---

### Bloque 4 · Registro de viajes pasados
Este bloque gestiona la información relacionada con los viajes ya realizados, identificados como aquellos cuyo estado es **completado**.

- Añadir diario o notas asociadas al viaje.
- Valorar los viajes realizados.
- Asociar fotografías o archivos al viaje.
- Visualizar los viajes en formato de lista y vista de detalle.
- Representar el desarrollo del viaje mediante una línea temporal.
- Visualizar en un mapa geográfico los lugares visitados y realizar rutas.
- Exportar la información del viaje a PDF.

---

### Bloque 5 · Búsqueda
Este bloque se encarga de las funcionalidades de búsqueda y filtrado dentro del sistema.

- Buscar viajes por nombre.
- Filtrar viajes por duración, fechas, presupuesto, país, ciudad, estado y favoritos.

---

### Bloque 6 · Gestión de usuarios
Este bloque gestiona las funcionalidades relacionadas con los usuarios de la aplicación.

- Registro de nuevos usuarios e inicio de sesión.
- Gestión del perfil de usuario (foto de perfil, idioma, zona horaria, nombre, etc.).
- Recuperación de contraseña.
- Configuración de preferencias (tema oscuro/claro, moneda).

---

### Bloque 7 · Funcionalidades extra
Este bloque recoge posibles ampliaciones del sistema consideradas como funcionalidades adicionales.

- Integración con Skyscanner o Kiwi (uso del plan gratuito) para la búsqueda de vuelos según las fechas del viaje.
- Integración con Google Calendar para registrar eventos como check-in de billetes y fechas de vuelos.

Las funcionalidades descritas definen el alcance principal del sistema y permiten una implementación incremental, dejando abiertas posibles ampliaciones como trabajo futuro.

---

## Arquitectura del sistema  
**Plataforma objetivo:** Raspberry Pi 5 Model B

El sistema sigue una arquitectura cliente–servidor desacoplada, basada en una **Single Page Application (SPA)** que consume una **API REST**, con persistencia en una base de datos relacional. Todo el sistema se despliega mediante **contenedores Docker** sobre una Raspberry Pi 5 Model B, garantizando portabilidad, reproducibilidad y facilidad de despliegue.

### Componentes principales

- **SPA**  
  Se adopta una arquitectura SPA debido a que la aplicación está orientada a usuarios autenticados y no requiere posicionamiento SEO. Este enfoque proporciona una experiencia de usuario fluida, navegación sin recargas completas y una interacción rica con formularios, mapas, filtros y visualizaciones.

- **Docker Compose**  
  Utilizado para orquestar los distintos servicios del sistema, permitiendo el despliegue conjunto de la base de datos, backend y frontend.

---

### 1. Base de datos

- **PostgreSQL**  
  Base de datos relacional con soporte robusto de transacciones, constraints, JOINs y extensiones geográficas. Adecuada para un dominio con múltiples relaciones entre entidades. Ya utilizada previamente en la asignatura de Ingeniería Web.

---

### 2. Backend
El backend se implementa como una API REST encargada de la lógica de negocio, la seguridad, la persistencia de datos y la integración con servicios externos. También se responsabiliza de la generación de documentos PDF.

- **FastAPI**  
  Framework web en Python para el desarrollo de APIs REST. Alto rendimiento y generación automática de documentación.
- **SQLAlchemy**  
  ORM para mapear las tablas de la base de datos a código Python.
- **JWT**  
  Autenticación y autorización mediante tokens para registro, inicio de sesión y control de acceso a endpoints protegidos.
- **RQ + Redis**  
  Sistema de colas para la ejecución de tareas en segundo plano.
- **WeasyPrint**  
  Librería Python para la generación de documentos PDF a partir de HTML.

---

### 3. Frontend
El frontend se implementa como una SPA que consume la API REST del backend y gestiona la interacción con el usuario.

- **React + TypeScript**  
  Construcción de la interfaz mediante componentes reutilizables con tipado estático.
- **Material UI**  
  Librería de componentes basada en Material Design, que reduce la necesidad de CSS y promueve la reutilización.
- **Leaflet + OpenStreetMap**  
  Visualización de mapas y rutas geográficas.

---

## Diseño del sistema

El sistema se diseña siguiendo una **arquitectura en capas**, donde las capas más profundas corresponden a la gestión de datos y persistencia, y las capas más superficiales se encargan de la interfaz de usuario y la interacción con el sistema. Este enfoque permite una clara separación de responsabilidades, favoreciendo la mantenibilidad, reutilización del código y escalabilidad.

La arquitectura en capas facilita la evolución independiente de cada componente, permitiendo realizar cambios en la interfaz o en la lógica de negocio sin afectar directamente a las capas inferiores, siempre que se mantengan las interfaces definidas.

### Patrones de diseño

- **DAO (Data Access Object)**  
  Encapsula el acceso a la base de datos mediante SQLAlchemy.
- **DTO (Data Transfer Object)**  
  Se utiliza para la transferencia de datos entre capas y hacia el frontend, evitando el acoplamiento directo con las entidades de persistencia.

### Modelado y proceso de desarrollo

- **UML (Unified Modeling Language)**  
  Lenguaje de modelado estándar para representar de forma clara y estructurada los distintos aspectos del sistema.
- **Proceso Unificado Ágil (AUP)**  
  Metodología de desarrollo adoptada, combinada con prácticas de **Scrumban** (Scrum + Kanban).
- **Figma**  
  Herramienta utilizada para el prototipado de la interfaz de usuario.

