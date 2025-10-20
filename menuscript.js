/* =========================================================
   Muhabbet Ocakbaşı • Mobil Menü
   - Kategori: Etler, Mezeler, Ara Sıcak, Dürümler, Taş Fırın,
               Rakı (gruplu), Şarap
   - Admin panel: ?admin=1 ile açılır (sağ altta dişli çıkar)
   - Veriler localStorage'ta saklanır; JSON indir/yükle mevcut
   ========================================================= */

/* ---------------------------
   Varsayılan Veri Modeli
   --------------------------- */
const DEFAULT_DATA = {
  etler: [
    ["SATIR KEBAP (ACILI/ACISIZ)", 550],
    ["FISTIKLI KEBAP", 780],
    ["ÇÖP ŞİŞ", 650],
    ["KUZU ŞİŞ", 680],
    ["CİĞER ŞİŞ", 700],
    ["YAĞLI KARIŞIK", 850],
    ["KUZU KABURGA", 750],
    ["KUZU PİRZOLA", 850],
    ["KUZU KÜLBASTI", 850],
    ["TAVUK ŞİŞ", 450],
    ["TAVUK KANAT", 450],
    ["ALİ NAZİK (ETLİ - KIYMALI)", 680],
    ["ALİ NAZİK (TAVUKLU)", 650],
    ["SARMA BEYTİ", 610],
    ["KARIŞIK KEBAP", 900],
    ["KARIŞIK ET TABAĞI", 950],
    ["KUZU LOKUM", 900],
    ["PATLICAN KEBAP", 680],
    ["KUZU KÜŞLEME", 800],
    ["DANA LOKUM", 950],
    ["ANTRİKOT", 900],
    ["IZGARA KÖFTE", 460],
  ],
  mezeler: [
    ["İçli Köfte", 130],
    ["Patlıcan Söğürme", 250],
    ["Humus", 240],
    ["Acılı Ezme", 220],
  ],
  aras: [
    ["Güveçte Mantar", 240],
    ["Yaprak Ciğer", 460],
    ["Kaşarlı Mantar", 260],
    ["Sigara Böreği", 220],
  ],
  durum: [
    ["Adana Dürüm", 300],
    ["Urfa Dürüm", 300],
    ["Kuzu Şiş Dürüm", 350],
    ["Çöp Şiş Dürüm", 330],
    ["Ciğer Şiş Dürüm", 350],
    ["Tavuk Şiş Dürüm", 280],
  ],
  tasfirin: [
    ["Antep Lahmacun", 150],
    ["Kıymalı Pide", 330],
    ["Kaşarlı Pide", 310],
    ["Karışık Pide", 440],
    ["Adana Usulü Lahmacun", 450],
    ["Lahmacun", 150],
  ],
  // Gruplu kategori örneği (Rakı)
  raki: {
    "Yeni Rakı": [
      ["Tek", 250],
      ["Double", 300],
      ["20 cl", 750],
      ["35 cl", 1150],
      ["50 cl", 1450],
      ["70 cl", 2000],
      ["100 cl", 2700],
    ],
    "Yeni Seri": [
      ["20 cl", 740],
      ["35 cl", 1250],
      ["70 cl", 2200],
    ],
    "Efe Rakı": [
      ["Efe Klasik 35 cl", 1200],
      ["Efe Klasik 70 cl", 2100],
    ],
    "Yeşil Efe": [
      ["Tek", 250],
      ["Double", 300],
      ["20 cl", 900],
      ["35 cl", 1350],
      ["70 cl", 2200],
    ],
    "Ala Rakı": [
      ["35 cl", 1400],
      ["70 cl", 2300],
    ],
    "Beylerbeyi": [
      ["Double", 380],
      ["35 cl", 1450],
    ],
    "Sarı Zeybek": [
      ["Double", 380],
      ["35 cl", 1400],
      ["70 cl", 2200],
      ["100 cl", 3000],
    ],
  },
  sarap: [
    ["Kadeh Kırmızı", 300],
    ["Villa Doluca", 1250],
    ["Yakut", 1800],
  ],
};

/* ---------------------------
   Kalıcı Depolama
   --------------------------- */
const KEY = "muhabbet_menu_v1";

const store = {
  read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(DEFAULT_DATA);
      const data = JSON.parse(raw);
      // eksik kategori varsa tamamla
      for (const k of Object.keys(DEFAULT_DATA)) {
        if (data[k] == null) data[k] = structuredClone(DEFAULT_DATA[k]);
      }
      return data;
    } catch {
      return structuredClone(DEFAULT_DATA);
    }
  },
  write(obj) {
    localStorage.setItem(KEY, JSON.stringify(obj));
  },
};

let DATA = store.read();

/* ---------------------------
   Yardımcılar
   --------------------------- */
function money(n) {
  return `${n} ₺`;
}

const listRoot = document.getElementById("listRoot");
const catHero = document.getElementById("catHero");
const catTitle = document.getElementById("catTitle");
const catDesc = document.getElementById("catDesc");
const catStrip = document.getElementById("catStrip");

