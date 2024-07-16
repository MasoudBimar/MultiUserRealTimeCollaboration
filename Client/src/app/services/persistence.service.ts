import { Injectable } from '@angular/core';
import { Utility } from '../utility/utility';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService<T> {

  persistDoc(document: Map<string, T>, docName: string) {
    window.localStorage.setItem(docName, JSON.stringify(Array.from(document.entries())));
  }

  persistDoc2(document: Map<string, T>, docName: string) {
    const obj: Record<string, T> = {};
    document.forEach((value: T, key: string) => {
      obj[key] = value;
    });
    localStorage.setItem(docName, Utility.stringify(document));
  }

  loadDoc(docName: string): Map<string, T> {
    const doc = localStorage.getItem(docName);
    if (doc) {
      return new Map(JSON.parse(doc));
    } else{
      return new Map<string,  T>();
    }
  }

  loadDoc2(docName: string) {
    const data = localStorage.getItem(docName);
    return data ? JSON.parse(data) as Map<string, T> : [];
  }
}
