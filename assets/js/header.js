export function setMenuState(button, menu, expanded) {
  button.setAttribute("aria-expanded", String(expanded));
  menu.hidden = !expanded;
}

export function setMobileMenuState(button, menu, expanded) {
  button.setAttribute("aria-expanded", String(expanded));
  menu.setAttribute("aria-hidden", String(!expanded));
  menu.classList.toggle("is-open", expanded);
}

export function getContactModalMarkup() {
  return `<div class="contact-modal" data-contact-modal aria-hidden="true" hidden>
    <div class="contact-modal__backdrop" data-contact-modal-close></div>
    <section class="contact-modal__panel" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" data-contact-modal-panel>
      <button class="contact-modal__close" type="button" aria-label="Закрыть форму" data-contact-modal-close>×</button>
      <div data-contact-form-view>
        <h2 id="contact-modal-title">Написать нам</h2>
        <form class="contact-modal__form" data-contact-form>
          <label class="contact-modal__field">Ваше имя <span class="contact-modal__required" aria-hidden="true">*</span><input name="name" type="text" required autocomplete="name"></label>
          <label class="contact-modal__field">Телефон <span class="contact-modal__required" aria-hidden="true">*</span><input name="phone" type="tel" required autocomplete="tel"></label>
          <label class="contact-modal__field">Организация <span class="contact-modal__required" aria-hidden="true">*</span><input name="organization" type="text" required autocomplete="organization"></label>
          <label class="contact-modal__field">Электронная почта <span class="contact-modal__required" aria-hidden="true">*</span><input name="email" type="email" required autocomplete="email"></label>
          <label class="contact-modal__field">Описание проекта <span class="contact-modal__required" aria-hidden="true">*</span><textarea name="description" required rows="5"></textarea></label>
          <label class="contact-modal__upload">
            <input type="file" data-contact-file>
            <strong>Прикрепить файл</strong>
            <small>ТЗ, спецификацию, чертёж, опросный лист или другие материалы</small>
            <span class="contact-modal__file-name" data-contact-file-name>Файл не выбран</span>
          </label>
          <label class="contact-modal__consent"><input type="checkbox" required data-contact-consent><span>Согласие на условия обработки персональных данных</span></label>
          <button class="contact-modal__submit" type="submit">Отправить</button>
        </form>
      </div>
      <div class="contact-modal__success" role="status" data-contact-success hidden>
        <p>Спасибо! Заявка отправлена. Специалист ЭМКОМ свяжется с вами в течение рабочего дня.</p>
      </div>
    </section>
  </div>`;
}

export function getApplicationModalMarkup() {
  return `<div class="contact-modal application-modal" data-application-modal aria-hidden="true" hidden>
    <div class="contact-modal__backdrop" data-contact-modal-close></div>
    <section class="contact-modal__panel" role="dialog" aria-modal="true" aria-labelledby="application-modal-title" data-application-modal-panel>
      <button class="contact-modal__close" type="button" aria-label="Закрыть форму" data-contact-modal-close>×</button>
      <div data-contact-form-view>
        <h2 id="application-modal-title">Оставить заявку</h2>
        <form class="contact-modal__form" data-contact-form>
          <label class="contact-modal__field">Ваше имя <span class="contact-modal__required" aria-hidden="true">*</span><input name="application-name" type="text" required autocomplete="name"></label>
          <label class="contact-modal__field">Телефон <span class="contact-modal__required" aria-hidden="true">*</span><input name="application-phone" type="tel" required autocomplete="tel"></label>
          <label class="contact-modal__field">Комментарий<textarea name="application-comment" rows="5"></textarea></label>
          <label class="contact-modal__upload">
            <input type="file" data-application-file>
            <strong>Прикрепить файл</strong>
            <span class="contact-modal__file-name" data-contact-file-name>Файл не выбран</span>
          </label>
          <label class="contact-modal__consent"><input type="checkbox" required data-application-consent><span>Согласие на условия обработки персональных данных</span></label>
          <button class="contact-modal__submit" type="submit">Отправить</button>
        </form>
      </div>
      <div class="contact-modal__success" role="status" data-contact-success hidden>
        <p>Спасибо! Заявка отправлена. Специалист ЭМКОМ свяжется с вами в течение рабочего дня.</p>
      </div>
    </section>
  </div>`;
}

