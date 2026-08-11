#!/usr/bin/env bash
set -e

docker compose up -d backend
docker compose exec backend pytest -v "$@"
