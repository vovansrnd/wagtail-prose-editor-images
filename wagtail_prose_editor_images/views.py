# wagtail_prose_editor_images/views.py
from django.http import JsonResponse
from django.contrib.auth.decorators import permission_required
from wagtail.images import get_image_model

@permission_required("wagtailadmin.access_admin")
def get_image_url(request, image_id):
    """Возвращает НАСТОЯЩИЙ полный URL оригинального файла из базы данных."""
    Image = get_image_model()
    try:
        image = Image.objects.get(pk=image_id)
        return JsonResponse({
            "success": True,
            "url": image.file.url, # Физический URL файла (например: /media/images/2026/slug/foto.png)
            "title": image.title,
        })
    except Image.DoesNotExist:
        return JsonResponse({"success": False, "error": "Image not found"}, status=404)
