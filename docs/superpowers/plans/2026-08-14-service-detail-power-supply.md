# Service Detail Power Supply Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить адаптивный прототип детальной страницы первой услуги и связать его со страницей каталога услуг.

**Architecture:** Новая статическая HTML-страница использует существующие общие шапку, подвал и CSS. Специальные классы `service-detail-*` задают композицию баннера, бокового меню, текста, таблицы и блока «Дополнительно»; медиазапрос до 900 px воспроизводит мобильную компоновку Aspro.

**Tech Stack:** HTML5, CSS3, существующий JavaScript шапки, Node.js `node:test`.

## Global Constraints

- Визуал прототипный: вместо изображений серые прямоугольники.
- Контент описательных блоков — Lorem ipsum.
- Не выводить исключённые пользователем разделы.
- Первая карточка услуг должна вести на детальную страницу.

---

### Task 1: Структура и навигация детальной страницы

**Files:**
- Create: `tests/service-detail.test.mjs`
- Create: `services/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html`
- Modify: `services/index.html`

**Interfaces:**
- Consumes: общие `site-header`, `services-page-sidebar`, `site-footer-placeholder`.
- Produces: URL `/services/avtonomnoe-i-rezervnoe-elektrosnabzhenie/` и ссылка первой карточки.

- [ ] **Step 1: Write the failing test** — проверить наличие страницы, утверждённых блоков, отсутствие исключённых блоков и ссылку первой карточки.
- [ ] **Step 2: Run test to verify it fails** — `npm test -- tests/service-detail.test.mjs`; ожидается FAIL из-за отсутствия файла.
- [ ] **Step 3: Write minimal implementation** — создать семантическую HTML-разметку и заменить первую карточку на ссылку.
- [ ] **Step 4: Run test to verify it passes** — `npm test -- tests/service-detail.test.mjs`; ожидается PASS.

### Task 2: Адаптивный визуал

**Files:**
- Modify: `assets/css/prototype.css`
- Modify: `tests/service-detail.test.mjs`
- Modify: HTML-страницы для обновления ключа CSS.

**Interfaces:**
- Consumes: классы `service-detail-*` из Task 1.
- Produces: двухколоночный десктопный и одноколоночный мобильный макет.

- [ ] **Step 1: Write the failing test** — проверить сетку, скрытие бокового меню и вертикальную таблицу в медиазапросе до 900 px.
- [ ] **Step 2: Run test to verify it fails** — `npm test -- tests/service-detail.test.mjs`; ожидается FAIL из-за отсутствующих CSS-правил.
- [ ] **Step 3: Write minimal implementation** — добавить стили и обновить ключ CSS до `20260814-19`.
- [ ] **Step 4: Run test to verify it passes** — `npm test`; ожидаются все тесты PASS.
- [ ] **Step 5: Verify visually** — проверить публичную страницу при ширине 1440 px и 390 px, затем проверить переход с первой карточки.
