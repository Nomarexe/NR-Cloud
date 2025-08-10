// Video gallery functionality for NR Space
// Handles dynamic loading of video files from the /Video folder with grid layout

async function loadVideos() {
  try {
    const response = await fetch('/api/videos');
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    const videos = await response.json();
    const videoGrid = document.querySelector('.video-grid');
    
    if (!videoGrid) {
      console.error('Video grid element not found');
      return;
    }
    
    videoGrid.innerHTML = '';
    
    if (videos.length === 0) {
      videoGrid.innerHTML = '<div class="empty-state"><p>Nessun video disponibile al momento.</p></div>';
      return;
    }
    
    videos.forEach((videoUrl, index) => {
      const videoItem = document.createElement('div');
      videoItem.className = 'video-item opacity-animation';
      
      const videoElement = document.createElement('video');
      videoElement.controls = true;
      videoElement.style.maxWidth = '100%';
      videoElement.style.borderRadius = '8px';
      videoElement.style.display = 'block';
      
      const source = document.createElement('source');
      source.src = videoUrl;
      source.type = 'video/mp4';
      
      videoElement.appendChild(source);
      
      // Add click handler for fullscreen viewing
      videoElement.addEventListener('click', (e) => {
        e.preventDefault();
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        }
      });
      
      videoItem.appendChild(videoElement);
      videoGrid.appendChild(videoItem);
    });
    
  } catch (error) {
    console.error('Error loading videos:', error);
    const videoGrid = document.querySelector('.video-grid');
    if (videoGrid) {
      videoGrid.innerHTML = '<div class="empty-state"><p>Errore nel caricamento dei video.</p></div>';
    }
  }
}

// Load videos when page is ready
document.addEventListener('DOMContentLoaded', loadVideos);

// Refresh video list after file uploads
document.addEventListener('filesUploaded', (event) => {
  if (event.detail.category === 'video') {
    loadVideos();
  }
});
