document.addEventListener('DOMContentLoaded', () => {
  const audioGrid = document.querySelector('.audio-grid');

  function createAudioElement(src, index) {
    const container = document.createElement('div');
    container.className = 'audio-item opacity-animation';

    // Extract filename for display
    const filename = src.split('/').pop() || `Audio ${index + 1}`;
    
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = src;
    audio.preload = 'none';
    audio.style.width = '100%';

    const title = document.createElement('div');
    title.className = 'audio-title';
    title.textContent = filename;

    container.appendChild(audio);
    container.appendChild(title);
    return container;
  }

  function fetchAudioFiles() {
    fetch('/api/audio')
      .then(response => response.json())
      .then(audioUrls => {
        if (Array.isArray(audioUrls)) {
          audioGrid.innerHTML = '';
          
          if (audioUrls.length === 0) {
            audioGrid.innerHTML = '<div class="empty-state"><p>Nessun file audio disponibile al momento.</p></div>';
            return;
          }
          
          audioUrls.forEach((url, index) => {
            const audioElement = createAudioElement(url, index);
            audioGrid.appendChild(audioElement);
          });
        } else {
          console.error('Invalid audio array from /api/audio');
        }
      })
      .catch(error => {
        console.error('Error fetching audio files:', error);
        audioGrid.innerHTML = '<div class="empty-state"><p>Errore nel caricamento dei file audio.</p></div>';
      });
  }

  fetchAudioFiles();

  // Refresh audio list after file uploads
  document.addEventListener('filesUploaded', (event) => {
    if (event.detail.category === 'audio') {
      fetchAudioFiles();
    }
  });
});