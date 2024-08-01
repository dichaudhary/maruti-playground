


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
  block.appendChild(newDiv);


  // Add the carousel functionality
  const carouselDiv = document.createElement('div');
  carouselDiv.classList.add('carouselDiv');
  const leftArrow = document.createElement('div');
  leftArrow.classList.add('leftArrow');
  const rightArrow = document.createElement('div');
  rightArrow.classList.add('rightArrow');
  carouselDiv.appendChild(leftArrow);
  carouselDiv.appendChild(rightArrow);
  block.appendChild(carouselDiv);


  const jcItems = block.querySelector('.jc-items');

  let currentIndex = 0;
  let direction = 1;
  const jcItemDetails = block.querySelectorAll('.jc-item');

  function updateCarousel() {
    const jcItemList = block.querySelectorAll('.jc-item');
    const itemWidth = jcItemList[0]?.offsetWidth || 0; // Get the width of one item
    //jcItems.style.transform = `translateX(-${currentIndex * itemWidth*direction}px)`;


    jcItemList.forEach((item, index) => {
      if (index === currentIndex || (index === (currentIndex + 1) % jcItemDetails.length)) {
        item.style.display = 'block';
        //item.style.transform = `translateX(-${currentIndex * itemWidth*direction}px)`;

      }
      else {
        item.style.display = 'none';
      }
    });

  }

  leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + jcItemDetails.length) % jcItemDetails.length;
    direction = -1;
    updateCarousel();
  });

  rightArrow.addEventListener('click', () => {
    direction = 1;
    currentIndex = (currentIndex + 1) % jcItemDetails.length;
    updateCarousel();
  });


  function updateView() {
    if (window.innerWidth <= 768) {
      jcItemDetails.forEach((item, index) => {
        if(index === 0 || index === 1){
          item.style.display = 'block';
        }
        else {
          item.style.display = 'none';
        }
      });

      carouselDiv.style.display = 'block';
      
    } else {
      // Desktop screens
      jcItemDetails.forEach((item, index) => {
        item.style.display = 'block';
      });

      carouselDiv.style.display = 'none';
    }
  }


  // Add event listener for window resize
  window.addEventListener('resize', updateView);

}