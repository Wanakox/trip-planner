#!/usr/bin/env bash

set -Eeuo pipefail

# Directorio donde se encuentra este script: TripPlanner/backend
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# Raíz del proyecto: TripPlanner
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

COMPOSE_FILE="${PROJECT_ROOT}/docker-compose.yml"
ENV_FILE="${PROJECT_ROOT}/.env"
HEALTH_URL="http://localhost:8000/api/v1/health"

echo "========================================"
echo "        Iniciando TripPlanner"
echo "========================================"

# Comprobaciones previas
if ! command -v docker >/dev/null 2>&1; then
    echo "Error: Docker no está instalado o no está disponible."
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker no está iniciado o tu usuario no puede acceder a él."
    exit 1
fi

if [[ ! -f "${COMPOSE_FILE}" ]]; then
    echo "Error: no se encontró ${COMPOSE_FILE}."
    exit 1
fi

if [[ ! -f "${ENV_FILE}" ]]; then
    echo "Error: no existe el archivo .env."
    echo "Créalo desde la plantilla con:"
    echo "  cp \"${PROJECT_ROOT}/.env.example\" \"${ENV_FILE}\""
    exit 1
fi

cd "${PROJECT_ROOT}"

# Reconstrucción opcional
if [[ "${1:-}" == "--build" ]]; then
    echo "Construyendo imágenes e iniciando servicios..."
    docker compose up --build -d
else
    echo "Iniciando servicios..."
    docker compose up -d
fi

echo
echo "Esperando a que la API esté disponible..."

MAX_ATTEMPTS=30
ATTEMPT=1

until curl --silent --fail "${HEALTH_URL}" >/dev/null 2>&1; do
    if [[ "${ATTEMPT}" -ge "${MAX_ATTEMPTS}" ]]; then
        echo
        echo "Error: la API no respondió después de ${MAX_ATTEMPTS} intentos."
        echo "Revisa los logs con:"
        echo "  docker compose logs backend"
        exit 1
    fi

    printf "."
    sleep 1
    ATTEMPT=$((ATTEMPT + 1))
done

echo
echo
docker compose ps

echo
echo "TripPlanner está preparado."
echo
echo "API:           http://localhost:8000"
echo "Swagger:       http://localhost:8000/docs"
echo "Health check:  ${HEALTH_URL}"
echo "pgAdmin:       http://localhost:5050"
echo
echo "Logs generales:"
echo "  docker compose logs -f"
echo
echo "Detener el entorno:"
echo "  docker compose down"