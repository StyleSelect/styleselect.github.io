const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const catalogMotion = document.querySelector(".catalog-motion");
const interactiveWatch = document.querySelector(".interactive-watch");
const womenVisual = document.querySelector(".women-visual");
const revealItems = document.querySelectorAll(".product-card, .reveal");
const filterForms = document.querySelectorAll(".watch-filters");
const catalogFilterButtons = document.querySelectorAll("[data-catalog-filter]");
let languageSelects = document.querySelectorAll(".language-select");
const watchFilterUpdaters = [];
let activeCatalogCategory = catalogFilterButtons.length > 0
  ? localStorage.getItem("styleselectCatalogCategory") || "automatico"
  : "all";

if (header && !document.querySelector(".site-language-select")) {
  const navTools = header.querySelector(".nav-tools") || document.createElement("div");
  navTools.className = "nav-tools";
  navTools.innerHTML = `
    <label class="nav-select">
      <span class="sr-only">Idioma</span>
      <select class="language-select site-language-select" aria-label="Cambiar idioma">
        <option value="es">ES</option>
        <option value="en">EN</option>
        <option value="fr">FR</option>
        <option value="de">DE</option>
      </select>
    </label>
  `;

  if (!navTools.isConnected) {
    const nav = header.querySelector(".nav");
    nav?.appendChild(navTools);
  }

  languageSelects = document.querySelectorAll(".language-select");
}

