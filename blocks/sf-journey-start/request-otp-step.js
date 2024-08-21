/* eslint-disable object-curly-newline */
/* eslint-disable import/no-unresolved */
import { html } from '../../scripts/vendor/htm-preact.js';
import { useContext, useRef, useState } from '../../scripts/vendor/preact-hooks.js';
import { hnodeAs, MultiStepFormContext } from './multi-step-form.js';

function RequestOtpStep({ config }) {
  const { customerOption, dealerOption, description, button } = config;
  const { updateFormState, handleSetActiveRoute } = useContext(MultiStepFormContext);
  const formRef = useRef();
  const [showError, setShowError] = useState(false);

  const isValidMobileNumber = (number) => {
    const phoneNumberPattern = /^\d{10}$/;
    return phoneNumberPattern.test(number);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const formEntries = Object.fromEntries([...new FormData(formRef.current)]);
    const { 'mobile-number': mobileNumber } = formEntries;

    if (isValidMobileNumber(mobileNumber)) {
      // Update the form state with the mobile number
      // updateFormState((currentState) => ({
      //   ...currentState,
      //   mobileNumber,
      // }));

      try {
        const response = await fetch(`${window.location.origin}/placeholders.json`);

        const data = await response.json();
        // eslint-disable-next-line no-shadow
        const entry = data.data.find((entry) => entry.Key === mobileNumber);

        if (entry) {
          updateFormState((currentState) => ({
            ...currentState,
            mobileNumber,
            name: entry.Text, // Add the value of the key to form state
          }));

          // Move to the restore-previous-journey-step
          handleSetActiveRoute('restore-previous-journey-step');
        } else {
          handleSetActiveRoute('basic-user-details-step');
        }
      } catch (error) {
        handleSetActiveRoute('request-otp-step');
      }
      setShowError(false);
    } else {
      setShowError(true);
    }
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
        <input type="text" name="mobile-number" placeholder="Mobile Number" />
        <button type="submit">
          ${hnodeAs(button, 'span')}
        </button>
      </div>
      <div class=${`error-form ${showError ? 'active' : ''}`}>
        <p>*Mobile Number is not Valid</p>
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
