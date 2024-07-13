import { Injectable } from '@angular/core';
import { IndexeddbPersistence } from 'y-indexeddb';
import * as Y from "yjs";
import { CustomizableModel, DomRectModel } from '../model/customizable.model';
import { Utility } from '../utility/utility';
import { WebSocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class CRDTWSService<T extends { id: string, domRect?: DomRectModel }> {
  array: T[] = [];
  ydoc = new Y.Doc();
  ymap?: Y.Map<string>;
  offlineUpdates: Uint8Array[] = [];
  textContent = "Disconnect";
  indexeddbProvider?: IndexeddbPersistence;

  constructor(public websocketService: WebSocketService<Uint8Array>) {
    this.loadPersisstedLocalData();
    this.setupWebsocketConnection();
    this.loadDoc();
    this.observeChanges();
  }

  /**
    * Load String data in indexdb of browser
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *
  */
  loadPersisstedLocalData() {
    this.indexeddbProvider = new IndexeddbPersistence('DesignDoc', this.ydoc);
  }

  /**
    * Load String data from Server
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *
  */
  loadDoc() {
    this.ymap = this.ydoc.getMap("DesignDoc");
  }

  /**
    * Creating a websocket connection between users for a particular YDoc
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *
  */
  setupWebsocketConnection() {
    this.websocketService.getMessages().subscribe((message: Uint8Array) => {
      Utility.decompressArrayBuffer(message).then(value => {
        Y.applyUpdate(this.ydoc, new Uint8Array(value));
      })
    })
  }

  /**
    * Function for observing changes in YDoc Data Structure
    * Listen to update events and apply them on remote client
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *
  */
  observeChanges() {
    if (this.ymap) {
      this.ymap?.observe((ymapEvent: Y.YMapEvent<string>) => {
        this.syncArrayWithYArray(ymapEvent);
      });
    }

    // Listen to update events and apply them on remote client
    this.ydoc.on("update", (update) => {
      Utility.compressArrayBuffer(update).then(value => {
        this.websocketService.sendMessage(value);
      })
    });
  }

  /**
    * Function for inserting new Data into ymap
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *
  */
  insert(newItem: CustomizableModel) {
    this.ymap?.set(newItem.id, Utility.stringify(newItem));

  }

  /**
    * Function for deleting existing item from ymap
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *
  */
  delete(id: string) {
    this.ymap?.delete(id);
  }

  /**
    * Function for clearing all items in ymap
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *
  */
  clear() {
    this.ymap?.clear();
  }

  /**
    * Function for receiving any change from ymap observable and update the Array
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *  @param ymapEvent - Y.YMapEvent<any> change event
    *
  */
  syncArrayWithYArray(ymapEvent: Y.YMapEvent<string>) {
    ymapEvent.changes.keys.forEach((change, key: string) => {
      if (change.action === 'add') {
        this.array.push(this.getItemFromyMap(key))
      } else if (change.action === 'update') {
        const item = this.array.find(item => item.id === key);
        if (item) {
          item.domRect = this.getItemFromyMap(key).domRect;
        }
      } else if (change.action === 'delete') {
        const itemIndex = this.array.findIndex(item => item.id === key);
        if (itemIndex > -1) {
          this.array.splice(itemIndex, 1)
        }
      }
    })
  }

  /**
    * Function for updating ymap based on modified item
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    * @param id    - uuid of updated element
    * @param model - new DOMRect
    *
  */
  updateItem(id: string, model: DomRectModel) {
    const prevItem = this.getItemFromyMap(id);
    prevItem.domRect = model;
    this.ymap?.set(id, JSON.stringify(prevItem));
  }

  getItemFromyMap(key: string): T {
    const item: string | undefined = this.ymap?.get(key);
    if (item) {
      return JSON.parse(item) as T;
    } else {
      throw new Error("Item Not Found");
    }
  }

  close(){
    this.websocketService.closeConnection();
  }

  open(){
    // this.websocketService.openConnection();
    this.setupWebsocketConnection();
  }
}
