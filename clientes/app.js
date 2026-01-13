(() => {
  const KEY = "controle_contatos_basico_v5";

  const $ = (id) => document.getElementById(id);

  const els = {
    form: $("form"),
    name: $("name"),
    type: $("type"),
    country: $("country"),
    sentDate: $("sentDate"),
    channel: $("channel"),
    status: $("status"),
    followUp: $("followUp"),
    tzHint: $("tzHint"),

    // WhatsApp (new)
    whatsappField: $("whatsappField"),
    whatsappNumber: $("whatsappNumber"),

    tbody: $("tbody"),
    empty: $("empty"),

    filterStatus: $("filterStatus"),
    filterCountry: $("filterCountry"),
    filterFollowup: $("filterFollowup"),

    btnExportPdf: $("btnExportPdf"),
    btnExportJson: $("btnExportJson"),
    import: $("import"),
    btnClear: $("btnClear"),

    // followup bar
    followupBar: $("followupBar"),
    followupTitle: $("followupTitle"),
    followupText: $("followupText"),
    btnViewFollowups: $("btnViewFollowups"),
    btnDismissFollowups: $("btnDismissFollowups"),

    // modal edit
    modalBackdrop: $("modalBackdrop"),
    btnClose: $("btnClose"),
    btnCancel: $("btnCancel"),

    editForm: $("editForm"),
    editId: $("editId"),
    editName: $("editName"),
    editType: $("editType"),
    editCountry: $("editCountry"),
    editSentDate: $("editSentDate"),
    editChannel: $("editChannel"),
    editStatus: $("editStatus"),
    editFollowUp: $("editFollowUp"),
    editTzHint: $("editTzHint"),

    // WhatsApp (new, modal)
    editWhatsappField: $("editWhatsappField"),
    editWhatsappNumber: $("editWhatsappNumber"),
  };

  // Country -> Timezone (for local time)
  const COUNTRY_OPTIONS = [
    { label: "UK", flag: "🇬🇧", tz: "Europe/London" },
    { label: "Ireland", flag: "🇮🇪", tz: "Europe/Dublin" },
    { label: "Portugal", flag: "🇵🇹", tz: "Europe/Lisbon" },
    { label: "Spain", flag: "🇪🇸", tz: "Europe/Madrid" },
    { label: "France", flag: "🇫🇷", tz: "Europe/Paris" },
    { label: "Germany", flag: "🇩🇪", tz: "Europe/Berlin" },
    { label: "Italy", flag: "🇮🇹", tz: "Europe/Rome" },
    { label: "Netherlands", flag: "🇳🇱", tz: "Europe/Amsterdam" },
    { label: "Belgium", flag: "🇧🇪", tz: "Europe/Brussels" },
    { label: "Switzerland", flag: "🇨🇭", tz: "Europe/Zurich" },
    { label: "Austria", flag: "🇦🇹", tz: "Europe/Vienna" },
    { label: "Sweden", flag: "🇸🇪", tz: "Europe/Stockholm" },
    { label: "Norway", flag: "🇳🇴", tz: "Europe/Oslo" },
    { label: "Denmark", flag: "🇩🇰", tz: "Europe/Copenhagen" },
    { label: "Finland", flag: "🇫🇮", tz: "Europe/Helsinki" },
    { label: "Poland", flag: "🇵🇱", tz: "Europe/Warsaw" },
    { label: "Czechia", flag: "🇨🇿", tz: "Europe/Prague" },
    { label: "Hungary", flag: "🇭🇺", tz: "Europe/Budapest" },
    { label: "Romania", flag: "🇷🇴", tz: "Europe/Bucharest" },
    { label: "Greece", flag: "🇬🇷", tz: "Europe/Athens" },
    { label: "Turkey", flag: "🇹🇷", tz: "Europe/Istanbul" },

    { label: "Brazil", flag: "🇧🇷", tz: "America/Sao_Paulo" },
    { label: "USA (NY)", flag: "🇺🇸", tz: "America/New_York" },
    { label: "Canada (Toronto)", flag: "🇨🇦", tz: "America/Toronto" },
    { label: "Mexico", flag: "🇲🇽", tz: "America/Mexico_City" },
    { label: "Argentina", flag: "🇦🇷", tz: "America/Argentina/Buenos_Aires" },
    { label: "Chile", flag: "🇨🇱", tz: "America/Santiago" },
    { label: "Colombia", flag: "🇨🇴", tz: "America/Bogota" },
    { label: "Peru", flag: "🇵🇪", tz: "America/Lima" },

    { label: "Australia (Sydney)", flag: "🇦🇺", tz: "Australia/Sydney" },
    { label: "New Zealand", flag: "🇳🇿", tz: "Pacific/Auckland" },
    { label: "Japan", flag: "🇯🇵", tz: "Asia/Tokyo" },
    { label: "South Korea", flag: "🇰🇷", tz: "Asia/Seoul" },
    { label: "China", flag: "🇨🇳", tz: "Asia/Shanghai" },
    { label: "India", flag: "🇮🇳", tz: "Asia/Kolkata" },
    { label: "UAE", flag: "🇦🇪", tz: "Asia/Dubai" },

    { label: "Other", flag: "🌍", tz: "" },
  ];

  function countryText(opt){ return `${opt.flag} ${opt.label}`.trim(); }
  function tzFromCountryText(ct){
    const found = COUNTRY_OPTIONS.find(o => countryText(o) === ct);
    return found?.tz || "";
  }

  // Populate country selects (form + modal)
  function fillCountrySelect(selectEl){
    selectEl.innerHTML = COUNTRY_OPTIONS.map(o => `<option>${countryText(o)}</option>`).join("");
  }
  fillCountrySelect(els.country);
  fillCountrySelect(els.editCountry);

  // Defaults
  els.country.value = countryText(COUNTRY_OPTIONS[0]); // 🇬🇧 UK
  els.sentDate.value = todayIso();

  // Local time hint (form)
  els.country.addEventListener("change", () => updateCountryHint(els.country.value, els.tzHint));
  updateCountryHint(els.country.value, els.tzHint);

  // Local time hint (modal)
  els.editCountry.addEventListener("change", () => updateCountryHint(els.editCountry.value, els.editTzHint));

  // WhatsApp field toggles
  els.channel.addEventListener("change", () => toggleWhatsappField(false));
  els.editChannel.addEventListener("change", () => toggleWhatsappField(true));
  toggleWhatsappField(false);
  toggleWhatsappField(true);

  // Data
  let data = load();

  // Filters
  els.filterStatus.addEventListener("change", render);
  els.filterCountry.addEventListener("change", render);
  els.filterFollowup.addEventListener("change", render);

  // Follow-up bar actions
  els.btnViewFollowups.addEventListener("click", () => {
    els.filterFollowup.value = "due";
    render();
    els.followupBar.style.display = "none";
  });
  els.btnDismissFollowups.addEventListener("click", () => {
    els.followupBar.style.display = "none";
  });

  // Add
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    add();
  });

  // Export/Import
  els.btnExportJson.addEventListener("click", () => {
    download(`contacts-backup-${todayIso()}.json`, JSON.stringify({ version: 5, data }, null, 2), "application/json");
  });

  els.import.addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try{
      const obj = JSON.parse(await f.text());
      if (!obj || !Array.isArray(obj.data)) throw new Error("Invalid file");
      const byId = new Map(data.map(x => [x.id, x]));
      obj.data.forEach(x => byId.set(x.id, normalize(x)));
      data = Array.from(byId.values());
      save();
      render();
      alert("Imported!");
    } catch (err){
      alert("Error: " + (err?.message || err));
    } finally {
      e.target.value = "";
    }
  });

  els.btnClear.addEventListener("click", () => {
    if (!confirm("Delete everything?")) return;
    data = [];
    save();
    render();
    renderFollowupBar();
  });

  // PDF
  els.btnExportPdf.addEventListener("click", () => exportPdf());

  // Modal
  els.btnClose.addEventListener("click", closeModal);
  els.btnCancel.addEventListener("click", closeModal);
  els.modalBackdrop.addEventListener("click", (e) => { if (e.target === els.modalBackdrop) closeModal(); });

  els.editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveEdit();
  });

  // Update hints every 30s (time + follow-up bar)
  setInterval(() => {
    updateCountryHint(els.country.value, els.tzHint);
    if (els.modalBackdrop.style.display === "block") {
      updateCountryHint(els.editCountry.value, els.editTzHint);
    }
    renderFollowupBar();
  }, 30000);

  // Initial render
  render();
  renderFollowupBar();

  // ===== WhatsApp behaviour =====
  function toggleWhatsappField(isModal){
    const channelEl = isModal ? els.editChannel : els.channel;
    const fieldEl = isModal ? els.editWhatsappField : els.whatsappField;
    const inputEl = isModal ? els.editWhatsappNumber : els.whatsappNumber;

    // In case you're still using the old HTML, fail safely:
    if (!fieldEl || !inputEl || !channelEl) return;

    const isWa = String(channelEl.value || "").toLowerCase() === "whatsapp";

    fieldEl.style.display = isWa ? "" : "none";
    inputEl.required = isWa;

    // If user changes away from WhatsApp, clear the number to avoid confusion
    if (!isWa) inputEl.value = "";
  }

  function getWhatsappFromForm(){
    const isWa = String(els.channel.value || "").toLowerCase() === "whatsapp";
    if (!isWa) return "";
    return normalisePhone(els.whatsappNumber?.value || "");
  }

  function getWhatsappFromEditForm(){
    const isWa = String(els.editChannel.value || "").toLowerCase() === "whatsapp";
    if (!isWa) return "";
    return normalisePhone(els.editWhatsappNumber?.value || "");
  }

  function normalisePhone(raw){
    const v = String(raw || "").trim();
    if (!v) return "";
    // Keep digits, spaces, +, (), -
    return v.replace(/[^\d+\s()-]/g, "").trim();
  }

  // ===== CRUD =====
  function add(){
    // WhatsApp validation (only if WhatsApp selected)
    if (String(els.channel.value || "").toLowerCase() === "whatsapp") {
      const w = normalisePhone(els.whatsappNumber?.value || "");
      if (!w) return alert("Please enter a WhatsApp number.");
    }

    const item = normalize({
      id: cryptoId(),
      country: els.country.value,
      name: els.name.value.trim(),
      type: els.type.value.trim(),
      sentDate: els.sentDate.value,
      channel: els.channel.value,
      status: els.status.value,
      followUp: els.followUp.value || "",
      whatsapp: getWhatsappFromForm()
    });

    if (!item.name) return alert("Client name is required.");
    if (!item.type) return alert("Business type is required.");
    if (!item.country) return alert("Country is required.");
    if (!item.sentDate) return alert("Date is required.");

    data.unshift(item);
    save();
    refreshCountryFilterOptions();
    render();
    renderFollowupBar();

    els.name.value = "";
    els.type.value = "";
    els.status.value = "sent";
    els.followUp.value = "";
    if (els.whatsappNumber) els.whatsappNumber.value = "";
    toggleWhatsappField(false);
    els.name.focus();
  }

  function openEdit(id){
    const item = data.find(x => x.id === id);
    if (!item) return;

    els.editId.value = item.id;
    els.editName.value = item.name;
    els.editType.value = item.type;
    els.editCountry.value = item.country;
    els.editSentDate.value = item.sentDate;
    els.editChannel.value = item.channel;
    els.editStatus.value = item.status;
    els.editFollowUp.value = item.followUp || "";

    // WhatsApp number in modal
    if (els.editWhatsappNumber) els.editWhatsappNumber.value = item.whatsapp || "";
    toggleWhatsappField(true);

    updateCountryHint(els.editCountry.value, els.editTzHint);

    els.modalBackdrop.style.display = "block";
    setTimeout(() => els.editName.focus(), 0);
  }

  function saveEdit(){
    const id = els.editId.value;
    const idx = data.findIndex(x => x.id === id);
    if (idx < 0) return;

    // WhatsApp validation (only if WhatsApp selected)
    if (String(els.editChannel.value || "").toLowerCase() === "whatsapp") {
      const w = normalisePhone(els.editWhatsappNumber?.value || "");
      if (!w) return alert("Please enter a WhatsApp number.");
    }

    data[idx] = normalize({
      id,
      country: els.editCountry.value,
      name: els.editName.value.trim(),
      type: els.editType.value.trim(),
      sentDate: els.editSentDate.value,
      channel: els.editChannel.value,
      status: els.editStatus.value,
      followUp: els.editFollowUp.value || "",
      whatsapp: getWhatsappFromEditForm()
    });

    save();
    refreshCountryFilterOptions();
    render();
    renderFollowupBar();
    closeModal();
  }

  function removeItem(id){
    const item = data.find(x => x.id === id);
    if (!item) return;
    if (!confirm(`Delete "${item.name}"?`)) return;
    data = data.filter(x => x.id !== id);
    save();
    refreshCountryFilterOptions();
    render();
    renderFollowupBar();
  }

  function setStatus(id, status){
    const idx = data.findIndex(x => x.id === id);
    if (idx < 0) return;
    data[idx] = { ...data[idx], status };
    save();
    render();
    renderFollowupBar();
  }

  // ===== filters =====
  function applyFilters(list){
    const st = els.filterStatus.value;
    const c = els.filterCountry.value;
    const fu = els.filterFollowup.value;

    let out = list;

    if (st) out = out.filter(x => x.status === st);
    if (c) out = out.filter(x => x.country === c);

    if (fu === "has") out = out.filter(x => !!x.followUp);
    if (fu === "none") out = out.filter(x => !x.followUp);
    if (fu === "due") out = out.filter(x => isFollowupDue(x.followUp) && x.status !== "replied");

    return out;
  }

  function render(){
    refreshCountryFilterOptions(false);

    const filtered = applyFilters(data);

    els.tbody.innerHTML = filtered.map(rowHtml).join("");
    els.empty.style.display = data.length ? "none" : "block";

    filtered.forEach(item => {
      document.querySelector(`[data-edit="${item.id}"]`)?.addEventListener("click", () => openEdit(item.id));
      document.querySelector(`[data-del="${item.id}"]`)?.addEventListener("click", () => removeItem(item.id));

      document.querySelector(`[data-qsent="${item.id}"]`)?.addEventListener("click", () => setStatus(item.id, "sent"));
      document.querySelector(`[data-qrep="${item.id}"]`)?.addEventListener("click", () => setStatus(item.id, "replied"));
      document.querySelector(`[data-qno="${item.id}"]`)?.addEventListener("click", () => setStatus(item.id, "no_reply"));
    });
  }

  function rowHtml(i){
    const statusText =
      i.status === "replied" ? "✅ Replied" :
      i.status === "sent" ? "📩 Message sent" :
      i.status === "pending" ? "🟡 Pending" :
      "🔴 No reply";

    const follow = i.followUp ? fmt(i.followUp) : `<span class="small">—</span>`;
    const due = isFollowupDue(i.followUp) && i.status !== "replied";

    const tz = tzFromCountryText(i.country);
    const { timeText, badHour } = tz ? getLocalTime(tz) : { timeText: "—", badHour: false };

    const whatsappCell = i.whatsapp ? esc(i.whatsapp) : `<span class="small">—</span>`;

    return `
      <tr>
        <td>${esc(i.country)}</td>
        <td><span class="tz ${badHour ? "bad" : ""}">${esc(timeText)}</span></td>
        <td><b>${esc(i.name)}</b></td>
        <td>${esc(i.type)}</td>
        <td>${whatsappCell}</td>
        <td>${fmt(i.sentDate)}</td>
        <td>${esc(i.channel)}</td>
        <td>
          <div class="quick">
            <button class="qbtn sent" data-qsent="${i.id}" type="button">📩 Sent</button>
            <button class="qbtn replied" data-qrep="${i.id}" type="button">✅ Replied</button>
            <button class="qbtn no_reply" data-qno="${i.id}" type="button">🔴 No</button>
          </div>
          <span class="status ${i.status}">${statusText}</span>
        </td>
        <td>${due ? `<b style="color:#b91c1c">${follow}</b>` : follow}</td>
        <td>
          <button class="icon-btn" data-edit="${i.id}" type="button">Edit</button>
          <button class="icon-btn del" data-del="${i.id}" type="button">Delete</button>
        </td>
      </tr>
    `;
  }

  // ===== Follow-up Bar =====
  function renderFollowupBar(){
    const dueList = data.filter(x => isFollowupDue(x.followUp) && x.status !== "replied");
    if (!dueList.length) {
      els.followupBar.style.display = "none";
      return;
    }

    const todayCount = dueList.filter(x => x.followUp && x.followUp === todayIso()).length;
    const overdue = dueList.length - todayCount;

    els.followupTitle.textContent = "⚠️ Follow-ups due";
    els.followupText.textContent =
      `You have ${dueList.length} (Today: ${todayCount} • Overdue: ${overdue}). Click “View now”.`;

    els.followupBar.style.display = "flex";
  }

  function isFollowupDue(iso){
    if (!iso) return false;
    const f = parseIsoToDate(iso);
    const t = parseIsoToDate(todayIso());
    return f <= t; // overdue or today
  }

  // ===== Timezone / Local time =====
  function updateCountryHint(countryTextValue, hintEl){
    const tz = tzFromCountryText(countryTextValue);
    if (!tz) {
      hintEl.classList.remove("warn");
      hintEl.textContent = "Local time: —";
      return;
    }

    const { timeText, badHour } = getLocalTime(tz);
    if (badHour) {
      hintEl.classList.add("warn");
      hintEl.textContent = `Local time: ${timeText} • ⚠️ Outside 09:00–19:00`;
    } else {
      hintEl.classList.remove("warn");
      hintEl.textContent = `Local time: ${timeText} • OK (09:00–19:00)`;
    }
  }

  function getLocalTime(timeZone){
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(new Date());

    const hh = Number(parts.find(p => p.type === "hour")?.value ?? "0");
    const mm = parts.find(p => p.type === "minute")?.value ?? "00";
    const timeText = `${String(hh).padStart(2,"0")}:${mm}`;

    const badHour = (hh < 9 || hh >= 19);
    return { timeText, badHour };
  }

  // ===== Country filter options =====
  function refreshCountryFilterOptions(forceKeepSelected = true){
    const unique = Array.from(new Set(data.map(x => x.country))).sort((a,b) => a.localeCompare(b));

    const current = els.filterCountry.value;
    const base = `<option value="">All</option>`;
    const opts = unique.map(c => `<option value="${escAttr(c)}">${esc(c)}</option>`).join("");
    els.filterCountry.innerHTML = base + opts;

    if (forceKeepSelected && unique.includes(current)) {
      els.filterCountry.value = current;
    }
  }

  // ===== PDF =====
  function exportPdf(){
    const filtered = applyFilters(data);

    const rowsHtml = filtered.map(i => {
      const statusText =
        i.status === "replied" ? "Replied" :
        i.status === "sent" ? "Message sent" :
        i.status === "pending" ? "Pending" : "No reply";

      const tz = tzFromCountryText(i.country);
      const localTime = tz ? getLocalTime(tz).timeText : "-";
      const wa = i.whatsapp ? esc(i.whatsapp) : "-";

      return `
        <tr>
          <td>${esc(i.country)}</td>
          <td>${esc(localTime)}</td>
          <td>${esc(i.name)}</td>
          <td>${esc(i.type)}</td>
          <td>${wa}</td>
          <td>${fmt(i.sentDate)}</td>
          <td>${esc(i.channel)}</td>
          <td>${esc(statusText)}</td>
          <td>${i.followUp ? fmt(i.followUp) : "-"}</td>
        </tr>
      `;
    }).join("");

    const html = `
      <!doctype html>
      <html lang="en-GB">
      <head>
        <meta charset="utf-8" />
        <title>PDF Export - Contacts</title>
        <style>
          body{ font-family: Arial, sans-serif; padding:20px; color:#111; }
          h1{ margin:0 0 6px; font-size:18px; }
          p{ margin:0 0 14px; color:#444; font-size:12px; }
          table{ width:100%; border-collapse:collapse; }
          th, td{ border:1px solid #bbb; padding:8px; font-size:12px; text-align:left; }
          th{ background:#e9eef7; }
          @media print { @page{ size:A4 landscape; margin:10mm; } }
        </style>
      </head>
      <body>
        <h1>Contact Tracker</h1>
        <p>Generated: ${new Date().toLocaleString("en-GB")}</p>
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Local time</th>
              <th>Client name</th>
              <th>Business type</th>
              <th>WhatsApp</th>
              <th>Date</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Follow-up</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="9">No records</td></tr>`}
          </tbody>
        </table>

        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) return alert("Pop-up blocked. Please allow pop-ups to export the PDF.");
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  // ===== Storage =====
  function load(){
    try{
      const raw = localStorage.getItem(KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.map(normalize);
    }catch{
      return [];
    }
  }

  function save(){
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function normalize(obj){
    // Backwards compatible: old records may not have whatsapp
    return {
      id: String(obj.id || cryptoId()),
      country: String(obj.country || countryText(COUNTRY_OPTIONS[0])),
      name: String(obj.name || "").trim(),
      type: String(obj.type || "").trim(),
      sentDate: obj.sentDate ? String(obj.sentDate) : todayIso(),
      channel: String(obj.channel || "Instagram"),
      status: ["replied","pending","sent","no_reply"].includes(obj.status) ? obj.status : "sent",
      followUp: obj.followUp ? String(obj.followUp) : "",
      whatsapp: obj.whatsapp ? String(obj.whatsapp).trim() : ""
    };
  }

  function closeModal(){
    els.modalBackdrop.style.display = "none";
  }

  function todayIso(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  function parseIsoToDate(iso){
    const [y,m,d] = iso.split("-").map(Number);
    return new Date(y, (m-1), d, 0, 0, 0, 0);
  }

  // UK-style display (dd/mm/yyyy)
  function fmt(iso){
    const [y,m,d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  function esc(s){
    return String(s ?? "")
      .replaceAll("&","&amp;").replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function escAttr(s){
    return String(s ?? "").replaceAll('"',"&quot;");
  }

  function cryptoId(){
    return (crypto?.randomUUID?.() || ("id_" + Math.random().toString(16).slice(2) + Date.now()));
  }

  function download(filename, content, mime){
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
})();
