let entries = [];
let currentDate = new Date().toISOString().split('T')[0];
let saveTimeout;
let calendarDate = new Date();
let selectedEntries = new Set();

// Load entries from localStorage
function loadEntries() {
    const saved = localStorage.getItem('diaryEntries');
    if (saved) {
        entries = JSON.parse(saved);
    }
}

// Save entries to localStorage
function saveEntries() {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
}

// Initialize
function init() {
    loadEntries();
    updateDateButton();
    loadCurrentEntry();
    renderCalendar();
    
    // Event listeners
    document.getElementById('writeBtn').addEventListener('click', showWriteView);
    document.getElementById('browseBtn').addEventListener('click', showBrowseView);
    document.getElementById('exportBtn').addEventListener('click', openExportModal);
    document.getElementById('closeModal').addEventListener('click', closeExportModal);
    document.getElementById('dateButton').addEventListener('click', toggleCalendar);
    document.getElementById('entryTextarea').addEventListener('input', handleTextInput);
    document.getElementById('searchInput').addEventListener('input', renderEntries);
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    document.getElementById('selectAllBtn').addEventListener('click', toggleSelectAll);
    document.getElementById('downloadBtn').addEventListener('click', downloadSelectedEntries);
    
    // Close calendar when clicking outside
    document.addEventListener('click', (e) => {
        const calendar = document.getElementById('calendarPopup');
        const button = document.getElementById('dateButton');
        if (!calendar.contains(e.target) && e.target !== button) {
            calendar.classList.remove('active');
        }
    });

    // Close modal when clicking overlay
    document.getElementById('exportModal').addEventListener('click', (e) => {
        if (e.target.id === 'exportModal') {
            closeExportModal();
        }
    });
}

function updateDateButton() {
    const date = new Date(currentDate + 'T00:00:00');
    document.getElementById('dateButton').textContent = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

function toggleCalendar(e) {
    e.stopPropagation();
    const calendar = document.getElementById('calendarPopup');
    calendar.classList.toggle('active');
    if (calendar.classList.contains('active')) {
        calendarDate = new Date(currentDate + 'T00:00:00');
        renderCalendar();
    }
}

function changeMonth(delta) {
    calendarDate.setMonth(calendarDate.getMonth() + delta);
    renderCalendar();
}

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    
    document.getElementById('calendarMonth').textContent = 
        calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    // Day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        grid.appendChild(header);
    });
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = daysInPrevMonth - i;
        grid.appendChild(day);
    }
    
    // Current month days
    const today = new Date().toISOString().split('T')[0];
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        if (dateStr === currentDate) {
            day.classList.add('selected');
        }
        if (dateStr === today) {
            day.classList.add('today');
        }
        
        day.addEventListener('click', () => {
            saveCurrentEntry();
            currentDate = dateStr;
            updateDateButton();
            loadCurrentEntry();
            document.getElementById('calendarPopup').classList.remove('active');
        });
        
        grid.appendChild(day);
    }
    
    // Next month days
    const totalCells = firstDay + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        grid.appendChild(day);
    }
}

function showWriteView() {
    document.querySelector('.write-view').classList.add('active');
    document.querySelector('.browse-view').classList.remove('active');
    document.getElementById('writeBtn').classList.add('active');
    document.getElementById('browseBtn').classList.remove('active');
}

function showBrowseView() {
    document.querySelector('.write-view').classList.remove('active');
    document.querySelector('.browse-view').classList.add('active');
    document.getElementById('writeBtn').classList.remove('active');
    document.getElementById('browseBtn').classList.add('active');
    renderEntries();
}

function loadCurrentEntry() {
    const entry = entries.find(e => e.date === currentDate);
    const textarea = document.getElementById('entryTextarea');
    textarea.value = entry ? entry.content : '';
    updateWordCount();
}

function handleTextInput() {
    updateWordCount();
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(saveCurrentEntry, 1000);
}

function updateWordCount() {
    const content = document.getElementById('entryTextarea').value;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const wordCountEl = document.getElementById('wordCount');
    wordCountEl.textContent = `${words} ${words === 1 ? 'word' : 'words'}`;
    
    if (words > 0) {
        wordCountEl.classList.add('active');
    } else {
        wordCountEl.classList.remove('active');
    }
}

function saveCurrentEntry() {
    const content = document.getElementById('entryTextarea').value;
    
    if (content.trim()) {
        entries = entries.filter(e => e.date !== currentDate);
        entries.push({
            date: currentDate,
            content: content,
            wordCount: content.trim().split(/\s+/).length
        });
        entries.sort((a, b) => b.date.localeCompare(a.date));
    } else {
        entries = entries.filter(e => e.date !== currentDate);
    }
    
    saveEntries();
}

