const Viewport = (function initializeViewport() {
  let deviceType;

  const breakpoints = {
    mobile: window.matchMedia('(max-width: 47.99rem)'),
    tablet: window.matchMedia('(min-width: 48rem) and (max-width: 63.99rem)'),
    desktop: window.matchMedia('(min-width: 64rem)'),
  };

  function getDeviceType() {
    if (breakpoints.mobile.matches) {
      deviceType = 'Mobile';
    } else if (breakpoints.tablet.matches) {
      deviceType = 'Tablet';
    } else {
      deviceType = 'Desktop';
    }
    return deviceType;
  }
  getDeviceType();

  

  function isDesktop() {
    return deviceType === 'Desktop';
  }

  function isMobile() {
    return deviceType === 'Mobile';
  }
  function isTablet() {
    return deviceType === 'Tablet';
  }
  return {
    getDeviceType,
    isDesktop,
    isMobile,
    isTablet,
  };
}());


export default async function decorate(block) {
  const divs = block.querySelectorAll(':scope > div');

  // Add the class to the first div
  if (divs.length > 0) {
    divs[0].classList.add('jc-details');
    divs[0].querySelectorAll('h3').forEach((h3) => {
      const nextP = h3.nextElementSibling;
      if (nextP && nextP.tagName.toLowerCase() === 'p') {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('wrapped-content');

        h3.parentNode.insertBefore(wrapperDiv, h3);
        wrapperDiv.appendChild(h3);
        wrapperDiv.appendChild(nextP);
      }
    });
  }

  // Add the class to the rest of the divs
  const caraousalDiv = document.createElement('div');
  caraousalDiv.classList.add('carouselDiv');
  block.appendChild(caraousalDiv);
  const newDiv = document.createElement('div');
  newDiv.classList.add('jc-items');

  // Move the remaining divs into the new div and add the class 'jc-item-details'
  for (let i = 1; i < divs.length; i++) {
    const itemdiv = document.createElement('div');
    itemdiv.classList.add('jc-item');
    const arrowdiv = document.createElement('div');
    arrowdiv.classList.add('jc-arrow');
    itemdiv.appendChild(arrowdiv);
    divs[i].classList.add('jc-item-details');
    itemdiv.appendChild(divs[i]);
    newDiv.appendChild(itemdiv);
  }

  // Add the new div element to the block
  caraousalDiv.appendChild(newDiv);


  // Add the carousel functionality
  const navDiv = document.createElement('div');
  navDiv.classList.add('arrowDiv');
  const leftArrow = document.createElement('div');
  leftArrow.classList.add('leftArrow');
  const rightArrow = document.createElement('div');
  rightArrow.classList.add('rightArrow');
  navDiv.appendChild(leftArrow);
  navDiv.appendChild(rightArrow);
  caraousalDiv.appendChild(navDiv);


  const jcItems = block.querySelector('.jc-items');
const jcItemDetails = block.querySelectorAll('.jc-item');
let currentIndex = 0;

function updateCarousel() {
  const itemWidth = jcItemDetails[0]?.offsetWidth || 0; // Get the width of one item
  jcItems.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

leftArrow.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + jcItemDetails.length) % jcItemDetails.length;
  // Add a clone of the last item to the start when the first item is in view
  if (currentIndex === 0) {
    const clone = jcItemDetails[jcItemDetails.length - 1].cloneNode(true);
    jcItems.insertBefore(clone, jcItems.firstChild);
  }
  // Remove the clone and reset currentIndex when the last item comes into view
  else if (currentIndex === jcItemDetails.length - 1 && jcItemDetails.length > 4) {
    jcItems.removeChild(jcItems.firstChild);
    currentIndex = 1;
    jcItems.style.transition = 'none';
  }
  updateCarousel();
});

rightArrow.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % jcItemDetails.length;
  // Add a clone of the first item to the end when the last item is in view
  if (currentIndex === jcItemDetails.length - 1) {
    const clone = jcItemDetails[0].cloneNode(true);
    jcItems.appendChild(clone);
  }
  // Remove the clone and reset currentIndex when the first item comes into view
  else if (currentIndex === 0 && jcItemDetails.length > 4) {
    jcItems.removeChild(jcItems.lastChild);
    currentIndex = jcItemDetails.length - 2;
  }
  updateCarousel();
});


  function updateView() {
    Viewport.getDeviceType();
    if (Viewport.isTablet() ) {
      jcItemDetails.forEach((item, index) => {
        
      });

      arrowDiv.style.display = 'block';
      
    } else {
      // Desktop screens
      jcItemDetails.forEach((item, index) => {
       // item.style.display = 'block';
      });

      arrowDiv.style.display = 'none';
    }
  }


  // Add event listener for window resize
  window.addEventListener('resize', updateView);

}