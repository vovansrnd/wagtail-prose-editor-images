"""URLConf тестов: админ Wagtail; endpoint плагина подключается хуком
register_admin_urls (поэтому отдельный include не нужен — иначе дублируется
namespace wagtail_prose_editor_images)."""
from django.urls import include, path

urlpatterns = [
    path("admin/", include("wagtail.admin.urls")),
]
