from django.templatetags.static import static
from django.urls import include, path, reverse, reverse_lazy
from django.utils.html import format_html
from wagtail import hooks


def _chooser_url():
    try:
        return str(reverse_lazy("wagtailimages_chooser:choose"))
    except Exception:
        # Fallback for older Wagtail releases / custom admin mounts.
        return "/admin/images/chooser/"


@hooks.register("insert_global_admin_js")
def insert_prose_editor_image_js():
    # ?v= для cache-busting локальной статики (runserver без манифеста):
    # без него браузеры редакторов держат старый JS после обновления плагина.
    # При изменении static/js/wagtail_image_handler.js — поднять версию.
    # v=4: fail-closed обработчик 0.2.5 (fallback-цепочка удалена); ?v=3
    # уже раздавался релизом 0.2.4 — закэшированный старый JS обходил бы
    # новое поведение. URL скрипта chooser Wagtail не меняется.
    return format_html(
        "<script>window.WAGTAIL_PROSE_EDITOR_IMAGES = {{"
        "chooserUrl: \"{}\","
        "imageUrl: \"{}\""
        "}};</script>\n"
        '<script src="{}?v=3" defer></script>\n'
        '<script src="{}?v=4" defer></script>',
        _chooser_url(),
        reverse("wagtail_prose_editor_images:get_image_url", kwargs={"image_id": 987654321}).replace("987654321/", "__IMAGE_ID__/"),
        static("wagtailimages/js/image-chooser-modal.js"),
        static("wagtail_prose_editor_images/js/wagtail_image_handler.js"),
    )


@hooks.register("insert_global_admin_css")
def insert_prose_editor_css():
    return format_html(
        '<link rel="stylesheet" href="{}">',
        static("wagtail_prose_editor_images/css/editor.css"),
    )


@hooks.register("register_admin_urls")
def register_prose_image_urls():
    return [
        path("prose-editor-images/", include("wagtail_prose_editor_images.urls")),
    ]
