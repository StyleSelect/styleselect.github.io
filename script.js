const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const catalogMotion = document.querySelector(".catalog-motion");
const interactiveWatch = document.querySelector(".interactive-watch");
const womenVisual = document.querySelector(".women-visual");
const revealItems = document.querySelectorAll(".product-card, .reveal");
const filterForm = document.querySelector(".watch-filters");

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

if (filterForm) {
  const searchInput = filterForm.querySelector(".watch-search");
  const priceSelect = filterForm.querySelector(".watch-price");
  const styleSelect = filterForm.querySelector(".watch-style");
  const watchItems = document.querySelectorAll(".watch-item");
  const emptyMessage = document.querySelector(".filter-empty");

  const applyWatchFilters = () => {
    const searchValue = (searchInput?.value || "").trim().toLowerCase();
    const maxPrice = priceSelect?.value || "all";
    const styleValue = styleSelect?.value || "all";
    let visibleCount = 0;

    watchItems.forEach((item) => {
      const itemName = item.dataset.name || "";
      const itemStyle = item.dataset.style || "";
      const itemPrice = Number(item.dataset.price || 0);

      const matchesSearch = !searchValue || itemName.includes(searchValue);
      const matchesPrice = maxPrice === "all" || itemPrice <= Number(maxPrice);
      const matchesStyle = styleValue === "all" || itemStyle.includes(styleValue);
      const isVisible = matchesSearch && matchesPrice && matchesStyle;

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
}

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
