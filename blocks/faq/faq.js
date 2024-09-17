import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Add the hero styles to the FAQ block
  const heroWrapper = document.createElement('div');
  heroWrapper.className = 'faq-hero-wrapper';
  
  const heroContainer = document.createElement('div');
  heroContainer.className = 'faq-hero-container';
  
  heroWrapper.appendChild(heroContainer);

  const header = block.querySelector('h2');
  if (header) {
    heroContainer.appendChild(header);
  }

  const picture = block.querySelector('picture');
  if (picture) {
    heroContainer.appendChild(picture);
  }

  block.prepend(heroWrapper);

  // Convert the FAQ items into an accordion
  [...block.children].forEach((row) => {
    if (!row.querySelector('h2') && !row.querySelector('picture')) {
      // Decorate accordion item label
      const label = row.children[0];
      const summary = document.createElement('summary');
      summary.className = 'faq-item-label';
      if (label.childElementCount) {
        summary.append(...label.childNodes);
      }

      // Decorate accordion item body
      const body = row.children[1];
      body.className = 'faq-item-body';

      // Decorate accordion item
      const details = document.createElement('details');
      details.className = 'faq-item';

      // Important for authoring in Universal editor
      moveInstrumentation(row, details);
      details.append(summary, body);
      row.replaceWith(details);
    }
  });
}
