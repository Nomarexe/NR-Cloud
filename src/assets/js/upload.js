/**
 * File Upload Module for NR Space
 * Handles file uploads with drag-and-drop support for all categories
 */

class FileUploader {
    constructor(category, containerSelector, apiEndpoint) {
        this.category = category;
        this.container = document.querySelector(containerSelector);
        this.apiEndpoint = apiEndpoint;
        this.uploadEndpoint = `/api/upload/${category}`;
        
        this.init();
    }

    init() {
        this.createUploadInterface();
        this.bindEvents();
    }

    createUploadInterface() {
        const uploadContainer = document.createElement('div');
        uploadContainer.className = 'upload-section';
        uploadContainer.innerHTML = `
            <div class="upload-area" id="upload-area-${this.category}">
                <div class="upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </div>
                <p class="upload-text">Trascina i file qui o <span class="upload-link">clicca per selezionare</span></p>
                <input type="file" id="file-input-${this.category}" multiple class="file-input" accept="${this.getAcceptTypes()}">
            </div>
            <div class="upload-progress" id="upload-progress-${this.category}" style="display: none;">
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill-${this.category}"></div>
                </div>
                <span class="progress-text" id="progress-text-${this.category}">0%</span>
            </div>
            <div class="upload-results" id="upload-results-${this.category}"></div>
        `;
        
        this.container.insertBefore(uploadContainer, this.container.firstChild);
    }

    getAcceptTypes() {
        const types = {
            'audio': 'audio/*',
            'video': 'video/*',
            'documents': '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.svg,.webp',
            'gallery': 'image/*,video/*'
        };
        return types[this.category] || '*/*';
    }

    bindEvents() {
        const uploadArea = document.getElementById(`upload-area-${this.category}`);
        const fileInput = document.getElementById(`file-input-${this.category}`);

        // Click to select files
        uploadArea.addEventListener('click', () => fileInput.click());

        // File input change
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Drag and drop events
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragenter', this.handleDragEnter.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('.upload-area').classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!e.target.closest('.upload-area').contains(e.relatedTarget)) {
            e.target.closest('.upload-area').classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.closest('.upload-area').classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        this.handleFiles(files);
    }

    async handleFiles(files) {
        if (!files || files.length === 0) return;

        const progressContainer = document.getElementById(`upload-progress-${this.category}`);
        const progressFill = document.getElementById(`progress-fill-${this.category}`);
        const progressText = document.getElementById(`progress-text-${this.category}`);
        const resultsContainer = document.getElementById(`upload-results-${this.category}`);

        progressContainer.style.display = 'block';
        resultsContainer.innerHTML = '';

        const totalFiles = files.length;
        let uploadedFiles = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(this.uploadEndpoint, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                
                if (result.success) {
                    uploadedFiles++;
                    const progress = (uploadedFiles / totalFiles) * 100;
                    progressFill.style.width = `${progress}%`;
                    progressText.textContent = `${Math.round(progress)}%`;
                    
                    resultsContainer.innerHTML += `
                        <div class="upload-result success">
                            <span class="icon">✓</span>
                            <span>${file.name} caricato con successo</span>
                        </div>
                    `;
                } else {
                    resultsContainer.innerHTML += `
                        <div class="upload-result error">
                            <span class="icon">✗</span>
                            <span>Errore con ${file.name}: ${result.error}</span>
                        </div>
                    `;
                }
            } catch (error) {
                resultsContainer.innerHTML += `
                    <div class="upload-result error">
                        <span class="icon">✗</span>
                        <span>Errore di connessione con ${file.name}</span>
                    </div>
                `;
            }
        }

        // Hide progress after completion
        setTimeout(() => {
            progressContainer.style.display = 'none';
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
            
            // Refresh the content
            this.refreshContent();
        }, 2000);
    }

    refreshContent() {
        // Trigger refresh of the current page's content
        const event = new CustomEvent('filesUploaded', { detail: { category: this.category } });
        document.dispatchEvent(event);
    }
}

// Initialize uploaders for each category
document.addEventListener('DOMContentLoaded', () => {
    // Audio uploader
    if (document.querySelector('.audio-list')) {
        new FileUploader('audio', '.audio-list', '/api/audio');
    }
    
    // Video uploader
    if (document.querySelector('.video-grid')) {
        new FileUploader('video', '.video-grid', '/api/videos');
    }
    
    // Documents uploader
    if (document.querySelector('.documents-grid')) {
        new FileUploader('documents', '.documents-grid', '/api/documents');
    }
    
    // Gallery uploader
    if (document.querySelector('.gallery-grid')) {
        new FileUploader('gallery', '.gallery-grid', '/api/gallery');
    }
});
