document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  let galleryItems = [];

  // Fetch media list from backend API
  fetch('/api/gallery')
    .then(response => response.json())
    .then(media => {
      if (Array.isArray(media)) {
        // Clear existing gallery items if any
        galleryGrid.innerHTML = '';

        media.forEach((mediaSrc, index) => {
          const div = document.createElement('div');
          div.className = 'gallery-item opacity-animation';

          const lowerSrc = mediaSrc.toLowerCase();
          let mediaElement;

          if (lowerSrc.endsWith('.mp4') || lowerSrc.endsWith('.webm') || lowerSrc.endsWith('.ogg')) {
            mediaElement = document.createElement('video');
            mediaElement.src = mediaSrc;
            mediaElement.controls = true;
            mediaElement.style.maxWidth = '100%';
            mediaElement.style.borderRadius = '8px';
          } else {
            mediaElement = document.createElement('img');
            mediaElement.src = mediaSrc;
            mediaElement.alt = `Gallery image ${index + 1}`;
            mediaElement.style.cursor = 'pointer';
          }

          div.appendChild(mediaElement);
          galleryGrid.appendChild(div);
        });

        // Update galleryItems NodeList after dynamic creation
        galleryItems = galleryGrid.querySelectorAll('.gallery-item img');

        // Setup modal functionality with dynamic images only (videos open with controls)
        setupModal(galleryItems);
      } else {
        console.error('Invalid media array from /api/gallery');
      }
    })
    .catch(error => {
      console.error('Error fetching gallery media:', error);
    });

  function setupModal(galleryItems) {
    const modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '10000';
    modal.style.cursor = 'pointer';

    const modalImg = document.createElement('img');
    modalImg.style.maxWidth = '90%';
    modalImg.style.maxHeight = '90%';
    modalImg.style.borderRadius = '8px';
    modal.appendChild(modalImg);

    document.body.appendChild(modal);

    let currentIndex = 0;

    function showModal(index) {
      currentIndex = index;
      modalImg.src = galleryItems[currentIndex].src;
      modal.style.display = 'flex';
    }

    function hideModal() {
      modal.style.display = 'none';
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      modalImg.src = galleryItems[currentIndex].src;
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      modalImg.src = galleryItems[currentIndex].src;
    }

    galleryItems.forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        showModal(index);
      });
    });

    modal.addEventListener('click', () => {
      hideModal();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex') {
        if (e.key === 'ArrowRight') {
          showNext();
        } else if (e.key === 'ArrowLeft') {
          showPrev();
        } else if (e.key === 'Escape') {
          hideModal();
        }
      }
    });
  }
});