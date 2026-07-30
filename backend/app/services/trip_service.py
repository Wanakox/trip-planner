from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import (
    InvalidTripDatesError,
    TripNotCompletedError,
    TripNotFoundError,
)
from app.models.destination import Destination
from app.models.trip import Trip, TripStatus
from app.models.user import User
from app.repositories.trip_repository import (
    create_trip_with_destinations,
)
from app.schemas.trip import (
    TripCreate,
    TripUpdate,
)
from app.services.currency_service import (
    validate_currency_code,
)


def create_trip(
    db: Session,
    user: User,
    trip_data: TripCreate,
) -> Trip:
    """
    Crea un viaje junto con sus destinos iniciales.
    """

    normalized_trip_currency = validate_currency_code(
        trip_data.currency
    )

    trip = Trip(
        user_id=user.id,
        name=trip_data.name,
        origin=trip_data.origin,
        description=trip_data.description,
        start_date=trip_data.start_date,
        end_date=trip_data.end_date,
        budget=trip_data.budget,
        currency=normalized_trip_currency,
        status=TripStatus.PLANNING,
    )

    trip.destinations = [
        Destination(
            country=destination_data.country,
            city=destination_data.city,
            currency=validate_currency_code(
                destination_data.currency
            ),
            order=index,
        )
        for index, destination_data in enumerate(
            trip_data.destinations,
            start=1,
        )
    ]

    return create_trip_with_destinations(
        db=db,
        trip=trip,
    )


def update_trip(
    db: Session,
    user: User,
    trip_id: int,
    trip_data: TripUpdate,
) -> Trip:
    """
    Actualiza parcialmente los datos generales de un viaje.

    Esta función no modifica los destinos.
    """

    statement = select(Trip).where(
        Trip.id == trip_id,
        Trip.user_id == user.id,
    )

    trip = db.scalar(statement)

    if trip is None:
        raise TripNotFoundError

    update_data = trip_data.model_dump(
        exclude_unset=True,
    )

    if "currency" in update_data:
        update_data["currency"] = (
            validate_currency_code(
                update_data["currency"]
            )
        )

    updated_start_date = update_data.get(
        "start_date",
        trip.start_date,
    )

    updated_end_date = update_data.get(
        "end_date",
        trip.end_date,
    )

    if updated_end_date < updated_start_date:
        raise InvalidTripDatesError

    for field, value in update_data.items():
        setattr(
            trip,
            field,
            value,
        )

    try:
        db.commit()
        db.refresh(trip)
    except Exception:
        db.rollback()
        raise

    return trip

def update_trip_rating(
    db: Session,
    user: User,
    trip_id: int,
    rating: int,
) -> Trip:
    """
    Crea o reemplaza la valoración de un viaje completado.
    """

    statement = select(Trip).where(
        Trip.id == trip_id,
        Trip.user_id == user.id,
    )

    trip = db.scalar(statement)

    if trip is None:
        raise TripNotFoundError

    if trip.status != TripStatus.COMPLETED:
        raise TripNotCompletedError

    trip.rating = rating

    try:
        db.commit()
        db.refresh(trip)
    except Exception:
        db.rollback()
        raise

    return trip