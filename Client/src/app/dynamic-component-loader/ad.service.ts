import { Injectable, Type } from '@angular/core';
import { CardComponent } from '../card/card.component';
// import { HeroProfileComponent } from './hero-profile.component';
// import { HeroJobAdComponent } from './hero-job-ad.component';

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
    ] as { component: Type<CardComponent>, inputs: Partial<Record<keyof ComponentInput, unknown>> }[];
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/

export interface ComponentInput {
  direction: "ltr" | "rtl";
  width: string;
  type: 'text' | 'number';
  name: string;
  label: string;
  placeholder: string;
  appearance: 'fill' | 'outline';
  labelPosition: "default" | "start" | "top";
  disabled: boolean;
  value: any;

}
