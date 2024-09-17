import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Add a class to the block for styling
  block.classList.add('faq-block');

  // Decorate the FAQ title
  const title = block.querySelector('h2');
  if (title) {
    title.classList.add('faq-title');
  }

  // Decorate the FAQ items
  [...block.children].forEach((row, index) => {
    if (index > 0) { // Skip the first row which contains the title
      const label = row.children[0];
      const summary = document.createElement('summary');
      summary.className = 'faq-item-label';
      if(label.childElementCount > 0) {
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

  // Add the "View More Questions" button
  const viewMoreButton = document.createElement('button');
  viewMoreButton.className = 'faq-view-more';
  viewMoreButton.textContent = 'VIEW MORE QUESTIONS';
  block.append(viewMoreButton);
}
