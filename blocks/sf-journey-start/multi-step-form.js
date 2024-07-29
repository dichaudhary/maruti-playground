/* eslint-disable object-curly-newline */
/* eslint-disable import/no-unresolved */
import { render, h, createContext, cloneElement } from '../../scripts/vendor/preact.js';
import { useState, useRef, useEffect } from '../../scripts/vendor/preact-hooks.js';
import { html } from '../../scripts/vendor/htm-preact.js';
import { toClassName } from '../../scripts/aem.js';

export function hnodeAs(node, tagName, props = {}) {
  const copy = cloneElement(node, props);
  copy.type = tagName;
  return copy;
}

function getAttributes(element) {
  return Object.fromEntries([...element.attributes].map((attr) => [attr.name, attr.value]));
}

function hnode(nodes) {
  const convert = (node) => {
    if (node) {
      if (node.nodeType === 3) {
        return node.data;
      }
      if (node.nodeType === 1) {
        return h(node.nodeName.toLowerCase(), getAttributes(node), [...node.childNodes].map(hnode));
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

export const MultiStepFormContext = createContext();

export default async function decorate(block, routes) {
  const parsedRoutes = Object.entries(routes).reduce((acc, [name, Component]) => {
    const configBlock = block.querySelector(`.${toClassName(name)}`);
    const parsed = parseConfig(configBlock, Component);
    return { ...acc, [name]: parsed };
  }, {});

  /**
   * A higher level component that wraps the given child into a <div> that is a dynamic-block.
   * The dynamic-block receives updates in the editor from the editor-support script and can
   * parse them to apply them selectively. To do that the block keeps track of the applied
   * configuration and attributes.
   */
  function MultiStepFormStep({ props, children: renderer }) {
    const { config, attrs, name, isActive } = props;
    const [editorState, setEditorState] = useState(null);
    const ref = useRef();
    const classList = [name, 'dynamic-block'];

    if (isActive) classList.push('active');

    useEffect(() => {
      // listen for updates, parse them using the same function used in decorate() and update
      // the state accordingly
      function handleContentUpdate({ detail: update }) {
        const parsedUpdate = new DOMParser().parseFromString(update, 'text/html');
        const configBlock = parsedUpdate.querySelector(`.${name}`);
        const { attrs: newAttrs, config: newConfig } = parseConfig(configBlock, routes[name]);
        setEditorState({ attrs: newAttrs, config: newConfig });
      }
      ref.current.addEventListener('apply-update', handleContentUpdate);
      return () => ref.current.removeEventListener('apply-update', handleContentUpdate);
    }, [name]);

    return html`
      <div ...${editorState ? editorState.attrs : attrs} class="${classList.join(' ')}" ref=${ref}>
        ${renderer({ config: editorState ? editorState.config : config })}
      </div>
    `;
  }

  function MultiStepForm() {
    const [firstRoute] = Object.keys(routes);
    const [activeRoute, setActiveRoute] = useState(firstRoute);
    const context = { activeRoute, setActiveRoute };

    // if loaded in an iframe (Universal Editor), render all routes
    block.dataset.renderAll = window.self !== window.top ? 'true' : '';
    block.dataset.activeRoute = activeRoute;

    // listen for navigation triggered from the outside, e.g. the Universal Editor
    block.addEventListener('navigate-to-route', ({ detail }) => {
      const { route: newRoute } = detail;
      if (newRoute && routes[newRoute] && newRoute !== activeRoute) {
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
          <${MultiStepFormStep} props=${{ config, attrs, name, isActive: name === activeRoute }}>
            ${(props) => html`<${Component} ...${props}/>`}
          </${MultiStepFormStep}>
        `;
      });
    } else {
      // otherwise we only render the active route
      const Component = routes[activeRoute];
      const { attrs, config } = parsedRoutes[activeRoute];
      formContent = html`
        <${MultiStepFormStep} props=${{ config, attrs, name: activeRoute, isActive: true }}>
          ${(props) => html`<${Component} ...${props}/>`}
        </${MultiStepFormStep}>
      `;
    }

    return html`
      <${MultiStepFormContext.Provider} value=${context}>
        ${formContent}
      </${MultiStepFormContext.Provider}>
    `;
  }

  block.textContent = '';
  render(html`<${MultiStepForm}/>`, block);
}
