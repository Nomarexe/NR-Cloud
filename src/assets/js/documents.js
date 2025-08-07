/**
 * Documents Section JavaScript
 * Handles dynamic loading and display of documents from the Documents folder
 */

document.addEventListener('DOMContentLoaded', function() {
    loadDocuments();
});

/**
 * Load documents from the Documents folder
 */
async function loadDocuments() {
    const container = document.getElementById('documents-container');
    const emptyState = document.getElementById('empty-state');
    
    try {
        // Fetch the list of documents from the server
        const response = await fetch('/api/documents');
        
        if (!response.ok) {
            throw new Error('Failed to fetch documents');
        }
        
        const documents = await response.json();
        
        if (documents.length === 0) {
            emptyState.style.display = 'block';
            container.style.display = 'none';
            return;
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Render each document
        documents.forEach(doc => {
            const docElement = createDocumentElement(doc);
            container.appendChild(docElement);
        });
        
    } catch (error) {
        console.error('Error loading documents:', error);
        showErrorMessage('Errore nel caricamento dei documenti');
    }
}

/**
 * Create HTML element for a document
 * @param {Object} doc - Document object with name, type, url, size
 * @returns {HTMLElement} - Document card element
 */
function createDocumentElement(doc) {
    const card = document.createElement('div');
    card.className = 'document-card';
    
    const icon = getDocumentIcon(doc.type);
    const formattedSize = formatFileSize(doc.size);
    
    card.innerHTML = `
        <div class="document-icon">
            ${icon}
        </div>
        <div class="document-info">
            <h3 class="document-title">${doc.name}</h3>
            <p class="document-type">${doc.type.toUpperCase()}</p>
            <p class="document-size">${formattedSize}</p>
        </div>
        <div class="document-actions">
            <a href="${doc.url}" class="btn btn-primary" target="_blank" rel="noopener">
                Visualizza
            </a>
            <button class="btn btn-secondary" onclick="downloadDocument('${doc.url}', '${doc.name}')">
                Scarica
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Get appropriate icon for document type
 * @param {string} type - File extension/type
 * @returns {string} - SVG icon HTML
 */
function getDocumentIcon(type) {
    const icons = {
        'pdf': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
        'docx': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3498db" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        'txt': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#95a5a6" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        'svg': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f39c12" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="12" r="3"/><path d="M16 21l-4-4-4 4"/></svg>',
        'default': '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7f8c8d" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
    };
    
    return icons[type.toLowerCase()] || icons.default;
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Download document
 * @param {string} url - Document URL
 * @param {string} filename - Document filename
 */
function downloadDocument(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    const container = document.getElementById('documents-container');
    container.innerHTML = `
        <div class="error-message">
            <h3>Errore</h3>
            <p>${message}</p>
            <button onclick="loadDocuments()" class="btn btn-primary">Riprova</button>
        </div>
    `;
}

/**
 * Refresh documents list
 */
function refreshDocuments() {
    loadDocuments();
}

// Add refresh functionality
window.refreshDocuments = refreshDocuments;
