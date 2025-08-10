/**
 * documents.js
 * Gestione dinamica dei documenti con layout griglia tipo galleria
 */

class DocumentManager {
  constructor() {
    this.documents = [];
    this.filteredDocuments = [];
    this.currentFilter = '';
    this.currentType = 'all';
    this.isLoading = false;

    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.createFilterUI();
      this.loadDocuments();
    });
  }

  createFilterUI() {
    const container = document.querySelector('main');
    if (!container) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'documents-filter';
    filterContainer.style.marginBottom = '2rem';
    filterContainer.innerHTML = `
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        <input type="text" 
               class="filter-input" 
               id="search-input" 
               placeholder="Cerca documenti..."
               aria-label="Cerca documenti"
               style="flex: 1; min-width: 200px; padding: 0.5rem; border-radius: 4px; border: 1px solid #444; background: #1e1e1e; color: var(--color-text);">
        <select class="filter-select" id="type-filter" aria-label="Filtra per tipo"
                style="padding: 0.5rem; border-radius: 4px; border: 1px solid #444; background: #1e1e1e; color: var(--color-text);">
          <option value="all">Tutti i tipi</option>
          <option value="pdf">PDF</option>
          <option value="docx">Word</option>
          <option value="txt">Testo</option>
          <option value="xlsx">Excel</option>
          <option value="pptx">PowerPoint</option>
        </select>
        <button class="btn btn-secondary" onclick="documentManager.refreshDocuments()" aria-label="Ricarica"
                style="padding: 0.5rem 1rem; border-radius: 4px; border: none; background: var(--color-primary); color: white; cursor: pointer;">
          Ricarica
        </button>
      </div>
    `;

    const documentsGrid = document.querySelector('.documents-grid');
    if (documentsGrid) {
      container.insertBefore(filterContainer, documentsGrid);
    }

    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterDocuments(e.target.value, typeFilter?.value || 'all');
      });
    }

    if (typeFilter) {
      typeFilter.addEventListener('change', (e) => {
        this.filterDocuments(searchInput?.value || '', e.target.value);
      });
    }
  }

  async loadDocuments() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoadingState();

    try {
      const documents = await this.fetchDocuments();
      this.documents = documents;
      this.filteredDocuments = documents;

      if (documents.length === 0) {
        this.showEmptyState();
        return;
      }

      this.renderDocuments();

    } catch (error) {
      console.error('Error loading documents:', error);
      this.showErrorMessage('Errore nel caricamento dei documenti');
    } finally {
      this.isLoading = false;
    }
  }

  async fetchDocuments() {
    try {
      const res = await fetch('/api/documents');
      if (!res.ok) throw new Error('Errore risposta server');
      const documents = await res.json();

      return documents.filter(doc => doc.exists !== false);
    } catch (err) {
      console.error('Errore fetchDocuments:', err);
      return [];
    }
  }

  filterDocuments(searchTerm, typeFilter) {
    this.currentFilter = searchTerm.toLowerCase();
    this.currentType = typeFilter;

    this.filteredDocuments = this.documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(this.currentFilter) ||
        (doc.description && doc.description.toLowerCase().includes(this.currentFilter));
      const matchesType = this.currentType === 'all' || doc.type === this.currentType;

      return matchesSearch && matchesType;
    });

    this.renderDocuments();
  }

  renderDocuments() {
    const container = document.querySelector('.documents-grid');
    const emptyState = document.getElementById('empty-state');

    if (!container) return;

    if (this.filteredDocuments.length === 0) {
      this.showEmptyState();
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.innerHTML = '';

    this.filteredDocuments.forEach((doc, index) => {
      const docElement = this.createDocumentElement(doc, index);
      container.appendChild(docElement);
    });
  }

  createDocumentElement(doc, index) {
    const card = document.createElement('div');
    card.className = 'document-item opacity-animation';
    card.style.animationDelay = `${index * 0.1}s`;

    const icon = this.getDocumentIcon(doc.type);
    const formattedSize = this.formatFileSize(doc.size);
    const formattedDate = this.formatDate(doc.date);

    card.innerHTML = `
      <div class="document-icon">${icon}</div>
      <div class="document-title" title="${doc.name}">${this.truncateText(doc.name, 25)}</div>
      <div class="document-type">${doc.type.toUpperCase()}</div>
      <div class="document-size">${formattedSize}</div>
      <div class="document-actions">
        <a href="${doc.url}" class="btn btn-primary" target="_blank" rel="noopener">Visualizza</a>
        <button class="btn btn-secondary" onclick="documentManager.downloadDocument('${doc.url}', '${doc.name}')">
          Scarica
        </button>
      </div>
    `;
    return card;
  }

  getDocumentIcon(type) {
    const icons = {
      'pdf': 'pdf',
      'docx': 'docx',
      'txt': 'txt',
      'xlsx': 'xlsx',
      'pptx': 'pptx',
      'default': 'documento'
    };
    return icons[type.toLowerCase()] || icons.default;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  downloadDocument(url, filename) {
    if (url === '#') {
      alert('Download non disponibile');
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  showLoadingState() {
    const container = document.querySelector('.documents-grid');
    if (!container) return;
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 2rem;">📁</div>
        <p>Caricamento documenti...</p>
      </div>
    `;
  }

  showEmptyState() {
    const container = document.querySelector('.documents-grid');
    const emptyState = document.getElementById('empty-state');
    if (!container || !emptyState) return;
    
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 3rem;">📁</div>
        <h2>Nessun documento trovato</h2>
        <p>Carica i tuoi documenti nella cartella "Documents" per visualizzarli qui.</p>
      </div>
    `;
  }

  showErrorMessage(message) {
    const container = document.querySelector('.documents-grid');
    if (!container) return;
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 2rem;"> (TwT) </div>
        <h3>Errore</h3>
        <p>${message}</p>
        <button onclick="documentManager.refreshDocuments()" class="btn btn-primary" style="padding: 0.5rem 1rem; border-radius: 4px; border: none; background: var(--color-primary); color: white; cursor: pointer;">
          Riprova
        </button>
      </div>
    `;
  }

  refreshDocuments() {
    this.loadDocuments();
  }
}

window.documentManager = new DocumentManager();
