(function () {
  const P = window.PERFUMES, C = window.CATEGORIES;

  // Each note maps to an icon family; unknown notes fall back to "default".
  const NOTE_FAMILY = {
    citrus: ["Bergamot","Lemon","Grapefruit","Mandarin","Petitgrain","Orange"],
    fruit: ["Pineapple","Apple","Black Currant","Pear","Dates","Plum"],
    floral: ["Jasmine","Rose","Iris","Violet","Orange Blossom","Tuberose","Geranium"],
    green: ["Violet Leaf","Mint","Lavender","Oregano","Absinthe","Birch","Oakmoss","Fir Resin"],
    spice: ["Pepper","Black Pepper","Pink Pepper","Sichuan Pepper","Cardamom","Cinnamon","Nutmeg","Ginger","Saffron","Elemi"],
    wood: ["Cedar","Sandalwood","Vetiver","Patchouli","Amberwood","Papyrus","Oud"],
    resin: ["Amber","Labdanum","Incense","Myrrh","Benzoin","Opoponax","Ambergris","Ambroxan","Ambrox"],
    sweet: ["Vanilla","Tonka Bean","Praline","Coffee","Tobacco"],
    musk: ["Musk","Leather"]
  };
  const familyOf = n => Object.keys(NOTE_FAMILY).find(f => NOTE_FAMILY[f].includes(n)) || "default";

  const ICONS = {
    citrus: '<circle cx="32" cy="32" r="22" fill="#f2c23a"/><circle cx="32" cy="32" r="17" fill="#fbe08a"/><path d="M32 15v34M15 32h34M20 20l24 24M44 20 20 44" stroke="#f2c23a" stroke-width="2"/>',
    fruit: '<path d="M32 18c-14-6-24 6-20 20 3 12 12 20 20 16 8 4 17-4 20-16 4-14-6-26-20-20z" fill="#d9534f"/><path d="M32 18c0-6 2-10 6-12" stroke="#6b4a2a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="42" cy="10" rx="7" ry="4" fill="#5f8f3e" transform="rotate(-20 42 10)"/>',
    floral: '<g fill="#e48aa6"><circle cx="32" cy="18" r="10"/><circle cx="45" cy="28" r="10"/><circle cx="40" cy="44" r="10"/><circle cx="24" cy="44" r="10"/><circle cx="19" cy="28" r="10"/></g><circle cx="32" cy="32" r="7" fill="#f6d36b"/>',
    green: '<path d="M32 58C12 46 10 22 32 6c22 16 20 40 0 52z" fill="#4f7a3a"/><path d="M32 58V12M32 26l-9-6M32 36l10-7M32 46l-10-6" stroke="#cfe6b8" stroke-width="2" fill="none" stroke-linecap="round"/>',
    spice: '<path d="M14 40c6-18 30-26 40-14-8 14-28 22-40 14z" fill="#b5462e"/><path d="M14 40c-4 4-6 8-6 12" stroke="#5f8f3e" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M22 36c8-6 18-10 26-10" stroke="#e07a5f" stroke-width="2" fill="none"/>',
    wood: '<rect x="10" y="22" width="40" height="22" rx="4" fill="#b88a5c"/><path d="M14 28h30M14 34h26M14 40h32" stroke="#8a6544" stroke-width="1.5"/><ellipse cx="50" cy="33" rx="7" ry="11" fill="#d9b48a" stroke="#8a6544" stroke-width="2"/><ellipse cx="50" cy="33" rx="3" ry="5" fill="none" stroke="#8a6544" stroke-width="1.5"/>',
    resin: '<path d="M32 8c10 14 16 22 16 32a16 16 0 0 1-32 0c0-10 6-18 16-32z" fill="#d99a2b"/><path d="M26 34c0 6 3 10 8 11" stroke="#fbe08a" stroke-width="3" fill="none" stroke-linecap="round"/>',
    sweet: '<path d="M30 54C28 40 26 22 30 8" stroke="#3b2414" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M38 54c2-14 4-32 0-46" stroke="#5a3a20" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="20" cy="46" r="7" fill="#f3e2b8"/>',
    musk: '<circle cx="32" cy="32" r="20" fill="#d8cfc4"/><circle cx="26" cy="28" r="10" fill="#efe8df" opacity=".9"/><circle cx="38" cy="36" r="9" fill="#c4b8aa" opacity=".8"/>',
    default: '<circle cx="32" cy="32" r="18" fill="#c9b99a"/>'
  };
  // Drop a photo at img/notes/<note-name>.jpg (e.g. img/notes/black-pepper.jpg) and it
  // replaces the drawn icon automatically; missing photos fall back to the icon.
  const slug = n => n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const icon = n => `<svg viewBox="0 0 64 64" aria-hidden="true">${ICONS[familyOf(n)]}</svg>` +
    `<img class="nphoto" src="img/notes/${slug(n)}.jpg" alt="" loading="lazy" onerror="this.remove()">`;

  // Original bottle illustration tinted per perfume; uses a photo when provided.
  // Bottle photo: set "photo" in perfumes.js, or drop a file at img/bottles/<id>.png.
  const bottle = p => p.photo
    ? `<img src="${p.photo}" alt="${p.brand} ${p.name} bottle">`
    : `<svg viewBox="0 0 200 300" role="img" aria-label="${p.name} bottle illustration">
        <defs><linearGradient id="g-${p.id}" x1="0" x2="1">
          <stop offset="0" stop-color="${p.color}" stop-opacity=".95"/><stop offset=".45" stop-color="${p.color}" stop-opacity=".6"/><stop offset="1" stop-color="${p.color}"/>
        </linearGradient></defs>
        <ellipse cx="100" cy="288" rx="62" ry="7" fill="#000" opacity=".12"/>
        <rect x="72" y="22" width="56" height="58" rx="6" fill="${p.cap}"/>
        <rect x="84" y="80" width="32" height="14" fill="#a8874a"/>
        <rect x="42" y="94" width="116" height="190" rx="14" fill="url(#g-${p.id})"/>
        <rect x="52" y="104" width="12" height="168" rx="6" fill="#fff" opacity=".2"/>
        <rect x="60" y="162" width="80" height="56" rx="4" fill="#f7f3ea"/>
        <text x="100" y="186" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="11" fill="#555">${p.brand.toUpperCase().slice(0,22)}</text>
        <text x="100" y="204" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="13" fill="#222">${p.name.toUpperCase().slice(0,18)}</text>
      </svg>`;

  const $ = s => document.querySelector(s);
  let active = "all", query = "";

  function renderTabs() {
    $("#tabs").innerHTML = C.map(c =>
      `<button role="tab" aria-selected="${c.id === active}" data-cat="${c.id}">${c.label}</button>`).join("");
    const c = C.find(x => x.id === active);
    $("#catDesc").textContent = c.desc || "Every perfume in the collection";
  }

  function renderGrid() {
    const q = query.trim().toLowerCase();
    const list = P.filter(p => (active === "all" || p.category === active) &&
      (!q || [p.brand, p.name, ...p.notes.top, ...p.notes.heart, ...p.notes.base].join(" ").toLowerCase().includes(q)));
    $("#grid").innerHTML = list.length ? list.map(p => `
      <button class="pcard" data-id="${p.id}">
        <div class="pimg">${bottle(p)}</div>
        <div class="pbody">
          <span class="pcat">${C.find(c => c.id === p.category).label}</span>
          <div class="pbrand">${p.brand}</div>
          <div class="pname">${p.name}</div>
          <div class="pnotes">${p.notes.top.slice(0,3).map(n => `<span>${icon(n)}</span>`).join("")}</div>
        </div>
      </button>`).join("") : `<p class="empty">No perfumes match “${query}”.</p>`;
  }

  const tier = (label, notes) => `
    <div class="tier"><h4>${label}</h4>
      <div class="notes">${notes.map(n => `<div class="note"><div class="ic">${icon(n)}</div>${n}</div>`).join("")}</div>
    </div>`;

  function openDetail(id) {
    const p = P.find(x => x.id === id);
    if (!p) return;
    const facts = [["Type", p.type], ["For", p.gender], ["Launched", p.year], ["Perfumer", p.perfumer], ["Best for", p.bestFor]]
      .filter(f => f[1]).map(f => `<div class="fact"><b>${f[0]}</b>${f[1]}</div>`).join("");
    $("#detailBody").innerHTML = `
      <div class="dhero">
        <div class="dimg" style="--tint:${p.color}">${bottle(p)}</div>
        <div>
          <div class="pbrand">${p.brand}</div>
          <h2 id="dTitle">${p.name}</h2>
          <p class="muted">${p.blurb}</p>
          <div class="chips">${p.accords.map((a, i) => `<span style="opacity:${1 - i * 0.12}">${a}</span>`).join("")}</div>
          <div class="facts">${facts}</div>
        </div>
      </div>
      <h3 class="ptitle">Notes pyramid</h3>
      ${tier("Top notes", p.notes.top)}${tier("Heart notes", p.notes.heart)}${tier("Base notes", p.notes.base)}`;
    const d = $("#detail");
    if (!d.open) d.showModal();
    d.scrollTop = 0;
    if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
  }

  function closeDetail() {
    $("#detail").close();
  }

  $("#tabs").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    active = b.dataset.cat; renderTabs(); renderGrid();
  });
  $("#search").addEventListener("input", e => { query = e.target.value; renderGrid(); });
  $("#grid").addEventListener("click", e => {
    const b = e.target.closest(".pcard"); if (b) openDetail(b.dataset.id);
  });
  $("#closeBtn").addEventListener("click", closeDetail);
  $("#detail").addEventListener("click", e => { if (e.target.id === "detail") closeDetail(); });
  $("#detail").addEventListener("close", () => history.replaceState(null, "", location.pathname));

  renderTabs(); renderGrid();
  if (location.hash) openDetail(location.hash.slice(1));
})();
