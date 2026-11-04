// wagtail_prose_editor_images/static/wagtail_prose_editor_images/js/wagtail_image_handler.js
(function () {
  'use strict';

  // URLs are injected by the wagtail_hooks.py hook so custom admin mounts work.
  const CFG = window.WAGTAIL_PROSE_EDITOR_IMAGES || {
    chooserUrl: '/admin/images/chooser/',
    imageUrl: '/admin/prose-editor-images/api/image-url/__IMAGE_ID__/',
  };

  /* 1. Открытие Wagtail Image Chooser модалки */
  function chooseImage() {
    return new Promise((resolve) => {
      const wf = ModalWorkflow({
        url: CFG.chooserUrl,
        onload: window.IMAGE_CHOOSER_MODAL_ONLOAD_HANDLERS || {},
      });

      const origRespond = wf.respond.bind(wf);
      wf.respond = (step, data) => {
        if (step === 'chosen' || step === 'imageChosen' || step === 'insertImage') {
          resolve({ data: data, modal: wf.container });
        } else if (step === 'closed' || step === 'cancel') {
          resolve(null);
        }
        return origRespond(step, data);
      };
    });
  }

  /* 2. Вставка изображения в TipTap / ProseMirror */
  async function insertImage(editor) {
    try {
      const response = await chooseImage();
      if (!response) return; // модалку закрыли без выбора

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
          const res = await fetch(CFG.imageUrl.replace("__IMAGE_ID__", encodeURIComponent(imageId)));
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
      console.warn('[prose-editor-images] broken editor config', e);
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

  function scanForEditors(root) {
    if (root.querySelectorAll) {
      root.querySelectorAll('.prose-editor').forEach(addImageButton);
    }
  }

  /* 4. Инициализация, устойчивая к порядку инициализации редакторов.
        django-prose-editor — ES-модули и строит .prose-editor асинхронно,
        поэтому одиночный скан на DOMContentLoaded ненадёжен: если в момент
        скана menubar ещё не построен, кнопка не создаётся никогда.
        Сканируем: сразу (если body уже готов), на DOMContentLoaded, на
        window load и с отложенными ретраями; MutationObserver ловит
        редакторы, добавляемые динамически (inline-панели, preview).
        Скан идемпотентен: существующая кнопка — ранний return. */
  function scheduleScans() {
    scanForEditors(document.body);
    [250, 800, 2000].forEach((ms) => setTimeout(() => scanForEditors(document.body), ms));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleScans);
  } else {
    scheduleScans();
  }
  window.addEventListener('load', () => scanForEditors(document.body));

  let initTimer = null;
  const observer = new MutationObserver((mutations) => {
    let relevant = false;
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (
          node.classList?.contains('prose-editor') ||
          node.querySelector?.('.prose-editor') ||
          node.querySelector?.('.prose-menubar')
        ) {
          relevant = true;
        }
      }
    }
    if (!relevant) return;
    clearTimeout(initTimer);
    initTimer = setTimeout(() => scanForEditors(document.body), 100);
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
