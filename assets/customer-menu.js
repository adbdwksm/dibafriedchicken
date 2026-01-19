const menuSections = document.getElementById("menuSections");
const cartSummary = document.getElementById("cartSummary");
const previewOverlay = document.getElementById("previewOverlay");
const previewModal = document.getElementById("previewModal");
const previewImage = document.getElementById("previewImage");
const previewClose = document.getElementById("previewClose");

const counts = new Map();

function formatRupiah(value) {
  const thousands = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${thousands}`;
}

function updateSummary() {
  let total = 0;
  counts.forEach((qty) => {
    total += qty;
  });
  if (cartSummary) {
    cartSummary.textContent = `${total} item`;
  }
}

function renderMenu() {
  if (!menuSections || !window.DBC_MENU) return;
  const categories = [
    { id: "promo", label: "Promo" },
    { id: "package", label: "Package" },
    { id: "ayam", label: "Ayam Saja" },
    { id: "sauce", label: "Sauce" },
    { id: "lainnya", label: "Lainnya" }
  ];

  const sections = categories
    .map((category) => {
      const items = window.DBC_MENU.filter((item) => item.category === category.label);
      if (items.length === 0) return "";
      const cards = items
        .map((item) => {
          const soldOut = !item.active;
          const badgeText = soldOut ? "Sold out" : item.badge;
          const badgeClass = soldOut ? "bg-ink/20 text-ink" : "bg-mint/30 text-ink";
          return `
          <article class="surface shadow-soft rounded-2xl p-4 ${soldOut ? "sold-out" : ""}">
            <div class="flex gap-4">
              <button class="preview-btn" data-src="${item.image}">
                <img class="h-24 w-24 rounded-xl object-cover" src="${item.thumb}" alt="${item.name}" />
              </button>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="text-base font-semibold">${item.name}</h3>
                    <p class="text-xs text-slate">${item.desc}</p>
                  </div>
                  <span class="badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <span class="text-lg font-semibold">${formatRupiah(item.price)}</span>
                  <div class="inline-flex items-center gap-2">
                    <button class="qty-control rounded-full border border-ink/10 bg-white px-3 py-1 text-sm" data-id="${item.id}" data-action="down" ${soldOut ? "disabled" : ""}>-</button>
                    <span class="text-sm font-semibold" data-count="${item.id}">0</span>
                    <button class="qty-control rounded-full bg-ink px-3 py-1 text-sm font-semibold text-cream" data-id="${item.id}" data-action="up" ${soldOut ? "disabled" : ""}>+</button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        `;
        })
        .join("");

      return `
        <section id="${category.id}" class="relative z-10 mt-6 menu-section">
          <h2 class="text-lg font-semibold">${category.label}</h2>
          <div class="mt-4 grid gap-4">
            ${cards}
          </div>
        </section>
      `;
    })
    .join("");

  menuSections.innerHTML = sections;
}

function bindQtyControls() {
  document.querySelectorAll(".qty-control").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const action = button.dataset.action;
      const current = counts.get(id) || 0;
      const next = action === "up" ? current + 1 : Math.max(0, current - 1);
      counts.set(id, next);
      const target = document.querySelector(`[data-count="${id}"]`);
      if (target) {
        target.textContent = String(next);
      }
      updateSummary();
    });
  });
}

function bindPreviewButtons() {
  document.querySelectorAll(".preview-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const src = button.dataset.src;
      if (!src || !previewImage) return;
      previewImage.src = src;
      previewOverlay?.classList.remove("hidden");
      previewModal?.classList.remove("hidden");
      previewModal?.classList.add("flex");
    });
  });
}

function closePreview() {
  previewOverlay?.classList.add("hidden");
  previewModal?.classList.add("hidden");
  previewModal?.classList.remove("flex");
  if (previewImage) {
    previewImage.src = "";
    previewImage.classList.remove("zoomed");
  }
}

previewOverlay?.addEventListener("click", closePreview);
previewClose?.addEventListener("click", closePreview);
previewImage?.addEventListener("click", () => {
  previewImage.classList.toggle("zoomed");
});

renderMenu();
bindQtyControls();
bindPreviewButtons();
updateSummary();
