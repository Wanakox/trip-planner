from sqlalchemy.orm import Session

from app.core.exceptions import (
    EmailAlreadyRegisteredError,
    UsernameAlreadyRegisteredError,
)
from app.core.security import hash_password
from backend.app.models.user import User
from app.repositories.user_repository import (
    create_user,
    get_user_by_email,
    get_user_by_username,
)
from backend.app.schemas.user import UserCreate


def register_user(
    db: Session,
    user_data: UserCreate,
) -> User:
    normalized_email = str(user_data.email).lower()

    if get_user_by_email(db, normalized_email) is not None:
        raise EmailAlreadyRegisteredError

    if get_user_by_username(db, user_data.username) is not None:
        raise UsernameAlreadyRegisteredError

    user = User(
        name=user_data.name,
        surname=user_data.surname,
        profile_photo=user_data.profile_photo,
        username=user_data.username,
        email=normalized_email,
        default_currency=user_data.default_currency,
        hashed_password=hash_password(user_data.password),
    )

    return create_user(db, user)