// Smooth scroll + offsets for fixed header
const header = document.querySelector(".header");
const headerOffset = () => (header?.offsetHeight || 80) + 18;

document.querySelectorAll("[data-scroll]").forEach(a => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    // close mobile drawer if open
    closeDrawer();

    const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      const el = en.target;
      const delay = Number(el.dataset.revealDelay || 0);
      setTimeout(() => el.classList.add("is-visible"), delay);
      io.unobserve(el);
    }
  });
}, { threshold: 0.14 });

reveals.forEach(el => io.observe(el));

// Mobile drawer
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");
const drawerCloseBtn = document.getElementById("drawerClose");

function openDrawer(){
  if (!drawer) return;
  drawer.setAttribute("aria-hidden", "false");
  burger?.setAttribute("aria-expanded", "true");
}
function closeDrawer(){
  if (!drawer) return;
  drawer.setAttribute("aria-hidden", "true");
  burger?.setAttribute("aria-expanded", "false");
}
burger?.addEventListener("click", () => {
  const hidden = drawer.getAttribute("aria-hidden") === "true";
  hidden ? openDrawer() : closeDrawer();
});
drawerCloseBtn?.addEventListener("click", closeDrawer);

// Close drawer on outside click (mobile)
document.addEventListener("click", (e) => {
  if (!drawer || drawer.getAttribute("aria-hidden") === "true") return;
  const isInside = drawer.contains(e.target) || burger.contains(e.target);
  if (!isInside) closeDrawer();
});

// Search logic
const input = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const resultCount = document.getElementById("resultCount");
const cards = Array.from(document.querySelectorAll(".person, .player"));

function normalize(s){
  return (s || "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function applySearch(q){
  const query = normalize(q);

  let shown = 0;
  cards.forEach(card => {
    const hay = normalize(card.getAttribute("data-search"));
    const match = query.length === 0 ? true : hay.includes(query);
    card.classList.toggle("is-hidden", !match);
    if (match) shown++;
  });

  if (resultCount) {
    resultCount.textContent = `Найдено: ${shown} / ${cards.length}`;
  }
}

input?.addEventListener("input", () => applySearch(input.value));
clearBtn?.addEventListener("click", () => {
  if (!input) return;
  input.value = "";
  applySearch("");
  input.focus();
});

// Chips
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const val = chip.getAttribute("data-chip") || "";
    if (!input) return;
    input.value = val;
    applySearch(val);
  });
});

// Init
applySearch("");