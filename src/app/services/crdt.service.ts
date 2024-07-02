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
  yarray?: Y.Array<string>;
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
    // Getting contents of array from doc created.
    this.yarray = this.ydoc.getArray("TodoDoc");
    this.syncArrayWithYArray();
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
    if (this.yarray) {
      this.yarray?.observe((event) => {
        console.log("🚀 ~ CRDTService<T> ~ this.yarray?.observe ~ event:", event)
        this.syncArrayWithYArray();
      });
    }

    this.ydoc.on("update", (update) => {
      Y.applyUpdate(this.ydoc, update);
    });
  }

  // Function for inserting Data into array
  insert<T>(newItem: CustomizableModel<T>) {
    let array = [];
    array.push(Utility.stringify(newItem));
    this.yarray?.insert(this.yarray.length, array);
    this.syncArrayWithYArray();
  }

  delete(index: number) {
    this.yarray?.delete(index, 1);
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
    this.yarray?.delete(0, this.yarray.length);
    // this.syncArrayWithYArray();
  }

  syncArrayWithYArray() {
    if (this.yarray) {
      let tmpArray: CustomizableModel<T>[]=[];
      for (let i = 0; i < (this.yarray ?? []).length; i++) {
        if (this.yarray?.get(i)) {
          tmpArray.push(JSON.parse(this.yarray?.get(i)) as CustomizableModel<T>)
        }
      }
      this.array = tmpArray;
    } else {
      this.array = [];
    }
  }

  updateItem(index: number, model: DomRectModel) {
    this.ydoc.transact(() => {
      if (this.yarray) {
        let deletedItem: CustomizableModel<T> = JSON.parse(this.yarray.get(index));
        deletedItem.domRect = model;
        this.yarray?.delete(index, 1);
        this.insert(deletedItem);
      }
    })
  }

}
