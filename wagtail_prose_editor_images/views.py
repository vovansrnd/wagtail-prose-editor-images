# wagtail_prose_editor_images/views.py
import logging

from django.conf import settings
from django.contrib.auth.decorators import permission_required
from django.http import Http404, JsonResponse
from django.views.decorators.http import require_GET
from wagtail.images import get_image_model

logger = logging.getLogger(__name__)


def _image_permission_policy():
    """Resolve Wagtail's image policy after the image app is ready.

    Wagtail 8.0+ exposes the permission policy registry
    (`wagtail.permissions.policy_registry`); Wagtail 6.x/7.x only has the
    module-level `wagtail.images.permissions.permission_policy`. Try the
    registry first and fall back to the legacy policy lazily (never at module
    import time), so the declared floor `wagtail>=6.0` actually works.
    """
    try:
        from wagtail.permissions import policy_registry
    except ImportError:
        from wagtail.images.permissions import permission_policy

        return permission_policy
    return policy_registry.get_by_type(get_image_model())


@require_GET
@permission_required("wagtailadmin.access_admin", raise_exception=True)
def get_image_url(request, image_id):
    """Return an image URL only when the user may choose that image.

    A broad admin-access permission is not sufficient: Wagtail collections can
    restrict which images a user is allowed to view/use.
    """
    Image = get_image_model()
    try:
        image = Image.objects.select_related("collection").get(pk=image_id)
    except Image.DoesNotExist:
        raise Http404("Image not found")

    if not _image_permission_policy().user_has_permission_for_instance(
        request.user, "choose", image
    ):
        # Return the same response for a missing image and an inaccessible one,
        # so the endpoint does not disclose private image IDs.
        raise Http404("Image not found")

    if not image.file:
        return JsonResponse(
            {"success": False, "error": "Image file is missing"}, status=404
        )

    spec = getattr(settings, "WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC", "width-1200")
    try:
        url = image.get_rendition(spec).url
    except Exception:
        logger.exception(
            "Could not make rendition %s for image %s", spec, image_id
        )
        # Fail closed: NEVER fall back to image.file.url — that would insert
        # a full-size original into published article HTML. The endpoint only
        # ever returns the URL of a real derived rendition.
        return JsonResponse(
            {"success": False, "error": "Could not generate image rendition"},
            status=500,
        )
    return JsonResponse({"success": True, "url": url, "title": image.title})
