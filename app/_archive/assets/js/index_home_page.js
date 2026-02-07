let images = document.querySelectorAll('.carrousel img');
let currentIndex = 0;

function changeImage() {
 images[currentIndex].style.opacity = 0;
 currentIndex = (currentIndex + 1) % images.length;
 images[currentIndex].style.opacity = 1;
}

setInterval(changeImage, 4000); // Change l'image toutes les 4 secondes (4000 milliseceonds => 4s)
