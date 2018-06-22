import { Component, Injector, ComponentFactoryResolver } from '@angular/core';
import { AngularCustomElementBridge } from './hello/angular-element-bridge';
import { HelloComponentClass } from './hello/hello.component.class';
import { HelloComponent } from './hello/hello.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private injector: Injector) {
    const bridge = new AngularCustomElementBridge(injector, HelloComponent);
    injector.get(ComponentFactoryResolver).resolveComponentFactory(HelloComponent).
      inputs.forEach(input => HelloComponentClass.attributes.push(input.templateName));
    HelloComponentClass.bridge = bridge;
    customElements.define('hello-elem', HelloComponentClass);
  }
}
