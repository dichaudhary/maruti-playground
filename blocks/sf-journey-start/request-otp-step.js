/* eslint-disable import/no-cycle */
/* eslint-disable import/no-unresolved */
import { Component } from '../../scripts/vendor/preact.js';
import { html } from '../../scripts/vendor/htm-preact.js';
import { hnodeAs } from './multi-step-form.js';

export default class RequestOtpStep extends Component {
  static parse(block) {
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
  }

  static defaults = {
    customerOption: html`<p>Customer</p>`,
    dealerOption: html`<p>Dealer</p>`,
    description: html`<p>Description</p>`,
    button: html`<p>Request OTP</p>`,
  };

  render() {
    const {
      customerOption,
      dealerOption,
      description,
      button,
    } = this.props.config;

    return html`
      <form>
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
}
