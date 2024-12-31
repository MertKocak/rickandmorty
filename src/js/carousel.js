 // JavaScript for controlling carousel
 let currentIndex = 0;
 const items = document.querySelectorAll('#carouselItems > div');
 const totalItems = items.length;
 const carousel = document.getElementById('carouselItems');

 // Show the current slide
 function updateCarousel() {
   carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
 }

 // Next button
 document.getElementById('nextBtn').addEventListener('click', () => {
   currentIndex = (currentIndex + 1) % totalItems; // Loop back to the first item
   updateCarousel();
 });

 // Previous button
 document.getElementById('prevBtn').addEventListener('click', () => {
   currentIndex = (currentIndex - 1 + totalItems) % totalItems; // Loop back to the last item
   updateCarousel();
 });