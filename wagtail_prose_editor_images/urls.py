# wagtail_prose_editor_images/urls.py
from django.urls import path
from . import views

app_name = "wagtail_prose_editor_images"

urlpatterns = [
    path("api/image-url/<int:image_id>/", views.get_image_url, name="get_image_url"),
]
