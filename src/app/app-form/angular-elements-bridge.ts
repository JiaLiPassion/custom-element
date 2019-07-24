import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injector
} from '@angular/core';
import { Observable, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export class AngularCustomElementsBridge {
  static attributes: string[] = [];
  componentRef: ComponentRef<any>;
  initialInputValues = {};
  applicationRef: ApplicationRef;
  outputEvents: Observable<any>;
  ngElementEventsSubscription: Subscription;

  constructor(
    private injector: Injector,
    private component,
    private componentFactory: ComponentFactory<any>
  ) {}

  prepare() {
    this.componentFactory.inputs.forEach(input =>
      AngularCustomElementsBridge.attributes.push(input.templateName)
    );
  }

  initComponent(element: HTMLElement) {
    // first we need an componentInjector to initialize the component.
    // here the injector is from outside of Custom Element, user can register
    // some of their own providers in it.
    const componentInjector = Injector.create([], this.injector);
    // analyze projectable nodes from element
    // for example:
    // <app-hello>
    //   <div class="inside">some projection content</div>
    // </app-hello>
    // const projectableNodes =
    // this.injector.get(ComponentFactoryResolver).resolveComponentFactory(this.component);
    // Here we got all we need, we will initialize the component
    this.componentRef = this.componentFactory.create(componentInjector, null, element);

    // Then we need to check whether we need to initialize value of component's
    // input the case is, before Angular Element is loaded, user may already set
    // element's property. those values will be kept in an initialInputValues
    // map.
    this.componentFactory.inputs.forEach(
      prop => (this.componentRef.instance[prop.propName] = this.initialInputValues[prop.propName])
    );

    // subscribe to event emitters of Angular Component and dispatch Custom
    // Events
    const eventEmitters = this.componentFactory.outputs.map(({ propName, templateName }) => {
      const emitter = (this.componentRef.instance as any)[propName] as EventEmitter<any>;
      return emitter.pipe(map((value: any) => ({ name: templateName, value })));
    });
    // merge all those output event emitter to a single stream.
    this.outputEvents = merge(...eventEmitters);
    // Listen for events from the merged stream and dispatch them as custom
    // events
    this.ngElementEventsSubscription = this.outputEvents.subscribe(e => {
      const customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(e.name, false, false, e.value);
      element.dispatchEvent(customEvent);
    });

    // then we will trigger a change detection so the component will be rendered
    // in next tick.
    // this.componentRef.changeDetectorRef.detectChanges();
    this.applicationRef = this.injector.get(ApplicationRef);

    // finally we will attach this component's HostView to applicationRef
    this.applicationRef.attachView(this.componentRef.hostView);
  }

  destroyComponent() {
    this.componentRef.destroy();
    this.ngElementEventsSubscription.unsubscribe();
  }

  getInput(propName: string) {
    return this.componentRef && this.componentRef.instance[propName];
  }

  setInput(propName: string, value: string) {
    if (!this.componentRef) {
      this.initialInputValues[propName] = value;
      return;
    }
    if (this.componentRef.instance[propName] === value) {
      return;
    }
    this.componentRef.instance[propName] = value;
    // this.componentRef.changeDetectorRef.detectChanges();
  }
}
