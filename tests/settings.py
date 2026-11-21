"""Минимальные настройки тестового набора wagtail-prose-editor-images.

SQLite in-memory; tmp MEDIA_ROOT (реальные rendition-файлы в тесте width-1200).
Пакет wagtail_prose_editor_images должен резолвиться из site-packages (wheel).
"""
import os
import tempfile

SECRET_KEY = "wpei-test-only-not-a-production-secret"
DEBUG = True
USE_TZ = True
STATIC_URL = "/static/"
MEDIA_ROOT = tempfile.mkdtemp(prefix="wpei-test-media-")
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "taggit",
    "modelcluster",
    "django_prose_editor",
    "wagtail",
    "wagtail.admin",
    "wagtail.documents",
    "wagtail.images",
    "wagtail.sites",
    "wagtail.users",
    "wagtail.snippets",
    "wagtail.contrib.forms",
    "wagtail.contrib.redirects",
    "wagtail.search",
    "wagtail.embeds",
    "wagtail_prose_editor_images",
]
MIDDLEWARE = [
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [], "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]
WAGTAIL_SITE_NAME = "test"
WAGTAILADMIN_BASE_URL = "http://tests.local"

ROOT_URLCONF = "tests.urls"
