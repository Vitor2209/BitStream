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
  };

  // País -> Timezone (para calcular hora local)
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

  // popular selects de país (form + modal)
  function fillCountrySelect(selectEl){
    selectEl.innerHTML = COUNTRY_OPTIONS.map(o => `<option>${countryText(o)}</option>`).join("");
  }
  fillCountrySelect(els.country);
  fillCountrySelect(els.editCountry);

  // default
  els.country.value = countryText(COUNTRY_OPTIONS[0]); // 🇬🇧 UK
  els.sentDate.value = todayIso();

  // Hora local / aviso de fuso (form)
  els.country.addEventListener("change", () => updateCountryHint(els.country.value, els.tzHint));
  updateCountryHint(els.country.value, els.tzHint);

  // Hora local / aviso de fuso (modal)
  els.editCountry.addEventListener("change", () => updateCountryHint(els.editCountry.value, els.editTzHint));

  let data = load();

  // filtros
  els.filterStatus.addEventListener("change", render);
  els.filterCountry.addEventListener("change", render);
  els.filterFollowup.addEventListener("change", render);

  // followup bar actions
  els.btnViewFollowups.addEventListener("click", () => {
    els.filterFollowup.value = "due";
    render();
    els.followupBar.style.display = "none";
  });
  els.btnDismissFollowups.addEventListener("click", () => {
    els.followupBar.style.display = "none";
  });

  // add
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    add();
  });

  // export/import
  els.btnExportJson.addEventListener("click", () => {
    download(`contatos-backup-${todayIso()}.json`, JSON.stringify({ version: 5, data }, null, 2), "application/json");
  });

  els.import.addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try{
      const obj = JSON.parse(await f.text());
      if (!obj || !Array.isArray(obj.data)) throw new Error("Arquivo inválido");
      const byId = new Map(data.map(x => [x.id, x]));
      obj.data.forEach(x => byId.set(x.id, normalize(x)));
      data = Array.from(byId.values());
      save();
      render();
      alert("Importado!");
    } catch (err){
      alert("Erro: " + (err?.message || err));
    } finally {
      e.target.value = "";
    }
  });

  els.btnClear.addEventListener("click", () => {
    if (!confirm("Apagar tudo?")) return;
    data = [];
    save();
    render();
  });

  // pdf
  els.btnExportPdf.addEventListener("click", () => exportPdf());

  // modal
  els.btnClose.addEventListener("click", closeModal);
  els.btnCancel.addEventListener("click", closeModal);
  els.modalBackdrop.addEventListener("click", (e) => { if (e.target === els.modalBackdrop) closeModal(); });

  els.editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveEdit();
  });

  // Atualiza hints de fuso a cada 30s (pra hora local não ficar velha)
  setInterval(() => {
    updateCountryHint(els.country.value, els.tzHint);
    if (els.modalBackdrop.style.display === "block") {
      updateCountryHint(els.editCountry.value, els.editTzHint);
    }
    renderFollowupBar(); // atualiza alerta
    // não chama render() aqui pra não ficar pesado
  }, 30000);

  // render inicial
  render();
  renderFollowupBar();

  function add(){
    const item = normalize({
      id: cryptoId(),
      country: els.country.value,
      name: els.name.value.trim(),
      type: els.type.value.trim(),
      sentDate: els.sentDate.value,
      channel: els.channel.value,
      status: els.status.value,
      followUp: els.followUp.value || ""
    });

    if (!item.name) return alert("Nome do cliente obrigatório.");
    if (!item.type) return alert("Tipo do lugar obrigatório.");
    if (!item.country) return alert("País obrigatório.");
    if (!item.sentDate) return alert("Data obrigatória.");

    data.unshift(item);
    save();
    refreshCountryFilterOptions();
    render();
    renderFollowupBar();

    els.name.value = "";
    els.type.value = "";
    els.status.value = "sent";
    els.followUp.value = "";
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

    updateCountryHint(els.editCountry.value, els.editTzHint);

    els.modalBackdrop.style.display = "block";
    setTimeout(() => els.editName.focus(), 0);
  }

  function saveEdit(){
    const id = els.editId.value;
    const idx = data.findIndex(x => x.id === id);
    if (idx < 0) return;

    data[idx] = normalize({
      id,
      country: els.editCountry.value,
      name: els.editName.value.trim(),
      type: els.editType.value.trim(),
      sentDate: els.editSentDate.value,
      channel: els.editChannel.value,
      status: els.editStatus.value,
      followUp: els.editFollowUp.value || ""
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
    if (!confirm(`Excluir "${item.name}"?`)) return;
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
      i.status === "replied" ? "✅ Respondeu" :
      i.status === "sent" ? "📩 Mensagem enviada" :
      i.status === "pending" ? "🟡 Pendente" :
      "🔴 Não respondeu";

    const follow = i.followUp ? fmt(i.followUp) : `<span class="small">—</span>`;
    const due = isFollowupDue(i.followUp) && i.status !== "replied";

    const tz = tzFromCountryText(i.country);
    const { timeText, badHour } = tz ? getLocalTime(tz) : { timeText: "—", badHour: false };

    return `
      <tr>
        <td>${esc(i.country)}</td>
        <td><span class="tz ${badHour ? "bad" : ""}">${esc(timeText)}</span></td>
        <td><b>${esc(i.name)}</b></td>
        <td>${esc(i.type)}</td>
        <td>${fmt(i.sentDate)}</td>
        <td>${esc(i.channel)}</td>
        <td>
          <div class="quick">
            <button class="qbtn sent" data-qsent="${i.id}" type="button">📩 Enviada</button>
            <button class="qbtn replied" data-qrep="${i.id}" type="button">✅ Respondeu</button>
            <button class="qbtn no_reply" data-qno="${i.id}" type="button">🔴 Não</button>
          </div>
          <span class="status ${i.status}">${statusText}</span>
        </td>
        <td>${due ? `<b style="color:#b91c1c">${follow}</b>` : follow}</td>
        <td>
          <button class="icon-btn" data-edit="${i.id}" type="button">Editar</button>
          <button class="icon-btn del" data-del="${i.id}" type="button">Excluir</button>
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

    const today = dueList.filter(x => x.followUp && x.followUp === todayIso()).length;
    const overdue = dueList.length - today;

    els.followupTitle.textContent = "⚠️ Follow-ups pendentes";
    els.followupText.textContent =
      `Você tem ${dueList.length} (Hoje: ${today} • Vencidos: ${overdue}). Clique em “Ver agora”.`;

    els.followupBar.style.display = "flex";
  }

  function isFollowupDue(iso){
    if (!iso) return false;
    const f = parseIsoToDate(iso);
    const t = parseIsoToDate(todayIso());
    return f <= t; // vencido ou hoje
  }

  // ===== Timezone / hora local =====
  function updateCountryHint(countryTextValue, hintEl){
    const tz = tzFromCountryText(countryTextValue);
    if (!tz) {
      hintEl.classList.remove("warn");
      hintEl.textContent = "Hora local: —";
      return;
    }

    const { timeText, badHour } = getLocalTime(tz);
    if (badHour) {
      hintEl.classList.add("warn");
      hintEl.textContent = `Hora local: ${timeText} • ⚠️ Fora de 09:00–19:00`;
    } else {
      hintEl.classList.remove("warn");
      hintEl.textContent = `Hora local: ${timeText} • OK (09:00–19:00)`;
    }
  }

  function getLocalTime(timeZone){
    const parts = new Intl.DateTimeFormat("pt-BR", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(new Date());

    const hh = Number(parts.find(p => p.type === "hour")?.value ?? "0");
    const mm = parts.find(p => p.type === "minute")?.value ?? "00";
    const timeText = `${String(hh).padStart(2,"0")}:${mm}`;

    // "horário ruim" fora de 09:00-19:00
    const badHour = (hh < 9 || hh >= 19);
    return { timeText, badHour };
  }

  // ===== filtros país =====
  function refreshCountryFilterOptions(forceKeepSelected = true){
    const unique = Array.from(new Set(data.map(x => x.country))).sort((a,b) => a.localeCompare(b));

    const current = els.filterCountry.value;
    const base = `<option value="">Todos</option>`;
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
        i.status === "replied" ? "Respondeu" :
        i.status === "sent" ? "Mensagem enviada" :
        i.status === "pending" ? "Pendente" : "Não respondeu";

      const tz = tzFromCountryText(i.country);
      const localTime = tz ? getLocalTime(tz).timeText : "-";

      return `
        <tr>
          <td>${esc(i.country)}</td>
          <td>${esc(localTime)}</td>
          <td>${esc(i.name)}</td>
          <td>${esc(i.type)}</td>
          <td>${fmt(i.sentDate)}</td>
          <td>${esc(i.channel)}</td>
          <td>${esc(statusText)}</td>
          <td>${i.followUp ? fmt(i.followUp) : "-"}</td>
        </tr>
      `;
    }).join("");

    const html = `
      <!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Export PDF - Contatos</title>
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
        <h1>Controle de Contatos</h1>
        <p>Gerado em: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>
              <th>País</th>
              <th>Hora local</th>
              <th>Nome do cliente</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Canal</th>
              <th>Status</th>
              <th>Follow-up</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="8">Nenhum registro</td></tr>`}
          </tbody>
        </table>

        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `;

    const w = window.open("", "_blank");
    if (!w) return alert("Pop-up bloqueado. Permita pop-ups para exportar o PDF.");
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  // ===== storage =====
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
    return {
      id: String(obj.id || cryptoId()),
      country: String(obj.country || countryText(COUNTRY_OPTIONS[0])),
      name: String(obj.name || "").trim(),
      type: String(obj.type || "").trim(),
      sentDate: obj.sentDate ? String(obj.sentDate) : todayIso(),
      channel: String(obj.channel || "Instagram"),
      status: ["replied","pending","sent","no_reply"].includes(obj.status) ? obj.status : "sent",
      followUp: obj.followUp ? String(obj.followUp) : ""
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
    // normaliza para meia-noite local
    const [y,m,d] = iso.split("-").map(Number);
    return new Date(y, (m-1), d, 0, 0, 0, 0);
  }

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
    // para value=""
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
