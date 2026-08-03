from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.exceptions import (
    TripFileLimitExceededError,
    TripFileNotFoundError,
    TripFileStorageError,
    TripNotCompletedError,
    TripNotFoundError,
)
from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.file import TripFileResponse
from app.services.file_service import (
    add_files_to_trip,
    delete_file_from_trip,
    get_files_from_trip,
)


router = APIRouter(
    prefix="/trips/{trip_id}/files",
    tags=["files"],
)


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


@router.get(
    "",
    response_model=list[TripFileResponse],
    status_code=status.HTTP_200_OK,
    summary="Get the files from a trip",
)
def get_trip_files(
    trip_id: int,
    current_user: CurrentUser,
    db: DatabaseSession,
) -> list[TripFileResponse]:
    try:
        return get_files_from_trip(
            db=db,
            trip_id=trip_id,
            user=current_user,
        )

    except TripNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        ) from exc

    except TripNotCompletedError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Files can only be accessed "
                "for completed trips"
            ),
        ) from exc


@router.post(
    "",
    response_model=list[TripFileResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Upload files to a trip",
)
async def upload_trip_files(
    trip_id: int,
    current_user: CurrentUser,
    db: DatabaseSession,
    files: list[UploadFile],
) -> list[TripFileResponse]:
    try:
        return await add_files_to_trip(
            db=db,
            trip_id=trip_id,
            user=current_user,
            files=files,
        )

    except TripNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        ) from exc

    except TripNotCompletedError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Files can only be uploaded "
                "to completed trips"
            ),
        ) from exc

    except TripFileLimitExceededError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "The trip cannot contain "
                "more than 10 files"
            ),
        ) from exc

    except TripFileStorageError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "The uploaded files could not "
                "be stored"
            ),
        ) from exc


@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a file from a trip",
)
def delete_trip_file(
    trip_id: int,
    file_id: int,
    current_user: CurrentUser,
    db: DatabaseSession,
) -> Response:
    try:
        delete_file_from_trip(
            db=db,
            trip_id=trip_id,
            file_id=file_id,
            user=current_user,
        )

        return Response(
            status_code=status.HTTP_204_NO_CONTENT,
        )

    except TripNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found",
        ) from exc

    except TripNotCompletedError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Files can only be deleted "
                "from completed trips"
            ),
        ) from exc

    except TripFileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        ) from exc

    except TripFileStorageError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "The file could not be deleted "
                "from storage"
            ),
        ) from exc