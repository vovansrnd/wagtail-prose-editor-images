(function () {
  'use strict';

  /* 1. Открытие стандартного Wagtail Image Chooser */
  function chooseImage() {
    return new Promise((resolve) => {
      // Вызываем штатное модальное окно Wagtail без лишних параметров формата
      const wf = ModalWorkflow({
        url: '/admin/images/chooser/',
        onload: window.IMAGE_CHOOSER_MODAL_ONLOAD_HANDLERS || {},
      });

      const origRespond = wf.respond.bind(wf);
      wf.respond = (step, data) => {
        // Ловим успешный выбор или загрузку картинки
        if (step === 'imageChosen' || step === 'chosen' || step === 'insertImage') {
          resolve({ data: data, modal: wf.container });
        }
        return origRespond(step, data);
      };
    });
  }

  /* 2. Вставка изображения в TipTap / ProseMirror */
  async function insertImage(editor) {
    try {
      const result = await chooseImage();
      const data = result.data;
      const modal = result.modal;

      // Закрываем окно Wagtail Bootstrap Modal, если оно открыто
      if (modal && typeof modal.modal === 'function') {
        modal.modal('hide');
      }

      // Получаем прямой URL и Alt текст
      let src = data.preview?.url || data.url;
      if (!src && data.html) {
        const doc = new DOMParser().parseFromString(data.html, 'text/html');
        src = doc.querySelector('img')?.getAttribute('src');
      }

      const alt = data.alt || data.alt_text || data.title || '';

      if (src) {
        editor
          .chain()
          .focus()
          .setImage({ src: src, alt: alt, title: alt })
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

    // Вставляем после группы списков или жирного
    const groups = menubar.querySelectorAll('.prose-menubar__group');
    if (groups.length >= 2) {
      groups[1].after(btn);
    } else {
      menubar.appendChild(btn);
    }
  }

  /* 4. Наблюдатель за появлением редакторов */
  document.addEventListener('DOMContentLoaded', () => {
    new MutationObserver(() => {
      document.querySelectorAll('.prose-editor').forEach(addImageButton);
    }).observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll('.prose-editor').forEach(addImageButton);
  });
})();