function renderEntries() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredEntries = entries.filter(e => 
        e.content.toLowerCase().includes(searchTerm)
    );

    const listContainer = document.getElementById('entriesList');

    if (filteredEntries.length === 0) {
        if (entries.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <p>No entries yet. Start writing to begin your journey.</p>
                </div>
            `;
        } else {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <p>No entries match your search.</p>
                </div>
            `;
        }
        return;
    }

    listContainer.innerHTML = `
        <div class="entries-list">
            ${filteredEntries.map((entry, index) => `
                <div class="entry-card" data-date="${entry.date}" style="animation-delay: ${index * 0.1}s">
                    <div class="entry-header">
                        <div class="entry-date">${formatDate(entry.date)}</div>
                        <div class="entry-word-count">${entry.wordCount} words</div>
                    </div>
                    <div class="entry-preview">${entry.content}</div>
                </div>
            `).join('')}
        </div>
    `;

    // Add click handlers
    document.querySelectorAll('.entry-card').forEach(card => {
        card.addEventListener('click', () => {
            const date = card.getAttribute('data-date');
            currentDate = date;
            updateDateButton();
            loadCurrentEntry();
            showWriteView();
        });
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Export Modal Functions
function openExportModal() {
    if (entries.length === 0) {
        alert('You have no entries to export yet!');
        return;
    }
    
    selectedEntries.clear();
    renderExportList();
    document.getElementById('exportModal').classList.add('active');
    updateSelectedCount();
}

function closeExportModal() {
    document.getElementById('exportModal').classList.remove('active');
}

function renderExportList() {
    const listContainer = document.getElementById('exportEntryList');
    listContainer.innerHTML = entries
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(entry => `
            <div class="export-entry-item">
                <input type="checkbox" id="export-${entry.date}" value="${entry.date}">
                <label for="export-${entry.date}" class="export-entry-info">
                    <div class="export-entry-date">${formatDate(entry.date)}</div>
                    <div class="export-entry-preview">${entry.content.substring(0, 60)}${entry.content.length > 60 ? '...' : ''}</div>
                </label>
            </div>
        `).join('');

    // Add change listeners to checkboxes
    listContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}

function handleCheckboxChange(e) {
    const date = e.target.value;
    if (e.target.checked) {
        selectedEntries.add(date);
    } else {
        selectedEntries.delete(date);
    }
    updateSelectedCount();
}

function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('#exportEntryList input[type="checkbox"]');
    const allSelected = selectedEntries.size === entries.length;
    
    if (allSelected) {
        selectedEntries.clear();
        checkboxes.forEach(cb => cb.checked = false);
    } else {
        selectedEntries.clear();
        checkboxes.forEach(cb => {
            cb.checked = true;
            selectedEntries.add(cb.value);
        });
    }
    updateSelectedCount();
}

function updateSelectedCount() {
    document.getElementById('selectedCount').textContent = 
        `${selectedEntries.size} ${selectedEntries.size === 1 ? 'entry' : 'entries'} selected`;
    
    document.getElementById('downloadBtn').disabled = selectedEntries.size === 0;
    
    const btn = document.getElementById('selectAllBtn');
    btn.textContent = selectedEntries.size === entries.length ? 'Deselect All' : 'Select All';
}

function downloadSelectedEntries() {
    const fileName = document.getElementById('fileName').value || 'my-diary-export';
    const fileType = document.getElementById('fileType').value;
    
    const selectedEntriesData = entries
        .filter(e => selectedEntries.has(e.date))
        .sort((a, b) => a.date.localeCompare(b.date));

    let content, mimeType, extension;

    switch (fileType) {
        case 'txt':
            content = selectedEntriesData
                .map(e => `${e.date}\n\n${e.content}\n\n${'='.repeat(50)}\n\n`)
                .join('');
            mimeType = 'text/plain';
            extension = 'txt';
            break;

        case 'md':
            content = selectedEntriesData
                .map(e => `# ${formatDate(e.date)}\n\n${e.content}\n\n---\n\n`)
                .join('');
            mimeType = 'text/markdown';
            extension = 'md';
            break;

        case 'html':
            content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Diary Export</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
        .entry { margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 2px solid #ff6b35; }
        .entry:last-child { border-bottom: none; }
        .date { color: #ff6b35; font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; }
        .content { white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1 style="color: #ff6b35;">My Diary</h1>
    ${selectedEntriesData.map(e => `
    <div class="entry">
        <div class="date">${formatDate(e.date)}</div>
        <div class="content">${e.content}</div>
    </div>
    `).join('')}
</body>
</html>`;
            mimeType = 'text/html';
            extension = 'html';
            break;

        case 'json':
            content = JSON.stringify(selectedEntriesData, null, 2);
            mimeType = 'application/json';
            extension = 'json';
            break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);

    closeExportModal();
}

// Initialize on load
init();
