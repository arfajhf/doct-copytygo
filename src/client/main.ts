import "../styles/site.css";
import { searchEntries, type SearchEntry } from "./search.ts";

const menu = document.querySelector<HTMLButtonElement>(".menu-toggle");
const sidebar = document.querySelector<HTMLElement>("#sidebar");
function closeMenu() {
  menu?.setAttribute("aria-expanded", "false");
  sidebar?.classList.remove("is-open");
}
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute(
    "aria-label",
    open ? "Tutup menu dokumentasi" : "Buka menu dokumentasi",
  );
  sidebar?.classList.toggle("is-open", open);
});
sidebar?.addEventListener("click", (event) => {
  if ((event.target as Element).closest("a")) closeMenu();
});
document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("ctg-theme", theme);
  } catch {}
});
for (const button of document.querySelectorAll<HTMLButtonElement>(".copy-code"))
  button.addEventListener("click", async () => {
    const text = button
      .closest(".code-block")
      ?.querySelector("code")?.textContent;
    if (!text) return;
    const label = button.getAttribute("aria-label") || "Salin kode";
    try {
      // Synchronous copy keeps user activation in embedded browsers. The async API
      // remains a fallback for browsers that no longer implement execCommand.
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("aria-hidden", "true");
      area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.append(area);
      area.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } finally {
        area.remove();
        button.focus();
      }
      if (!copied) await navigator.clipboard.writeText(text);
      button.textContent = "Tersalin ✓";
      button.setAttribute("aria-label", "Kode tersalin");
    } catch {
      button.textContent = "Gagal menyalin";
      button.setAttribute("aria-label", "Gagal menyalin kode");
    }
    setTimeout(() => {
      button.textContent = "Salin";
      button.setAttribute("aria-label", label);
    }, 2500);
  });
const dialog = document.querySelector<HTMLDialogElement>(".search-dialog")!;
const input = document.querySelector<HTMLInputElement>("#search-input")!;
const status = document.querySelector<HTMLElement>("#search-status")!;
const results = document.querySelector<HTMLElement>("#search-results")!;
let entries: SearchEntry[] | null = null;
let loading: Promise<void> | null = null;
let returnFocus: HTMLElement | null = null;
async function loadIndex() {
  if (entries) return;
  if (!loading)
    loading = fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) throw new Error("Search unavailable");
        return response.json();
      })
      .then((data) => {
        entries = data;
      })
      .finally(() => {
        loading = null;
      });
  await loading;
}
async function renderSearch() {
  status.textContent = "Memuat pencarian…";
  try {
    await loadIndex();
    results.replaceChildren();
    const query = input.value.trim();
    if (!query) {
      status.textContent = "Ketik untuk mencari dokumentasi.";
      return;
    }
    const matches = searchEntries(entries!, query);
    status.textContent = matches.length
      ? `${matches.length} hasil untuk “${query}”`
      : "Tidak ada hasil. Coba kata lain.";
    for (const entry of matches) {
      const item = document.createElement("li"),
        link = document.createElement("a"),
        title = document.createElement("strong"),
        excerpt = document.createElement("span");
      link.href = entry.route;
      title.textContent = entry.title;
      const position = entry.text
        .toLocaleLowerCase("id")
        .indexOf(query.toLocaleLowerCase("id").split(/\s+/)[0]);
      excerpt.textContent =
        (position > 35 ? "…" : "") +
        entry.text.slice(
          Math.max(0, position - 35),
          Math.max(0, position - 35) + 180,
        ) +
        "…";
      link.append(title, excerpt);
      item.append(link);
      results.append(item);
    }
  } catch {
    status.textContent = "Pencarian gagal dimuat. Coba tutup dan buka kembali.";
  }
}
function openSearch() {
  returnFocus = document.activeElement as HTMLElement;
  dialog.showModal();
  input.focus();
  void renderSearch();
}
document
  .querySelector("[data-search-open]")
  ?.addEventListener("click", openSearch);
document
  .querySelector("[data-search-close]")
  ?.addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => returnFocus?.focus());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  }
});
input.addEventListener("input", () => void renderSearch());
input.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    results.querySelector("a")?.focus();
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (dialog.open) dialog.close();
    else openSearch();
  }
  if (event.key === "Escape") {
    closeMenu();
    document
      .querySelectorAll<HTMLDetailsElement>("details[open]")
      .forEach((details) => (details.open = false));
  }
});
document.addEventListener("click", (event) =>
  document
    .querySelectorAll<HTMLDetailsElement>(".versions[open]")
    .forEach((details) => {
      if (!details.contains(event.target as Node)) details.open = false;
    }),
);
