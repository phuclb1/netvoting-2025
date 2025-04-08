from enum import Enum


class UserRole(str, Enum):
    BLD = "BLD"
    DIRECTOR = "Director"
    COACH = "Coach"
    MANAGER = "Manager"
    ATHLETE = "Athlete"
    STUDENT = "Student"
    PARENT = "Parent"
