from internal.common.exceptions.common import XBaseException


class ExceptionFileTypeNotAccepted(XBaseException):
    def __init__(self, file_type):
        self.message = f"File type {file_type} not accept"
        super().__init__(status_code=400, message=self.message)


class ExceptionFileTooLarge(XBaseException):
    def __init__(self, max_size):
        self.message = f"File too large, max size is {max_size}"
        super().__init__(status_code=413, message=self.message)


class ExceptionMaxUploadFilesExceeded(XBaseException):
    def __init__(self, max_files: int):
        self.message = f"Maximum number of concurrent upload files is {max_files}"
        super().__init__(status_code=400, message=self.message)
