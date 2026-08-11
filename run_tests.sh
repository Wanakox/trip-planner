#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_dir"

if ! command -v docker >/dev/null 2>&1; then
    echo "Error: Docker no está instalado o no está disponible en PATH." >&2
    exit 1
fi

if ! docker compose ps --services --status running | grep -qx "backend"; then
    echo "El servicio backend no está iniciado. Arrancándolo..."
    docker compose up -d --build backend
fi

echo "Ejecutando los tests de TripPlanner..."
docker compose exec backend pytest -v "$@"
