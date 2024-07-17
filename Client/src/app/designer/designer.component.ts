import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { BaseCustomizableComponent } from '../components/base-customizable/base-customizable.component';
import { ButtonComponent } from '../components/button/button.component';
import { EventService } from '../services/event.service';
import { SnackBarService } from '../services/snackbar.service';
import { UpdateElementFormComponent } from '../update-element-form/update-element-form.component';
import { CustomizableModel, DomRectModel, Message } from './../model/customizable.model';
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
    FormsModule,
    ButtonComponent,
    BaseCustomizableComponent
  ],
  templateUrl: './designer.component.html',
  styleUrl: './designer.component.scss'
})
export class DesignerComponent implements OnDestroy, AfterViewInit {
  document = new Map<string, CustomizableModel>();
  docName = 'DesignDoc';
  webSocketSubscription: Subscription[] = [];
  @ViewChild("componentRef", { read: ViewContainerRef }) componentRef?: ViewContainerRef;
  constructor(
    public crdtwsService: NewCRDTWSService<CustomizableModel>,
    public dialog: MatDialog,
    public persistenceService: PersistenceService<CustomizableModel>,
    public componentLoaderService: ComponentLoaderService,
    public eventService: EventService,
    public snackBarService: SnackBarService
  ) {

    this.loadLocalDoc();
    this.crdtwsService.registerDocument(this.document, this.docName);
    this.crdtwsService.websocketService.messages$.subscribe((message: Message<CustomizableModel>) => {
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

    this.eventService.openSetting.subscribe((key: string) => {
      this.customizeElement(key);
    });
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
    this.webSocketSubscription.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

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

  allowDrop(ev: any) {
    ev.preventDefault();
  }

  drop(ev: any) {
    ev.preventDefault();
    if (ev.dataTransfer.getData("Text")) {
      const newItem = new CustomizableModel();
      newItem.domRect = new DomRectModel(ev.offsetX, ev.offsetY, 300, 100)
      newItem.itemType = ev.dataTransfer.getData("Text");
      this.crdtwsService.insert(newItem);
      this.componentLoaderService.addDynamicComponent(newItem, newItem.id);
    }

  }

  customizeElement(key: string) {
    const dialogRef = this.dialog.open(UpdateElementFormComponent, {
      data: this.document.get(key),
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        const item = this.document.get(key);
        if (item) {
          item.type = response.type;
          item.name = response.name;
          item.label = response.label;
          item.placeholder = response.placeholder;
          item.itemType = response.itemType;
          this.crdtwsService.updateItem(key,response);
          this.componentLoaderService.addDynamicComponent(item, item.id);
        }
        this.snackBarService.openSuccess('Item Updated', 'Ok');
      } else {
        this.snackBarService.openError('Operation Failed', 'Ok');
      }
    });
  }
}

