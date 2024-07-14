import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EnvironmentInjector, inject, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { RouterOutlet } from '@angular/router';
import { debounce, distinctUntilChanged, interval, Subject } from 'rxjs';
import { CustomizableDirective } from './directives/customizable.directive';
import { CustomizableModel, DomRectModel } from './model/customizable.model';
import { NewCRDTWSService } from './services/new-crdt-ws.service';
import { SnackBarService } from './services/snackbar.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { Utility } from './utility/utility';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CustomizableDirective,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    ToolbarComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy, AfterViewInit {
  title = 'Multi-User Real-Time Collaboration App Creatingly';
  envInjector = inject(EnvironmentInjector);
  typeResolver = Utility.componentTypeResolver();
  @ViewChild("componentRef", { read: ViewContainerRef }) componentRef!: ViewContainerRef;
  itemResized$: Subject<{ domRect: DomRectModel, id: string }> = new Subject<{ domRect: DomRectModel, id: string }>();
  itemDropped$: Subject<{ domRect: DomRectModel, id: string }> = new Subject<{ domRect: DomRectModel, id: string }>();
  constructor(public crdtwsService: NewCRDTWSService<CustomizableModel>, public dialog: MatDialog, public snackBarService: SnackBarService) {

    this.itemResized$.pipe(distinctUntilChanged(), debounce(() => interval(100)),).subscribe((event: { domRect: DomRectModel, id: string }) => {
      this.crdtwsService.updateItem(event.id, event.domRect);
    });

    this.itemDropped$.subscribe((event: { domRect: DomRectModel, id: string }) => {
      this.crdtwsService.updateItem(event.id, event.domRect);
    });


  }
  ngAfterViewInit(): void {
    this.crdtwsService.document.forEach((item: CustomizableModel, key: string) => {
      console.log("🚀 ~ AppComponent ~ this.crdtwsService.document.forEach ~ item:", item)
      const comp = this.componentRef.createComponent(this.typeResolver(item.itemType), {
        environmentInjector: this.envInjector,
      });

      Object.entries(item.componentInputs).forEach(([key, value]) => {
        console.log("🚀 ~ AppComponent ~ Object.entries ~ key:", key, value)
        comp.setInput(key, value);
      });
    });

  }

  ngOnDestroy() {
    console.log('######');
    // this.webSocketSubscription.unsubscribe();
  }

  clearBorad() {
    this.crdtwsService.clear();
  }

  deleteItem(idx: string) {
    this.crdtwsService.delete(idx);
  }

  toggleConnection(){
    if (this.crdtwsService.websocketService.connectionStatus) {
      this.crdtwsService.close();
    }
  }


}
