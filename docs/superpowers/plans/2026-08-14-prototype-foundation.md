# ЭМКОМ_2.0 Prototype Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать минимальную публичную основу кликабельного HTML-прототипа без самостоятельного добавления страниц, блоков и контента.

**Architecture:** Статический сайт состоит из стартового реестра страниц и единого CSS-файла с нейтральными wireframe-токенами. Содержательные страницы добавляются отдельными итерациями только по прямым указаниям пользователя. GitHub Pages публикует содержимое корня ветки `main`.

**Tech Stack:** HTML5, CSS3, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Отображаемое название проекта: `ЭМКОМ_2.0`.
- Техническое имя GitHub-репозитория: `EMCOM_2.0`.
- Репозиторий и GitHub Pages-сайт публичные.
- Не добавлять страницы, блоки, элементы или тексты, которые пользователь явно не запросил.
- Рыбный текст добавлять только по прямому указанию пользователя и только в указанном объёме.
- Изображения представлять нейтральными серыми заглушками.
- Не копировать исходный код и финальный визуальный дизайн шаблона Aspro.
- Использовать статический HTML, CSS и только минимально необходимый JavaScript.

---

## File Map

- `index.html` — стартовый реестр прототипов; до получения первого задания показывает пустое состояние.
- `assets/css/prototype.css` — общие цвета, размеры контейнера, типографика и примитивы wireframe.
- `.nojekyll` — отключает обработку Jekyll при публикации статических файлов.
- `package.json` — единая команда запуска проверок без сторонних зависимостей.
- `tests/foundation.test.mjs` — проверяет обязательную структуру стартовой страницы и базовые ограничения.
- `README.md` — кратко объясняет назначение репозитория и правило добавления страниц.

### Task 1: Проверяемая основа стартовой страницы

**Files:**
- Create: `tests/foundation.test.mjs`
- Create: `package.json`
- Create: `index.html`
- Create: `assets/css/prototype.css`
- Create: `.nojekyll`
- Create: `README.md`

**Interfaces:**
- Consumes: правила из `docs/superpowers/specs/2026-08-14-emcom-prototype-design.md`.
- Produces: публичную точку входа `/index.html` и набор CSS-классов `.site-shell`, `.page-registry`, `.empty-state`, `.wireframe-block`, `.media-placeholder` для следующих итераций.

- [ ] **Step 1: Создать падающий тест основы**

```js
// tests/foundation.test.mjs
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("foundation files exist", () => {
  assert.equal(existsSync(new URL("../index.html", import.meta.url)), true);
  assert.equal(existsSync(new URL("../assets/css/prototype.css", import.meta.url)), true);
  assert.equal(existsSync(new URL("../.nojekyll", import.meta.url)), true);
});

test("index is a Russian semantic page with an empty registry", () => {
  const html = read("index.html");
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<title>ЭМКОМ_2\.0 — прототип<\/title>/);
  assert.match(html, /href="assets\/css\/prototype\.css"/);
  assert.match(html, /<main[^>]*class="page-registry"/);
  assert.match(html, /Страницы будут добавлены после согласования/);
});

test("shared stylesheet exposes approved wireframe primitives", () => {
  const css = read("assets/css/prototype.css");
  for (const selector of [".site-shell", ".page-registry", ".empty-state", ".wireframe-block", ".media-placeholder"]) {
    assert.equal(css.includes(selector), true, `missing ${selector}`);
  }
});
```

- [ ] **Step 2: Создать команду проверки и убедиться, что тест падает**

```json
{
  "name": "emcom-2-prototype",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "test": "node --test"
  }
}
```

Run: `npm test`

Expected: FAIL, потому что `index.html`, `assets/css/prototype.css` и `.nojekyll` ещё отсутствуют.

- [ ] **Step 3: Создать минимальную стартовую страницу**

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ЭМКОМ_2.0 — прототип</title>
  <link rel="stylesheet" href="assets/css/prototype.css">
</head>
<body>
  <div class="site-shell">
    <header class="project-header">
      <p class="eyebrow">Кликабельный прототип</p>
      <h1>ЭМКОМ_2.0</h1>
    </header>
    <main class="page-registry" aria-labelledby="registry-title">
      <h2 id="registry-title">Страницы</h2>
      <p class="empty-state">Страницы будут добавлены после согласования.</p>
    </main>
  </div>
</body>
</html>
```

- [ ] **Step 4: Создать общие стили wireframe**

```css
:root {
  --color-page: #f3f3f3;
  --color-surface: #ffffff;
  --color-placeholder: #d9d9d9;
  --color-border: #c8c8c8;
  --color-text: #202020;
  --color-muted: #737373;
  --container: 1200px;
  --radius: 4px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--color-page);
  color: var(--color-text);
  font-family: Arial, Helvetica, sans-serif;
}

.site-shell {
  width: min(100% - 32px, var(--container));
  min-height: 100vh;
  margin-inline: auto;
  background: var(--color-surface);
}

