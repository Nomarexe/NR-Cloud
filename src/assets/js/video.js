// Video gallery functionality for NR Space
// Handles dynamic loading of video files from the /Video folder

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
      videoGrid.innerHTML = '<p>Nessun video disponibile al momento.</p>';
      return;
    }
    
    videos.forEach(videoUrl => {
      const videoItem = document.createElement('div');
      videoItem.className = 'video-item';
      
      const videoElement = document.createElement('video');
      videoElement.controls = true;
      videoElement.width = 400;
      videoElement.height = 225;
      
      const source = document.createElement('source');
      source.src = videoUrl;
      source.type = 'video/mp4';
      
      videoElement.appendChild(source);
      videoItem.appendChild(videoElement);
      videoGrid.appendChild(videoItem);
    });
    
  } catch (error) {
    console.error('Error loading videos:', error);
    const videoGrid = document.querySelector('.video-grid');
    if (videoGrid) {
      videoGrid.innerHTML = '<p>Errore nel caricamento dei video.</p>';
    }
  }
}

// Load videos when page is ready
document.addEventListener('DOMContentLoaded', loadVideos);
