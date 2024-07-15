import { ComponentRef, EnvironmentInjector, inject, Injectable, Type, ViewContainerRef } from "@angular/core";
import { debounce, distinctUntilChanged, interval } from "rxjs";
import { BaseCustomizableComponent } from "../components/base-customizable/base-customizable.component";
import { CustomizableModel, DomRectModel } from "../model/customizable.model";
import { Utility } from "../utility/utility";
import { NewCRDTWSService } from "./new-crdt-ws.service";


@Injectable({ providedIn: 'root' })
export class ComponentLoaderService {
  rootViewContainer?: ViewContainerRef;
  envInjector = inject(EnvironmentInjector);
  components: Map<string, ComponentRef<unknown>> = new Map<string, ComponentRef<unknown>>;
  /**
   *
   */
  constructor(public crdtwsService: NewCRDTWSService<CustomizableModel>) {
  }

  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addDynamicComponent(item: CustomizableModel, key: string) {

    if (this.components.get(key)) {
      this.components.get(key)?.destroy();
      this.components.delete(key);
    }

    if (this.rootViewContainer) {
      const componentref = this.rootViewContainer.createComponent(Utility.componentTypeResolver(item.itemType), {
        environmentInjector: this.envInjector,
      });

      (componentref.instance as BaseCustomizableComponent).itemDropped.subscribe((event: DomRectModel) => {
          this.crdtwsService.updateItem(key, event);
        });
      (componentref.instance as BaseCustomizableComponent).itemResized.pipe(
        debounce(() => interval(100)))
        .subscribe((event: DomRectModel) => {
          this.crdtwsService.updateItem(key, event);
        });
      (componentref.instance as BaseCustomizableComponent).itemRemoved.subscribe(() => {
        if (this.crdtwsService.document) {
          this.components.get(key)?.destroy();
        }
        this.crdtwsService.delete(key);
      });

      Object.entries(item).forEach(([key, value]) => {
        componentref.setInput(key, value);
      });

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
