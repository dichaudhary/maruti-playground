/* eslint-disable object-curly-newline */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import {
  render,
  h,
  createContext,
  cloneElement,
} from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { html } from 'htm/preact';
import RequestOtpStep from './request-otp-step.js';
import RestorePreviousJourenyStep from './restore-previous-journey-step.js';

export function hnodeAs(node, tagName, props = {}) {
  const copy = cloneElement(node, props);
  copy.type = tagName.toUpperCase();
  return copy;
}

function getAttributes(element) {
  return Object.fromEntries([...element.attributes].map((attr) => [attr.name, attr.value]));
}

export function hnode(nodes) {
  const convert = (node) => {
    if (node) {
      if (node.nodeType === 3) {
        return node.data;
      }
      if (node.nodeType === 1) {
        return h(node.nodeName, getAttributes(node), [...node.childNodes].map(hnode));
      }
    }
    return null;
  };
  if (nodes instanceof HTMLCollection) {
    // eslint-disable-next-line no-param-reassign
    nodes = [...nodes];
  }
  if (Array.isArray(nodes)) {
    return nodes.filter(Boolean).map(convert).filter(Boolean);
  }

  return convert(nodes);
}

const routes = {
  'request-otp-step': RequestOtpStep,
  'restore-previous-journey-step': RestorePreviousJourenyStep,
};

export const LoanApplicationFormContext = createContext();

function parseConfig(block, Component) {
  let config = block;
  let attrs = {};
  if (config) {
    attrs = getAttributes(config);
    config = Component.parse(config);
    config = {
      ...Component.defaults,
      ...Object.entries(config)
        // the entries are key => node pairs
        // adapt the nodes to hnodes
        .map(([key, value]) => [key, hnode(value)])
        // filter out any falsy values
        .filter(([, value]) => value)
        // convert the array back to an object
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
    };
  } else {
    config = Component.defaults;
  }

  return { attrs, config };
}

/**
 * A higher level component that wraps the given child into a <div> that is a dynamic-block.
 * The dynamic-block receives updates in the editor from the editor-support script and can
 * parse them to apply them selectively. To do that the block keeps track of the applied
 * configuration and attributes.
 */
export function ConfiguredFormStep({ props, children: renderer }) {
  const { config, attrs, name, isActive } = props;
  const [appliedAttrs, setAppliedAttrs] = useState(attrs);
  const [appliedConfig, setAppliedConfig] = useState(config);
  const ref = useRef();
  const classList = [name, 'dynamic-block'];
  if (isActive) classList.push('active');

  useEffect(() => {
    // listen for updates, parse them using the same function used in decorate() and update
    // the state accordingly
    ref.current.addEventListener('apply-update', ({ detail: update }) => {
      const parsedUpdate = new DOMParser().parseFromString(update, 'text/html');
      const configBlock = parsedUpdate.querySelector('.request-otp-step');
      const { attrs: newAttrs, config: newConfig } = parseConfig(configBlock, routes[name]);
      setAppliedAttrs(newAttrs);
      setAppliedConfig(newConfig);
    });
  }, []);

  return html`
    <div ...${appliedAttrs} class="${classList.join(' ')}" ref=${ref}>
      ${renderer({ config: appliedConfig })}
    </div>
  `;
}

export default async function decorate(block) {
  const parsedRoutes = Object.entries(routes).reduce((acc, [name, Component]) => {
    const configBlock = block.querySelector(`.${name}`);
    const parsed = parseConfig(configBlock, Component);
    return { ...acc, [name]: parsed };
  }, {});

  function LoanApplicationForm() {
    const [firstRoute] = Object.keys(routes);
    // TODO: restore state from localStorage
    const [activeRoute, setActiveRoute] = useState(firstRoute);
    const context = { activeRoute, setActiveRoute };

    block.dataset.renderAll = 'true';
    block.dataset.activeRoute = activeRoute;

    block.addEventListener('navigate-to-route', ({ detail }) => {
      const { route: newRoute } = detail;
      if (newRoute && newRoute !== activeRoute) {
        setActiveRoute(newRoute);
        block.dataset.activeRoute = newRoute;
      }
    });

    let formContent;
    if (block.dataset.renderAll === 'true') {
      // for authoring we have to render all the routes and show/hide them with CSS
      formContent = Object.entries(routes).map(([name, Component]) => {
        const { attrs, config } = parsedRoutes[name];
        return html`
          <${ConfiguredFormStep} props=${{ config, attrs, name, isActive: name === activeRoute }}>
            ${(props) => html`<${Component} ...${props}/>`}
          </${ConfiguredFormStep}>
        `;
      });
    } else {
      // otherwise we only render the active route
      const Component = routes[activeRoute];
      const { attrs, config } = parsedRoutes[activeRoute];
      formContent = html`
        <${ConfiguredFormStep} props=${{ config, attrs, name: activeRoute, isActive: true }}>
          ${(props) => html`<${Component} ...${props}/>`}
        </${ConfiguredFormStep}>
      `;
    }

    return html`
      <${LoanApplicationFormContext.Provider} value=${context}>
        ${formContent}
      </${LoanApplicationFormContext.Provider}>
    `;
  }

  block.textContent = '';
  render(html`<${LoanApplicationForm}/>`, block);
}
