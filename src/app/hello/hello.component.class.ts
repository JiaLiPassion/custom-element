import {AngularCustomElementBridge} from './angular-element-bridge';
import { HelloComponent } from './hello.component';

export class HelloComponentClass extends HTMLElement {
  static bridge: AngularCustomElementBridge;
  static attributes: string[] = [];
  constructor() {
    super();
    HelloComponentClass.bridge.prepare();
  }

  static get observedAttributes() {
    return HelloComponentClass.attributes;
  }

  connectedCallback() {
    HelloComponentClass.bridge.initComponent(this);
  }

  disconnectedCallback() {
    HelloComponentClass.bridge.destroyComponent();
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    HelloComponentClass.bridge.setInput(attrName, newVal);
  }
}
