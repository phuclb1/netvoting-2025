from fastapi import APIRouter

from internal.common.schemas.training_center import CenterResponse, ListCenterResponse
from internal.handler.training_center import TrainingCenterHandler


class TrainingCenterRoute:
    router: APIRouter
    handler: TrainingCenterHandler

    def __init__(self, handler: TrainingCenterHandler):
        self.router = APIRouter()
        self.handler = handler

        self.router.add_api_route(
            path="",
            endpoint=self.handler.create_center,
            methods=["POST"],
            response_model=CenterResponse,
            summary="Create center",
            description="Create center",
        )

        self.router.add_api_route(
            path="/{center_id}",
            endpoint=self.handler.get_center_by_id,
            methods=["GET"],
            response_model=CenterResponse,
            summary="Get center by ID",
            description="Get center by ID",
        )

        self.router.add_api_route(
            path="/{center_id}",
            endpoint=self.handler.update_center,
            methods=["PUT"],
            response_model=CenterResponse,
            summary="Update center",
            description="Update center",
        )

        self.router.add_api_route(
            path="",
            endpoint=self.handler.get_list_center,
            methods=["GET"],
            response_model=ListCenterResponse,
            summary="Get list center",
            description="Get list center",
        )

        self.router.add_api_route(
            path="",
            endpoint=self.handler.delete_center,
            methods=["DELETE"],
            summary="Delete centers",
            description="Delete centers"
        )
