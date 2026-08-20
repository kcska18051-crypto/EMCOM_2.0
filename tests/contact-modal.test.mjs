import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const completedPages = [
  "index.html",
  "company/index.html",
  "company/history/index.html",
  "company/partners/index.html",
  "company/licenses/index.html",
  "company/staff/index.html",
  "company/staff/sotrudnik/index.html",
  "solutions/index.html",
  "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html",
  "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html",
  "services/index.html",
  "services/predproektnoe-obsledovanie/index.html",
  "cases/index.html",
  "cases/proekt-1/index.html",
  "production/index.html",
  "knowledge/index.html",
  "knowledge/statya-1/index.html",
  "contacts/index.html"
];

test("all completed headers expose the contact modal button", () => {
  for (const path of completedPages) {
    const html = read(path);
    assert.match(
      html,
      /<button class="nav-cta" type="button" data-contact-modal-open>Написать нам<\/button>/,
      `${path} must expose the shared contact modal button`
    );
  }
});

test("contact modal markup contains the approved form", async () => {
  const { getContactModalMarkup } = await import("../assets/js/header.js");
  assert.equal(typeof getContactModalMarkup, "function");

  const html = getContactModalMarkup();
  assert.match(html, /data-contact-modal/);
  assert.match(html, /role="dialog"/);
  assert.match(html, /aria-modal="true"/);
  assert.match(html, /<h2 id="contact-modal-title">Написать нам<\/h2>/);
  assert.match(html, /name="name" type="text" required/);
  assert.match(html, /name="phone" type="tel" required/);
  assert.match(html, /name="organization" type="text" required/);
  assert.match(html, /name="email" type="email" required/);
  assert.match(html, /name="description" required/);
  assert.match(html, /type="checkbox" required data-contact-consent/);
  assert.match(html, /Согласие на условия обработки персональных данных/);
  assert.match(html, /<button class="contact-modal__submit" type="submit">Отправить<\/button>/);
});

test("file attachment is optional and shows the approved explanation", async () => {
  const { getContactModalMarkup } = await import("../assets/js/header.js");
  const html = getContactModalMarkup();
  const fileInput = html.match(/<input[^>]*data-contact-file[^>]*>/)?.[0] ?? "";

  assert.match(fileInput, /type="file"/);
  assert.doesNotMatch(fileInput, /required/);
  assert.match(html, /Прикрепить файл/);
  assert.match(html, /ТЗ, спецификацию, чертёж, опросный лист или другие материалы/);
});

test("contact modal exposes the exact success message", async () => {
  const { getContactModalMarkup } = await import("../assets/js/header.js");
  const html = getContactModalMarkup();

  assert.match(html, /data-contact-success/);
  assert.match(html, /Спасибо! Заявка отправлена\. Специалист ЭМКОМ свяжется с вами в течение рабочего дня\./);
});

test("contact modal state helper synchronizes visibility and scroll lock", async () => {
  const { setContactModalState } = await import("../assets/js/header.js");
  const modalClasses = new Set();
  const bodyClasses = new Set();
  const attributes = new Map();
  const modal = {
    hidden: true,
    ownerDocument: {
      body: {
        classList: {
          toggle(name, enabled) {
            enabled ? bodyClasses.add(name) : bodyClasses.delete(name);
          }
        }
      }
    },
    classList: {
      toggle(name, enabled) {
        enabled ? modalClasses.add(name) : modalClasses.delete(name);
      }
    },
    setAttribute(name, value) {
      attributes.set(name, value);
    }
  };
  const opener = {};

  setContactModalState(modal, true, opener);
  assert.equal(modal.hidden, false);
  assert.equal(modalClasses.has("is-open"), true);
  assert.equal(bodyClasses.has("has-contact-modal"), true);
  assert.equal(attributes.get("aria-hidden"), "false");
  assert.equal(modal._contactOpener, opener);

  setContactModalState(modal, false);
  assert.equal(modal.hidden, true);
  assert.equal(modalClasses.has("is-open"), false);
  assert.equal(bodyClasses.has("has-contact-modal"), false);
  assert.equal(attributes.get("aria-hidden"), "true");
});

test("success helper switches from the form to the confirmation", async () => {
  const { showContactSuccess } = await import("../assets/js/header.js");
  const formView = { hidden: false };
  const success = { hidden: true };
  const modal = {
    querySelector(selector) {
      return selector === "[data-contact-form-view]" ? formView : success;
    }
  };

  showContactSuccess(modal);
  assert.equal(formView.hidden, true);
  assert.equal(success.hidden, false);
});
