const cart = new Map();
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cartBadge");
const clearCart = document.getElementById("clearCart");
const cartSummaryHome = document.getElementById("cartSummaryHome");
const previewOverlay = document.getElementById("previewOverlay");
const previewModal = document.getElementById("previewModal");
const previewImage = document.getElementById("previewImage");
const previewClose = document.getElementById("previewClose");
const menuSections = document.getElementById("menuSections");

function formatRupiah(value) {
  const thousands = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${thousands}`;
}

function toggleCart(open) {
  cartPanel.classList.toggle("open", open);
  cartOverlay.classList.toggle("hidden", !open);
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;
    count += item.qty;

    const row = document.createElement("div");
    row.className = "flex items-center justify-between rounded-xl bg-white/90 px-3 py-2";
    row.innerHTML = `
      <div>
        <p class="text-sm font-semibold">${item.name}</p>
        <p class="text-xs text-slate">${formatRupiah(item.price)} x ${item.qty}</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="qty-btn rounded-full border border-ink/10 px-2 text-sm" data-id="${item.id}" data-action="down">-</button>
        <button class="qty-btn rounded-full border border-ink/10 px-2 text-sm" data-id="${item.id}" data-action="up">+</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  cartTotal.textContent = formatRupiah(total);
  cartBadge.textContent = count;
  if (cartSummaryHome) {
    cartSummaryHome.textContent = `${count} item`;
  }

  if (cart.size === 0) {
    const empty = document.createElement("div");
    empty.className = "rounded-xl border border-dashed border-ink/20 px-3 py-4 text-center text-sm text-slate";
    empty.textContent = "Your cart is empty. Add something tasty.";
    cartItems.appendChild(empty);
  }
}

function addItem({ id, name, price }) {
  const existing = cart.get(id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.set(id, { id, name, price, qty: 1 });
  }
  renderCart();
}

function adjustQty(id, delta) {
  const item = cart.get(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart.delete(id);
  }
  renderCart();
}

function bindAddButtons() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      addItem({
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number(button.dataset.price)
      });
      toggleCart(true);
    });
  });
}

function renderHomeMenu() {
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
                  <button class="add-to-cart inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cream" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" ${soldOut ? "disabled" : ""}>
                    <svg aria-hidden="true" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                    </svg>
                    Add
                  </button>
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

cartItems.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.classList.contains("qty-btn")) return;
  const id = target.dataset.id;
  const action = target.dataset.action;
  if (action === "up") {
    adjustQty(id, 1);
  } else {
    adjustQty(id, -1);
  }
});

cartButton?.addEventListener("click", () => toggleCart(true));
cartClose?.addEventListener("click", () => toggleCart(false));
cartOverlay?.addEventListener("click", () => toggleCart(false));
clearCart?.addEventListener("click", () => {
  cart.clear();
  renderCart();
});

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

renderHomeMenu();
bindAddButtons();
bindPreviewButtons();
renderCart();
