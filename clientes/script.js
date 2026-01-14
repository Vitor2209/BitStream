/* ======================================
   MINI CRM - JavaScript
   Pure JavaScript - No frameworks
   ====================================== */

// ===== DATA & STATE =====
let contacts = [];
let nextId = 101;
let selectedCountryForTimeDisplay = 'BR';

// Country configurations with timezone and flags
const COUNTRIES = {
    'BR': { name: 'Brasil', flag: '🇧🇷', timezone: 'America/Sao_Paulo' },
    'PT': { name: 'Portugal', flag: '🇵🇹', timezone: 'Europe/Lisbon' },
    'UK': { name: 'Reino Unido', flag: '🇬🇧', timezone: 'Europe/London' },
    'US': { name: 'Estados Unidos', flag: '🇺🇸', timezone: 'America/New_York' },
    'MX': { name: 'México', flag: '🇲🇽', timezone: 'America/Mexico_City' },
    'ES': { name: 'Espanha', flag: '🇪🇸', timezone: 'Europe/Madrid' },
    'FR': { name: 'França', flag: '🇫🇷', timezone: 'Europe/Paris' },
    'DE': { name: 'Alemanha', flag: '🇩🇪', timezone: 'Europe/Berlin' },
    'IT': { name: 'Itália', flag: '🇮🇹', timezone: 'Europe/Rome' },
    'EE': { name: 'Estônia', flag: '🇪🇪', timezone: 'Europe/Tallinn' },
    'AR': { name: 'Argentina', flag: '🇦🇷', timezone: 'America/Argentina/Buenos_Aires' },
    'CL': { name: 'Chile', flag: '🇨🇱', timezone: 'America/Santiago' },
    'CO': { name: 'Colômbia', flag: '🇨🇴', timezone: 'America/Bogota' },
    'JP': { name: 'Japão', flag: '🇯🇵', timezone: 'Asia/Tokyo' },
    'CN': { name: 'China', flag: '🇨🇳', timezone: 'Asia/Shanghai' },
    'AU': { name: 'Austrália', flag: '🇦🇺', timezone: 'Australia/Sydney' },
    'CA': { name: 'Canadá', flag: '🇨🇦', timezone: 'America/Toronto' }
};

// ===== UTILITY FUNCTIONS =====

