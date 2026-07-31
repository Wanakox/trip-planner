from sqlalchemy.orm import Session

from app.core.exceptions import (
    EmailAlreadyRegisteredError,
    UsernameAlreadyRegisteredError,
)
from app.models.user import User
from app.repositories.user_repository import (
    delete_user,
    get_user_by_email,
    get_user_by_username,
    update_user,
)
from app.schemas.user import UserUpdate
from app.services.currency_service import (
    validate_currency_code,
)


def update_current_user(
    db: Session,
    user: User,
    user_data: UserUpdate,
) -> User:
    update_data = user_data.model_dump(
        exclude_unset=True,
    )

    if "email" in update_data:
        normalized_email = str(
            update_data["email"]
        ).strip().lower()

        existing_user = get_user_by_email(
            db=db,
            email=normalized_email,
        )

        if (
            existing_user is not None
            and existing_user.id != user.id
        ):
            raise EmailAlreadyRegisteredError

        update_data["email"] = normalized_email

    if "username" in update_data:
        existing_user = get_user_by_username(
            db=db,
            username=update_data["username"],
        )

        if (
            existing_user is not None
            and existing_user.id != user.id
        ):
            raise UsernameAlreadyRegisteredError

    if "default_currency" in update_data:
        update_data["default_currency"] = (
            validate_currency_code(
                update_data["default_currency"]
            )
        )

    for field, value in update_data.items():
        setattr(
            user,
            field,
            value,
        )

    return update_user(
        db=db,
        user=user,
    )


def delete_current_user(
    db: Session,
    user: User,
) -> None:
    delete_user(
        db=db,
        user=user,
    )