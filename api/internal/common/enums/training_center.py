from enum import Enum


class CenterType(str, Enum):
    FOOTBALL = "Football"
    BASKETBALL = "Basketball"


class CenterDepartment(str, Enum):
    AFFILIATED = "Affiliated"
    COOPERATE = "Cooperate"
