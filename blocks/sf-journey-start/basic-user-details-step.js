/* eslint-disable object-curly-newline */
/* eslint-disable import/no-unresolved */
import { html } from '../../scripts/vendor/htm-preact.js';
import { useContext, useRef } from '../../scripts/vendor/preact-hooks.js';
import { hnodeAs, MultiStepFormContext } from './multi-step-form.js';

function BasicUserDetailsStep({ config }) {
  const { intro, guidance, disclaimer, submitButton } = config;
  const { updateFormState } = useContext(MultiStepFormContext);
  const formRef = useRef();

  const handleOnSubmit = (e) => {
    const formEntries = Object.fromEntries([...new FormData(formRef.current)]);
    updateFormState((currentState) => ({ ...currentState, ...formEntries }));
    e.preventDefault();
  };

  return html`
      <form ref=${formRef} onsubmit=${(e) => handleOnSubmit(e)}>
        <div class="basic-user-details-step-description">
          ${intro}
        </div>
        <div class="basic-user-details-step-fields">
          <input type="text" name="fullname" placeholder="Full Name" />
          <input type="text" name="email" placeholder="Email" />
          <input type="text" name="date-of-birth" placeholder="DOB" />
          <input type="text" name="city" placeholder="Search City" />
          <button type="submit">
            ${hnodeAs(submitButton, 'span')}
          </button>
        </div>
        <div class="basic-user-details-step-guidance">
          ${guidance}
        </div>
        <div class="basic-user-details-step-disclaimer">
          <input type="checkbox" name="disclaimer" value="accepted" />
          ${disclaimer}
        </div>
      </form>
    `;
}

BasicUserDetailsStep.parse = (block) => {
  const [
    introWrapper,
    guidanceWrapper,
    disclaimerWrapper,
    submitButtonWrapper,
  ] = [...block.children].map((row) => row.firstElementChild);
  const intro = introWrapper.children;
  const guidance = guidanceWrapper.children;
  const disclaimer = disclaimerWrapper.children;
  const submitButton = submitButtonWrapper.firstElementChild;
  return { intro, guidance, disclaimer, submitButton };
};

BasicUserDetailsStep.defaults = {
  into: html`<p>Introduction</p>`,
  guidance: html`<p>guidance</p>`,
  disclaimer: html`<p>Disclaimer</p>`,
  submitButton: html`<button>Submit</button>`,
};

export default BasicUserDetailsStep;
