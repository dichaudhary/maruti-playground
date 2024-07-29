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
    divs[i].classList.add('jc-item-details');
    newDiv.appendChild(divs[i]);
  }

  // Add the new div element to the block
  block.appendChild(newDiv);
}
