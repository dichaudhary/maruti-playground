/* eslint-disable object-curly-newline */
/* eslint-disable import/no-unresolved */
import { html } from '../../scripts/vendor/htm-preact.js';
import { useContext, useRef } from '../../scripts/vendor/preact-hooks.js';
import { hnodeAs, MultiStepFormContext } from './multi-step-form.js';

function RequestOtpStep({ config }) {
  const { customerOption, dealerOption, description, button } = config;
  const { updateFormState } = useContext(MultiStepFormContext);
  const formRef = useRef();

  const handleOnSubmit = (e) => {
    const formEntries = Object.fromEntries([...new FormData(formRef.current)]);
    updateFormState((currentState) => ({ ...currentState, ...formEntries }));
    e.preventDefault();
  };

  return html`
    <form ref=${formRef} onsubmit=${(e) => handleOnSubmit(e)}>
      <div class="request-otp-step-options">
        <div>
          <input type="radio" id="customer-journey" name="journey-type" value="customer" checked />
          ${hnodeAs(customerOption, 'label', { for: 'customer-journey' })}
        </div>
        <div>
          <input type="radio" id="dealer-journey" name="journey-type" value="dealer" />
          ${hnodeAs(dealerOption, 'label', { for: 'dealer-journey' })}
        </div>
      </div>
      <div class="request-otp-step-description">
        ${description}
      </div>
      <div class="request-otp-step-input">
        <input type="text" placeholder="Mobile Number" />
        <button type="submit">
          ${hnodeAs(button, 'span')}
        </button>
      </div>
    </form>
  `;
}

RequestOtpStep.parse = (block) => {
  const [optionsWrapper, descriptionWrapper, buttonWrapper] = [...block.children]
    .map((row) => row.firstElementChild);
  const [customerOption, dealerOption] = [...optionsWrapper.children];
  const description = descriptionWrapper.children;
  const button = buttonWrapper.firstElementChild;
  return {
    customerOption,
    dealerOption,
    description,
    button,
  };
};

RequestOtpStep.defaults = {
  customerOption: html`<p>Customer</p>`,
  dealerOption: html`<p>Dealer</p>`,
  description: html`<p>Description</p>`,
  button: html`<p>Request OTP</p>`,
};

export default RequestOtpStep;
