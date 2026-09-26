(function () {
  'use strict';

  function chooseImage() {
    return new Promise((resolve) => {
      // Вызываем штатный ModalWorkflow
      const wf = ModalWorkflow({
        url: '/admin/images/chooser/',
        onload: window.IMAGE_CHOOSER_MODAL_ONLOAD_HANDLERS || {},
      });

      const origRespond = wf.respond.bind(wf);
      wf.respond = (step, data) => {
        // Ловим успешный выбор или создание изображения
        if (step === 'chosen' || step === 'imageChosen' || step === 'insertImage') {
          resolve({ data: data, modal: wf.container });
        }
        return origRespond(step, data);
      };
    });
  }

  async function insertImage(editor) {
    try {
      const response = await chooseImage();
      const raw = response.data || {};
      const modal = response.modal;

      // Закрываем модальное окно Bootstrap/Wagtail
      if (modal && typeof modal.modal === 'function') {
        modal.modal('hide');
      }

      // В Wagtail данные могут лежать в корне data или внутри data.result
      const item = raw.result || raw;

      let src = item.url || item.download_url || item.preview?.url;
      if (!src && item.html) {
        const doc = new DOMParser().parseFromString(item.html, 'text/html');
        src = doc.querySelector('img')?.getAttribute('src');
      }

      const alt = item.default_alt_text || item.alt || item.title || '';

      if (src) {
        editor
          .chain()
          .focus()
          .setImage({ src: src, alt: alt, title: alt })
          .run();
      }
    } catch (err) {
      console.error('Error inserting Wagtail image:', err);
    }
  }

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

    const groups = menubar.querySelectorAll('.prose-menubar__group');
    if (groups.length >= 2) {
      groups[1].after(btn);
    } else {
      menubar.appendChild(btn);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new MutationObserver(() => {
      document.querySelectorAll('.prose-editor').forEach(addImageButton);
    }).observe(document.body, { childList: true, subtree: true });

    document.querySelectorAll('.prose-editor').forEach(addImageButton);
  });
})();
