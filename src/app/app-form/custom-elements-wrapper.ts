import { AngularCustomElementsBridge } from './angular-elements-bridge';

export class CustomElementsWrapper extends HTMLElement {
  static bridge: AngularCustomElementsBridge;
  constructor() {
    super();
    CustomElementsWrapper.bridge.prepare();
  }

  static get observedAttributes() {
    return AngularCustomElementsBridge.attributes;
  }

  connectedCallback() {
    CustomElementsWrapper.bridge.initComponent(this);
  }

  disconnectedCallback() {
    CustomElementsWrapper.bridge.destroyComponent();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    CustomElementsWrapper.bridge.setInput(attrName, newVal);
  }
}
