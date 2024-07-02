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
  ymap?:  Y.Map<any>;
  websocketProvider?: WebsocketProvider;
  textContent = "Disconnect"

  constructor() {
    // String data in indexdb of browser
    const indexeddbProvider = new IndexeddbPersistence('TodoDoc', this.ydoc);
    this.setupWebsocketConnection();
    this.loadTodoDoc();
    this.observeChanges();
  }

  loadTodoDoc() {
    this.ymap = this.ydoc.getMap("TodoDoc");
    // this.syncArrayWithYArray();
  }

  setupWebsocketConnection() {
    // Creating a websocket connection between users for a particular doc.
    this.websocketProvider = new WebsocketProvider(
      "ws://localhost:8080", '',
      this.ydoc
    );
  }

  // Function for observing changes in Array
  observeChanges() {
    if (this.ymap) {
      this.ymap?.observe((event) => {
        this.syncArrayWithYArray();
      });
    }

    this.ydoc.on("update", (update) => {
      Y.applyUpdate(this.ydoc, update);
    });
  }

  // Function for inserting Data into array
  insert<T>(newItem: CustomizableModel<T>) {
    this.ymap?.set(newItem.id, Utility.stringify(newItem));
    console.log(this.ymap?.toJSON())
    this.syncArrayWithYArray();
  }

  delete(index: string) {
    this.ymap?.delete(index);
    // this.syncArrayWithYArray();
  }

  // Function for making connection between users.
  connect() {
    if (this.websocketProvider?.shouldConnect) {
      this.websocketProvider?.disconnect();
      this.textContent = "Connect";
    } else {
      this.websocketProvider?.connect();
      this.textContent = "Disconnect";
    }
  }

  clear() {
    this.ymap?.clear();
    // this.syncArrayWithYArray();
  }

  syncArrayWithYArray() {
    if (this.ymap) {
      let tmpArray: CustomizableModel<T>[]=[];
      let jsn = this.ymap?.toJSON();
      if (jsn) {
        this.array =Object.values(jsn).map(x => JSON.parse(x));
      }
    } else {
      this.array = [];
    }
  }

  updateItem(id: string, model: DomRectModel) {
    let prevItem = JSON.parse(this.ymap?.get(id));
    prevItem.domRect = model;
    this.ymap?.set(id, JSON.stringify(prevItem));

  }
}