const CAT_META = {
  etler: { title: "Etlerimiz", desc: "Ustadan kebaplar, ateşin lezzeti." },
  mezeler: { title: "Mezeler", desc: "Geleneksel tatlar, taze sunum." },
  aras: { title: "Ara Sıcak", desc: "Masaya sıcak dokunuşlar." },
  durum: { title: "Dürümlerimiz", desc: "Taş fırından sıcak lavaşla." },
  tasfirin: { title: "Taş Fırın", desc: "Közde lezzet, ince hamur." },
  raki: { title: "Rakı", desc: "Sohbetin eşlikçisi." },
  sarap: { title: "Şarap", desc: "Seçkin bağlardan." },
};

/* ---------------------------
   Liste Render
   --------------------------- */
function renderList(cat) {
  const data = DATA[cat];
  listRoot.innerHTML = "";

  // 1) Düz dizi ise
  if (Array.isArray(data)) {
    data.forEach(([name, price], i) => {
      const row = document.createElement("div");
      row.className = "item";
      row.dataset.i = i;
      row.style.setProperty("--i", i);
      row.innerHTML = `<span class="name">${name}</span><span class="price">${money(
        price
      )}</span>`;
      listRoot.appendChild(row);
    });
    return;
  }

  // 2) Gruplu obje ise (ör: Rakı)
  if (data && typeof data === "object") {
    let i = 0;
    Object.keys(data).forEach((groupName) => {
      // grup başlığı
      const gHead = document.createElement("h3");
      gHead.className = "group-title";
      gHead.textContent = groupName;
      listRoot.appendChild(gHead);

      (data[groupName] || []).forEach(([name, price]) => {
        const row = document.createElement("div");
        row.className = "item";
        row.dataset.i = i;
        row.style.setProperty("--i", i++);
        row.innerHTML = `<span class="name">${name}</span><span class="price">${money(
          price
        )}</span>`;
        listRoot.appendChild(row);
      });
    });
  }
}

/* ---------------------------
   Kategori Değiştir
   --------------------------- */
function setCategory(cat) {
  // çip aktiflik
  document.querySelectorAll(".chip").forEach((c) => {
    c.classList.toggle("active", c.dataset.cat === cat);
  });

  // başlık & banner
  const meta = CAT_META[cat] || { title: cat, desc: "" };
  catTitle.textContent = meta.title;
  catDesc.textContent = meta.desc;
  catHero.dataset.cat = cat;

  // liste
  renderList(cat);

  // URL hash
  history.replaceState(null, "", `#${cat}`);

  // aktif çipi merkeze yaklaştır
  const activeChip = document.querySelector(`.chip[data-cat="${cat}"]`);
  if (activeChip) {
    activeChip.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
}

/* ---------------------------
   Parallax (kategori banner)
   --------------------------- */
window.addEventListener("scroll", () => {
  const rect = catHero.getBoundingClientRect();
  const vis = Math.max(0, Math.min(1, 1 - rect.top / 300));
  catHero.style.setProperty("--parallax", `${-vis * 12}%`);
});

/* ---------------------------
   Kategori Çipleri click
   --------------------------- */
catStrip.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  setCategory(btn.dataset.cat);
});

/* ---------------------------
   Başlangıç kategorisi
   --------------------------- */
const start = location.hash.replace("#", "") || "etler";
setCategory(start);

/* =========================================================
   ADMIN PANEL ( ?admin=1 )
   - Düz listeleri ve gruplu veriyi düzenleyebilir
   ========================================================= */
const params = new URLSearchParams(location.search);
const isAdmin = params.get("admin") === "1";

const adminBtn = document.getElementById("adminBtn");
const adminDialog = document.getElementById("adminDialog");
const panelCategory = document.getElementById("panelCategory");
const rows = document.getElementById("rows");
const addRowBtn = document.getElementById("addRow");
const saveBtn = document.getElementById("savePrices");
const exportBtn = document.getElementById("exportJson");
const importInput = document.getElementById("importJson");

// buton görünürlüğü
if (isAdmin && adminBtn) adminBtn.hidden = false;

adminBtn?.addEventListener("click", () => {
  adminDialog.showModal();
  panelCategory.value = location.hash.replace("#", "") || "etler";
  drawPanel(panelCategory.value);
});

adminDialog?.addEventListener("cancel", (e) => e.preventDefault());
adminDialog?.addEventListener("close", () => (rows.innerHTML = ""));

