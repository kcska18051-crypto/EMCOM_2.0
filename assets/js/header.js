export function setMenuState(button, menu, expanded) {
  button.setAttribute("aria-expanded", String(expanded));
  menu.hidden = !expanded;
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

if (typeof document !== "undefined") {
  setupAboutMenu();
}
