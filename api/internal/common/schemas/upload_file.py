from datetime import datetime
from typing import Optional

import pytz
from pydantic import BaseModel, Field

from internal.common.enums.upload_file import UploadStatus


class UploadResponse(BaseModel):
    filename: Optional[str] = Field(..., description="File name")
    status: UploadStatus = Field(..., description="Upload status")
    message: str = Field(..., description="Upload status message")
    url: Optional[str] = Field(
        default=None, description="File URL in blob storage")
    timestamp: datetime = Field(default=datetime.now(
        pytz.utc), description="Timestamp")
    file_size: Optional[int] = Field(
        default=None, description="File size in KB")


class DeleteBlobsResponse(BaseModel):
    success_deleted_urls: list[str] = Field(
        ..., description="List of URLs of blobs that were successfully deleted")
    failed_deleted_urls: list[str] = Field(
        ..., description="List of URLs of blobs that could not be deleted")
    all_deleted: bool = Field(
        ..., description="Flag indicating if all requested blobs were deleted")
