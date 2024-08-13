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

function updateView() {
  const arrowDiv = document.querySelector('.journey-carousel .arrow-div');
  Viewport.getDeviceType();
  if (Viewport.isTablet()) {
    arrowDiv.style.display = 'block';
  } else {
    arrowDiv.style.display = 'none';
  }
  const jcItems = document.querySelector('.journey-carousel .jc-items');
  jcItems.style.transform = 'translateX(0px)';

  if (Viewport.isMobile()) {
    const backgroundDiv = document.querySelector('.journey-carousel .jc-items');
    const pictureDivs = document.querySelectorAll('.journey-carousel .jc-details picture');
    backgroundDiv.style.background = `url(${pictureDivs[0].querySelector('img').src}) center 60px no-repeat`;
    backgroundDiv.style.backgroundSize = '80% 80%';
  } else {
    const backgroundDiv = document.querySelector('.journey-carousel .jc-items');
    backgroundDiv.style.background = 'none';
  }
}

function handleSelection({ detail: { prop, element } }) {
  const block = element.parentElement?.closest('.block') || element?.closest('.block');
  //check if it is a carousel view
  if (block && block.querySelector('.arrow-div').style.display === 'block') {
    const jcitemDetails = Array.from(block.querySelectorAll('.jc-item-details'));
    const currentIndex = jcitemDetails.indexOf(element);
    // If the current index is the last item, move to the second last item 
    //so that second last and last item show up on the screen
    if (currentIndex === jcitemDetails.length - 1) {
      currentIndex = jcitemDetails.length - 2;
    }
    const itemWidth = jcitemDetails[0]?.offsetWidth || 0;
    const jcItems = block.querySelector('.jc-items');
    jcItems.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }
}

function addNavigationDiv(caraousalDiv) {
  const navDiv = document.createElement('div');
  navDiv.classList.add('arrow-div');
  const leftArrow = document.createElement('div');
  leftArrow.classList.add('left-arrow');
  const rightArrow = document.createElement('div');
  rightArrow.classList.add('right-arrow');
  navDiv.appendChild(leftArrow);
  navDiv.appendChild(rightArrow);
  caraousalDiv.appendChild(navDiv);

  const jcItems = caraousalDiv.querySelector('.jc-items');
  const jcItemDetails = Array.from(caraousalDiv.querySelectorAll('.jc-item'));
  let currentIndex = 0;
  function updateCarousel() {
    const itemWidth = jcItemDetails[0]?.offsetWidth || 0; // Get the width of one item
    jcItems.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  leftArrow.addEventListener('click', () => {
    if (currentIndex <= 0) {
      currentIndex = jcItemDetails.length - 2; // Move to the last item
    } else {
      currentIndex = (currentIndex - 1 + jcItemDetails.length) % jcItemDetails.length;
    }
    updateCarousel();
  });

  rightArrow.addEventListener('click', () => {
    if (currentIndex >= jcItemDetails.length - 2) {
      currentIndex = 0; // Move to the first item
    } else {
      currentIndex = (currentIndex + 1) % jcItemDetails.length;
    }
    updateCarousel();
  });
}

export default async function decorate(block) {
  block.classList.add('dynamic-block');
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
  const caraousalDiv = document.createElement('div');
  caraousalDiv.classList.add('carousel-div');
  block.appendChild(caraousalDiv);
  const itemsDiv = document.createElement('div');
  itemsDiv.classList.add('jc-items');

  // set background for jc-items div for mobile view
  if (Viewport.isMobile()) {
    const backgroundDiv = itemsDiv;
    const pictureDivs = block.querySelectorAll('.journey-carousel .jc-details picture');
    backgroundDiv.style.background = `url(${pictureDivs[0].querySelector('img').src}) center 60px no-repeat`;
    backgroundDiv.style.backgroundSize = '80% 80%';
  }

  // Move the remaining divs into the new div and add the class 'jc-item-details'
  for (let i = 1; i < divs.length; i += 1) {
    const itemdiv = document.createElement('div');
    itemdiv.classList.add('jc-item');
    const arrowdiv = document.createElement('div');
    arrowdiv.classList.add('jc-arrow');
    itemdiv.appendChild(arrowdiv);
    divs[i].classList.add('jc-item-details');
    itemdiv.appendChild(divs[i]);

    if (i === 1) {
      const firstArrowdiv = document.createElement('div');
      firstArrowdiv.classList.add('jc-arrow');
      itemdiv.appendChild(firstArrowdiv);
    }
    itemsDiv.appendChild(itemdiv);
  }
  caraousalDiv.appendChild(itemsDiv);
  addNavigationDiv(caraousalDiv);
  //add listetener for selection event in Universal Editor 
  block.addEventListener('navigate-to-route', handleSelection);
  // Add event listener for window resize
  window.addEventListener('resize', updateView);
}
