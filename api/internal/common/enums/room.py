from enum import Enum


class EnumRoomStatus(str, Enum):
    READY_TO_USE = "READY_TO_USE"
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE"
