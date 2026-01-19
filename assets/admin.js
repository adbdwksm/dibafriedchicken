const statusMap = {
  new: { label: "New", badge: "bg-saffron", next: "cooking" },
  cooking: { label: "Cooking", badge: "bg-mint", next: "ready" },
  ready: { label: "Ready", badge: "bg-tomato", next: "picked" },
  picked: { label: "Picked", badge: "bg-ink", next: "new" }
};

const filterSelect = document.getElementById("statusFilter");
const cards = Array.from(document.querySelectorAll(".order-card"));

function updateStats() {
  const counts = { new: 0, cooking: 0, ready: 0 };
  cards.forEach((card) => {
    const status = card.dataset.status;
    if (counts[status] !== undefined) {
      counts[status] += 1;
    }
  });
  document.getElementById("statNew").textContent = counts.new;
  document.getElementById("statCooking").textContent = counts.cooking;
  document.getElementById("statReady").textContent = counts.ready;
  document.getElementById("statTotal").textContent = cards.length;
}

function applyFilter() {
  const value = filterSelect.value;
  cards.forEach((card) => {
    const show = value === "all" || card.dataset.status === value;
    card.classList.toggle("hidden", !show);
  });
}

function advanceStatus(card) {
  const current = card.dataset.status;
  const next = statusMap[current]?.next || "new";
  card.dataset.status = next;

  const dot = card.querySelector(".status-dot");
  const label = card.querySelector(".status-label");
  if (dot) {
    dot.className = `status-dot ${statusMap[next].badge}`;
  }
  if (label) {
    label.textContent = statusMap[next].label;
  }
  updateStats();
  applyFilter();
}

filterSelect?.addEventListener("change", applyFilter);

cards.forEach((card) => {
  const button = card.querySelector(".advance-btn");
  button?.addEventListener("click", () => advanceStatus(card));
});

updateStats();
