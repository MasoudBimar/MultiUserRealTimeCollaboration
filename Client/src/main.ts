import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { DynamicComponentLoaderComponent } from './app/dynamic-component-loader/dynamic-component-loader.component';
import { TestComponent } from './app/test/test.component';

bootstrapApplication(DynamicComponentLoaderComponent, appConfig)
  .catch((err) => console.error(err));
