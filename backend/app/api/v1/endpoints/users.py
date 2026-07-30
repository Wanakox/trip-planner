from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get the authenticated user",
)
def get_me(
    current_user: CurrentUser,
) -> UserResponse:
    return current_user