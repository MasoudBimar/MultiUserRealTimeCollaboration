import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { EventService } from '../services/event.service';
import { CustomizableModel, Message } from './../model/customizable.model';
import { ComponentLoaderService } from './../services/component-loader.service';
import { NewCRDTWSService } from './../services/new-crdt-ws.service';
import { PersistenceService } from './../services/persistence.service';
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
  document = new Map<string, CustomizableModel>();
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
    this.crdtwsService.websocketService.messages$.subscribe((message: Message<CustomizableModel>) => {
      console.log("🚀 ~ NewCRDTWSService<T ~ geeeeeeeeettttttt mmmmmmmmmmmessage:", message);
      // this.crdtwsService.insert(item);
      if (message.type === 'add' || message.type === 'update') {
        if (message) {
          this.document.set(message.payload.id, message.payload);
          this.componentLoaderService.addDynamicComponent(message.payload, message.payload.id);
        }
      } else if (message.type === 'remove') {
        if (message) {
          this.document.delete(message.payload.id);
          this.componentLoaderService.deleteDynamicComponent(message.payload, message.payload.id);
        }
      }

    });
    this.eventService.itemAdded.subscribe((item: CustomizableModel) => {
      this.crdtwsService.insert(item);
      this.componentLoaderService.addDynamicComponent(item, item.id);
    })
  }
  ngAfterViewInit(): void {
    if (this.componentRef) {
      this.componentLoaderService.setViewContainerRef(this.componentRef);
    }
    this.document.forEach((item: CustomizableModel, key: string) => {
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
      this.document = new Map<string, CustomizableModel>(res.entries());
    }
  }
}

