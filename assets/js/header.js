export function setMenuState(button, menu, expanded) {
  button.setAttribute("aria-expanded", String(expanded));
  menu.hidden = !expanded;
}

export function setMobileMenuState(button, menu, expanded) {
  button.setAttribute("aria-expanded", String(expanded));
  menu.setAttribute("aria-hidden", String(!expanded));
  menu.classList.toggle("is-open", expanded);
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

function setupMobileMenu() {
  const button = document.querySelector("[data-mobile-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  const header = document.querySelector(".site-header");

  if (!button || !menu || !header) {
    return;
  }

  const isMobile = () => window.matchMedia("(max-width: 900px)").matches;
  const closeMenu = () => setMobileMenuState(button, menu, false);

  const syncViewport = () => {
    closeMenu();
    if (!isMobile()) {
      menu.setAttribute("aria-hidden", "false");
    }
  };

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    setMobileMenuState(button, menu, !expanded);
  });

  menu.addEventListener("click", (event) => {
    if (isMobile() && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (isMobile() && !header.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMobile()) {
      closeMenu();
      button.focus();
    }
  });

  window.addEventListener("resize", syncViewport);
  syncViewport();
}

if (typeof document !== "undefined") {
  setupAboutMenu();
  setupMobileMenu();
}
