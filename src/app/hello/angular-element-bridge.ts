import {Injector, ComponentFactory, ComponentFactoryResolver, ComponentRef, ChangeDetectorRef, ApplicationRef} from '@angular/core';

import {HelloComponent} from './hello.component';

export class AngularCustomElementBridge {
  componentRef: ComponentRef<HelloComponent>;
  componentFactory: ComponentFactory<HelloComponent>;
  initialInputValues = {};
  applicationRef: ApplicationRef;
  changeDetectorRef: ChangeDetectorRef;

  constructor(private injector: Injector, private component) {
    this.changeDetectorRef = this.injector.get(ChangeDetectorRef);
  }

  prepare() {
    this.componentFactory = this.injector.get(ComponentFactoryResolver).resolveComponentFactory(this.component);
  }

  initComponent(element: HTMLElement) {
    // first we need an componentInjector to initialize the component.
    // here the injector is from outside of Custom Element, user can register some of their own
    // providers in it.
    const componentInjector = Injector.create([], this.injector);
    // analyze projectable nodes from element
    // for example:
    // <app-hello>
    //   <div class="inside">some projection content</div>
    // </app-hello>
    // const projectableNodes = this.injector.get(ComponentFactoryResolver).resolveComponentFactory(this.component);
    // Here we got all we need, we will initialize the component
    this.componentRef = this.componentFactory.create(componentInjector, null, element);

    // Then we need to check whether we need to initialize value of component's input
    // the case is, before Angular Element is loaded, user may already set element's property.
    // those values will be kept in an initialInputValues map.
    this.componentFactory.inputs.forEach(prop => this.componentRef.instance[prop.propName] = this.initialInputValues[prop.propName]);

    // then we will trigger a change detection so the component will be rendered in next tick.
    this.changeDetectorRef.detectChanges();
    this.applicationRef = this.injector.get(ApplicationRef);

    // finally we will attach this component's HostView to applicationRef
    this.applicationRef.attachView(this.componentRef.hostView);
  }

  destroyComponent() {
    this.componentRef.destroy();
  }

  setInput(propName: string, value: string) {
    if (!this.componentRef) {
      this.initialInputValues[propName] = value;
      return;
    }
    if (this.componentRef[propName] === value) {
      return;
    }
    this.componentRef[propName] = value;
    this.changeDetectorRef.detectChanges();
  }
}
