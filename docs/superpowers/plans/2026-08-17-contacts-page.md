# Contacts Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить адаптивную страницу «Контакты» с двумя представительствами ЭМКОМ и связать её с общей навигацией прототипа.

**Architecture:** Одна статическая страница использует существующие шапку, пустой подвал, Montserrat и серые медиазаглушки. Основной `contacts-layout` содержит карту-заглушку слева и две самостоятельные карточки `contact-office` справа; на мобильном блоки перестраиваются по исходному порядку DOM.

**Tech Stack:** HTML5, CSS3, существующий JavaScript мобильной шапки, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Маршрут: `/contacts/`.
- Карта и две фотографии представлены серыми прямоугольниками.
- Используются точные контактные данные двух адресов из утверждённой спецификации.
- Контактные значения, медиазаглушки и карточки неинтерактивны.
- Формы, кнопки и дополнительные представительства отсутствуют.
- На мобильном порядок: карта, Санкт-Петербург, Кировск.

---

### Task 1: Тестовый контракт страницы

**Files:**
- Create: `tests/contacts-page.test.mjs`

**Interfaces:**
- Consumes: существующие пути готовых HTML-страниц и общий CSS.
- Produces: контракт `data-contacts-map`, два `data-contact-office`, два `data-contact-office-media` и сквозные ссылки шапки.

- [ ] **Step 1: Write failing tests**

Создать тесты структуры:

```js
test("contacts page contains the approved two offices", () => {
  const html = read("contacts/index.html");
  assert.match(html, /<h1>Контакты<\/h1>/);
  assert.equal((html.match(/data-contacts-map/g) ?? []).length, 1);
  assert.equal((html.match(/data-contact-office(?:\s|>)/g) ?? []).length, 2);
  assert.equal((html.match(/data-contact-office-media/g) ?? []).length, 2);
  assert.match(html, /Санкт-Петербург/);
  assert.match(html, /Кировск/);
});
```

Добавить точные проверки адресов, времени, телефона, почты, отсутствия `form`, отсутствия интерактивных элементов внутри `main` и ссылок «Контакты» во всех готовых шапках.

- [ ] **Step 2: Run red test**

Run: `node --test tests/contacts-page.test.mjs`

Expected: FAIL, потому что `contacts/index.html` отсутствует и старые шапки содержат `href="#"`.

---

### Task 2: Страница и адаптив

**Files:**
- Create: `contacts/index.html`
- Modify: `assets/css/prototype.css`
- Test: `tests/contacts-page.test.mjs`

**Interfaces:**
- Consumes: `.site-header`, `.breadcrumbs`, `.media-placeholder`, `.site-footer-placeholder`, `assets/js/header.js`.
- Produces: `.contacts-page`, `.contacts-layout`, `.contacts-map`, `.contacts-offices`, `.contact-office`.

- [ ] **Step 1: Add semantic page markup**

Использовать структуру:

```html
<main class="contacts-page" data-contacts-page>
  <header class="contacts-heading">…<h1>Контакты</h1>…</header>
  <div class="contacts-layout">
    <div class="contacts-map media-placeholder" data-contacts-map aria-label="Место для карты"></div>
    <section class="contacts-offices" aria-label="Представительства">
      <article class="contact-office" data-contact-office>…</article>
      <article class="contact-office" data-contact-office>…</article>
    </section>
  </div>
</main>
```

В каждой карточке разместить `data-contact-office-media`, город и четыре строки фактических данных обычным текстом.

- [ ] **Step 2: Add desktop CSS**

Добавить:

```css
.contacts-layout { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(320px, .75fr); gap: 48px; }
.contacts-map { min-height: 720px; }
.contacts-offices { display: grid; gap: 28px; }
.contact-office-media { aspect-ratio: 16 / 7; min-height: 0; }
```

Оформить текстовые строки карточек существующими цветами и границами.

- [ ] **Step 3: Add mobile CSS**

При `max-width: 900px` перевести `.contacts-layout` в одну колонку, уменьшить высоту карты и сохранить порядок DOM. При `max-width: 560px` уменьшить боковые поля до `20px`.

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/contacts-page.test.mjs`

Expected: структура страницы проходит; тест общей навигации остаётся красным до Task 3.

---

### Task 3: Сквозная навигация и cache key

**Files:**
- Modify: все готовые HTML-страницы, включая `knowledge/index.html` и `knowledge/statya-1/index.html`
- Modify: существующие тесты с точным CSS cache key
- Test: `tests/contacts-page.test.mjs`

**Interfaces:**
- Consumes: `/contacts/` и относительные пути текущей структуры.
- Produces: рабочую ссылку «Контакты» во всех шапках, активное состояние на `/contacts/`, единый cache key `20260817-10`.

- [ ] **Step 1: Replace contact placeholders**

Во всех готовых шапках заменить `href="#">Контакты</a>` на корректный относительный путь к `/contacts/`. На новой странице использовать `href="./" aria-current="page"`.

- [ ] **Step 2: Refresh CSS cache key**

Обновить подключения общего CSS и точные тестовые ожидания на `20260817-10`.

- [ ] **Step 3: Run full suite**

Run: `npm test`

Expected: все тесты PASS.

---

### Task 4: Публикация и визуальная проверка

**Files:**
- Verify: все изменённые файлы Tasks 1–3.

**Interfaces:**
- Consumes: зелёный набор тестов.
- Produces: опубликованную страницу `/contacts/` в `main`.

- [ ] **Step 1: Publish in an isolated feature branch**

Создать feature-ветку от ветки спецификации, загрузить точный набор изменений, объединить с `main` и удалить только слитые временные ветки.

- [ ] **Step 2: Verify desktop**

Проверить карту слева, две карточки справа, правильные данные, активную навигацию и отсутствие горизонтального переполнения.

- [ ] **Step 3: Verify mobile**

Проверить бургер и порядок «карта — Санкт-Петербург — Кировск» при ширине `390px`.
