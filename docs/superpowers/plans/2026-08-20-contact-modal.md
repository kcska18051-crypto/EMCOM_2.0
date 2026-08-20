# Contact Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить CTA в шапке всех страниц на кнопку «Написать нам» и добавить единое интерактивное модальное окно с согласованными полями, загрузкой файла и успешным состоянием.

**Architecture:** Все страницы уже используют общий `assets/js/header.js`; он получит чистую функцию генерации разметки, функции управления состоянием и браузерную инициализацию окна. Каждая шапка содержит только кнопку с `data-contact-modal-open`; разметка окна создаётся один раз в `document.body`. Стили находятся в общем `assets/css/prototype.css`.

**Tech Stack:** HTML5, CSS Grid/Flexbox, JavaScript ES modules, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Текст кнопки в шапке: «Написать нам».
- Обязательные поля: «Ваше имя», «Телефон», «Организация», «Электронная почта», «Описание проекта».
- Прикрепление одного файла необязательно и не отправляет данные.
- Согласие на условия обработки персональных данных обязательно.
- Кнопка формы: «Отправить».
- Точный успешный текст: «Спасибо! Заявка отправлена. Специалист ЭМКОМ свяжется с вами в течение рабочего дня.»
- Большая форма на главной странице не изменяется.
- Внешние запросы и реальная отправка данных отсутствуют.
- Десктопное окно около 580 px; мобильное занимает доступный экран и не создаёт горизонтального переполнения.

---

### Task 1: Зафиксировать контракт формы тестами

**Files:**
- Create: `tests/contact-modal.test.mjs`
- Test: `tests/contact-modal.test.mjs`

**Interfaces:**
- Consumes: HTML всех готовых страниц, `assets/js/header.js`, `assets/css/prototype.css`.
- Produces: тестовый контракт маркеров `data-contact-modal-open`, `data-contact-modal`, `data-contact-form`, `data-contact-file`, `data-contact-success` и экспортов `getContactModalMarkup`, `setContactModalState`, `showContactSuccess`.

- [ ] **Step 1: Write the failing header and markup tests**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const pages = [
  "index.html", "company/index.html", "company/history/index.html",
  "company/partners/index.html", "company/licenses/index.html",
  "company/staff/index.html", "company/staff/sotrudnik/index.html",
  "solutions/index.html",
  "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html",
  "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html",
  "services/index.html", "services/predproektnoe-obsledovanie/index.html",
  "cases/index.html", "cases/proekt-1/index.html", "production/index.html",
  "knowledge/index.html", "knowledge/statya-1/index.html", "contacts/index.html"
];

test("all completed headers expose the contact modal button", () => {
  for (const path of pages) {
    const html = read(path);
    assert.match(html, /<button class="nav-cta" type="button" data-contact-modal-open>Написать нам<\/button>/);
  }
});

