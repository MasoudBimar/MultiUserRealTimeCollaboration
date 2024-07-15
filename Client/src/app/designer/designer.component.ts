import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ComponentRef, effect, OnDestroy, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CustomizableModel } from './../model/customizable.model';
import { ComponentLoaderService } from './../services/component-loader.service';
import { NewCRDTWSService } from './../services/new-crdt-ws.service';
import { PersistenceService } from './../services/persistence.service';
import { EventService } from '../services/event.service';
@Component({
  selector: 'app-designer',
  standalone: true,
  imports: [
    MatInputModule,
    CommonModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss'
})
export class DesignerComponent implements OnDestroy, AfterViewInit {
  document = signal(new Map<string, CustomizableModel>());
  docName = 'DesignDoc';
  @ViewChild("componentRef", { read: ViewContainerRef, static: false }) componentRef?: ViewContainerRef;
  constructor(
    public crdtwsService: NewCRDTWSService<CustomizableModel>,
    public dialog: MatDialog,
    public persistenceService: PersistenceService<CustomizableModel>,
    public componentLoaderService: ComponentLoaderService,
    public eventService: EventService
  ) {

    this.loadLocalDoc();
    this.crdtwsService.registerDocument(this.document, this.docName);
    this.eventService.itemAdded.subscribe((item: CustomizableModel) => {
      this.crdtwsService.insert(item);
      this.componentLoaderService.addDynamicComponent(item, item.id);
    })
  }
  ngAfterViewInit(): void {
    if (this.componentRef) {
      this.componentLoaderService.setViewContainerRef(this.componentRef);
    }
    this.document().forEach((item: CustomizableModel, key: string) => {
      this.componentLoaderService.addDynamicComponent(item, key);
    });


  }

  ngOnDestroy() {
    console.log('######');
    // this.webSocketSubscription.unsubscribe();
  }

  clearBorad() {
    // this.crdtwsService.clear();
    // if (this.array.length > 0) {
    //   this.array[1].destroy();
    // }
  }

  // deleteItem(idx: string) {
  //   this.crdtwsService.delete(idx);
  // }

  toggleConnection() {
    if (this.crdtwsService.websocketService.connectionStatus) {
      this.crdtwsService.close();
    }
  }
  loadLocalDoc() {
    const res: Map<string, CustomizableModel> = this.persistenceService.loadDoc(this.docName);
    if (res) {
      this.document.set(res);
    }
  }
}

