// ===== Logo animation (гарантированный запуск) =====
window.addEventListener("load", () => {
  const logo = document.getElementById("auraLogo");
  if (!logo) return;
  setTimeout(() => logo.classList.add("is-on"), 120);
});

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ===== Modal logic =====
const modal = document.getElementById("modal");
const mTitle = document.getElementById("mTitle");
const mRole = document.getElementById("mRole");
const mMeta = document.getElementById("mMeta");
const mExtra = document.getElementById("mExtra");
const mImg = document.getElementById("mImg");
const mImgWrap = document.getElementById("mImgWrap");

function openModal(card){
  const title = card.dataset.title || "AURA FC";
  const role = card.dataset.role || "";
  const meta = card.dataset.meta || "";
  const extra = card.dataset.extra || "";
  const img = card.dataset.img || "";

  mTitle.textContent = title;
  mRole.textContent = role;
  mMeta.textContent = meta;
  mExtra.textContent = extra;

  if (img) {
    mImg.src = img;
    mImgWrap.style.display = "block";
  } else {
    mImg.removeAttribute("src");
    mImgWrap.style.display = "none";
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => openModal(card));
});

modal.addEventListener("click", (e) => {
  const t = e.target;
  if (t?.dataset?.close === "true") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});