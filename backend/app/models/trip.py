from datetime import date
from decimal import Decimal
from enum import StrEnum
from typing import TYPE_CHECKING

from sqlalchemy import (
    BigInteger,
    Date,
    Enum,
    ForeignKey,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.destination import Destination
    from app.models.user import User


class TripStatus(StrEnum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Trip(Base):
    __tablename__ = "viaje"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        "id_usuario",
        BigInteger,
        ForeignKey(
            "usuario.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        "nombre",
        String(150),
        nullable=False,
    )

    origin: Mapped[str] = mapped_column(
        "origen",
        String(100),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        "descripcion",
        Text,
        nullable=True,
    )

    start_date: Mapped[date] = mapped_column(
        "fecha_inicio",
        Date,
        nullable=False,
    )

    end_date: Mapped[date] = mapped_column(
        "fecha_fin",
        Date,
        nullable=False,
    )

    budget: Mapped[Decimal] = mapped_column(
        "presupuesto",
        Numeric(
            precision=12,
            scale=2,
        ),
        nullable=False,
    )

    currency: Mapped[str] = mapped_column(
        "moneda",
        String(3),
        nullable=False,
        default="EUR",
    )

    status: Mapped[TripStatus] = mapped_column(
        "estado",
        Enum(
            TripStatus,
            name="trip_status",
            values_callable=lambda enum_class: [
                member.value
                for member in enum_class
            ],
        ),
        nullable=False,
        default=TripStatus.PLANNING,
    )

    rating: Mapped[int | None] = mapped_column(
        "valoracion",
        BigInteger,
        nullable=True,
    )

    user: Mapped["User"] = relationship(
        back_populates="trips",
    )

    destinations: Mapped[list["Destination"]] = relationship(
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="Destination.order",
        lazy="selectin",
    )