// satır component (düz)
function rowEl(name = "", price = "", i = 0) {
  const wrap = document.createElement("div");
  wrap.className = "row-item";
  wrap.innerHTML = `
    <input class="form-control form-control-sm" placeholder="Ürün adı" value="${name}">
    <input class="form-control form-control-sm" type="number" min="0" step="10" placeholder="Fiyat" value="${price}">
    <div class="d-flex gap-1">
      <button type="button" class="btn btn-outline-light btn-sm move-up" title="Yukarı"><i class="bi bi-arrow-up"></i></button>
      <button type="button" class="btn btn-outline-light btn-sm move-down" title="Aşağı"><i class="bi bi-arrow-down"></i></button>
      <button type="button" class="btn btn-outline-danger btn-sm del" title="Sil"><i class="bi bi-trash"></i></button>
    </div>
  `;
  wrap.querySelector(".del").onclick = () => wrap.remove();
  wrap.querySelector(".move-up").onclick = () =>
    wrap.previousElementSibling?.before(wrap);
  wrap.querySelector(".move-down").onclick = () =>
    wrap.nextElementSibling?.after(wrap);
  return wrap;
}

/* ---------- Gruplu UI: Grup + satırlar ---------- */
function groupBlockEl(groupName = "Yeni Grup", items = []) {
  const group = document.createElement("div");
  group.className = "mb-3 p-2 rounded-3";
  group.style.background = "#161617";
  group.style.border = "1px solid rgba(255,255,255,.12)";

  group.innerHTML = `
    <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
      <input class="form-control form-control-sm w-auto" style="min-width:220px" value="${groupName}">
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-outline-light btn-sm add-item"><i class="bi bi-plus-lg"></i> Ürün Ekle</button>
        <button type="button" class="btn btn-outline-danger btn-sm del-group"><i class="bi bi-trash"></i> Grubu Sil</button>
      </div>
    </div>
    <div class="rows"></div>
  `;

  const rowsWrap = group.querySelector(".rows");
  items.forEach(([n, p], i) => rowsWrap.appendChild(rowEl(n, p, i)));
  group.querySelector(".add-item").onclick = () =>
    rowsWrap.appendChild(rowEl());
  group.querySelector(".del-group").onclick = () => group.remove();

  return group;
}

/* ---------- Paneli Çiz ---------- */
function drawPanel(cat) {
  rows.innerHTML = "";
  const data = DATA[cat];

  // Düz liste
  if (Array.isArray(data)) {
    (data || []).forEach(([name, price], i) =>
      rows.appendChild(rowEl(name, price, i))
    );
    addRowBtn?.classList.remove("d-none");
    return;
  }

  // Gruplu (object)
  if (data && typeof data === "object") {
    Object.keys(data).forEach((g) =>
      rows.appendChild(groupBlockEl(g, data[g] || []))
    );
    // Düz satır ekleme butonunu gizle; grup içinde "Ürün Ekle" var
    addRowBtn?.classList.add("d-none");

    // Grup ekleme kısayolu: addRow tuşu grup eklesin
    addRowBtn?.addEventListener(
      "click",
      () => rows.appendChild(groupBlockEl("Yeni Grup", [])),
      { once: true }
    );
  }
}

panelCategory?.addEventListener("change", () => drawPanel(panelCategory.value));

// Düz liste için "+ Ekle"
addRowBtn?.addEventListener("click", () => rows.appendChild(rowEl()));

/* ---------- Kaydet ---------- */
saveBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  const cat = panelCategory.value;
  const source = rows;

  // Düz liste ise:
  if (Array.isArray(DATA[cat])) {
    const next = [];
    source.querySelectorAll(".row-item").forEach((row) => {
      const [nameEl, priceEl] = row.querySelectorAll("input");
      const name = (nameEl.value || "").trim();
      const price = Number(priceEl.value);
      if (name && !Number.isNaN(price)) next.push([name, price]);
    });
    DATA[cat] = next;
    store.write(DATA);
    if ((location.hash.replace("#", "") || "etler") === cat) renderList(cat);
    adminDialog.close();
    return;
  }

  // Gruplu ise:
  if (DATA[cat] && typeof DATA[cat] === "object") {
    const obj = {};
    source.querySelectorAll(".mb-3").forEach((groupEl) => {
      const gName = (groupEl.querySelector("input")?.value || "").trim();
      if (!gName) return;
      const arr = [];
      groupEl.querySelectorAll(".row-item").forEach((row) => {
        const [nameEl, priceEl] = row.querySelectorAll("input");
        const name = (nameEl.value || "").trim();
        const price = Number(priceEl.value);
        if (name && !Number.isNaN(price)) arr.push([name, price]);
      });
      if (arr.length) obj[gName] = arr;
    });
    DATA[cat] = obj;
    store.write(DATA);
    if ((location.hash.replace("#", "") || "etler") === cat) renderList(cat);
    adminDialog.close();
  }
});

/* ---------- JSON Dışa/İçe Aktar ---------- */
exportBtn?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(DATA, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "muhabbet-menu.json";
  a.click();
  URL.revokeObjectURL(url);
});

importInput?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const obj = JSON.parse(text);
    // var olan yapıyı bozmayalım; eksikleri tamamlayalım
    const base = store.read();
    DATA = { ...base, ...obj };
    store.write(DATA);
    drawPanel(panelCategory.value);
  } catch (err) {
    alert("JSON okunamadı.");
  }
});
