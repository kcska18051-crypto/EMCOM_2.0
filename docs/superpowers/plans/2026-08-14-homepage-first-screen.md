# Homepage First Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать согласованные шапку, главный баннер и шесть фичей главной страницы ЭМКОМ_2.0.

**Architecture:** Существующий `index.html` становится первой страницей прототипа. Разметка остаётся статической и семантической; общие стили расширяются в `prototype.css`; небольшое ES-модульное поведение управляет только выпадающим меню «О компании».

**Tech Stack:** HTML5, CSS3, ES modules, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Ничего не добавлять сверх состава из спецификации.
- Кнопку «Обсудить задачу» не отрисовывать.
- Использовать Montserrat.
- Использовать предоставленный логотип.
- Изображение баннера заменить серой заглушкой, пиктограммы фичей — серыми кругами.
- Точное мобильное поведение шаблона финализировать после получения ссылки.

### Task 1: Контракт разметки и меню

**Files:**
- Create: `tests/homepage.test.mjs`
- Create: `assets/js/header.js`
- Modify: `index.html`
- Modify: `assets/css/prototype.css`
- Create: `assets/images/emcom-logo.png`

**Interfaces:**
- Produces: `setMenuState(button, menu, expanded)` и кликабельное меню `[data-about-toggle]` / `[data-about-menu]`.

- [ ] Создать тесты точного состава, контента и состояния меню.
- [ ] Запустить `npm test` и подтвердить падение новых тестов из-за отсутствующей разметки и `header.js`.
- [ ] Скопировать предоставленный логотип в `assets/images/emcom-logo.png`.
- [ ] Реализовать минимальную разметку, стили и `setMenuState`.
- [ ] Запустить `npm test`; ожидается 5 тестов PASS.
- [ ] Проверить в браузере десктоп, раскрытие меню, Escape и ширину 390 px.
- [ ] Загрузить проверенные файлы в отдельную feature-ветку через Base64 и убедиться, что удалённый HTML сохраняет кириллицу.

### Task 2: Узкий баннер и услуги

**Files:**
- Modify: `tests/homepage.test.mjs`
- Modify: `index.html`
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Produces: секцию `.brief-cta` и сетку `.service-grid` из восьми `[data-service-card]`.

- [ ] Добавить тест точного текста баннера, кнопки, заголовка раздела и восьми карточек.
- [ ] Запустить `npm test` и подтвердить падение нового теста из-за отсутствующих секций.
- [ ] Добавить баннер сразу после `.features` и раздел услуг сразу после баннера.
- [ ] Реализовать десктопную сетку 4×2 и мобильную сетку в одну колонку.
- [ ] Запустить `npm test`; ожидается 7 тестов PASS.
- [ ] Проверить в браузере расположение секций, кнопку и адаптив на ширине 390 px.
- [ ] Загрузить изменения в отдельную feature-ветку, объединить с `main` и проверить GitHub Pages.
