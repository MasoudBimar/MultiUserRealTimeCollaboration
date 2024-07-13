import { Injectable, Type } from '@angular/core';
// import { HeroProfileComponent } from './hero-profile.component';
// import { HeroJobAdComponent } from './hero-job-ad.component';

@Injectable({ providedIn: 'root' })
export class AdService {
  getAds() {
    return [
      {
        component: HTMLInputElement,
        inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
      },
      {
        component: HTMLButtonElement,
        inputs: { name: 'Bombasto', bio: 'Brave as they come' },
      },
      {
        component: HTMLTextAreaElement,
        inputs: {
          headline: 'Hiring for several positions',
          body: 'Submit your resume today!',
        },
      },
      {
        component: HTMLLabelElement,
        inputs: {
          headline: 'Openings in all departments',
          body: 'Apply today',
        },
      },
    ] as {component: Type<any>, inputs: Record<string, unknown>}[];
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/