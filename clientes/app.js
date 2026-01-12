// app.js
(() => {
  const KEY = "controle_contatos_basico_v1";

  const $ = (id) => document.getElementById(id);

  const els = {
    form: $("form"),
    name: $("name"),
    type: $("type"),
    sentDate: $("sentDate"),
    channel: $("channel"),
    status: $("status"),
    followUp: $("followUp"),

    tbody: $("tbody"),
    empty: $("empty"),

    btnExport: $("btnExport"),
    import: $("import"),
    btnClear: $("btnClear"),

    // modal edit
    modalBackdrop: $("modalBackdrop"),
    btnClose: $("btnClose"),
    btnCancel: $("btnCancel"),

    editForm: $("editForm"),
    editId: $("editId"),
    editName: $("editName"),
    editType: $("editType"),
    editSentDate: $("editSentDate"),
    editChannel: $("editChannel"),
    editStatus: $("editStatus"),
    editFollowUp: $("editFollowUp"),
  };

  let data = load();

  // default date
  els.sentDate.value = todayIso();

  render();

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    add();
  });

  els.btnExport.addEventListener("click", () => {
    download(`contatos-backup-${todayIso()}.json`, JSON.stringify({ version: 1, data }, null, 2), "application/json");
  });

  els.import.addEventListener("change", async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try{
      const obj = JSON.parse(await f.text());
      if (!obj || !Array.isArray(obj.data)) throw new Error("Arquivo inválido");
      // merge por id
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

  // modal actions
  els.btnClose.addEventListener("click", closeModal);
  els.btnCancel.addEventListener("click", closeModal);
  els.modalBackdrop.addEventListener("click", (e) => { if (e.target === els.modalBackdrop) closeModal(); });

  els.editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveEdit();
  });

  function add(){
    const item = normalize({
      id: cryptoId(),
      name: els.name.value.trim(),
      type: els.type.value.trim(),
      sentDate: els.sentDate.value,
      channel: els.channel.value,
      status: els.status.value,
      followUp: els.followUp.value || ""
    });

    if (!item.name) return alert("Nome do cliente obrigatório.");
    if (!item.type) return alert("Tipo do lugar obrigatório.");
    if (!item.sentDate) return alert("Data obrigatória.");

    data.unshift(item);
    save();
    render();

    // limpar campos básicos sem tirar a data
    els.name.value = "";
    els.type.value = "";
    els.status.value = "pending";
    els.followUp.value = "";
    els.name.focus();
  }

  function openEdit(id){
    const item = data.find(x => x.id === id);
    if (!item) return;

    els.editId.value = item.id;
    els.editName.value = item.name;
    els.editType.value = item.type;
    els.editSentDate.value = item.sentDate;
    els.editChannel.value = item.channel;
    els.editStatus.value = item.status;
    els.editFollowUp.value = item.followUp || "";

    els.modalBackdrop.style.display = "block";
    setTimeout(() => els.editName.focus(), 0);
  }

  function saveEdit(){
    const id = els.editId.value;
    const idx = data.findIndex(x => x.id === id);
    if (idx < 0) return;

    data[idx] = normalize({
      id,
      name: els.editName.value.trim(),
      type: els.editType.value.trim(),
      sentDate: els.editSentDate.value,
      channel: els.editChannel.value,
      status: els.editStatus.value,
      followUp: els.editFollowUp.value || ""
    });

    save();
    render();
    closeModal();
  }

  function removeItem(id){
    const item = data.find(x => x.id === id);
    if (!item) return;
    if (!confirm(`Excluir "${item.name}"?`)) return;
    data = data.filter(x => x.id !== id);
    save();
    render();
  }

  function render(){
    els.tbody.innerHTML = data.map(rowHtml).join("");
    els.empty.style.display = data.length ? "none" : "block";

    data.forEach(item => {
      document.querySelector(`[data-edit="${item.id}"]`)?.addEventListener("click", () => openEdit(item.id));
      document.querySelector(`[data-del="${item.id}"]`)?.addEventListener("click", () => removeItem(item.id));
    });
  }

  function rowHtml(i){
    const statusText =
      i.status === "replied" ? "✅ Respondeu" :
      i.status === "pending" ? "🟡 Pendente" : "🔴 Não respondeu";

    const follow = i.followUp ? fmt(i.followUp) : `<span class="small">—</span>`;

    return `
      <tr>
        <td><b>${esc(i.name)}</b></td>
        <td>${esc(i.type)}</td>
        <td>${fmt(i.sentDate)}</td>
        <td>${esc(i.channel)}</td>
        <td><span class="status ${i.status}">${statusText}</span></td>
        <td>${follow}</td>
        <td>
          <button class="icon-btn" data-edit="${i.id}">Editar</button>
          <button class="icon-btn del" data-del="${i.id}">Excluir</button>
        </td>
      </tr>
    `;
  }

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
      name: String(obj.name || "").trim(),
      type: String(obj.type || "").trim(),
      sentDate: obj.sentDate ? String(obj.sentDate) : todayIso(),
      channel: String(obj.channel || "Instagram"),
      status: ["replied","pending","no_reply"].includes(obj.status) ? obj.status : "pending",
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

  function fmt(iso){
    const [y,m,d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  function esc(s){
    return String(s ?? "")
      .replaceAll("&","&amp;").replaceAll("<","&lt;")
      .replaceAll(">","&gt;").replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
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


