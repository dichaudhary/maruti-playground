/* eslint-disable import/no-cycle */
/* eslint-disable import/no-unresolved */

import { html } from '../../scripts/vendor/htm-preact.js';
import { useContext, useRef } from '../../scripts/vendor/preact-hooks.js';
import { hnodeAs, MultiStepFormContext } from './multi-step-form.js';

function RestorePreviousJourenyStep({ config }) {
  const { description, yesButton, noButton } = config;
  const { updateFormState } = useContext(MultiStepFormContext);
  const formRef = useRef();

  const handleOnSubmit = (e) => {
    const formEntries = Object.fromEntries([...new FormData(formRef.current)]);
    updateFormState((currentState) => ({ ...currentState, ...formEntries }));
    e.preventDefault();
  };

  return html`
     <form ref=${formRef} onsubmit=${(e) => handleOnSubmit(e)}>
      <div class="restore-previous-journey-step-description">
        ${description}
      </div>
      <div class="restore-previous-journey-step-buttons">
        <button type="submit" value="yes">
          ${hnodeAs(yesButton, 'span')}
        </button>
        <button type="submit" value="no">
          ${hnodeAs(noButton, 'span')}
        </button>
      </div>
    </form>
  `;
}

RestorePreviousJourenyStep.parse = (block) => {
  const [descriptionWrapper, buttonsWraper] = [...block.children]
    .map((row) => row.firstElementChild);
  const description = descriptionWrapper.children;
  const [yesButton, noButton] = [...buttonsWraper.children];
  return { description, yesButton, noButton };
};

RestorePreviousJourenyStep.defaults = {
  description: html`<p>Do you want to restore your previous journey?</p>`,
  yesButton: html`<button>Yes</button>`,
  noButton: html`<button>No</button>`,
};

export default RestorePreviousJourenyStep;
