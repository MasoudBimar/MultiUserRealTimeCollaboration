import { ComponentRef, createComponent, DestroyRef, EnvironmentInjector, inject, Injectable, Injector, ViewContainerRef } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseCustomizableComponent } from "@app-components";
import {
  CRDTWSService,
  EventService
} from "@app-services";
import { debounce, interval } from "rxjs";
import { CustomizableModel, DomRectModel } from "../model/customizable.model";
import { Utility } from "../utility/utility";


@Injectable({ providedIn: 'root' })
export class ComponentLoader2Service {
  rootViewContainer?: ViewContainerRef;
  envInjector = inject(EnvironmentInjector);
  destroyRef = inject(DestroyRef);
  injector = inject(Injector);
  components: Map<string, ComponentRef<unknown>> = new Map<string, ComponentRef<unknown>>;
  /**
   *
   */
  constructor(public crdtwsService: CRDTWSService<CustomizableModel>, public eventService: EventService) {
  }

  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addDynamicComponent(item: CustomizableModel, key: string) {

    if (this.rootViewContainer) {
      let componentref = this.components.get(key)
      if (!componentref) {
        const hostElement = document.createElement(Utility.elementTypeResolver(item.itemType));
        componentref = createComponent(BaseCustomizableComponent, { hostElement, environmentInjector: this.envInjector, elementInjector: this.injector });

        (componentref.instance as BaseCustomizableComponent).itemDropped.pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe((event: DomRectModel) => {
          this.crdtwsService.updateItem(key, { domRect: event });
        });
        (componentref.instance as BaseCustomizableComponent).itemResized.pipe(
          takeUntilDestroyed(this.destroyRef),
          debounce(() => interval(100)))
          .subscribe((event: DomRectModel) => {
            this.crdtwsService.updateItem(key, { domRect: event });
          });
        (componentref.instance as BaseCustomizableComponent).itemRemoved.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          if (this.crdtwsService.document) {
            this.components.get(key)?.destroy();
          }
          this.crdtwsService.delete(key);
        });

        (componentref.instance as BaseCustomizableComponent).itemSetting.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.eventService.openSetting.emit(key);
        });
      }
      Object.entries(item).forEach(([key, value]) => {
        componentref.setInput(key, value);
      });

      this.rootViewContainer.insert(componentref.hostView);
      componentref.changeDetectorRef.detectChanges();
      this.components.set(key, componentref);
    }
  }
  deleteDynamicComponent(item: CustomizableModel, key: string) {
    if (this.components.get(key)) {
      this.components.get(key)?.destroy();
      this.components.delete(key);
    }
  }
}
