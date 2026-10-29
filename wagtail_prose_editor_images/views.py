# wagtail_prose_editor_images/views.py
from django.conf import settings
from django.contrib.auth.decorators import permission_required
from django.http import Http404, JsonResponse
from django.views.decorators.http import require_GET
from wagtail.images import get_image_model
from wagtail.images.permissions import permission_policy


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

    if not permission_policy.user_has_permission_for_instance(
        request.user, "choose", image
    ):
        # Return the same response for a missing image and an inaccessible one,
        # so the endpoint does not disclose private image IDs.
        raise Http404("Image not found")

    url = None
    if image.file:
        spec = getattr(settings, "WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC", "width-1200")
        try:
            url = image.get_rendition(spec).url
        except Exception:
            import logging
            logging.getLogger(__name__).exception(
                "Could not make rendition %s for image %s", spec, image_id
            )
            # Explicit last-resort fallback. Monitor rendition failures because
            # this can insert a full-size original into article HTML.
            try:
                url = image.file.url
            except (OSError, ValueError, FileNotFoundError):
                url = None
    if not url:
        return JsonResponse(
            {"success": False, "error": "Image file is missing"}, status=404
        )
    return JsonResponse({"success": True, "url": url, "title": image.title})
