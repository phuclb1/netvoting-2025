from enum import Enum


class UploadStatus(str, Enum):
    UPLOADED = "UPLOADED"
    DONE = "DONE"
    FAILED = "FAILED"
