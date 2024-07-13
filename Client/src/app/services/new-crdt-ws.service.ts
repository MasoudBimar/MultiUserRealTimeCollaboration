import { Injectable } from '@angular/core';
import { DomRectModel } from '../model/customizable.model';
import { NewWebSocketService } from './new-websocket.service';
import { PersistenceService } from './persistence.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class NewCRDTWSService<T extends { id: string, domRect?: DomRectModel }> {
  document = new Map<string, T>();
  offlineUpdates = new Map<string, T>();
  docName = 'DesignDoc';

  constructor(public websocketService: NewWebSocketService<T>, public persistenceService: PersistenceService<T>) {
    this.setupWebsocketConnection();
    this.document = this.persistenceService.loadDoc(this.docName);
    this.open();
  }



  setupWebsocketConnection() {
    this.websocketService.messages$.subscribe( (message: T) => {
      console.log("🚀 ~ NewCRDTWSService<T ~ this.websocketService.messages$.subscribe ~ message:", message);
      this.document.set(message.id, message);
    })
  }

  insert(newItem: T) {
    this.document?.set(newItem.id, newItem);
    this.websocketService.sendMessage(newItem);
    this.persistenceService.persistDoc(this.document,this.docName);

  }


  delete(id: string) {
    this.document?.delete(id);
  }


  clear() {
    this.document = new Map<string, T>();
  }


  updateItem(id: string, model: DomRectModel) {
    const prevItem = this.document.get(id);
    if (prevItem) {
      prevItem.domRect = model;
      this.document.set(id, prevItem);
      this.websocketService.sendMessage(prevItem);
      this.persistenceService.persistDoc(this.document,this.docName);
    }
  }

  close() {
    this.websocketService.close();
  }

  open() {
    // this.websocketService.openConnection();
    this.websocketService.connect();
  }
}
