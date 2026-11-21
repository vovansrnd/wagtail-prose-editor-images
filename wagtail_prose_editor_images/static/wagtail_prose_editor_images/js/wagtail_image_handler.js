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

      // Единственный источник URL — permission-checked endpoint плагина.
      // Fallback на адреса из ответа chooser (любые поля item, кроме id)
      // ЗАПРЕЩЁН: эти адреса не проходят проверку прав и могут быть
      // полноразмерным оригиналом вместо производного rendition. При любом
      // сбое endpoint (сетевая ошибка, non-2xx, некорректный JSON,
      // success=false) ничего не вставляется и показывается понятная ошибка.
      if (imageId) {
        let data;
        try {
          const res = await fetch(CFG.imageUrl.replace("__IMAGE_ID__", encodeURIComponent(imageId)));
          if (!res.ok) {
            throw new Error('Image URL endpoint returned HTTP ' + res.status);
          }
          data = await res.json();
        } catch (e) {
          console.error('Wagtail image URL endpoint failed:', e);
          showInsertError(editor, 'Could not retrieve the image URL from the server. The image was not inserted.');
          return;
        }
        if (!data.success || !data.url) {
          console.warn('Image URL endpoint did not return a URL:', data);
          showInsertError(editor, 'The server did not return an image URL (the file may be unavailable). The image was not inserted.');
          return;
        }
        finalUrl = data.url;
        alt = alt || data.title;
      } else {
        showInsertError(editor, 'The image chooser returned an unknown image reference. The image was not inserted.');
        return;
      }

      // Вставляем изображение в редактор — только по проверенному URL
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

  /* Видимая ошибка вставки в Wagtail admin (рядом с полем редактора). */
  function showInsertError(editor, message) {
    try {
      const dom = editor && editor.view ? editor.view.dom : null;
      const container = dom
        ? (dom.closest('.w-field, .object, .prose-editor') || dom.parentElement)
        : null;
      if (!container) {
        window.alert(message);
        return;
      }
      let box = container.querySelector('.wpei-insert-error');
      if (!box) {
        box = document.createElement('div');
        box.className = 'wpei-insert-error';
        box.style.cssText = 'color:#cd3238;background:#f6e7e8;border:1px solid #e0b4b6;'
          + 'padding:6px 10px;margin-top:6px;border-radius:3px;font-size:13px;';
        container.appendChild(box);
      }
      box.textContent = message;
      clearTimeout(box._wpeiTimer);
      box._wpeiTimer = setTimeout(() => box.remove(), 8000);
    } catch (e) {
      console.error('Could not show insert error UI:', e);
      window.alert(message);
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
