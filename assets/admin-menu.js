const adminMenuList = document.getElementById("adminMenuList");
const previewOverlay = document.getElementById("previewOverlay");
const previewModal = document.getElementById("previewModal");
const previewImage = document.getElementById("previewImage");
const previewClose = document.getElementById("previewClose");

function formatRupiah(value) {
  const thousands = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${thousands}`;
}

function renderAdminMenu() {
  if (!adminMenuList || !window.DBC_MENU) return;

  adminMenuList.innerHTML = window.DBC_MENU
    .map((item) => {
      const active = item.active;
      const badgeText = active ? "Aktif" : "Nonaktif";
      const badgeClass = active ? "bg-mint/30 text-ink" : "bg-saffron/30 text-ink";
      const actionText = active ? "Nonaktifkan" : "Aktifkan";
      return `
      <article class="surface shadow-soft rounded-2xl p-4 ${active ? "" : "sold-out"}">
        <div class="flex items-center gap-4">
          <button class="preview-btn" data-src="${item.image}">
            <img class="h-16 w-16 rounded-xl object-cover" src="${item.thumb}" alt="${item.name}" />
          </button>
          <div class="flex-1">
            <p class="text-sm font-semibold">${item.name}</p>
            <p class="text-xs text-slate">${formatRupiah(item.price)}</p>
          </div>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <button class="rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-semibold">Edit</button>
          <div class="flex items-center gap-2">
            <button class="rounded-full border border-ink/10 bg-white px-3 py-2 text-xs font-semibold">Ganti Foto</button>
            <button class="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream">${actionText}</button>
          </div>
        </div>
      </article>
    `;
    })
    .join("");
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

renderAdminMenu();
bindPreviewButtons();
