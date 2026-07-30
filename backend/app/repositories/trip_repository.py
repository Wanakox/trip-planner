from sqlalchemy.orm import Session

from app.models.trip import Trip


def create_trip_with_destinations(
    db: Session,
    trip: Trip,
) -> Trip:
    """
    Guarda un viaje y sus destinos en una única transacción.

    Gracias a la cascada configurada en la relación, añadir el viaje
    también añade todos los destinos asociados.
    """
    try:
        db.add(trip)
        db.commit()
        db.refresh(trip)

        return trip
    except Exception:
        db.rollback()
        raise