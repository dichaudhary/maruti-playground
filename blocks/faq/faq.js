export default function decorate(block) {
  // Add a class to the block for styling
  block.classList.add('faq-block');

  // Iterate over each child of the block
  [...block.children].forEach((row) => {
    // Check if the row contains a question and answer
    if (row.children.length === 2) {
      // Create the summary element for the question
      const question = row.children[0];
      const summary = document.createElement('summary');
      summary.className = 'faq-item-question';
      summary.append(...question.childNodes);

      // Create the body element for the answer
      const answer = row.children[1];
      answer.className = 'faq-item-answer';

      // Create the details element to wrap the question and answer
      const details = document.createElement('details');
      details.className = 'faq-item';
      details.append(summary, answer);

      // Replace the original row with the new details element
      row.replaceWith(details);
    }
  });
}
