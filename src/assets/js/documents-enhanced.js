/**
 * Enhanced Documents Section JavaScript
 * Improved visualization with animations, filtering, and better UX
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

  /**
   * Create enhanced filter UI
   */
  createFilterUI() {
    const container = document.querySelector('.documents-section');
    const filterContainer = document.createElement('div');
    filterContainer.className = 'documents-filter';
    filterContainer.innerHTML = `
      <input type="text" 
             class="filter-input" 
             id="search-input" 
             placeholder="Cerca documenti..."
             aria-label="Cerca documenti">
      <select class="filter-select" id="type-filter" aria-label="Filtra per tipo">
        <option value="all">Tutti i tipi</option>
        <option value="pdf">PDF</option>
        <option value="docx">Word</option>
        <option value="txt">Testo</option>
        <option value="svg">SVG</option>
      </select>
      <button class="btn btn-secondary" onclick="documentManager.refreshDocuments()" aria-label="Ricarica">
        🔄 Ricarica
      </button>
    `;
    
    container.insertBefore(filterContainer, container.firstChild);
    
    // Add event listeners
    document.getElementById('search-input').addEventListener('input', (e) => {
      this.filterDocuments(e.target.value, document.getElementById('type-filter').value);
    });
    
    document.getElementById('type-filter').addEventListener('change', (e) => {
      this.filterDocuments(document.getElementById('search-input').value, e.target.value);
    });
  }

  /**
   * Load documents with enhanced loading state
   */
  async loadDocuments() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoadingState();
    
    const container = document.getElementById('documents-container');
    const emptyState = document.getElementById('empty-state');
    
    try {
      // Simulate API call with enhanced mock data
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

  /**
   * Fetch documents (mock data for demo)
   */
  async fetchDocuments() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 1,
        name: 'NR Cloud – Gestione Documenti.pdf',
        type: 'pdf',
        size: 2457600,
        url: '/Documents/NR Cloud – Gestione Documenti.pdf',
        date: '2024-01-15',
        description: 'Guida completa alla gestione documenti'
      },
      {
        id: 2,
        name: 'Manuale Utente NR Cloud.docx',
        type: 'docx',
        size: 1048576,
        url: '#',
        date: '2024-01-10',
        description: 'Manuale utente dettagliato'
      },
      {
        id: 3,
        name: 'Configurazione Iniziale.txt',
        type: 'txt',
        size: 51200,
        url: '#',
        date: '2024-01-08',
        description: 'Istruzioni per la configurazione iniziale'
      },
      {
        id: 4,
        name: 'Logo NR Cloud.svg',
        type: 'svg',
        size: 15360,
        url: '#',
        date: '2024-01-05',
        description: 'Logo ufficiale in formato vettoriale'
      },
      {
        id: 5,
        name: 'Privacy Policy.pdf',
        type: 'pdf',
        size: 524288,
        url: '#',
        date: '2024-01-03',
        description: 'Informativa sulla privacy'
      }
    ];
  }

  /**
   * Filter documents based on search and type
   */
  filterDocuments(searchTerm, typeFilter) {
    this.currentFilter = searchTerm.toLowerCase();
    this.currentType = typeFilter;
    
    this.filteredDocuments = this.documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(this.currentFilter) ||
                           doc.description.toLowerCase().includes(this.currentFilter);
      const matchesType = this.currentType === 'all' || doc.type === this.currentType;
      
      return matchesSearch && matchesType;
    });
    
    this.renderDocuments();
  }

  /**
   * Render documents with enhanced cards
   */
  renderDocuments() {
    const container = document.getElementById('documents-container');
    const emptyState = document.getElementById('empty-state');
    
    if (this.filteredDocuments.length === 0) {
      emptyState.style.display = 'block';
      container.style.display = 'none';
      return;
    }
    
    emptyState.style.display = 'none';
    container.style.display = 'grid';
    container.innerHTML = '';
    
    this.filteredDocuments.forEach((doc, index) => {
      const docElement = this.createEnhancedDocumentElement(doc, index);
      container.appendChild(docElement);
    });
  }

  /**
   * Create enhanced document card
   */
  createEnhancedDocumentElement(doc, index) {
    const card = document.createElement('div');
    card.className = 'document-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const icon = this.getEnhancedDocumentIcon(doc.type);
    const formattedSize = this.formatFileSize(doc.size);
    const formattedDate = this.formatDate(doc.date);
    
    card.innerHTML = `
      <div class="document-icon">
        ${icon}
      </div>
      <div class="document-info">
        <h3 class="document-title" title="${doc.name}">${this.truncateText(doc.name, 30)}</h3>
        <div class="document-meta">
          <span class="document-type-badge">${doc.type.toUpperCase()}</span>
          <span class="document-size">${formattedSize}</span>
        </div>
        <p class="document-description">${this.truncateText(doc.description, 50)}</p>
        <p class="document-date">📅 ${formattedDate}</p>
      </div>
      <div class="document-actions">
        <a href="${doc.url}" class="btn btn-primary" target="_blank" rel="noopener">
          👁️ Visualizza
        </a>
        <button class="btn btn-secondary" onclick="documentManager.downloadDocument('${doc.url}', '${doc.name}')">
          ⬇️ Scarica
        </button>
      </div>
    `;
    
    return card;
  }

  /**
   * Get enhanced document icons
   */
  getEnhancedDocumentIcon(type) {
    const icons = {
      'pdf': '📄',
      'docx': '📝',
      'txt': '📃',
      'svg': '🎨',
      'default': '📎'
    };
    
    return icons[type.toLowerCase()] || icons.default;
  }

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  /**
   * Format date
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Truncate text
   */
  truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  /**
   * Download document
   */
  downloadDocument(url, filename) {
    if (url === '#') {
      alert('Download non disponibile per questo documento demo');
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

  /**
   * Show loading state
   */
  showLoadingState() {
    const container = document.getElementById('documents-container');
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Caricamento documenti...</p>
      </div>
    `;
  }

  /**
   * Show empty state
   */
  showEmptyState() {
    const container = document.getElementById('documents-container');
    const emptyState = document.getElementById('empty-state');
    
    emptyState.innerHTML = `
      <div class="empty-state-icon">📁</div>
      <h2 class="empty-state-title">Nessun documento trovato</h2>
      <p class="empty-state-description">
        ${this.filteredDocuments.length === 0 && this.documents.length > 0 
          ? 'Nessun documento corrisponde ai filtri selezionati.' 
          : 'Carica i tuoi documenti nella cartella "Documents" per visualizzarli qui.'}
      </p>
    `;
    
    emptyState.style.display = 'block';
    container.style.display = 'none';
  }

  /**
   * Show error message
   */
  showErrorMessage(message) {
    const container = document.getElementById('documents-container');
    container.innerHTML = `
      <div class="error-message">
        <h3>⚠️ Errore</h3>
        <p>${message}</p>
        <button onclick="documentManager.refreshDocuments()" class="btn btn-primary">
          Riprova
        </button>
      </div>
    `;
  }

  /**
   * Refresh documents
   */
  refreshDocuments() {
    this.loadDocuments();
  }
}

// Create global instance
window.documentManager = new DocumentManager();
