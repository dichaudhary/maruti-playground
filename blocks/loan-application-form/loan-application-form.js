/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-cycle */
/* eslint-disable no-use-before-define */
import {
  render,
  h,
  createContext,
  cloneElement,
} from 'preact';
import { useState } from 'preact/hooks';
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

export default async function decorate(block) {
  const parsedRoutes = Object.entries(routes).reduce((acc, [name, component]) => {
    let config = block.querySelector(`.${name}`);
    let attrs = {};
    if (config) {
      attrs = getAttributes(config);
      config = component.parse(config);
      config = {
        ...component.defaults,
        ...Object.entries(config)
          .map(([key, value]) => [key, hnode(value)])
          .filter(([, value]) => value)
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
      };
    } else {
      config = component.defaults;
    }
    return { ...acc, [name]: { config, attrs } };
  }, {});

  function LoanApplicationForm() {
    const [firstRoute] = Object.keys(routes);
    // TODO: restore state from localStorage
    const [activeRoute, setActiveRoute] = useState(firstRoute);
    const context = {
      activeRoute,
      setActiveRoute,
    };

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
          <div ...${attrs} class="${name} ${name === activeRoute ? 'active' : ''}" >
            <${Component} config=${config} />
          </div>
        `;
      });
    } else {
      // otherwise we only render the active route
      const Component = routes[activeRoute];
      const { attrs, config } = parsedRoutes[activeRoute];
      formContent = html`
        <div ...${attrs} class="${activeRoute} active">
          <${Component} config=${config} />
        </div>
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
