from sqlalchemy import BigInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    __tablename__ = "usuario"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        "nombre",
        String(100),
        nullable=False,
    )

    surname: Mapped[str] = mapped_column(
        "apellido",
        String(150),
        nullable=False,
    )

    profile_photo: Mapped[str | None] = mapped_column(
        "foto_perfil",
        String(500),
        nullable=True,
    )

    username: Mapped[str] = mapped_column(
        "nombre_usuario",
        String(50),
        nullable=False,
        unique=True,
    )

    email: Mapped[str] = mapped_column(
        "correo_electronico",
        String(255),
        nullable=False,
        unique=True,
    )

    default_currency: Mapped[str] = mapped_column(
        "moneda_predeterminada",
        String(3),
        nullable=False,
        default="EUR",
    )

    hashed_password: Mapped[str] = mapped_column(
        "contrasena_hash",
        String(255),
        nullable=False,
    )