// Get current time in a specific timezone
function getTimeInTimezone(timezone) {
    try {
        const now = new Date();
        return new Intl.DateTimeFormat('pt-BR', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(now);
    } catch (e) {
        console.error('Timezone error:', e);
        return '--:--';
    }
}

// Calculate timezone offset difference with UK
function getTimezoneOffsetFromUK(timezone) {
    try {
        const now = new Date();
        const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
        const targetTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const diffHours = Math.round((targetTime - ukTime) / (1000 * 60 * 60));
        
        if (diffHours === 0) return '0h';
        return diffHours > 0 ? `+${diffHours}h` : `${diffHours}h`;
    } catch (e) {
        return '--';
    }
}

// Get ideal window badge based on local time
function getIdealWindowBadge(localTime) {
    const [hours] = localTime.split(':').map(Number);
    
    if (hours >= 9 && hours < 18) {
        return { text: 'Bom Horário', class: 'badge-success' };
    } else if ((hours >= 8 && hours < 9) || (hours >= 18 && hours < 20)) {
        return { text: 'Neutro', class: 'badge-warning' };
    } else {
        return { text: 'Fora do Horário', class: 'badge-danger' };
    }
}

// Calculate days without response
function calculateDaysWithoutResponse(contact) {
    if (!contact.lastActionDate) return '—';
    if (contact.status === 'Replied' || contact.lastAction === 'Fechado') return '—';
    
    const lastDate = new Date(contact.lastActionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 ? diffDays : 0;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '—';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch (e) {
        return dateString;
    }
}

// Get status badge class
function getStatusBadgeClass(status) {
    const classes = {
        'Pending': 'badge-pending',
        'Sent': 'badge-sent',
        'Replied': 'badge-replied',
        'No reply': 'badge-noreply'
    };
    return classes[status] || 'badge-neutral';
}

// Get last action badge class
function getLastActionBadgeClass(action) {
    if (!action) return '';
    const classes = {
        'Mensagem Enviada': 'badge-action',
        'Follow-Up 1': 'badge-followup',
        'Follow-Up 2': 'badge-followup',
        'Aguardando Retorno': 'badge-waiting',
        'Fechado': 'badge-closed'
    };
    return classes[action] || 'badge-neutral';
}

// ===== TIME INFO DISPLAY =====
function updateTimeInfo() {
    const ukTime = getTimeInTimezone('Europe/London');
    const countryInfo = COUNTRIES[selectedCountryForTimeDisplay];
    const offset = countryInfo ? getTimezoneOffsetFromUK(countryInfo.timezone) : '--';
    
    const timeInfoEl = document.getElementById('timeInfo');
    timeInfoEl.innerHTML = `<strong>Seu Horário (UK):</strong> ${ukTime} | <strong>Diferença de fuso:</strong> ${selectedCountryForTimeDisplay} ${offset}`;
}

// ===== TABLE RENDERING =====
function renderTable(filteredContacts = null) {
    const tableBody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');
    const dataToRender = filteredContacts || contacts;
    
    if (dataToRender.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.table-container').style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    document.querySelector('.table-container').style.display = 'block';
    
    tableBody.innerHTML = dataToRender.map(contact => {
        const country = COUNTRIES[contact.country] || { flag: '🏳️', name: contact.country };
        const localTime = getTimeInTimezone(country.timezone || 'UTC');
        const idealWindow = getIdealWindowBadge(localTime);
        const daysWithoutResponse = calculateDaysWithoutResponse(contact);
        const statusClass = getStatusBadgeClass(contact.status);
        const actionClass = getLastActionBadgeClass(contact.lastAction);
        
        return `
            <tr>
                <td class="cell-id">${contact.id}</td>
                <td>
                    <div class="cell-country">
                        <span class="flag">${country.flag}</span>
                        <span class="code">${contact.country}</span>
                    </div>
                </td>
                <td class="cell-time">${localTime}</td>
                <td>
                    <span class="badge ${idealWindow.class}">${idealWindow.text}</span>
                </td>
                <td class="cell-business">${escapeHtml(contact.businessName)}</td>
                <td class="cell-type">${escapeHtml(contact.businessType)}</td>
                <td class="cell-contact" title="${escapeHtml(contact.contact)}">${escapeHtml(contact.contact)}</td>
                <td>
                    ${contact.lastAction ? `<span class="badge ${actionClass}">${escapeHtml(contact.lastAction)}</span>` : '—'}
                </td>
                <td>
                    <span class="badge ${statusClass}">${escapeHtml(contact.status)}</span>
                </td>
                <td class="cell-days">${daysWithoutResponse}</td>
                <td class="cell-date">${formatDate(contact.nextFollowUp)}</td>
                <td class="cell-notes" title="${escapeHtml(contact.notes || '')}">${escapeHtml(contact.notes || '—')}</td>
                <td>
                    <div class="cell-actions">
                        ${renderActionButtons(contact)}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderActionButtons(contact) {
    const buttons = [];
    
    // WhatsApp button
    const whatsappNumber = contact.contact.replace(/\D/g, '');
    if (whatsappNumber || contact.channel === 'WhatsApp') {
        buttons.push(`
            <button class="action-btn whatsapp" onclick="openWhatsApp('${whatsappNumber}')" title="WhatsApp">
                WA
            </button>
        `);
    }
    
    // Instagram button
    const instagramHandle = contact.instagram || (contact.contact.startsWith('@') ? contact.contact : null);
    if (instagramHandle || contact.channel === 'Instagram') {
        const handle = instagramHandle ? instagramHandle.replace('@', '') : '';
        buttons.push(`
            <button class="action-btn instagram" onclick="openInstagram('${handle}')" title="Instagram">
                IG
            </button>
        `);
    }
    
    // Email button
    const emailAddress = contact.email || (contact.contact.includes('@') && !contact.contact.startsWith('@') ? contact.contact : null);
    if (emailAddress || contact.channel === 'Email') {
        buttons.push(`
            <button class="action-btn email" onclick="openEmail('${emailAddress || ''}')" title="Email">
                @
            </button>
        `);
    }
    
    // Website button
    if (contact.website) {
        buttons.push(`
            <button class="action-btn website" onclick="openWebsite('${escapeHtml(contact.website)}')" title="Website">
                🌐
            </button>
        `);
    }
    
    // Edit button
    buttons.push(`
        <button class="action-btn edit" onclick="editContact(${contact.id})" title="Editar">
            ✏️
        </button>
    `);
    
    // Delete button
    buttons.push(`
        <button class="action-btn delete" onclick="deleteContact(${contact.id})" title="Excluir">
            🗑️
        </button>
    `);
    
    return buttons.join('');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== ACTION HANDLERS =====
function openWhatsApp(number) {
    if (number) {
        window.open(`https://wa.me/${number}`, '_blank');
    } else {
        showToast('Número de WhatsApp não disponível', 'warning');
    }
}

function openInstagram(handle) {
    if (handle) {
        window.open(`https://instagram.com/${handle}`, '_blank');
    } else {
        showToast('Instagram não disponível', 'warning');
    }
}

function openEmail(email) {
    if (email) {
        window.location.href = `mailto:${email}`;
    } else {
        showToast('Email não disponível', 'warning');
    }
}

function openWebsite(url) {
    if (url) {
        window.open(url, '_blank');
    } else {
        showToast('Website não disponível', 'warning');
    }
}

// ===== MODAL FUNCTIONS =====
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Adicionar Contato';
    document.getElementById('contactForm').reset();
    document.getElementById('editingId').value = '';
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.body.style.overflow = '';
}

function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    
    document.getElementById('modalTitle').textContent = 'Editar Contato';
    document.getElementById('editingId').value = id;
    
    // Fill form with contact data
    document.getElementById('country').value = contact.country || '';
    document.getElementById('businessName').value = contact.businessName || '';
    document.getElementById('businessType').value = contact.businessType || '';
    document.getElementById('contact').value = contact.contact || '';
    document.getElementById('channel').value = contact.channel || 'WhatsApp';
    document.getElementById('status').value = contact.status || 'Pending';
    document.getElementById('lastAction').value = contact.lastAction || '';
    document.getElementById('lastActionDate').value = contact.lastActionDate || '';
    document.getElementById('nextFollowUp').value = contact.nextFollowUp || '';
    document.getElementById('website').value = contact.website || '';
    document.getElementById('instagram').value = contact.instagram || '';
    document.getElementById('email').value = contact.email || '';
    document.getElementById('notes').value = contact.notes || '';
    
    document.getElementById('modalOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function saveContact(event) {
    event.preventDefault();
    
    const editingId = document.getElementById('editingId').value;
    const contactData = {
        country: document.getElementById('country').value,
        businessName: document.getElementById('businessName').value,
        businessType: document.getElementById('businessType').value,
        contact: document.getElementById('contact').value,
        channel: document.getElementById('channel').value,
        status: document.getElementById('status').value,
        lastAction: document.getElementById('lastAction').value,
        lastActionDate: document.getElementById('lastActionDate').value,
        nextFollowUp: document.getElementById('nextFollowUp').value,
        website: document.getElementById('website').value,
        instagram: document.getElementById('instagram').value,
        email: document.getElementById('email').value,
        notes: document.getElementById('notes').value
    };
    
    if (editingId) {
        // Update existing contact
        const index = contacts.findIndex(c => c.id === parseInt(editingId));
        if (index !== -1) {
            contacts[index] = { ...contacts[index], ...contactData };
            showToast('Contato atualizado com sucesso!', 'success');
        }
    } else {
        // Add new contact
        contactData.id = nextId++;
        contacts.push(contactData);
        showToast('Contato adicionado com sucesso!', 'success');
    }
    
    saveToLocalStorage();
    renderTable();
    closeModal();
    applyFilters();
}

function deleteContact(id) {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
        contacts = contacts.filter(c => c.id !== id);
        saveToLocalStorage();
        renderTable();
        applyFilters();
        showToast('Contato excluído!', 'success');
    }
}

// ===== COUNTRY PREVIEW UPDATE =====
function updateCountryPreview() {
    const country = document.getElementById('country').value;
    if (country) {
        selectedCountryForTimeDisplay = country;
        updateTimeInfo();
    }
}

// ===== FILTERS =====
function populateCountryFilter() {
    const filterCountry = document.getElementById('filterCountry');
    const countries = [...new Set(contacts.map(c => c.country))].filter(Boolean);
    
    // Keep "Todos" option
    filterCountry.innerHTML = '<option value="">Todos</option>';
    
    countries.forEach(code => {
        const country = COUNTRIES[code] || { flag: '🏳️', name: code };
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${country.flag} ${code}`;
        filterCountry.appendChild(option);
    });
}

function applyFilters() {
    const statusFilter = document.getElementById('filterStatus').value;
    const countryFilter = document.getElementById('filterCountry').value;
    const followUpFilter = document.getElementById('filterFollowUp').value;
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = [...contacts];
    
    // Status filter
    if (statusFilter) {
        filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    // Country filter
    if (countryFilter) {
        filtered = filtered.filter(c => c.country === countryFilter);
    }
    
    // Follow-up filter
    if (followUpFilter) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (followUpFilter === 'today') {
            filtered = filtered.filter(c => {
                if (!c.nextFollowUp) return false;
                const followUpDate = new Date(c.nextFollowUp);
                followUpDate.setHours(0, 0, 0, 0);
                return followUpDate.getTime() === today.getTime();
            });
        } else if (followUpFilter === 'week') {
            const weekFromNow = new Date(today);
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            
            filtered = filtered.filter(c => {
                if (!c.nextFollowUp) return false;
                const followUpDate = new Date(c.nextFollowUp);
                return followUpDate >= today && followUpDate <= weekFromNow;
            });
        } else if (followUpFilter === 'overdue') {
            filtered = filtered.filter(c => {
                if (!c.nextFollowUp) return false;
                const followUpDate = new Date(c.nextFollowUp);
                followUpDate.setHours(0, 0, 0, 0);
                return followUpDate < today;
            });
        }
    }
    
    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(c => {
            return (
                (c.businessName && c.businessName.toLowerCase().includes(searchQuery)) ||
                (c.contact && c.contact.toLowerCase().includes(searchQuery)) ||
                (c.businessType && c.businessType.toLowerCase().includes(searchQuery)) ||
                (c.notes && c.notes.toLowerCase().includes(searchQuery))
            );
        });
    }
    
    renderTable(filtered);
}

function clearFilters() {
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterCountry').value = '';
    document.getElementById('filterFollowUp').value = '';
    document.getElementById('searchInput').value = '';
    renderTable();
    closeDropdown();
    showToast('Filtros limpos!', 'success');
}

// ===== DROPDOWN =====
function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}

function closeDropdown() {
    document.getElementById('dropdownMenu').classList.remove('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        closeDropdown();
    }
});

// ===== ABOUT MODAL =====
function showAbout() {
    document.getElementById('aboutModal').classList.add('show');
    closeDropdown();
}

function closeAboutModal() {
    document.getElementById('aboutModal').classList.remove('show');
}

// ===== IMPORT/EXPORT =====
function importJSON() {
    document.getElementById('importInput').click();
}

document.getElementById('importInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (Array.isArray(data)) {
                contacts = data;
            } else if (data.contacts && Array.isArray(data.contacts)) {
                contacts = data.contacts;
                if (data.nextId) nextId = data.nextId;
            } else {
                throw new Error('Invalid format');
            }
            
            // Update nextId
            const maxId = Math.max(...contacts.map(c => c.id || 0), 100);
            nextId = maxId + 1;
            
            saveToLocalStorage();
            renderTable();
            populateCountryFilter();
            showToast(`${contacts.length} contatos importados com sucesso!`, 'success');
        } catch (err) {
            console.error('Import error:', err);
            showToast('Erro ao importar arquivo. Verifique o formato JSON.', 'error');
        }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
});

function exportJSON() {
    const data = {
        contacts: contacts,
        nextId: nextId,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `crm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Dados exportados com sucesso!', 'success');
}

// ===== RESET DATA =====
function resetData() {
    if (confirm('ATENÇÃO: Todos os dados serão apagados permanentemente. Deseja continuar?')) {
        if (confirm('Tem certeza absoluta? Esta ação não pode ser desfeita.')) {
            contacts = [];
            nextId = 101;
            localStorage.removeItem('miniCrmContacts');
            localStorage.removeItem('miniCrmNextId');
            renderTable();
            populateCountryFilter();
            showToast('Todos os dados foram apagados!', 'warning');
        }
    }
}

// ===== LOCAL STORAGE =====
function saveToLocalStorage() {
    try {
        localStorage.setItem('miniCrmContacts', JSON.stringify(contacts));
        localStorage.setItem('miniCrmNextId', nextId.toString());
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        showToast('Erro ao salvar dados localmente', 'error');
    }
}

function loadFromLocalStorage() {
    try {
        const savedContacts = localStorage.getItem('miniCrmContacts');
        const savedNextId = localStorage.getItem('miniCrmNextId');
        
        if (savedContacts) {
            contacts = JSON.parse(savedContacts);
        }
        
        if (savedNextId) {
            nextId = parseInt(savedNextId);
        }
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        contacts = [];
        nextId = 101;
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== SAMPLE DATA =====
function loadSampleData() {
    if (contacts.length === 0) {
        contacts = [
            {
                id: 101,
                country: 'BR',
                businessName: 'Sabor & Arte',
                businessType: 'Restaurante',
                contact: '(11) 98765-4321',
                channel: 'WhatsApp',
                status: 'Pending',
                lastAction: 'Follow-Up 1',
                lastActionDate: '2024-04-17',
                nextFollowUp: '2024-04-20',
                website: '',
                instagram: '',
                email: '',
                notes: 'Aguardando'
            },
            {
                id: 102,
                country: 'PT',
                businessName: 'Café Lisboa',
                businessType: 'Cafeteria',
                contact: 'cafelisboa@mail.pt',
                channel: 'Email',
                status: 'Sent',
                lastAction: 'Mensagem Enviada',
                lastActionDate: '2024-04-20',
                nextFollowUp: '',
                website: '',
                instagram: '',
                email: 'cafelisboa@mail.pt',
                notes: ''
            },
            {
                id: 103,
                country: 'MX',
                businessName: 'Taco Fiesta',
                businessType: 'Lanchonete',
                contact: '+52 5543219876',
                channel: 'WhatsApp',
                status: 'No reply',
                lastAction: 'Aguardando Retorno',
                lastActionDate: '2024-04-15',
                nextFollowUp: '',
                website: '',
                instagram: '',
                email: '',
                notes: ''
            },
            {
                id: 104,
                country: 'US',
                businessName: 'Burger House',
                businessType: 'Hamburgueria',
                contact: '@burgerhouse',
                channel: 'Instagram',
                status: 'Replied',
                lastAction: 'Fechado',
                lastActionDate: '2024-04-18',
                nextFollowUp: '',
                website: '',
                instagram: '@burgerhouse',
                email: '',
                notes: ''
            },
            {
                id: 105,
                country: 'US',
                businessName: 'Churrasco Paulista',
                businessType: 'Restaurante',
                contact: 'churrasco@gmail.com',
                channel: 'Email',
                status: 'No reply',
                lastAction: '',
                lastActionDate: '2024-04-12',
                nextFollowUp: '',
                website: '',
                instagram: '',
                email: 'churrasco@gmail.com',
                notes: ''
            },
            {
                id: 106,
                country: 'BR',
                businessName: 'Padaria Doce Mel',
                businessType: 'Padaria',
                contact: '(21) 99876-5432',
                channel: 'WhatsApp',
                status: 'Pending',
                lastAction: '',
                lastActionDate: '2024-04-12',
                nextFollowUp: '2024-04-17',
                website: '',
                instagram: '',
                email: '',
                notes: 'Interessado'
            }
        ];
        nextId = 107;
        saveToLocalStorage();
    }
}

// ===== INITIALIZATION =====
function init() {
    loadFromLocalStorage();
    loadSampleData();
    renderTable();
    populateCountryFilter();
    updateTimeInfo();
    
    // Update time every 30 seconds
    setInterval(updateTimeInfo, 30000);
    
    // Update table times every minute
    setInterval(() => renderTable(), 60000);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
