/* =========================================================
   Muhabbet Ocakbaşı • Mobil Menü (STABİL)
   - Tek IIFE (global çakışma yok)
   - structuredClone polyfill eklendi
   - Admin panel dinleyici birikmesi engellendi
========================================================= */
(() => {
  "use strict";

  // --- Güvenli derin kopya (polyfill) ---
  const deepClone = (obj) => {
    if (typeof structuredClone === "function") return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
  };

  // ---------- Varsayılan Veri Modeli ----------
  const DEFAULT_DATA = {
    etler: [
      ["SATIR KEBAP (ACILI/ACISIZ)", 550, "Elle çekilmiş kıyma, hafif yağ; köz biber ve taze soğanla."],
      ["FISTIKLI KEBAP", 780, "Antep fıstığıyla harman; odun ateşi."],
      ["ÇÖP ŞİŞ", 650, "Marine kuzu lokmaları; yüksek ısı kısa pişirim."],
      ["KUZU ŞİŞ", 680, "Zeytinyağı-kekik marinaj."],
      ["CİĞER ŞİŞ", 700, "Soğan-sumak, maydanozla."],
      ["YAĞLI KARIŞIK", 850, "Şiş-köfte-kebap karışık tabak."],
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
    raki: {
      "Yeni Rakı": [["Tek",250],["Double",300],["20 cl",750],["35 cl",1150],["50 cl",1450],["70 cl",2000],["100 cl",2700]],
      "Yeni Seri": [["20 cl",740],["35 cl",1250],["70 cl",2200]],
      "Efe Rakı": [["Efe Klasik 35 cl",1200],["Efe Klasik 70 cl",2100]],
      "Yeşil Efe": [["Tek",250],["Double",300],["20 cl",900],["35 cl",1350],["70 cl",2200]],
      "Ala Rakı": [["35 cl",1400],["70 cl",2300]],
      "Beylerbeyi": [["Double",380],["35 cl",1450]],
      "Sarı Zeybek": [["Double",380],["35 cl",1400],["70 cl",2200],["100 cl",3000]],
    },
    sarap: [
      ["Kadeh Kırmızı", 300],
      ["Villa Doluca", 1250],
      ["Yakut", 1800],
    ],
  };

  // ---------- Kalıcı Depolama ----------
  const KEY = "muhabbet_menu_v1";
  const store = {
    read() {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return deepClone(DEFAULT_DATA);
        const data = JSON.parse(raw);
        for (const k of Object.keys(DEFAULT_DATA)) {
          if (data[k] == null) data[k] = deepClone(DEFAULT_DATA[k]);
        }
        return data;
      } catch {
        return deepClone(DEFAULT_DATA);
      }
    },
    write(obj) { localStorage.setItem(KEY, JSON.stringify(obj)); },
  };
  let DATA = store.read();

  // ---------- Yardımcılar & DOM ----------
  const money    = (n) => `${n} ₺`;
  const listRoot = document.getElementById("listRoot");
  const catHero  = document.getElementById("catHero");
  const catTitle = document.getElementById("catTitle");
  const catDesc  = document.getElementById("catDesc");
  const catStrip = document.getElementById("catStrip");

  const CAT_META = {
    etler:{title:"Etlerimiz",desc:"Ustadan kebaplar, ateşin lezzeti."},
    mezeler:{title:"Mezeler",desc:"Geleneksel tatlar, taze sunum."},
    aras:{title:"Ara Sıcak",desc:"Masaya sıcak dokunuşlar."},
    durum:{title:"Dürümlerimiz",desc:"Taş fırından sıcak lavaşla."},
    tasfirin:{title:"Taş Fırın",desc:"Közde lezzet, ince hamur."},
    raki:{title:"Rakı",desc:"Sohbetin eşlikçisi."},
    sarap:{title:"Şarap",desc:"Seçkin bağlardan."},
  };

  // ---------- Liste Render ----------
  function renderList(cat) {
    if (!listRoot) return;
    const data = DATA[cat];
    listRoot.innerHTML = "";

    if (Array.isArray(data)) {
      data.forEach((item, i) => {
        const [name, price, desc] = item;
        const row = document.createElement("div");
        row.className = "item";
        row.dataset.i = i;
        row.style.setProperty("--i", i);
        row.innerHTML = `
          <div class="name-wrap">
            <span class="name">${name}</span>
            ${desc ? `<br><small class="desc"><em>${desc}</em></small>` : ""}
          </div>
          <span class="price">${money(price)}</span>`;
        listRoot.appendChild(row);
      });
      return;
    }

    if (data && typeof data === "object") {
      let i = 0;
      Object.keys(data).forEach((groupName) => {
        const gHead = document.createElement("h3");
        gHead.className = "group-title";
        gHead.textContent = groupName;
        listRoot.appendChild(gHead);

        (data[groupName] || []).forEach(([name, price]) => {
          const row = document.createElement("div");
          row.className = "item";
          row.dataset.i = i;
          row.style.setProperty("--i", i++);
          row.innerHTML = `
            <div class="name-wrap"><span class="name">${name}</span></div>
            <span class="price">${money(price)}</span>`;
          listRoot.appendChild(row);
        });
      });
    }
  }

  // ---------- Kategori Değiştir ----------
  function setCategory(cat) {
    document.querySelectorAll(".chip").forEach((c) => {
      c.classList.toggle("active", c.dataset.cat === cat);
    });
    const meta = CAT_META[cat] || { title: cat, desc: "" };
    if (catTitle) catTitle.textContent = meta.title;
    if (catDesc)  catDesc.textContent  = meta.desc;
    if (catHero)  catHero.dataset.cat  = cat;

    renderList(cat);

    try { history.replaceState(null, "", `#${cat}`); } catch {}
    const activeChip = document.querySelector(`.chip[data-cat="${cat}"]`);
    activeChip?.scrollIntoView({ behavior:"smooth", inline:"center", block:"nearest" });
  }

  // ---------- Parallax ----------
  window.addEventListener("scroll", () => {
    if (!catHero) return;
    const rect = catHero.getBoundingClientRect();
    const vis  = Math.max(0, Math.min(1, 1 - rect.top / 300));
    catHero.style.setProperty("--parallax", `${-vis * 12}%`);
  });

  // ---------- Chip click ----------
  catStrip?.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (btn) setCategory(btn.dataset.cat);
  });

  // ---------- Başlangıç ----------
  const start = location.hash.replace("#","") || "etler";
  setCategory(start);

  // =========================================================
  // ADMIN PANEL
  // =========================================================
  const urlParams     = new URLSearchParams(location.search);
  const isAdmin       = urlParams.get("admin") === "1";

  const adminBtn      = document.getElementById("adminBtn");
  const adminDialog   = document.getElementById("adminDialog");
  const panelCategory = document.getElementById("panelCategory");
  const rows          = document.getElementById("rows");
  let   addRowBtn     = document.getElementById("addRow");  // klonlanacak
  const saveBtn       = document.getElementById("savePrices");
  const exportBtn     = document.getElementById("exportJson");
  const importInput   = document.getElementById("importJson");

  if (isAdmin && adminBtn) adminBtn.hidden = false;

  adminBtn?.addEventListener("click", () => {
    adminDialog?.showModal();
    if (panelCategory) panelCategory.value = location.hash.replace("#","") || "etler";
    drawPanel(panelCategory?.value || "etler");
  });
  adminDialog?.addEventListener("cancel", (e) => e.preventDefault());
  adminDialog?.addEventListener("close",  () => { if (rows) rows.innerHTML = ""; });

  // --- Satır bileşenleri ---
  function rowEl(name = "", price = "", desc = "") {
    const wrap = document.createElement("div");
    wrap.className = "row-item";
    wrap.innerHTML = `
      <input class="form-control form-control-sm" placeholder="Ürün adı" value="${name}">
      <input class="form-control form-control-sm" type="number" min="0" step="10" placeholder="Fiyat" value="${price}">
      <input class="form-control form-control-sm" placeholder="Kısa açıklama (isteğe bağlı)" value="${desc}">
      <div class="d-flex gap-1">
        <button type="button" class="btn btn-outline-light btn-sm move-up"   title="Yukarı"><i class="bi bi-arrow-up"></i></button>
        <button type="button" class="btn btn-outline-light btn-sm move-down" title="Aşağı"><i class="bi bi-arrow-down"></i></button>
        <button type="button" class="btn btn-outline-danger btn-sm del"      title="Sil"><i class="bi bi-trash"></i></button>
      </div>`;
    wrap.querySelector(".del").onclick       = () => wrap.remove();
    wrap.querySelector(".move-up").onclick   = () => wrap.previousElementSibling?.before(wrap);
    wrap.querySelector(".move-down").onclick = () => wrap.nextElementSibling?.after(wrap);
    return wrap;
  }

  function groupRowEl(name = "", price = "") {
    const wrap = document.createElement("div");
    wrap.className = "row-item";
    wrap.innerHTML = `
      <input class="form-control form-control-sm" placeholder="Ürün adı" value="${name}">
      <input class="form-control form-control-sm" type="number" min="0" step="10" placeholder="Fiyat" value="${price}">
      <div class="d-flex gap-1">
        <button type="button" class="btn btn-outline-light btn-sm move-up"   title="Yukarı"><i class="bi bi-arrow-up"></i></button>
        <button type="button" class="btn btn-outline-light btn-sm move-down" title="Aşağı"><i class="bi bi-arrow-down"></i></button>
        <button type="button" class="btn btn-outline-danger btn-sm del"      title="Sil"><i class="bi bi-trash"></i></button>
      </div>`;
    wrap.querySelector(".del").onclick       = () => wrap.remove();
    wrap.querySelector(".move-up").onclick   = () => wrap.previousElementSibling?.before(wrap);
    wrap.querySelector(".move-down").onclick = () => wrap.nextElementSibling?.after(wrap);
    return wrap;
  }

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
      <div class="rows"></div>`;
    const rowsWrap = group.querySelector(".rows");
    items.forEach(([n, p]) => rowsWrap.appendChild(groupRowEl(n, p)));
    group.querySelector(".add-item").onclick = () => rowsWrap.appendChild(groupRowEl());
    group.querySelector(".del-group").onclick = () => group.remove();
    return group;
  }

  // --- addRow dinleyicisi birikmesin
  function resetAddRowHandler() {
    if (!addRowBtn) return null;
    const clone = addRowBtn.cloneNode(true);
    addRowBtn.replaceWith(clone);
    addRowBtn = document.getElementById("addRow");
    return addRowBtn;
  }

  function drawPanel(cat) {
    if (!rows) return;
    rows.innerHTML = "";
    const data = DATA[cat];

    if (Array.isArray(data)) {
      (data || []).forEach(([name, price, desc = ""]) => rows.appendChild(rowEl(name, price, desc)));
      const btn = resetAddRowHandler();
      btn?.classList.remove("d-none");
      if (btn) btn.onclick = () => rows.appendChild(rowEl());
      return;
    }

    if (data && typeof data === "object") {
      Object.keys(data).forEach((g) => rows.appendChild(groupBlockEl(g, data[g] || [])));
      const btn = resetAddRowHandler();
      btn?.classList.add("d-none"); // gruplu ekleme grup içinde
    }
  }

  panelCategory?.addEventListener("change", () => drawPanel(panelCategory.value));

  // --- Kaydet
  saveBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const cat = panelCategory?.value || "etler";
    if (!rows) return;

    if (Array.isArray(DATA[cat])) {
      const next = [];
      rows.querySelectorAll(".row-item").forEach((row) => {
        const inputs = row.querySelectorAll("input");
        const name  = (inputs[0].value || "").trim();
        const price = Number(inputs[1].value);
        const desc  = (inputs[2].value || "").trim();
        if (name && !Number.isNaN(price)) next.push(desc ? [name, price, desc] : [name, price]);
      });
      DATA[cat] = next;
      store.write(DATA);
      if ((location.hash.replace("#","") || "etler") === cat) renderList(cat);
      adminDialog?.close();
      return;
    }

    if (DATA[cat] && typeof DATA[cat] === "object") {
      const obj = {};
      rows.querySelectorAll(".mb-3").forEach((groupEl) => {
        const gName = (groupEl.querySelector("input")?.value || "").trim();
        if (!gName) return;
        const arr = [];
        groupEl.querySelectorAll(".row-item").forEach((row) => {
          const [nameEl, priceEl] = row.querySelectorAll("input");
          const name  = (nameEl.value || "").trim();
          const price = Number(priceEl.value);
          if (name && !Number.isNaN(price)) arr.push([name, price]);
        });
        if (arr.length) obj[gName] = arr;
      });
      DATA[cat] = obj;
      store.write(DATA);
      if ((location.hash.replace("#","") || "etler") === cat) renderList(cat);
      adminDialog?.close();
    }
  });

  // --- JSON dışa/içe aktar
  exportBtn?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "muhabbet-menu.json"; a.click();
    URL.revokeObjectURL(url);
  });

  importInput?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const obj  = JSON.parse(text);
      const base = store.read();
      DATA = { ...base, ...obj };
      store.write(DATA);
      drawPanel(panelCategory?.value || "etler");
    } catch {
      alert("JSON okunamadı.");
    }
  });

  // ---------- (Opsiyonel) Açıklama stili enjekte ----------
  (function ensureDescStyle(){
    const id = "menu-desc-style";
    if (document.getElementById(id)) return;
    const css = document.createElement("style");
    css.id = id;
    css.textContent = `
      .item { display:flex; align-items:flex-start; justify-content:space-between; gap:.7rem; padding:.55rem 0; border-bottom:1px dashed rgba(255,255,255,.12); }
      .item .name-wrap { max-width: 72%; }
      .item .name { font-weight: 600; }
      .item .desc { opacity:.85; font-size:.9rem; }
      @media (max-width: 420px){ .item .name-wrap { max-width: 66%; } }
    `;
    document.head.appendChild(css);
  })();

})(); // END