export function setContactModalState(modal, expanded, opener) {
  modal.hidden = !expanded;
  modal.classList.toggle("is-open", expanded);
  modal.setAttribute("aria-hidden", String(!expanded));
  modal.ownerDocument?.body?.classList.toggle("has-contact-modal", expanded);

  if (expanded && opener) {
    modal._contactOpener = opener;
  }
}

export function showContactSuccess(modal) {
  modal.querySelector("[data-contact-form-view]").hidden = true;
  modal.querySelector("[data-contact-success]").hidden = false;
}

function resetContactModal(modal) {
  const form = modal.querySelector("[data-contact-form]");
  const formView = modal.querySelector("[data-contact-form-view]");
  const success = modal.querySelector("[data-contact-success]");
  const fileName = modal.querySelector("[data-contact-file-name]");

  form.reset();
  formView.hidden = false;
  success.hidden = true;
  fileName.textContent = "Файл не выбран";
  modal._contactSubmitted = false;
}

function setupPrototypeFormModal({ openerSelector, markup, firstFieldName, fileSelector, beforeOpen = () => {} }) {
  const openers = [...document.querySelectorAll(openerSelector)];

  if (!openers.length) {
    return;
  }

  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  const modal = template.content.firstElementChild;
  document.body.append(modal);

  const form = modal.querySelector("[data-contact-form]");
  const firstField = form.elements[firstFieldName];
  const fileInput = modal.querySelector(fileSelector);
  const fileName = modal.querySelector("[data-contact-file-name]");

  const closeModal = () => {
    if (modal.hidden) {
      return;
    }

    const opener = modal._contactOpener;
    setContactModalState(modal, false);

    if (modal._contactSubmitted) {
      resetContactModal(modal);
    }

    opener?.focus();
  };

  const openModal = (opener) => {
    setContactModalState(modal, true, opener);
    window.requestAnimationFrame(() => firstField.focus());
  };

  for (const opener of openers) {
    opener.addEventListener("click", () => {
      beforeOpen();
      openModal(opener);
    });
  }

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-contact-modal-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  fileInput.addEventListener("change", () => {
    fileName.textContent = fileInput.files?.[0]?.name || "Файл не выбран";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    showContactSuccess(modal);
    modal._contactSubmitted = true;
    modal.querySelector("[data-contact-success]").focus?.();
  });
}

function setupContactModal() {
  setupPrototypeFormModal({
    openerSelector: "[data-contact-modal-open]",
    markup: getContactModalMarkup(),
    firstFieldName: "name",
    fileSelector: "[data-contact-file]",
    beforeOpen: () => {
      const mobileButton = document.querySelector("[data-mobile-menu-toggle]");
      const mobileMenu = document.querySelector("[data-mobile-menu]");

      if (mobileButton && mobileMenu) {
        setMobileMenuState(mobileButton, mobileMenu, false);
      }
    },
  });
}

function setupApplicationModal() {
  setupPrototypeFormModal({
    openerSelector: "[data-application-modal-open]",
    markup: getApplicationModalMarkup(),
    firstFieldName: "application-name",
    fileSelector: "[data-application-file]",
  });
}

function setupAboutMenu() {
  const button = document.querySelector("[data-about-toggle]");
  const menu = document.querySelector("[data-about-menu]");

  if (!button || !menu) {
    return;
  }

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    setMenuState(button, menu, !expanded);
  });

  document.addEventListener("click", (event) => {
    if (!button.contains(event.target) && !menu.contains(event.target)) {
      setMenuState(button, menu, false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(button, menu, false);
      button.focus();
    }
  });
}

function setupMobileMenu() {
  const button = document.querySelector("[data-mobile-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const header = document.querySelector(".site-header");

  if (!button || !menu || !header) {
    return;
  }

  const isMobile = () => window.matchMedia("(max-width: 900px)").matches;
  const closeMenu = () => setMobileMenuState(button, menu, false);

  const syncViewport = () => {
    closeMenu();
    if (!isMobile()) {
      menu.setAttribute("aria-hidden", "false");
    }
  };

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    setMobileMenuState(button, menu, !expanded);
  });

  menu.addEventListener("click", (event) => {
    if (isMobile() && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (isMobile() && !header.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMobile()) {
      closeMenu();
      button.focus();
    }
  });

  window.addEventListener("resize", syncViewport);
  syncViewport();
}

if (typeof document !== "undefined") {
  setupAboutMenu();
  setupMobileMenu();
  setupContactModal();
  setupApplicationModal();
}
