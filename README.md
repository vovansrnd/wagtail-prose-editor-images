# wagtail-prose-editor-images

Adds native Wagtail Image Chooser integration to `django-prose-editor`.

![Wagtail Prose Editor with Image Chooser](https://raw.githubusercontent.com/vovansrnd/wagtail-prose-editor-images/main/prose-editor-preview.png)

## Features
- **Native Chooser Integration**: Opens Wagtail's standard image picker modal directly from the toolbar.
- **Full-Resolution Insertion**: Automatically selects the full-size original image URL rather than thumbnails.
- **Wagtail-Native Theming**: Seamlessly matches Wagtail's neutral light and dark admin color schemes.
- **Inline and Block Code Styling**: High-contrast, readable `<pre><code>` blocks out of the box.

## Installation

```bash
pip install wagtail-prose-editor-images
```

Add to `INSTALLED_APPS` in your `settings.py`:

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

In your model with `ProseEditorField`, enable the `Image` extension:

```python
from django_prose_editor.fields import ProseEditorField

class MyPage(Page):
    body = ProseEditorField(
        extensions={
            "Bold": True,
            "Italic": True,
            "Heading": {"levels": [2, 3]},
            "Image": True,  # Enables the Wagtail Image Chooser button!
            "Code": True,
            "CodeBlock": True,
        }
    )
```

## Recommended Complementary Package
Tired of dumping all uploaded images into a flat `media/original_images/` folder? Organize your media into clean `year/slug` directories:
👉 **[wagtail-image-directories](https://github.com/vovansrnd/wagtail-image-directories)**

![Wagtail Image Navigator Dashboard](https://raw.githubusercontent.com/vovansrnd/wagtail-image-directories/main/navigator-preview.png)

## Case Study & Background
Read the full story behind the migration and architecture on our blog: [Vs-Svet.ru](https://vs-svet.ru/) / [ZenWay.ru](https://zenway.ru/).
