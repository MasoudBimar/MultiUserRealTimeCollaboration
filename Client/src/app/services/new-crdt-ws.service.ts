import { Injectable } from '@angular/core';
import { EventService } from './event.service';
import { NewWebSocketService } from './new-websocket.service';
import { PersistenceService } from './persistence.service';

@Injectable({ providedIn: 'root' })
export class NewCRDTWSService<T extends { id: string }> {
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
    this.websocketService.sendMessage({ type: 'remove', payload: { id: id } as T });
    if (this.document) {
      this.persistenceService.persistDoc(this.document, this.docName);
    }
  }


  clear() {
    this.document?.clear();
  }


  updateItem(id: string, model: Partial<T>) {
    const prevItem = this.document?.get(id);
    if (prevItem) {
      const newItem = {...prevItem, ...model};
      this.document?.set(id, newItem);
      this.websocketService.sendMessage({ type: 'update', payload: newItem });
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
    if (!this.websocketService.connectionStatus) {
      this.websocketService.connect();
      this.eventService.connectionChanged.emit(true);
    }
  }
}
