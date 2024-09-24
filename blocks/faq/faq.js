import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Add FAQ title styling
  const title = block.querySelector('h2');
  if (title) {
    title.className = 'faq-title';
  }

  // Process each FAQ item
  [...block.children].forEach((row, index) => {
    if (index > 2) {
      const question = row.children[0];
      const answer = row.children[1];
  
      // Create summary element for the question
      const summary = document.createElement('summary');
      summary.className = 'faq-item-label';
      if (question.childElementCount) {
        summary.append(...question.childNodes);
      } else {
        summary.textContent = question.textContent;
      }
  
      // Create details element for the FAQ item
      const details = document.createElement('details');
      details.className = 'faq-item';
  
      // Move instrumentation
      moveInstrumentation(row, details);
  
      // Append summary and answer to details
      details.append(summary, answer);
      row.replaceWith(details);
    }
  });

  // Add the "View More Questions" button
  const viewMoreRow = document.createElement('div');
  viewMoreRow.className = 'faq-view-more';
  const viewMoreButton = document.createElement('button');
  viewMoreButton.textContent = 'VIEW MORE QUESTIONS';
  viewMoreRow.append(viewMoreButton);
  block.append(viewMoreRow);
}
