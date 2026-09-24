# wagtail-prose-editor-images

Adds native Wagtail Image Chooser integration to `django-prose-editor`.

## Features
- Toolbar button with native Wagtail image chooser modal.
- Clean integration with TipTap image node schema.
- Works out of the box in Wagtail Admin.

## Installation

```bash
pip install wagtail-prose-editor-images
```

Add to `INSTALLED_APPS` in your `settings.py` after `wagtail.images` and `django_prose_editor`:

```python
INSTALLED_APPS = [
    ...
    "wagtail.images",
    "django_prose_editor",
    "wagtail_prose_editor_images",
    ...
]
```

## Usage

In your model with `ProseEditorField`, simply enable the `Image` extension:

```python
from django_prose_editor.fields import ProseEditorField

class MyPage(Page):
    body = ProseEditorField(
        extensions={
            "Bold": True,
            "Italic": True,
            "Image": True,  # Enables image support and the Wagtail chooser button!
        }
    )
```
