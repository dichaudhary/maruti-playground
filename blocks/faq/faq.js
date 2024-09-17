function decorate(block) {
  // Find the FAQ title and style it
  const title = block.querySelector('h2');
  title.classList.add('faq-title');

  // Find the "View More Questions" button and style it
  const viewMore = block.querySelector('div > div > p');
  viewMore.classList.add('faq-view-more');
  viewMore.innerHTML = '<button>VIEW MORE QUESTIONS</button>';

  // Process each question-answer pair
  const pairs = [...block.querySelectorAll(':scope > div')].slice(3);

  pairs.forEach((pair) => {
    // Decorate the question
    const question = pair.children[0];
    const summary = document.createElement('summary');
    summary.className = 'faq-question';
    summary.append(...question.childNodes);

    // Decorate the answer
    const answer = pair.children[1];
    answer.className = 'faq-answer';

    // Create details element to wrap question and answer
    const details = document.createElement('details');
    details.className = 'faq-item';
    details.append(summary, answer);
    pair.replaceWith(details);
  });
}
