# Cases Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить страницу трёх кейсов и детальную страницу «Проект 1» с согласованными смысловыми блоками и адаптивом.

**Architecture:** Новые страницы располагаются в `/cases/` и используют общую шапку, подвал и токены прототипа. Для списка и детальных блоков добавляются изолированные классы `.cases-page-*` и `.case-detail-*`; тесты фиксируют семантику, навигацию и адаптив.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Раздел и пункт шапки называются «Кейсы».
- Список содержит «Проект 1», «Проект 2», «Проект 3»; кликабелен только «Проект 1».
- Формы и вкладки неинтерактивны.
- Изображения представлены серыми прямоугольниками, пиктограммы — серыми кругами.
- На мобильных страница не создаёт горизонтального переполнения.

---

### Task 1: Зафиксировать страницы тестами

**Files:**
- Create: `tests/cases-section.test.mjs`

**Interfaces:**
- Consumes: будущие `/cases/index.html`, `/cases/proekt-1/index.html` и CSS-классы кейсов.
- Produces: проверки структуры, количества блоков, ссылок и адаптива.

- [ ] **Step 1: Write failing tests**

Проверить наличие двух файлов, три `data-case-list-card`, одну ссылку на `./proekt-1/`, два `data-case-contact-control`, три `data-case-feature`, четыре `data-case-tab`, два `data-case-gallery-item`, два `data-case-service-card`, один `data-related-case-card` и отсутствие `<form>`.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/cases-section.test.mjs`

Expected: FAIL, потому что маршруты и классы отсутствуют.

### Task 2: Создать страницы и стили

**Files:**
- Create: `cases/index.html`
- Create: `cases/proekt-1/index.html`
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Produces: `.cases-page-grid`, `.cases-page-card`, `.case-detail-*` и две публичные страницы.

- [ ] **Step 1: Implement listing**

Создать список без бокового меню: три серые карточки в сетке, где первая является ссылкой на `./proekt-1/`.

- [ ] **Step 2: Implement detail**

Добавить баннер, заголовок, хлебные крошки, рыбную сводку, два неактивных `span`, три фичера с кругами, четыре неактивные вкладки, рыбный текст, галерею 2, услуги 2 и похожий проект 1.

- [ ] **Step 3: Implement responsive CSS**

Задать сетку `repeat(3, minmax(0, 1fr))`, промежуточные две колонки и мобильную одну колонку; вкладкам дать внутреннюю горизонтальную прокрутку.

- [ ] **Step 4: Verify focused tests**

Run: `node --test tests/cases-section.test.mjs`

Expected: PASS после завершения Task 3.

### Task 3: Обновить навигацию, кэш и публикацию

**Files:**
- Modify: все полноценные HTML-страницы с общей шапкой
- Modify: тесты cache key

**Interfaces:**
- Consumes: маршрут `/cases/` и cache key `20260817-5`.
- Produces: рабочий пункт «Кейсы» и загрузку нового CSS.

- [ ] **Step 1: Update headers**

Заменить неактивный пункт «Кейсы» корректными относительными ссылками; на двух новых страницах установить `aria-current="page"`.

- [ ] **Step 2: Bump CSS cache key**

Заменить `20260817-4` на `20260817-5` во всех полноценных страницах и соответствующих тестах.

- [ ] **Step 3: Run complete suite**

Run: `node --test tests/*.test.mjs`

Expected: все тесты PASS.

- [ ] **Step 4: Publish and verify**

Загрузить файлы в `feature/cases-section`, объединить с `main`, проверить обе страницы и переход на ширинах `1440px` и `390px`.
