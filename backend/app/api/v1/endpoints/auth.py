from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.exceptions import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
    UsernameAlreadyRegisteredError,
)
from app.db.dependencies import get_db
from app.schemas.user import (
    LoginRequest,
    TokenResponse,
    UserCreate,
    UserResponse,
)
from app.services.auth_service import (
    login_user,
    register_user,
)


router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
)


DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
def register(
    user_data: UserCreate,
    db: DatabaseSession,
) -> UserResponse:
    try:
        return register_user(
            db=db,
            user_data=user_data,
        )

    except EmailAlreadyRegisteredError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        ) from exc

    except UsernameAlreadyRegisteredError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered",
        ) from exc


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate a user and return an access token",
)
def login(
    credentials: LoginRequest,
    db: DatabaseSession,
) -> TokenResponse:
    try:
        access_token = login_user(
            db=db,
            identifier=credentials.identifier,
            password=credentials.password,
        )

    except InvalidCredentialsError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect identifier or password",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        ) from exc

    return TokenResponse(
        access_token=access_token,
    )