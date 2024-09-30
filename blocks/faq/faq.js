import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Set the block class
  block.classList.add('faq');

  // Decorate the title
  const title = block.querySelector('h2');
  if (title) {
    title.classList.add('faq-title');
  }

  // Decorate the "View More Questions" link
  const viewMore = block.querySelector('div > div > p');
  if (viewMore) {
    const viewMoreContainer = viewMore.parentElement;
    viewMoreContainer.classList.add('faq-view-more');
    viewMore.classList.add('faq-view-more-text');
  }

  // Decorate each FAQ item
  [...block.children].forEach((row, index) => {
    if (index > 2) { // Skip the first three divs (title, image, view more)
      const question = row.children[0];
      const answer = row.children[1];

      // Create summary and details elements
      const summary = document.createElement('summary');
      summary.className = 'faq-item-label';
      if (question.childElementCount) {
        summary.append(...question.childNodes);
      }

      const details = document.createElement('details');
      details.className = 'faq-item';
      moveInstrumentation(row, details);
      details.append(summary, answer);

      row.replaceWith(details);
    }
  });
}
