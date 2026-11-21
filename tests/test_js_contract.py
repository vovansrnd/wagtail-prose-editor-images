"""Д67-C(I): контракт-тест JS-обработчика вставки изображений.

Гарантирует на уровне исходника обработчика (в составе пакета):
- цепочка fallback `item.url || item.download_url || item.preview?.url`
  удалена — вставка возможна ТОЛЬКО по URL permission-checked endpoint;
- non-2xx от endpoint обрабатывается явно (проверка res.ok);
- при сетевом сбое / некорректном JSON / success=false ничего не вставляется
  и показывается видимая ошибка в Wagtail admin (showInsertError);
- вставка идёт через setImage({src: finalUrl}), где finalUrl назначается
  только из data.url.
"""
from pathlib import Path

from django.test import TestCase

import wagtail_prose_editor_images


def _handler_js() -> str:
    pkg = Path(wagtail_prose_editor_images.__file__).parent
    return (pkg / "static" / "wagtail_prose_editor_images" / "js" /
            "wagtail_image_handler.js").read_text(encoding="utf-8")


class JsInsertHandlerContractTests(TestCase):
    def test_no_fallback_chain_to_chooser_urls(self):
        js = _handler_js()
        self.assertNotIn("item.url ||", js)
        self.assertNotIn("download_url", js)
        self.assertNotIn("preview?.url", js)

    def test_endpoint_is_the_only_url_source(self):
        js = _handler_js()
        self.assertIn("finalUrl = data.url;", js)
        self.assertIn(".setImage({ src: finalUrl", js)
        # RHS всех присваиваний finalUrl: объявление null и data.url — других нет
        import re as _re
        rhs = _re.findall(r"(?:let\s+)?finalUrl\s*=\s*([^\s;]+)", js)
        self.assertEqual(rhs, ["null", "data.url"])

    def test_non_2xx_and_json_failures_are_handled(self):
        js = _handler_js()
        self.assertIn("res.ok", js)  # явная проверка HTTP-статуса
        self.assertIn("data.success", js)
        self.assertIn("showInsertError(editor", js)
        # три пути отказа вызывают видимую ошибку
        self.assertGreaterEqual(js.count("showInsertError(editor"), 3)

    def test_show_insert_error_is_defined(self):
        js = _handler_js()
        self.assertIn("function showInsertError", js)
        self.assertIn("wpei-insert-error", js)

    def test_braces_balanced(self):
        js = _handler_js()
        for a, b in (("{", "}"), ("(", ")"), ("[", "]")):
            self.assertEqual(js.count(a), js.count(b))


class CacheBusterContractTests(TestCase):
    """Cache-buster handler JS обязан быть выше номера, разданного 0.2.4
    (?v=3): иначе закэшированный старый обработчик с fallback-цепочкой
    продолжит работать и обойдёт fail-closed поведение 0.2.5."""

    def test_handler_cache_buster_is_v4(self):
        from wagtail_prose_editor_images.wagtail_hooks import (
            insert_prose_editor_image_js,
        )

        html = insert_prose_editor_image_js()
        self.assertIn("wagtail_image_handler.js?v=4", html)
        self.assertNotIn("wagtail_image_handler.js?v=3", html)
        # скрипт chooser Wagtail не менялся — его версия не повышается
        self.assertIn("image-chooser-modal.js?v=3", html)
