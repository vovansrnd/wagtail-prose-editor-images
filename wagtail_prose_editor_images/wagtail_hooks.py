from django.templatetags.static import static
from django.utils.html import format_html
from django.urls import include, path
from wagtail import hooks


@hooks.register("insert_global_admin_js")
def insert_prose_editor_image_js():
    return format_html(
        '<script src="{}"></script>\n'
        '<script src="{}" defer></script>',
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
