/**
 * Story Carousel — Infinite looping image slider
 * Supports: prev/next arrows, dots, keyboard, touch/swipe
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.story-carousel').forEach(initCarousel);
});

function initCarousel(carousel) {
  const track = carousel.querySelector('.story-carousel__track');
  const slides = Array.from(carousel.querySelectorAll('.story-carousel__slide'));
  const prevBtn = carousel.querySelector('.story-carousel__prev');
  const nextBtn = carousel.querySelector('.story-carousel__next');
  const dotsContainer = carousel.querySelector('.story-carousel__dots');
  const counter = carousel.querySelector('.story-carousel__counter');

  if (!track || slides.length === 0) return;

  // Single image — add class to hide controls
  if (slides.length === 1) {
    carousel.classList.add('story-carousel--single');
    return;
  }

  let current = 0;
  const total = slides.length;

  // Build dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'story-carousel__dot' + (i === 0 ? ' story-carousel__dot--active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateCounter() {
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.story-carousel__dot').forEach((d, i) => {
      d.classList.toggle('story-carousel__dot--active', i === current);
    });
  }

  function goTo(index) {
    // Wrap around (infinite loop)
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    updateCounter();
  }

  // Arrows
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch / Swipe
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(current + 1);  // swipe left → next
      else goTo(current - 1);           // swipe right → prev
    }
  }, { passive: true });

  // Init
  updateCounter();
}
