import { Injectable, Type } from '@angular/core';
import { CardComponent } from '../components/card/card.component';
import { ComponentInput } from '../model/customizable.model';

@Injectable({ providedIn: 'root' })
export class AdService {
  getAds() {
    return [
      {
        component: CardComponent,
        inputs: {
          name: 'Dr',
          placeholder: 'Smart as they come'
        },
      },
      {
        component: CardComponent,
        inputs: {
          name: 'Bombasto',
          placeholder: 'Brave as they come'
        },
      },
      {
        component: CardComponent,
        inputs: {
          placeholder: 'Hiring for several positions',
          name: 'Submit',
        },
      },
      {
        component: CardComponent,
        inputs: {
          placeholder: 'Openings in all departments',
          name: 'Apply',
        },
      },
    ] as { component: Type<unknown>, inputs: Partial<Record<keyof ComponentInput, unknown>> }[];
  }
}



