import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, ComponentFactoryResolver } from '@angular/core';

import { AppFormComponent } from './app-form/app-form.component';
import { AngularCustomElementsBridge } from './app-form/angular-elements-bridge';
import { CustomElementsWrapper } from './app-form/custom-elements-wrapper';

@NgModule({
  declarations: [AppFormComponent],
  imports: [BrowserModule],
  entryComponents: [AppFormComponent],
  providers: [],
  bootstrap: []
})
export class AppModule {
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const factory = this.injector
      .get(ComponentFactoryResolver)
      .resolveComponentFactory(AppFormComponent);
    const bridge = new AngularCustomElementsBridge(this.injector, AppFormComponent, factory);
    bridge.prepare();
    CustomElementsWrapper.bridge = bridge;
    factory.inputs
      .map(({ propName }) => propName)
      .forEach(property => {
        Object.defineProperty(CustomElementsWrapper.prototype, property, {
          get: function() {
            return bridge.getInput(property);
          },
          set: function(newValue: any) {
            bridge.setInput(property, newValue);
          },
          configurable: true,
          enumerable: true
        });
      });
    customElements.define('app-form', CustomElementsWrapper);
  }
}
