# Application Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать кнопку «Получить предварительный расчёт» интерактивной на трёх согласованных страницах и открывать отдельную демонстрационную форму «Оставить заявку».

**Architecture:** Вторая форма создаётся общей функцией из `assets/js/header.js` только на страницах с маркером `data-application-modal-open`. Она переиспользует проверенные вспомогательные функции открытия, закрытия, очистки и экрана благодарности, но имеет собственную разметку и независимое состояние. Общие модальные стили остаются в `assets/css/prototype.css`.

**Tech Stack:** HTML5, CSS, JavaScript ES modules, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Существующая форма «Написать нам» не изменяет состав полей и текстов.
- Большая форма на главной странице не изменяется.
- Вторая форма появляется только на детальной странице решения, детальной странице услуги и странице производства.
- Обязательны имя, телефон и согласие на обработку персональных данных.
- Комментарий и файл необязательны.
- Данные не отправляются на сервер.
- Точный текст успеха: «Спасибо! Заявка отправлена. Специалист ЭМКОМ свяжется с вами в течение рабочего дня.»

---

### Task 1: Тестовый контракт второй формы

**Files:**
- Create: `tests/application-modal.test.mjs`
- Test: `tests/application-modal.test.mjs`

**Interfaces:**
- Consumes: текущие HTML-страницы, `assets/js/header.js`, `assets/css/prototype.css`.
- Produces: контракт для `getApplicationModalMarkup()`, `data-application-modal-open` и адаптивных стилей.

- [ ] **Step 1: Write the failing test**

Создать `tests/application-modal.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const targets = [
  "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html",
  "services/predproektnoe-obsledovanie/index.html",
  "production/index.html",
];

test("three approved pages expose the application modal button", () => {
  for (const path of targets) {
    assert.match(
      read(path),
      /<button class="service-detail-calculation-control" type="button"[^>]*data-application-modal-open[^>]*>Получить предварительный расчёт<\/button>/,
      path,
    );
  }
});

test("application modal markup contains only the approved fields", async () => {
  const { getApplicationModalMarkup } = await import("../assets/js/header.js");
  const markup = getApplicationModalMarkup();
  assert.match(markup, /id="application-modal-title">Оставить заявку<\/h2>/);
  assert.match(markup, /name="application-name" type="text" required/);
  assert.match(markup, /name="application-phone" type="tel" required/);
  assert.match(markup, /name="application-comment"/);
  assert.doesNotMatch(markup, /name="application-comment"[^>]*required/);
  assert.match(markup, /type="file" data-application-file/);
  assert.doesNotMatch(markup, /type="file"[^>]*required/);
  assert.match(markup, /type="checkbox" required data-application-consent/);
  assert.match(markup, />Отправить<\/button>/);
});

test("application modal contains the exact success copy", async () => {
  const { getApplicationModalMarkup } = await import("../assets/js/header.js");
  assert.match(
    getApplicationModalMarkup(),
    /Спасибо! Заявка отправлена\. Специалист ЭМКОМ свяжется с вами в течение рабочего дня\./,
  );
});

test("application modal reuses responsive modal styling", () => {
  const css = read("assets/css/prototype.css");
  assert.match(css, /\.service-detail-calculation-control\s*\{[^}]*cursor:\s*pointer/s);
  assert.match(css, /@media \(max-width:\s*600px\)[\s\S]*\.contact-modal__panel\s*\{[^}]*min-height:\s*100vh/s);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/application-modal.test.mjs`

Expected: FAIL because the three elements are still `<span>` controls and `getApplicationModalMarkup` does not exist.

- [ ] **Step 3: Commit the failing contract**

```bash
git add -- tests/application-modal.test.mjs
git commit -m "test: define application modal contract"
```

---

### Task 2: Общая разметка и поведение формы

**Files:**
- Modify: `assets/js/header.js`
- Test: `tests/application-modal.test.mjs`

