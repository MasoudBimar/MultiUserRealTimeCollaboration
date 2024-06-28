import { Injectable } from '@angular/core';
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from 'y-indexeddb';
import { ToDoItem } from '../model/card.model';
import { Utility } from '../utility/utility';

@Injectable({ providedIn: 'root' })
export class CRDTService {
  array: ToDoItem[] = [];
  ydoc = new Y.Doc();
  yarray?: Y.Array<string>;
  websocketProvider?: WebsocketProvider;
  textContent = "Disconnect"

  constructor() {
    // String data in indexdb of browser
    // const indexeddbProvider = new IndexeddbPersistence('TodoDoc', this.ydoc);
    this.setupWebsocketConnection();
    this.loadTodoDoc();
    this.observeChanges();
  }

  loadTodoDoc() {
    // Getting contents of array from doc created.
    this.yarray = this.ydoc.getArray("TodoDoc");
    console.log("🚀 ~ CRDTService ~ loadTodoDoc ~ array:", this.yarray.toArray());
    this.syncArrayWithYArray();
    // this.array = this.yarray.toArray().map((doc: string)=> JSON.parse(doc))
  }

  setupWebsocketConnection() {
    // Creating a websocket connection between users for a particular doc.
    this.websocketProvider = new WebsocketProvider(
      "ws://192.168.0.229:8080", '',
      this.ydoc
    );
  }

  // Function for observing changes in Array
  observeChanges() {
    if (this.yarray) {
      this.yarray?.observe((event) => {
        console.log("🚀 ~ CRDTService ~ this.yarray?.observe ~ event:", event);
        console.log("🚀 ~ CRDTService ~ this.yarray?.observe ~ event:", this.yarray?.toArray());
        this.syncArrayWithYArray();
      });
    }

    this.ydoc.on("update", (update) => {
      // console.log("🚀 ~ CRDTService ~ this.ydoc.on ~ update:", update)
      Y.applyUpdate(this.ydoc, update);
    });
  }

  // Function for inserting Data into array
  insert(newItem: ToDoItem) {
    let array = [];
    array.push(Utility.stringify(newItem));
    // console.log("🚀 ~ @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ~ insert ~ array:", array);
    this.yarray?.insert(this.yarray.length, array);
    this.syncArrayWithYArray();
    // this.loadTodoDoc();
    // this.observeChanges();
  }

  delete(index: number) {
    // let array = [];
    // array.push(Utility.stringify(newItem));
    this.yarray?.delete(index, 1);
    this.syncArrayWithYArray();
  }

  // Function for making connection between users.
  connect() {
    if (this.websocketProvider?.shouldConnect) {
      this.websocketProvider?.disconnect();
      this.textContent = "Connect";
    } else {
      this.websocketProvider?.connect();
      this.textContent = "Disconnect";
      // this.updateArray();
    }
  }

  clear() {
    this.yarray?.delete(0, this.yarray.length);
    this.syncArrayWithYArray();
  }

  syncArrayWithYArray() {
    if (this.yarray) {
      let tmpArray = [];
      for (let i = 0; i < (this.yarray ?? []).length; i++) {
        if (this.yarray?.get(i)) {
          tmpArray.push(JSON.parse(this.yarray?.get(i)) as ToDoItem)
          console.log("🚀 ~ CRDTService ~ loadTodoDoc ~ array:", this.array)
        }
      }
      this.array = tmpArray;
    } else {
      console.log("🚀 ~ deleeeeeeeeeeeeeeeeeeeeeeeete", this.array)
      this.array = [];
    }
  }

  updateItem(index: number, model: ToDoItem) {
    this.ydoc.transact(() => {
      this.yarray?.delete(index, 1);
      this.insert(model);
    })
  }

}
