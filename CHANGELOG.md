# Changelog — wagtail_prose_editor_images

All notable changes for this package are documented here. PyPI availability is tracked per release: entries below describe the package state at that version; publication happens separately once approved.

## [0.2.4] — 2026-11-04

- Fixed the "Insert image from Wagtail" menubar button never appearing: the button condition
  read `window.WAGTAIL_PROSE_EDITOR_IMAGES.extensions`, which the admin hook never populated,
  so the check was always false on every project. The condition now reads the per-field
  serialized config (`data-django-prose-editor-configurable` on the field's own textarea), so
  the button appears only on ProseEditorFields that actually enable the `Image` extension.
- Made editor scanning robust against asynchronous editor initialization (ES-module
  django-prose-editor builds `.prose-editor` after DOMContentLoaded): immediate scan when the
  DOM is ready, DOMContentLoaded scan, `window load` scan, delayed retries and a
  MutationObserver tuned to menubar additions. Scans are idempotent.
- Added `?v=` cache-busting to the hook-injected admin scripts so editor browsers pick up
  plugin updates without manual cache clearing (runserver/local statics have no manifest
  hashes). Bump the version in `wagtail_hooks.py` when `wagtail_image_handler.js` changes.

## [0.2.3] — 2026-10-29

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
