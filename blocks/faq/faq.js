import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Add a class to the block for styling
  block.classList.add('faq-container');

  // Decorate the title
  const title = block.querySelector('h2');
  if (title) {
    title.classList.add('faq-title');
  }

  // Decorate the image
  const imageContainer = block.children[1]
  if (imageContainer) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'faq-image-wrapper';
    moveInstrumentation(imageContainer.parentElement, imgWrapper);
    imgWrapper.appendChild(imageContainer);
    imageContainer.parentElement.replaceWith(imgWrapper);
  }

  // Decorate the "View More Questions" button
  const viewMore = block.querySelector('div > div > p');
  if (viewMore) {
    const button = document.createElement('button');
    button.className = 'faq-view-more';
    button.textContent = viewMore.textContent;
    moveInstrumentation(viewMore.parentElement, button);
    viewMore.parentElement.replaceWith(button);
  }

  // Decorate the accordion items
  [...block.children].forEach((row, index) => {
    if (index > 2) { // Skip the first three rows (title, image, and button)
      const label = row.children[0];
      const summary = document.createElement('summary');
      summary.className = 'faq-item-label';
      if (label.childElementCount) {
        summary.append(...label.childNodes);
      }

      const body = row.children[1];
      body.className = 'faq-item-body';

      const details = document.createElement('details');
      details.className = 'faq-item';
      moveInstrumentation(row, details);
      details.append(summary, body);
      row.replaceWith(details);
    }
  });
}
