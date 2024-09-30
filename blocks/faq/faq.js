import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Set the block class
  block.classList.add('faq-block');

  // Decorate the title
  const title = block.querySelector('h2');
  if (title) {
    title.classList.add('faq-title');
  }

  // Decorate each FAQ item
  [...block.children].forEach((row, index) => {
    if (index > 1) {
      const question = row.children[0];
      const answer = row.children[1];

      if (question && answer) {
        // Create summary and details elements
        const summary = document.createElement('summary');
        summary.className = 'faq-item-question';
        summary.append(...question.childNodes);

        const details = document.createElement('details');
        details.className = 'faq-item';
        details.append(summary, answer);

        // Add the decorated details to the block
        moveInstrumentation(row, details);
        row.replaceWith(details);
      }
    }
  });

  // Decorate the "View More Questions" button
  const viewMore = block.querySelector('div > div > p');
  if (viewMore) {
    const button = document.createElement('button');
    button.className = 'faq-view-more';
    button.textContent = viewMore.textContent;
    viewMore.replaceWith(button);
  }
}
