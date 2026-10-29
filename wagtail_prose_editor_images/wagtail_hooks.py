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
    return format_html(
        "<script>window.WAGTAIL_PROSE_EDITOR_IMAGES = {{"
        "chooserUrl: \"{}\","
        "imageUrl: \"{}\""
        "}};</script>\n"
        '<script src="{}" defer></script>\n'
        '<script src="{}" defer></script>',
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
