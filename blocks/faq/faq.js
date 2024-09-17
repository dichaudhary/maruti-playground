import { moveInstrumentation } from '../../scripts/scripts.js';
import { loadBlock } from '../../scripts/aem.js';

function decorateButton(viewMoreButton) {
  const maxVisibleQuestions = 4;
  const faqItems = document.querySelectorAll('.faq-item');
  // Hide the 'View More' button if there are less than 5 questions
  if (faqItems.length < maxVisibleQuestions + 1) {
    viewMoreButton.style.display = 'none';
  } else {
    viewMoreButton.addEventListener('click', () => {
      for (let i = 0; i < faqItems.length; i += 1) {
        faqItems[i].style.display = 'block';
      }
      document.getElementById('viewMoreBtn').style.display = 'none';
    });
  }
}

function createFaqItem(div) {
  const label = div.children[0];
  label.classList.add('faq-item-label');
  const summary = document.createElement('summary');
  summary.className = 'faq-item-label';
  summary.append(...label.childNodes);
  const body = div.children[1];
  body.classList.add('faq-item-body');
  const details = document.createElement('details');
  moveInstrumentation(div, details);
  details.className = 'faq-item';
  details.append(summary, body);

  return details;
}

function getBlockFromHtml(blockHtml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(blockHtml, 'text/html');
  return doc.body.firstChild;
}

function handleContentUpdate({ detail: update }) {
  const newBlock = getBlockFromHtml(update);
  const oldBlock = document.querySelector('.faq');
  newBlock.style.display = 'none';
  oldBlock.insertAdjacentElement('afterend', newBlock);
  loadBlock(newBlock).then(() => {
    oldBlock.remove();
    newBlock.style.display = null;
  });
}

function addEventListenerToFaqItems(faq) {
  for (let i = 0; i < faq.length; i += 1) {
    faq[i].addEventListener('click', () => {
      for (let j = 0; j < faq.length; j += 1) {
        if (j !== i) faq[j].removeAttribute('open');
      }
    });
    faq[i].addEventListener('apply-update', handleContentUpdate);
  }
}

function createFaqItems(block) {
  const remainingDivs = Array.from(block.querySelectorAll('div.faq-item'));
  const faqListWrapper = document.createElement('div');
  faqListWrapper.classList.add('faq-list');

  remainingDivs.forEach((div) => {
    const details = createFaqItem(div);
    div.replaceWith(details);
    faqListWrapper.appendChild(details);
  });

  const faq = faqListWrapper.getElementsByTagName('details');
  if (faq.length > 0) {
    faq[0].setAttribute('open', '');
    addEventListenerToFaqItems(faq);
  }

  return faqListWrapper;
}

function addClassesToElements(block) {
  block.classList.add('dynamic-block');
  block.children[0].classList.add('faq-title');
  block.children[1].classList.add('faq-picture');
  block.children[2].id = 'viewMoreBtn';
  block.children[2].classList.add('view-more-faq');
  // Add faq-item class to all divs after the first 3
  for (let i = 3; i < block.children.length; i += 1) {
    block.children[i].classList.add('faq-item');
  }
}

function appendElementsToBlock(block, faqListWrapper) {
  block.appendChild(faqListWrapper);

  const faqContentLeft = document.createElement('div');
  faqContentLeft.classList.add('faq-content-left');
  faqContentLeft.appendChild(block.querySelector('.faq-title'));
  faqContentLeft.appendChild(block.querySelector('.faq-list'));
  faqContentLeft.appendChild(block.querySelector('.view-more-faq'));

  const faqContentRight = document.createElement('div');
  faqContentRight.classList.add('faq-content-right');
  faqContentRight.appendChild(block.querySelector('.faq-picture'));

  block.appendChild(faqContentLeft);
  block.appendChild(faqContentRight);
}

function handleSelection({ detail: { prop, element } }) {
  if (prop === 'ctas_submit') {
    const faqItems = document.querySelectorAll('.faq-item');
    for (let i = 0; i < faqItems.length; i += 1) {
      faqItems[i].style.display = 'block';
    }
    document.getElementById('viewMoreBtn').style.display = 'none';
  } else {
    // close all details
    document.querySelectorAll('details').forEach((details) => {
      details.open = false;
    });
    const details = element.matches('details') ? element : element.querySelector('details');
    if (details) {
      details.open = true;
    }
  }
}

export default function decorate(block) {
  addClassesToElements(block);
  const faqListWrapper = createFaqItems(block);
  appendElementsToBlock(block, faqListWrapper);
  decorateButton(block.querySelector('.view-more-faq'));
  block.addEventListener('navigate-to-route', handleSelection);
  block.addEventListener('apply-update', handleContentUpdate);
}