**Interfaces:**
- Consumes: `setContactModalState(modal, expanded, opener)`, `showContactSuccess(modal)` и внутреннюю очистку формы.
- Produces: `getApplicationModalMarkup(): string` и `setupApplicationModal(): void`.

- [ ] **Step 1: Add the application modal markup**

Добавить экспортируемую функцию:

```js
export function getApplicationModalMarkup() {
  return `<div class="contact-modal application-modal" data-application-modal aria-hidden="true" hidden>
    <div class="contact-modal__backdrop" data-contact-modal-close></div>
    <section class="contact-modal__panel" role="dialog" aria-modal="true" aria-labelledby="application-modal-title">
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
```

- [ ] **Step 2: Extract one private modal initializer**

Заменить дублируемую настройку формы общей функцией с точной сигнатурой:

```js
function setupPrototypeFormModal({ openerSelector, markup, firstFieldName, fileSelector, beforeOpen = () => {} }) {
  const openers = [...document.querySelectorAll(openerSelector)];
  if (!openers.length) return;

  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  const modal = template.content.firstElementChild;
  document.body.append(modal);

  const form = modal.querySelector("[data-contact-form]");
  const firstField = form.elements[firstFieldName];
  const fileInput = modal.querySelector(fileSelector);
  const fileName = modal.querySelector("[data-contact-file-name]");

  const closeModal = () => {
    if (modal.hidden) return;
    const opener = modal._contactOpener;
    setContactModalState(modal, false);
    if (modal._contactSubmitted) resetContactModal(modal);
    opener?.focus();
  };

  for (const opener of openers) {
    opener.addEventListener("click", () => {
      beforeOpen();
      setContactModalState(modal, true, opener);
      window.requestAnimationFrame(() => firstField.focus());
    });
  }

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-contact-modal-close]")) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
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
  });
}
```

Передать форме «Написать нам» callback `beforeOpen`, который закрывает мобильное меню через существующий `setMobileMenuState`. Для второй формы использовать значение по умолчанию, потому что её кнопки находятся в содержимом страницы.

- [ ] **Step 3: Initialize both independent forms**

Использовать общую функцию в двух оболочках:

```js
function setupContactModal() {
  setupPrototypeFormModal({
    openerSelector: "[data-contact-modal-open]",
    markup: getContactModalMarkup(),
    firstFieldName: "name",
    fileSelector: "[data-contact-file]",
    beforeOpen: () => {
      const mobileButton = document.querySelector("[data-mobile-menu-toggle]");
      const mobileMenu = document.querySelector("[data-mobile-menu]");
      if (mobileButton && mobileMenu) setMobileMenuState(mobileButton, mobileMenu, false);
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

if (typeof document !== "undefined") {
  setupAboutMenu();
  setupMobileMenu();
  setupContactModal();
  setupApplicationModal();
}
```

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/contact-modal.test.mjs tests/application-modal.test.mjs`

Expected: markup tests pass; button tests remain failing until Task 3. Existing contact-modal tests remain green.

- [ ] **Step 5: Commit shared behavior**

```bash
git add -- assets/js/header.js tests/application-modal.test.mjs
git commit -m "feat: add application modal behavior"
```

---

### Task 3: Подключение трёх кнопок и стили

**Files:**
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html`
- Modify: `services/predproektnoe-obsledovanie/index.html`
- Modify: `production/index.html`
- Modify: `assets/css/prototype.css`
- Modify: existing version assertions in `tests/*.test.mjs`
- Test: `tests/application-modal.test.mjs`

**Interfaces:**
- Consumes: `data-application-modal-open` from Task 2.
- Produces: three live buttons and button styling compatible with the current detail-page layout.

- [ ] **Step 1: Replace the three visual controls with buttons**

На каждой из трёх страниц заменить `span` на точную разметку:

```html
<button class="service-detail-calculation-control" type="button" data-application-modal-open>Получить предварительный расчёт</button>
```

На странице производства сохранить `data-production-calculation-control` дополнительно на этой же кнопке, чтобы действующий тест структуры производства продолжал проверять элемент.

- [ ] **Step 2: Make the existing control style button-safe**

Дополнить правило `.service-detail-calculation-control`:

```css
.service-detail-calculation-control {
  border: 0;
  cursor: pointer;
  font: inherit;
}
```

Сохранить существующие размеры, фон, цвет и мобильное правило ширины 100%.

- [ ] **Step 3: Bump shared asset cache keys**

Во всех готовых HTML-страницах заменить:

```text
prototype.css?v=20260820-1 -> prototype.css?v=20260820-2
header.js?v=20260820-1 -> header.js?v=20260820-2
```

Обновить точные ожидания версий в существующих тестах тем же значением `20260820-2`.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test tests/application-modal.test.mjs tests/contact-modal.test.mjs tests/service-detail.test.mjs tests/services-section.test.mjs tests/production-page.test.mjs`

Expected: all focused tests pass.

Run: `npm test`

Expected: 0 failures.

- [ ] **Step 5: Commit page integration**

```bash
git add -- assets/css/prototype.css assets/js/header.js cases/index.html cases/proekt-1/index.html company/history/index.html company/index.html company/licenses/index.html company/partners/index.html company/staff/index.html company/staff/sotrudnik/index.html contacts/index.html index.html knowledge/index.html knowledge/statya-1/index.html production/index.html services/index.html services/predproektnoe-obsledovanie/index.html solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html solutions/index.html tests/application-modal.test.mjs tests/cases-section.test.mjs tests/company.test.mjs tests/contacts-page.test.mjs tests/foundation.test.mjs tests/history.test.mjs tests/homepage.test.mjs tests/knowledge-base.test.mjs tests/licenses.test.mjs tests/partners.test.mjs tests/production-page.test.mjs tests/service-detail.test.mjs tests/services-page.test.mjs tests/services-section.test.mjs tests/solutions-hierarchy.test.mjs
git commit -m "feat: connect application modal to detail pages"
```

---

### Task 4: Документация, публикация и браузерная проверка

**Files:**
- Modify: `PROJECT.md`
- Verify: all changed source and test files.

**Interfaces:**
- Consumes: завершённые Tasks 1–3.
- Produces: опубликованную и проверенную вторую форму.

- [ ] **Step 1: Document the second form**

Добавить в `PROJECT.md`:

```markdown
## Модальная форма «Оставить заявку»

- Открывается кнопкой «Получить предварительный расчёт» на детальной странице решения, услуги и странице производства.
- Обязательны имя, телефон и согласие на обработку персональных данных.
- Комментарий и файл необязательны.
- Отправка демонстрационная: данные не передаются на сервер.
```

- [ ] **Step 2: Verify repository state**

Run: `git diff --check && npm test && git status --short`

Expected: `git diff --check` and `npm test` exit 0; status contains only the intended documentation change before commit.

- [ ] **Step 3: Commit documentation**

```bash
git add -- PROJECT.md
git commit -m "docs: describe application modal"
```

- [ ] **Step 4: Publish the approved branch to main**

Push the feature branch, merge it into `main` through the repository API, and wait for the `pages-build-deployment` workflow associated with the merge commit to finish successfully.

- [ ] **Step 5: Verify the public desktop flow**

At `1440×1000`, open each of the three pages and confirm:

- the button opens «Оставить заявку»;
- the panel is centered and approximately 580 px wide;
- empty submission is rejected;
- name, phone and consent permit submission without comment or file;
- the exact success text appears;
- close restores focus to the opener.

- [ ] **Step 6: Verify the public mobile flow**

At `390×844`, confirm the modal fills the viewport, scrolls vertically, keeps every field accessible and has no horizontal overflow.

- [ ] **Step 7: Final verification and cleanup**

Run on the updated local `main`:

```bash
npm test
git status --short --branch
git rev-parse HEAD
git rev-parse origin/main
```

Expected: all tests pass, the worktree is clean, and local `main` equals `origin/main`. Delete only the merged temporary feature branch.
