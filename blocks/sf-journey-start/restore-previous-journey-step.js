/* eslint-disable import/no-cycle */
/* eslint-disable import/no-unresolved */
import { Component } from '../../scripts/vendor/preact.js';
import { html } from '../../scripts/vendor/htm-preact.js';
import { hnodeAs } from './multi-step-form.js';

export default class RestorePreviousJourenyStep extends Component {
  static parse(block) {
    const [descriptionWrapper, buttonsWraper] = [...block.children]
      .map((row) => row.firstElementChild);
    const description = descriptionWrapper.children;
    const [yesButton, noButton] = [...buttonsWraper.children];
    return { description, yesButton, noButton };
  }

  static defaults = {
    description: html`<p>Do you want to restore your previous journey?</p>`,
    yesButton: html`<button>Yes</button>`,
    noButton: html`<button>No</button>`,
  };

  render() {
    const {
      description,
      yesButton,
      noButton,
    } = this.props.config;

    return html`
      <form>
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
}