.project-header,
.page-registry { padding: 40px; }

.project-header { border-bottom: 1px solid var(--color-border); }

.eyebrow {
  margin: 0 0 8px;
  color: var(--color-muted);
  font-size: 14px;
}

h1, h2 { margin: 0; }

.empty-state {
  margin-top: 24px;
  padding: 32px;
  border: 1px dashed var(--color-border);
  color: var(--color-muted);
  text-align: center;
}

.wireframe-block {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.media-placeholder {
  min-height: 160px;
  background: var(--color-placeholder);
}

@media (max-width: 640px) {
  .site-shell { width: 100%; }
  .project-header,
  .page-registry { padding: 24px 20px; }
}
```

- [ ] **Step 5: Создать служебные файлы**

`.nojekyll` должен быть пустым.

```markdown
# ЭМКОМ_2.0

Публичный кликабельный HTML-прототип корпоративного сайта.

Страницы и блоки добавляются поэтапно только после прямого задания и согласования. Репозиторий не содержит финальный дизайн или скопированный исходный код шаблона Aspro.
```

- [ ] **Step 6: Запустить проверку**

Run: `npm test`

Expected: три теста PASS, процесс завершается с кодом `0`.

- [ ] **Step 7: Зафиксировать основу одним GitHub-коммитом**

Из-за ограничения сгенерированной локальной папки загрузить шесть проверенных файлов в ветку `main` одним деревом через GitHub Git Data API:

```powershell
$owner = 'kcska18051-crypto'
$repo = 'EMCOM_2.0'
$files = @(
  'index.html',
  'assets/css/prototype.css',
  '.nojekyll',
  'package.json',
  'tests/foundation.test.mjs',
  'README.md'
)

$ref = gh api "repos/$owner/$repo/git/ref/heads/main" | ConvertFrom-Json
$parentSha = $ref.object.sha
$baseTreeSha = gh api "repos/$owner/$repo/git/commits/$parentSha" --jq '.tree.sha'
$treeElements = foreach ($path in $files) {
  $content = if ($path -eq '.nojekyll') { '' } else { Get-Content -Raw -Encoding UTF8 $path }
  $blobBody = @{ content = $content; encoding = 'utf-8' } | ConvertTo-Json -Compress
  $blob = $blobBody | gh api "repos/$owner/$repo/git/blobs" --method POST --input - | ConvertFrom-Json
  @{ path = $path; mode = '100644'; type = 'blob'; sha = $blob.sha }
}

$treeBody = @{
  base_tree = $baseTreeSha
  tree = @($treeElements)
} | ConvertTo-Json -Depth 5 -Compress
$tree = $treeBody | gh api "repos/$owner/$repo/git/trees" --method POST --input - | ConvertFrom-Json

$commitBody = @{
  message = 'feat: add prototype foundation'
  tree = $tree.sha
  parents = @($parentSha)
} | ConvertTo-Json -Depth 4 -Compress
$commit = $commitBody | gh api "repos/$owner/$repo/git/commits" --method POST --input - | ConvertFrom-Json

$refBody = @{ sha = $commit.sha; force = $false } | ConvertTo-Json -Compress
$refBody | gh api "repos/$owner/$repo/git/refs/heads/main" --method PATCH --input -
```

Expected: ветка `main` содержит все файлы из раздела **Files**, а последний коммит имеет указанное сообщение.

### Task 2: Публикация GitHub Pages

**Files:**
- Verify: `index.html`
- Verify: `.nojekyll`

**Interfaces:**
- Consumes: ветку `main` из Task 1.
- Produces: публичный адрес `https://kcska18051-crypto.github.io/EMCOM_2.0/`.

- [ ] **Step 1: Включить публикацию из корня ветки main**

Run:

```powershell
gh api repos/kcska18051-crypto/EMCOM_2.0/pages --method POST -f 'source[branch]=main' -f 'source[path]=/'
```

Expected: GitHub возвращает конфигурацию Pages с адресом `https://kcska18051-crypto.github.io/EMCOM_2.0/`.

- [ ] **Step 2: Проверить статус сборки**

Run:

```powershell
gh api repos/kcska18051-crypto/EMCOM_2.0/pages --jq '{status: .status, url: .html_url}'
```

Expected: `status` становится `built`, `url` совпадает с публичным адресом проекта.

- [ ] **Step 3: Проверить опубликованную страницу**

Run:

```powershell
$response = Invoke-WebRequest 'https://kcska18051-crypto.github.io/EMCOM_2.0/'
$response.StatusCode
$response.Content -match 'ЭМКОМ_2.0'
```

Expected: вывод содержит `200` и `True`.

- [ ] **Step 4: Зафиксировать результат проверки в описании проекта**

Run:

```powershell
gh repo edit kcska18051-crypto/EMCOM_2.0 --homepage 'https://kcska18051-crypto.github.io/EMCOM_2.0/'
```

Expected: поле Website в репозитории ведёт на опубликованный прототип; новых содержательных страниц или блоков не создано.
