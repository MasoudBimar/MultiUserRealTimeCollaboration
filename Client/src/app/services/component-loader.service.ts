import { ComponentRef, EnvironmentInjector, inject, Injectable, Type, ViewContainerRef } from "@angular/core";
import { debounce, distinctUntilChanged, interval } from "rxjs";
import { BaseCustomizableComponent } from "../components/base-customizable/base-customizable.component";
import { CustomizableModel, DomRectModel } from "../model/customizable.model";
import { Utility } from "../utility/utility";
import { NewCRDTWSService } from "./new-crdt-ws.service";


@Injectable({ providedIn: 'root' })
export class ComponentLoaderService {
  rootViewContainer?: ViewContainerRef;
  typeResolver: (type: string) => Type<unknown>;
  envInjector = inject(EnvironmentInjector);
  components: Map<string, ComponentRef<unknown>> = new Map<string, ComponentRef<unknown>>;
  /**
   *
   */
  constructor(public crdtwsService: NewCRDTWSService<CustomizableModel>) {
    this.typeResolver = Utility.componentTypeResolver();
  }

  setViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addDynamicComponent(item: CustomizableModel, key: string) {
    if (this.rootViewContainer) {
      const componentref = this.rootViewContainer.createComponent(this.typeResolver(item.itemType), {
        environmentInjector: this.envInjector,
      });

      (componentref.instance as BaseCustomizableComponent).itemDropped.pipe(
        distinctUntilChanged(),
        debounce(() => interval(100)))
        .subscribe((event: DomRectModel) => {
          this.crdtwsService.updateItem(key, event);
        });
      (componentref.instance as BaseCustomizableComponent).itemResized.pipe(
        distinctUntilChanged(),
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

      Object.entries(item.componentInputs).forEach(([key, value]) => {
        componentref.setInput(key, value);
      });

      this.components.set(key, componentref);
    }
  }
}
