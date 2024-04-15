window.addEventListener('load', function () {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
  
    function showSlide(n) {
      slides[currentSlide].style.display = 'none';
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].style.display = 'block';
    }
  
    showSlide(currentSlide);
  
    const interval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 3000);
  });
  