test("contact modal markup contains the approved required fields", async () => {
  const { getContactModalMarkup } = await import("../assets/js/header.js");
  const html = getContactModalMarkup();
  for (const label of ["Ваше имя", "Телефон", "Организация", "Электронная почта", "Описание проекта"]) {
    assert.match(html, new RegExp(`${label}[\\s\\S]*?required`));
  }
  assert.match(html, /data-contact-file/);
  assert.doesNotMatch(html.match(/<input[^>]*data-contact-file[^>]*>/)?.[0] ?? "", /required/);
  assert.match(html, /ТЗ, спецификацию, чертёж, опросный лист или другие материалы/);
  assert.match(html, /Согласие на условия обработки персональных данных/);
  assert.match(html, /Спасибо! Заявка отправлена\. Специалист ЭМКОМ свяжется с вами в течение рабочего дня\./);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/contact-modal.test.mjs`

Expected: FAIL because header buttons and `getContactModalMarkup` do not exist.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/contact-modal.test.mjs
git commit -m "test: define contact modal contract"
```

---

### Task 2: Реализовать общую разметку и поведение окна

**Files:**
- Modify: `assets/js/header.js`
- Test: `tests/contact-modal.test.mjs`

**Interfaces:**
- Produces: `getContactModalMarkup(): string`, `setContactModalState(modal, expanded, opener?): void`, `showContactSuccess(modal): void`.
- Browser setup consumes buttons `[data-contact-modal-open]` and creates exactly one root `[data-contact-modal]`.

- [ ] **Step 1: Add the pure markup generator**

```js
export function getContactModalMarkup() {
  return `<div class="contact-modal" data-contact-modal hidden>
    <div class="contact-modal__backdrop" data-contact-modal-close></div>
    <section class="contact-modal__panel" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title" data-contact-modal-panel>
      <button class="contact-modal__close" type="button" aria-label="Закрыть форму" data-contact-modal-close>×</button>
      <div data-contact-form-view>
        <h2 id="contact-modal-title">Написать нам</h2>
        <form class="contact-modal__form" data-contact-form>
          <label>Ваше имя <span>*</span><input name="name" type="text" required></label>
          <label>Телефон <span>*</span><input name="phone" type="tel" required></label>
          <label>Организация <span>*</span><input name="organization" type="text" required></label>
          <label>Электронная почта <span>*</span><input name="email" type="email" required></label>
          <label>Описание проекта <span>*</span><textarea name="description" required></textarea></label>
          <label class="contact-modal__upload"><strong>Прикрепить файл</strong><small>ТЗ, спецификацию, чертёж, опросный лист или другие материалы</small><input type="file" data-contact-file><span data-contact-file-name></span></label>
          <label class="contact-modal__consent"><input type="checkbox" required><span>Согласие на условия обработки персональных данных</span></label>
          <button class="contact-modal__submit" type="submit">Отправить</button>
        </form>
      </div>
      <div class="contact-modal__success" data-contact-success hidden><h2>Спасибо!</h2><p>Спасибо! Заявка отправлена. Специалист ЭМКОМ свяжется с вами в течение рабочего дня.</p></div>
    </section>
  </div>`;
}
```

- [ ] **Step 2: Add state helpers and tests**

```js
export function setContactModalState(modal, expanded, opener) {
  modal.hidden = !expanded;
  modal.classList.toggle("is-open", expanded);
  modal.setAttribute("aria-hidden", String(!expanded));
  document.body.classList.toggle("has-contact-modal", expanded);
  if (expanded && opener) modal._contactOpener = opener;
}

export function showContactSuccess(modal) {
  modal.querySelector("[data-contact-form-view]").hidden = true;
  modal.querySelector("[data-contact-success]").hidden = false;
}
```

Tests use small DOM-like objects to verify `hidden`, `aria-hidden`, class toggles and success visibility before browser wiring is added.

- [ ] **Step 3: Wire browser interaction**

`setupContactModal()` must:

1. append `getContactModalMarkup()` once;
2. open from every `[data-contact-modal-open]`;
3. close by close controls, backdrop and Escape;
4. return focus to the opener;
5. use native `form.checkValidity()` / `form.reportValidity()`;
6. prevent real submission and call `showContactSuccess(modal)` after a valid submit;
7. show `file.name` in `[data-contact-file-name]`;
8. reset the form and success view after successful state is closed.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `node --test tests/contact-modal.test.mjs tests/homepage.test.mjs`

Expected: all focused tests PASS.

- [ ] **Step 5: Commit the component behavior**

```bash
git add assets/js/header.js tests/contact-modal.test.mjs
git commit -m "feat: add shared contact modal behavior"
```

---

### Task 3: Подключить кнопку на всех страницах и оформить адаптив

**Files:**
- Modify: all 18 completed HTML pages listed in Task 1
- Modify: `assets/css/prototype.css`
- Modify: `tests/homepage.test.mjs`
- Test: `tests/contact-modal.test.mjs`

**Interfaces:**
- Consumes: `[data-contact-modal-open]` from HTML and classes emitted by `getContactModalMarkup()`.
- Produces: consistent desktop/mobile layout.

- [ ] **Step 1: Replace every header CTA**

Replace each relative feedback link:

```html
<a class="nav-cta" href="...#feedback-title">Форма обратной связи</a>
```

with:

```html
<button class="nav-cta" type="button" data-contact-modal-open>Написать нам</button>
```

- [ ] **Step 2: Add modal CSS**

```css
.contact-modal { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; }
.contact-modal[hidden] { display: none; }
.contact-modal__backdrop { position: absolute; inset: 0; background: rgba(18, 24, 34, 0.58); }
.contact-modal__panel { position: relative; width: min(580px, calc(100vw - 40px)); max-height: calc(100vh - 40px); overflow-y: auto; padding: 44px 50px 50px; border-radius: 4px; background: #fff; }
.contact-modal__close { position: absolute; top: 18px; right: 20px; border: 0; background: transparent; font-size: 30px; }
.contact-modal__form { display: grid; gap: 20px; margin-top: 30px; }
.contact-modal__form label { display: grid; gap: 8px; color: var(--color-muted); font-size: 13px; }
.contact-modal__form input:not([type="checkbox"]), .contact-modal__form textarea { width: 100%; border: 1px solid #e5e5e5; background: #f8f8f8; padding: 13px 15px; font: inherit; }
.contact-modal__form textarea { min-height: 120px; resize: vertical; }
.contact-modal__upload { border: 1px dashed var(--color-border); padding: 18px; cursor: pointer; }
.contact-modal__consent { grid-template-columns: auto 1fr; align-items: start; }
.contact-modal__submit { min-height: 50px; border: 0; background: #365edc; color: #fff; font-weight: 700; }
.contact-modal__success { padding: 70px 0; text-align: center; }
.has-contact-modal { overflow: hidden; }

@media (max-width: 600px) {
  .contact-modal { place-items: stretch; }
  .contact-modal__panel { width: 100%; max-height: 100vh; min-height: 100vh; padding: 56px 20px 30px; border-radius: 0; }
  .contact-modal__submit { width: 100%; }
}
```

- [ ] **Step 3: Add CSS assertions and run focused tests**

Assert desktop width `580px`, fixed overlay, `[hidden]`, and mobile `width: 100%` / `min-height: 100vh` rules.

Run: `node --test tests/contact-modal.test.mjs tests/homepage.test.mjs`

Expected: PASS.

- [ ] **Step 4: Commit page and style integration**

```bash
git add index.html company solutions services cases production knowledge contacts assets/css/prototype.css tests
git commit -m "feat: connect contact modal across prototype"
```

---

### Task 4: Обновить версии ресурсов, документацию и проверить проект

**Files:**
- Modify: all HTML files that reference `prototype.css` or `header.js`
- Modify: exact cache-key tests
- Modify: `PROJECT.md`

**Interfaces:**
- Consumes: existing cache keys `20260817-12` and `20260814-3`.
- Produces: cache key `20260820-1` for both shared files.

- [ ] **Step 1: Update cache keys**

Replace stylesheet and script query values with `20260820-1` in every completed HTML file and exact tests.

- [ ] **Step 2: Update PROJECT.md**

Document the header button, required fields, optional file, success state and absence of server submission.

- [ ] **Step 3: Verify no stale keys remain outside historical docs**

Run: `rg -n "20260817-12|20260814-3" --glob "!docs/**"`

Expected: no output.

- [ ] **Step 4: Run the complete suite**

Run: `npm test`

Expected: all tests PASS, zero failures.

- [ ] **Step 5: Commit final integration**

```bash
git add .
git commit -m "chore: refresh contact modal assets"
```

---

### Task 5: Опубликовать и визуально проверить

**Files:**
- No source changes unless verification reveals a reproducible defect.

- [ ] **Step 1: Push and merge the implementation branch into main**

- [ ] **Step 2: Wait for successful `pages-build-deployment`**

- [ ] **Step 3: Verify desktop behavior on the public homepage**

Open the modal, verify the five required fields, optional file, required consent, native validation, successful state, backdrop close, close button and Escape.

- [ ] **Step 4: Verify mobile behavior at 390 × 844**

Verify burger → «Написать нам» → full-screen scrollable modal, no horizontal overflow and successful close.

- [ ] **Step 5: Pull merged main and re-run `npm test`**

- [ ] **Step 6: Remove merged temporary branches after confirming `ahead_by: 0`**
