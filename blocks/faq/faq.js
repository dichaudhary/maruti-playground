import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Add a class to the block for styling
  block.classList.add('faq-container');

  // Decorate the FAQ title
  const title = block.querySelector('h2');
  if (title) {
    title.classList.add('faq-title');
  }

  // Decorate the FAQ items
  [...block.children].forEach((row, index) => {
    if (index > 1) { // Skip the first two rows (title and image)
      // Decorate FAQ item label
      const label = row.children[0];
      const summary = document.createElement('summary');
      summary.className = 'faq-item-label';
      if (label.childElementCount) summary.append(...label.childNodes);

      // Decorate FAQ item body
      const body = row.children[1];
      body.className = 'faq-item-body';

      // Decorate FAQ item
      const details = document.createElement('details');
      details.className = 'faq-item';
      moveInstrumentation(row, details);
      details.append(summary, body);
      row.replaceWith(details);
    }
  });
}
