"""Д67-C(I): fail-closed endpoint get_image_url.

- разрешённый пользователь получает URL реального rendition;
- пользователь без права choose и несуществующий image получают ОДИНАКОВЫЙ
  not-found (endpoint не раскрывает существование недоступных изображений);
- ошибка get_rendition() → контролируемый 5xx, image.file.url никогда
  не читается и не возвращается (fallback на оригинал удалён);
- отсутствие файла → контролируемый 404;
- width-1200 создаёт производный файл rendition, а не pass-through оригинал.
"""
import hashlib
import io
import re
from unittest import mock

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase
from wagtail.images import get_image_model

from PIL import Image as PILImage

Image = get_image_model()
URL = "/admin/prose-editor-images/api/image-url/{}/"


def _make_png(width=200, height=100, color=(120, 40, 200)):
    buf = io.BytesIO()
    PILImage.new("RGB", (width, height), color).save(buf, format="PNG")
    return buf.getvalue()


def _create_image(filename="test.png", content=None):
    content = content or _make_png()
    return Image.objects.create(
        title="Test image",
        file=SimpleUploadedFile(filename, content, content_type="image/png"),
    )


class ImageUrlEndpointTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        User = get_user_model()
        cls.superuser = User.objects.create_superuser(
            username="wpei-root", email="root@example.test", password="pw"
        )
        cls.staff_no_perms = User.objects.create_user(
            username="wpei-staff", password="pw", is_staff=True
        )
        cls.image = _create_image()

    def _get(self, user, image_id):
        client = Client()
        client.force_login(user)
        return client.get(URL.format(image_id))

    def test_permitted_user_gets_rendition_url(self):
        response = self._get(self.superuser, self.image.pk)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertTrue(data["url"])
        self.assertEqual(data["title"], "Test image")

    def test_rendition_url_is_not_the_original_file_url(self):
        response = self._get(self.superuser, self.image.pk)
        url = response.json()["url"]
        self.assertNotEqual(url, self.image.file.url)

    def test_no_choose_permission_and_missing_image_get_identical_not_found(self):
        # staff с доступом в админку (access_admin), но БЕЗ права choose на
        # изображение: реалистичный сценарий ограничения по коллекциям
        from django.contrib.auth.models import Permission
        self.staff_no_perms.user_permissions.add(
            Permission.objects.get(
                content_type__app_label="wagtailadmin", codename="access_admin"
            )
        )
        plain = self._get(self.staff_no_perms, self.image.pk)
        missing = self._get(self.superuser, 999_999)
        self.assertEqual(plain.status_code, 404)
        self.assertEqual(missing.status_code, 404)
        # одинаковый not-found ответ (в DEBUG Http404 отдаёт HTML-страницу —
        # сравниваем байты ответа, не JSON): не раскрываем существование
        # недоступного изображения
        self.assertEqual(plain.content, missing.content)
        self.assertNotIn(b'"url"', plain.content)

    def test_rendition_failure_returns_5xx_and_never_original_url(self):
        original_url = self.image.file.url
        with mock.patch.object(
            Image, "get_rendition", side_effect=OSError("rendition backend down")
        ):
            response = self._get(self.superuser, self.image.pk)
        self.assertGreaterEqual(response.status_code, 500)
        data = response.json()
        self.assertFalse(data["success"])
        self.assertIn("rendition", data["error"])
        # оригинальный URL не читается и не возвращается
        self.assertNotIn(original_url, response.content.decode())
        self.assertNotIn("url", data)

    def test_rendition_failure_does_not_read_file_url(self):
        """image.file.url не вызывается вовсе: заглушка на file.url падает
        тест, если код попытается построить fallback."""
        with mock.patch.object(
            Image, "get_rendition", side_effect=OSError("rendition backend down")
        ):
            with mock.patch.object(
                type(self.image.file), "url",
                side_effect=AssertionError("image.file.url must not be read on failure"),
            ):
                response = self._get(self.superuser, self.image.pk)
        self.assertGreaterEqual(response.status_code, 500)

    def test_missing_file_returns_404(self):
        # file="" нельзя создать напрямую (width/height NOT NULL) — создаём
        # реальное изображение и очищаем файл обходом ORM-сохранения
        empty = _create_image(filename="missing.png")
        Image.objects.filter(pk=empty.pk).update(file="")
        empty.refresh_from_db()
        response = self._get(self.superuser, empty.pk)
        self.assertEqual(response.status_code, 404)
        self.assertFalse(response.json()["success"])
        self.assertIn("missing", response.json()["error"])

    def test_width_1200_creates_real_derived_rendition(self):
        """width-1200 создаёт производный файл (не pass-through оригинал):
        отдельный файл в MEDIA_ROOT, отличный URL и отличный контент."""
        from django.conf import settings

        rendition = self.image.get_rendition("width-1200")
        rendition_file_path = rendition.file.path
        original_path = self.image.file.path
        self.assertNotEqual(rendition_file_path, original_path)
        self.assertNotEqual(rendition.url, self.image.file.url)
        original_bytes = open(original_path, "rb").read()
        rendition_bytes = open(rendition_file_path, "rb").read()
        self.assertNotEqual(
            hashlib.sha256(original_bytes).hexdigest(),
            hashlib.sha256(rendition_bytes).hexdigest(),
        )
        # файл лежит внутри MEDIA_ROOT тестов
        self.assertTrue(rendition_file_path.startswith(settings.MEDIA_ROOT))

    def test_custom_rendition_spec_setting_is_respected(self):
        """Настройка WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC применяется."""
        from django.test import override_settings

        with override_settings(WAGTAIL_PROSE_EDITOR_IMAGES_RENDITION_SPEC="width-60"):
            response = self._get(self.superuser, self.image.pk)
        self.assertEqual(response.status_code, 200)
        url = response.json()["url"]
        m = re.search(r"width-60", url)
        self.assertIsNotNone(m, url)
