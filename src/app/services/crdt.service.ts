import { Injectable } from '@angular/core';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { CustomizableModel, DomRectModel } from '../model/customizable.model';
import { Utility } from '../utility/utility';

@Injectable({ providedIn: 'root' })
export class CRDTService<T> {
  array: CustomizableModel<T>[] = [];
  ydoc = new Y.Doc();
  ymap?: Y.Map<any>;
  websocketProvider?: WebsocketProvider;
  textContent = "Disconnect"

  constructor() {
    this.loadPersisstedLocalData();
    this.setupWebsocketConnection();
    this.loadTodoDoc();
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
    const indexeddbProvider = new IndexeddbPersistence('TodoDoc', this.ydoc);
  }

  /**
    * Load String data from Server
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *
  */
  loadTodoDoc() {
    this.ymap = this.ydoc.getMap("TodoDoc");
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
    this.websocketProvider = new WebsocketProvider("ws://localhost:8080", '', this.ydoc);
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
      this.ymap?.observe((ymapEvent, e2) => {
        console.log("🚀 ~ CRDTService<T> ~ this.ymap?.observe ~ ymapEvent:", ymapEvent, e2.local)
        this.syncArrayWithYArray(ymapEvent)
      });
    }
    // Listen to update events and apply them on remote client
    this.ydoc.on("update", (update) => {
      console.log("🚀 ~ CRDTService<T> ~ this.ydoc.on ~ update:", update)
      Y.applyUpdate(this.ydoc, update);
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
  insert<T>(newItem: CustomizableModel<T>) {
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
    * Function for making connection between users on Websocket
    *
    * @remarks
    * This method is part of the {@link YJs-Websocket}.
    *
    *
  */
  connect() {
    if (this.websocketProvider?.wsconnected) {
      this.websocketProvider?.disconnect();
      this.textContent = "Connect";
    } else {
      this.websocketProvider?.connect();

      this.textContent = "Disconnect";
    }
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
  syncArrayWithYArray(ymapEvent: Y.YMapEvent<any>) {
    ymapEvent.changes.keys.forEach((change, key) => {
      console.log("🚀 ~ CRDTService<T> ~ ymapEvent.changes.keys.forEach ~ change:", change)
      if (change.action === 'add') {
        this.array.push(JSON.parse(this.ymap?.get(key)))
      } else if (change.action === 'update') {
        let item = this.array.find(item => item.id === key);
        if (item) {
          item.domRect = JSON.parse(this.ymap?.get(key)).domRect;
          item.metaData = JSON.parse(this.ymap?.get(key)).metaData;
          item.itemType = JSON.parse(this.ymap?.get(key)).itemType;
        }
      } else if (change.action === 'delete') {
        let itemIndex = this.array.findIndex(item => item.id === key);
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
    let prevItem = JSON.parse(this.ymap?.get(id));
    prevItem.domRect = model;
    this.ymap?.set(id, JSON.stringify(prevItem));

  }
}
