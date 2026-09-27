// wagtail_prose_editor_images/static/wagtail_prose_editor_images/js/wagtail_image_handler.js
(function () {
  'use strict';

  /* 1. Открытие Wagtail Image Chooser модалки */
  function chooseImage() {
    return new Promise((resolve) => {
      const wf = ModalWorkflow({
        url: '/admin/images/chooser/',
        onload: window.IMAGE_CHOOSER_MODAL_ONLOAD_HANDLERS || {},
      });

      const origRespond = wf.respond.bind(wf);
      wf.respond = (step, data) => {
        if (step === 'chosen' || step === 'imageChosen' || step === 'insertImage') {
          resolve({ data: data, modal: wf.container });
        }
        return origRespond(step, data);
      };
    });
  }

  /* 2. Вставка изображения в TipTap / ProseMirror */
  async function insertImage(editor) {
    try {
      const response = await chooseImage();
      const raw = response.data || {};
      const modal = response.modal;

      if (modal && typeof modal.modal === 'function') {
        modal.modal('hide');
      }

      const item = raw.result || raw;
      const imageId = item.id;
      let alt = item.default_alt_text || item.alt || item.title || '';
      let finalUrl = null;

      // 1. Запрашиваем НАСТОЯЩИЙ оригинальный URL картинки из API по ее ID
      if (imageId) {
        try {
          const res = await fetch(`/admin/prose-editor-images/api/image-url/${imageId}/`);
          const data = await res.json();
          if (data.success && data.url) {
            finalUrl = data.url;
            alt = alt || data.title;
          }
        } catch (e) {
          console.warn('Could not fetch exact image URL from API, falling back', e);
        }
      }

      // 2. Фолбэк, если эндпоинт недоступен
      if (!finalUrl) {
        finalUrl = item.url || item.download_url || item.preview?.url;
        // Если остался суффикс превью, пробуем его срезать
        if (finalUrl && finalUrl.includes('.max-165x165.')) {
          finalUrl = finalUrl.replace('.max-165x165.', '.');
        }
      }

      // 3. Вставляем изображение в редактор
      if (finalUrl) {
        editor
          .chain()
          .focus()
          .setImage({ src: finalUrl, alt: alt, title: alt })
          .run();
      }
    } catch (err) {
      console.error('Wagtail image insert error:', err);
    }
  }

  /* 3. Кнопка на панели django-prose-editor */
  function addImageButton(wrapper) {
    const textarea = wrapper.querySelector('textarea');
    if (!textarea) return;

    let cfg = {};
    try {
      cfg = JSON.parse(
        textarea.dataset.djangoProseEditorConfigurable ||
        textarea.dataset.djangoProseEditorDefault ||
        '{}'
      );
    } catch (e) {
      return;
    }

    if (!cfg.extensions?.Image) return;
    if (wrapper.querySelector('.prose-menubar__button--wagtail-img')) return;

    const menubar = wrapper.querySelector('.prose-menubar');
    if (!menubar) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'prose-menubar__button material-icons prose-menubar__button--wagtail-img';
    btn.textContent = 'image';
    btn.title = 'Вставить изображение из Wagtail';
    btn.style.cursor = 'pointer';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const editor = wrapper.querySelector('.tiptap')?.editor;
      if (editor) {
        insertImage(editor);
      }
    });

    // Вставляем кнопку после блока списков/цитат
    const groups = menubar.querySelectorAll('.prose-menubar__group');
    if (groups.length >= 2) {
      groups[1].after(btn);
    } else {
      menubar.appendChild(btn);
    }
  }

  /* 4. Наблюдатель за появлением редакторов в DOM */
  document.addEventListener('DOMContentLoaded', () => {
    new MutationObserver(() => {
      document.querySelectorAll('.prose-editor').forEach(addImageButton);
    }).observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll('.prose-editor').forEach(addImageButton);
  });
})();
