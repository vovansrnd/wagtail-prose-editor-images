# Changelog — wagtail_prose_editor_images

All notable changes for this package are documented here. Version numbers below are **prepared release candidates** in this audit bundle; they are not a claim that those versions have already been uploaded to PyPI.

## [0.2.3] — 2026-10-29 — prepared, not yet published

- Require permission to choose the specific image before returning its URL; clarify original-file URL semantics and Collection-permission testing.
- Expanded installation, security, troubleshooting, storage/integration and multi-language documentation.
- Added translated README files for English, Russian, German, Spanish, French, Italian, Brazilian Portuguese, Dutch, Polish, Turkish, Simplified Chinese, Japanese and Korean.
- Static syntax/packaging checks are included in the release bundle. Complete Django/Wagtail integration tests and live storage/permission checks remain a release gate.

## Previous releases

See the package's release history on PyPI and its source repository, where available.

## 2026-10-29 — follow-up audit

- The permission-checked image endpoint now returns a configurable Wagtail rendition (default `width-1200`) rather than the original in ordinary operation.
- Replaced URL string slicing with an explicit image-ID placeholder in the admin JS configuration.
- Retained the chooser modal script used by the current Wagtail integration; do not remove it without testing the exact installed Wagtail version.
- Updated all localized README guides to note rendition storage cost and the last-resort original URL fallback.
