import { Injectable } from '@angular/core';
import {
  EventService,
  PersistenceService,
  WebSocketService
} from '@app-services';

@Injectable({ providedIn: 'root' })
export class CRDTWSService<T extends { id: string }> {
  document?: Map<string, T>;
  docName: string = '';
  // offlineUpdates = new Map<string, T>();
  isOnline = false;
  constructor(
    public websocketService: WebSocketService<T>,
    public persistenceService: PersistenceService<T>,
    public eventService: EventService
  ) {
    this.websocketService.connectionStatus.subscribe((status: boolean) => {
      this.isOnline = status;
      this.eventService.connectionChanged.emit(status);
    })
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
      const newItem = { ...prevItem, ...model };
      this.document?.set(id, newItem);
      this.websocketService.sendMessage({ type: 'update', payload: newItem });
      if (this.document) {
        this.persistenceService.persistDoc(this.document, this.docName);
      }
    }
  }


  close() {
    this.websocketService.close();

  }

  open() {
    if (!this.isOnline) {
      this.websocketService.connect({reconnect: true});
      // this.websocketService.sendMessage({ type: 'imalive' });
    }
  }

  sendDocument() {
    if (this.document) {
      this.document.forEach((value: T, key: string) => {
        this.websocketService.sendMessage({ type: 'add', payload: value })
      });
    }

  }
}