const updateHeader = () => {
  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (hero && !reducedMotion) {
  const updateHeroMotion = (clientX, clientY) => {
    const rect = hero.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    hero.style.setProperty("--hero-move-x", ((x - 0.5) * -1).toFixed(3));
    hero.style.setProperty("--hero-move-y", ((y - 0.5) * -1).toFixed(3));
    hero.style.setProperty("--hero-light-x", `${(x * 100).toFixed(1)}%`);
    hero.style.setProperty("--hero-light-y", `${(y * 100).toFixed(1)}%`);
  };

  hero.addEventListener("pointermove", (event) => {
    updateHeroMotion(event.clientX, event.clientY);
  });

  hero.addEventListener("pointerdown", (event) => {
    updateHeroMotion(event.clientX, event.clientY);
    hero.style.setProperty("--hero-press-scale", "1.035");
  });

  hero.addEventListener("pointerup", () => {
    hero.style.setProperty("--hero-press-scale", "1");
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--hero-move-x", "0");
    hero.style.setProperty("--hero-move-y", "0");
    hero.style.setProperty("--hero-light-x", "50%");
    hero.style.setProperty("--hero-light-y", "50%");
    hero.style.setProperty("--hero-press-scale", "1");
  });
}

if (catalogMotion && !reducedMotion) {
  catalogMotion.addEventListener("pointermove", (event) => {
    const rect = catalogMotion.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    catalogMotion.style.setProperty("--catalog-shift", ((x - 0.5) * -1).toFixed(3));
  });

  catalogMotion.addEventListener("pointerleave", () => {
    catalogMotion.style.setProperty("--catalog-shift", "0");
  });
}

if (interactiveWatch && !reducedMotion) {
  interactiveWatch.addEventListener("pointermove", (event) => {
    const rect = interactiveWatch.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    interactiveWatch.style.setProperty("--tilt-x", `${((x - 0.5) * 16).toFixed(2)}deg`);
    interactiveWatch.style.setProperty("--tilt-y", `${((y - 0.5) * -14).toFixed(2)}deg`);
  });

  interactiveWatch.addEventListener("pointerleave", () => {
    interactiveWatch.style.setProperty("--tilt-x", "0deg");
    interactiveWatch.style.setProperty("--tilt-y", "0deg");
  });
}

if (womenVisual && !reducedMotion) {
  womenVisual.addEventListener("pointermove", (event) => {
    const rect = womenVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    womenVisual.style.setProperty("--women-move-x", ((x - 0.5) * -1).toFixed(3));
    womenVisual.style.setProperty("--women-move-y", ((y - 0.5) * -1).toFixed(3));
  });

  womenVisual.addEventListener("pointerleave", () => {
    womenVisual.style.setProperty("--women-move-x", "0");
    womenVisual.style.setProperty("--women-move-y", "0");
  });
}

const translations = {
  es: {
    catalogTitle: "Descubre tu estilo.",
    catalogCopy: "Pocas piezas, mejor ordenadas: automaticos, lujo y opciones asequibles que puedes filtrar sin ver un muro de productos.",
    viewFeatured: "Ver destacados",
    featuredTitle: "Filtra por estilo"
  },
  en: {
    catalogTitle: "Discover your style.",
    catalogCopy: "A short selection of the strongest watches: steel, bold dials and direct Amazon purchase.",
    viewFeatured: "View featured",
    featuredTitle: "Filter by style"
  },
  fr: {
    catalogTitle: "Decouvre ton style.",
    catalogCopy: "Une selection courte de montres avec presence, acier, cadrans forts et achat direct sur Amazon.",
    viewFeatured: "Voir la selection",
    featuredTitle: "Filtrer par style"
  },
  de: {
    catalogTitle: "Entdecke deinen Stil.",
    catalogCopy: "Eine kurze Auswahl starker Uhren mit Stahl, markanten Zifferblattern und direktem Amazon-Kauf.",
    viewFeatured: "Highlights ansehen",
    featuredTitle: "Nach Stil filtern"
  }
};

const getPreferredLanguage = () => {
  const language = (navigator.language || "es").slice(0, 2);
  return translations[language] ? language : "es";
};

const applyLanguage = (language = localStorage.getItem("styleselectLanguage") || "es") => {
  const dictionary = translations[language] || translations.es;

  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((item) => {
    const key = item.dataset.i18n;
    if (dictionary[key]) {
      item.textContent = dictionary[key];
    }
  });
};

const syncLocaleControls = () => {
  const storedLanguage = localStorage.getItem("styleselectLanguage") || getPreferredLanguage();

  languageSelects.forEach((select) => {
    select.value = storedLanguage;
  });

  applyLanguage(storedLanguage);
};

if (filterForms.length > 0) {
  const setupWatchFilters = (filterForm) => {
    const searchInput = filterForm.querySelector(".watch-search");
    const priceSelect = filterForm.querySelector(".watch-price");
    const styleSelect = filterForm.querySelector(".watch-style");
    const filterRoot = filterForm.closest("section") || document;
    const watchItems = filterRoot.querySelectorAll(".watch-item");
    const emptyMessage = filterRoot.querySelector(".filter-empty");

    const applyWatchFilters = () => {
      const searchValue = (searchInput?.value || "").trim().toLowerCase();
      const maxPrice = priceSelect?.value || "all";
      const styleValue = styleSelect?.value || "all";
      let visibleCount = 0;

      watchItems.forEach((item) => {
        const itemName = item.dataset.name || "";
        const itemStyle = item.dataset.style || "";
        const itemPrice = Number(item.dataset.price || 0);
        const itemCategories = item.dataset.categories || itemStyle || "";

        const matchesSearch = !searchValue || itemName.includes(searchValue);
        const matchesPrice = maxPrice === "all" || itemPrice <= Number(maxPrice);
        const matchesStyle = styleValue === "all" || itemStyle.includes(styleValue);
        const matchesCategory = activeCatalogCategory === "all" || itemCategories.includes(activeCatalogCategory);
        const isVisible = matchesSearch && matchesPrice && matchesStyle && matchesCategory;

        item.classList.toggle("is-hidden", !isVisible);
        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (emptyMessage && watchItems.length > 0) {
        emptyMessage.hidden = visibleCount > 0;
      }
    };

    filterForm.addEventListener("input", applyWatchFilters);
    filterForm.addEventListener("change", applyWatchFilters);
    applyWatchFilters();
    watchFilterUpdaters.push(applyWatchFilters);
  };

  filterForms.forEach(setupWatchFilters);
}

const syncCatalogCategoryButtons = () => {
  catalogFilterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.catalogFilter === activeCatalogCategory);
  });
};

catalogFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCatalogCategory = button.dataset.catalogFilter || "all";
    localStorage.setItem("styleselectCatalogCategory", activeCatalogCategory);
    syncCatalogCategoryButtons();
    watchFilterUpdaters.forEach((apply) => apply());
  });
});

syncCatalogCategoryButtons();

languageSelects.forEach((select) => {
  select.addEventListener("change", () => {
    localStorage.setItem("styleselectLanguage", select.value);
    syncLocaleControls();
  });
});

syncLocaleControls();

document.querySelectorAll(".gallery").forEach((gallery) => {
  const mainImage = gallery.querySelector(".product-image");
  const thumbnailButtons = gallery.querySelectorAll(".thumb-button");

  thumbnailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (mainImage.src.endsWith(button.dataset.image)) {
        return;
      }

      mainImage.classList.add("is-changing");

      window.setTimeout(() => {
        mainImage.src = button.dataset.image;
        mainImage.alt = button.dataset.alt;
        mainImage.classList.remove("is-changing");
      }, 160);

      thumbnailButtons.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));
