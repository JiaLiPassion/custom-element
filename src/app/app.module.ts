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
    customElements.define('app-form', CustomElementsWrapper);
  }
}
