import { Injectable } from '@angular/core';
import { DomRectModel } from '../model/customizable.model';
import { NewWebSocketService } from './new-websocket.service';
import { PersistenceService } from './persistence.service';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class NewCRDTWSService<T extends { id: string, domRect?: DomRectModel }> {
  document?: Map<string, T>;
  docName: string = '';
  offlineUpdates = new Map<string, T>();
  constructor(
    public websocketService: NewWebSocketService<T>,
    public persistenceService: PersistenceService<T>,
    public eventService: EventService
  ) {

  }

  registerDocument(doc: Map<string, T>, docName: string) {
    this.document = doc;
    this.docName = docName;
    this.open();
  }

  insert(newItem: T) {
    this.document?.set(newItem.id, newItem);
    this.websocketService.sendMessage({ type: 'add', payload: newItem });
    if (this.document) {
      this.persistenceService.persistDoc(this.document, this.docName);
    }

  }


  delete(id: string) {
    this.document?.delete(id);
    this.websocketService.sendMessage({ type: 'remove', payload: { id: id, domRect: undefined } as T });
    if (this.document) {
      this.persistenceService.persistDoc(this.document, this.docName);
    }
  }


  clear() {
    this.document?.clear();
  }


  updateItem(id: string, model: DomRectModel) {

    const prevItem = this.document?.get(id);
    if (prevItem) {
      prevItem.domRect = model;
      this.document?.set(id, prevItem);
      this.websocketService.sendMessage({ type: 'update', payload: prevItem });
      if (this.document) {
        this.persistenceService.persistDoc(this.document, this.docName);
      }
    }
  }

  close() {
    this.websocketService.close();
    this.eventService.connectionChanged.emit(false);
  }

  open() {
    // this.websocketService.openConnection();
    if (!this.websocketService.connectionStatus) {
      this.websocketService.connect();
      this.eventService.connectionChanged.emit(true);
    }
  }
}
