import { ComponentRef, DestroyRef, EnvironmentInjector, inject, Injectable, ViewContainerRef } from "@angular/core";
import { debounce, interval } from "rxjs";
import { BaseCustomizableComponent } from "../components/base-customizable/base-customizable.component";
import { CustomizableModel, DomRectModel } from "../model/customizable.model";
import { Utility } from "../utility/utility";
import { NewCRDTWSService } from "./new-crdt-ws.service";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from "./event.service";


@Injectable({ providedIn: 'root' })
export class ComponentLoaderService {
  rootViewContainer?: ViewContainerRef;
  envInjector = inject(EnvironmentInjector);
  destroyRef = inject(DestroyRef)
  components: Map<string, ComponentRef<unknown>> = new Map<string, ComponentRef<unknown>>;
  /**
   *
   */
  constructor(public crdtwsService: NewCRDTWSService<CustomizableModel>,public eventService: EventService) {
  }

  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addDynamicComponent(item: CustomizableModel, key: string) {

    if (this.rootViewContainer) {
      let componentref = this.components.get(key)
      if (!componentref) {
        componentref = this.rootViewContainer.createComponent(Utility.componentTypeResolver(item.itemType), {
          environmentInjector: this.envInjector,

        });

        (componentref.instance as BaseCustomizableComponent).itemDropped.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: DomRectModel) => {
          this.crdtwsService.updateItem(key, {domRect: event} );
        });
        (componentref.instance as BaseCustomizableComponent).itemResized.pipe(
          takeUntilDestroyed(this.destroyRef),
          debounce(() => interval(100)))
          .subscribe((event: DomRectModel) => {
            this.crdtwsService.updateItem(key, {domRect: event});
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
