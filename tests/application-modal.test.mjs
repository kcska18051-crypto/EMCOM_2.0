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
