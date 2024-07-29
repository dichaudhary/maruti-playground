/* eslint-disable object-curly-newline */
/* eslint-disable import/no-unresolved */
import { Component } from '../../scripts/vendor/preact.js';
import { html } from '../../scripts/vendor/htm-preact.js';
import { hnodeAs } from './multi-step-form.js';

export default class BasicUserDetailsStep extends Component {
  static parse(block) {
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
  }

  static defaults = {
    into: html`<p>Introduction</p>`,
    guidance: html`<p>guidance</p>`,
    disclaimer: html`<p>Disclaimer</p>`,
    submitButton: html`<button>Submit</button>`,
  };

  render() {
    const {
      intro,
      guidance,
      disclaimer,
      submitButton,
    } = this.props.config;

    return html`
      <form>
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
}
