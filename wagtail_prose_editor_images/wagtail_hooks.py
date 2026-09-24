from django.templatetags.static import static
from django.utils.html import format_html
from wagtail import hooks


@hooks.register("insert_global_admin_js")
def insert_prose_editor_image_js():
    return format_html(
        '<script src="{}"></script>\n'
        '<script src="{}" defer></script>',
        static("wagtailimages/js/image-chooser-modal.js"), # Гарантирует наличие IMAGE_CHOOSER_MODAL_ONLOAD_HANDLERS!
        static("wagtail_prose_editor_images/js/wagtail_image_handler.js"),
    )

