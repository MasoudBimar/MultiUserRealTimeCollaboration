import { Injectable, WritableSignal } from '@angular/core';
import { DomRectModel } from '../model/customizable.model';
import { NewWebSocketService } from './new-websocket.service';
import { PersistenceService } from './persistence.service';
import { EventService } from './event.service';

@Injectable({ providedIn: 'root' })
export class NewCRDTWSService<T extends { id: string, domRect?: DomRectModel }> {
  document?: WritableSignal<Map<string, T>>;
  docName: string = '';
  offlineUpdates = new Map<string, T>();
  constructor(
    public websocketService: NewWebSocketService<T>,
    public persistenceService: PersistenceService<T>,
    public eventService: EventService
  ) {

  }

  registerDocument(doc:  WritableSignal<Map<string, T>>, docName: string){
    this.document = doc;
    this.docName = docName;
    this.websocketService.messages$.subscribe((message: T) => {
      console.log("🚀 ~ NewCRDTWSService<T ~ geeeeeeeeettttttt mmmmmmmmmmmessage:", message)
      this.document?.update(docInstance => {
        docInstance.set(message.id, message);
        return new Map(docInstance.entries());
      });
    });
    this.open();
  }

  insert(newItem: T) {
    this.document?.update(map => {
      map.set(newItem.id, newItem);
      return new Map(map.entries());
    });
    this.websocketService.sendMessage(newItem);
    if (this.document) {
      this.persistenceService.persistDoc(this.document(), this.docName);
    }

  }


  delete(id: string) {
    this.document?.update(map => {
      map.delete(id);
      return map;
    });
    if (this.document) {
      this.persistenceService.persistDoc(this.document(), this.docName);
    }
  }


  clear() {
    this.document?.set(new Map<string, T>());
  }


  updateItem(id: string, model: DomRectModel) {

    this.document?.update(map => {
      const prevItem = map.get(id);
      if (prevItem) {
        prevItem.domRect = model;
        map.set(id, prevItem);
        this.websocketService.sendMessage(prevItem);
        if (this.document) {
          this.persistenceService.persistDoc(this.document(), this.docName);
        }
      }
      return map;
    })

    // const prevItem = this.document().get(id);
    // if (prevItem) {
    //   prevItem.domRect = model;
    //   this.document.set(id, prevItem);
    //   this.websocketService.sendMessage(prevItem);
    //   this.persistenceService.persistDoc(this.document(), this.docName);
    // }
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
