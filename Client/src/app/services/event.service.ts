import { EventEmitter, Injectable } from '@angular/core';
import { CustomizableModel } from '../model/customizable.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  itemAdded: EventEmitter<CustomizableModel> = new EventEmitter<CustomizableModel>();
  itemUpdated: EventEmitter<CustomizableModel> = new EventEmitter<CustomizableModel>();
  itemRemoved: EventEmitter<CustomizableModel> = new EventEmitter<CustomizableModel>();
  resetDesigner: EventEmitter<void> = new EventEmitter<void>();
  connectionChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  openSetting: EventEmitter<string> = new EventEmitter<string>();
  goLive: EventEmitter<void> = new EventEmitter<void>();
}
