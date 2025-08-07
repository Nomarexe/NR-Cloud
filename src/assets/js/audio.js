document.addEventListener('DOMContentLoaded', () => {
  const audioList = document.querySelector('.audio-list');

  function createAudioElement(src) {
    const container = document.createElement('div');
    container.className = 'audio-item opacity-animation';

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = src;
    audio.preload = 'none';

    container.appendChild(audio);
    return container;
  }

  function fetchAudioFiles() {
    fetch('/api/audio')
      .then(response => response.json())
      .then(audioUrls => {
        if (Array.isArray(audioUrls)) {
          audioList.innerHTML = '';
          audioUrls.forEach(url => {
            const audioElement = createAudioElement(url);
            audioList.appendChild(audioElement);
          });
        } else {
          console.error('Invalid audio array from /api/audio');
        }
      })
      .catch(error => {
        console.error('Error fetching audio files:', error);
      });
  }

  fetchAudioFiles();
});
