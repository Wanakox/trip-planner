"""Deterministic configuration shared by the backend test suite."""

import os

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-not-for-production")
os.environ.setdefault("DUFFEL_ACCESS_TOKEN", "test-duffel-token")
