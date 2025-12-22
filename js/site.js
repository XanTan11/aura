// =======================
// LOGO ANIMATION (always)
// =======================
window.addEventListener("load", () => {
  const logo = document.getElementById("auraLogo");
  if (logo) setTimeout(() => logo.classList.add("is-on"), 120);

  // после загрузки — включаем reveal
  initReveal();
});

// =======================
// SMOOTH SCROLL WITH OFFSET (mobile safe)
// =======================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (!el) return;

    e.preventDefault();

    const header = document.querySelector(".header");
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const extra = 14; // запас, чтобы не было "впритык"

    const y = el.getBoundingClientRect().top + window.pageYOffset - headerH - extra;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: "smooth"
    });
  });
});

// =======================
// MODAL LOGIC
// =======================
const modal = document.getElementById("modal");
const mTitle = document.getElementById("mTitle");
const mRole  = document.getElementById("mRole");
const mMeta  = document.getElementById("mMeta");
const mExtra = document.getElementById("mExtra");
const mImg   = document.getElementById("mImg");
const mImgWrap = document.getElementById("mImgWrap");

function openModal(card){
  if (!modal) return;

  mTitle.textContent = card.dataset.title || "AURA FC";
  mRole.textContent  = card.dataset.role  || "";
  mMeta.textContent  = card.dataset.meta  || "";
  mExtra.textContent = card.dataset.extra || "";

  const img = card.dataset.img || "";
  if (img) {
    mImg.src = img;
    mImgWrap.style.display = "grid";
  } else {
    mImg.removeAttribute("src");
    mImgWrap.style.display = "none";
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => openModal(card));
});

if (modal) {
  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t?.dataset?.close === "true") closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
});

// =======================
// REVEAL ON SCROLL (IntersectionObserver)
// =======================
function initReveal(){
  // Добавляем .reveal автоматически к нужным блокам
  document.querySelectorAll(
    ".section, .hero__left, .hero__right, .grid, .match-card, .kits, .kits__group"
  ).forEach(el => el.classList.add("reveal"));

  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  // если браузер древний — просто показываем
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
}

// =========================
// PAGE BOTTOM REVEAL
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // всё, что ниже hero — считаем "нижней частью"
  const bottomContent = document.querySelector("main");

  if (!bottomContent) return;

  bottomContent.classList.add("page-reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.disconnect(); // один раз
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  observer.observe(bottomContent);
});

// ===== REVEAL ON SCROLL (PASTE AT END) =====
(() => {
  // Что анимируем (можешь добавлять/убирать селекторы)
  const targets = [
    ".section",
    ".card",
    ".match-card",
    ".kit-card",
    ".footer"
  ];

  const nodes = document.querySelectorAll(targets.join(","));

  // НЕ трогаем лого (чтобы не пропадало)
  nodes.forEach(el => {
    if (el.classList.contains("aura-logo")) return;
    if (el.closest(".modal")) return;         // модалку не анимируем
    el.classList.add("reveal");
  });

  // Если браузер не поддерживает Observer — просто показываем
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target); // один раз показал — хватит
      }
    });
  }, {
    root: null,
    threshold