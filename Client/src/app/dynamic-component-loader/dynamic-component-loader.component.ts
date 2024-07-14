import { AsyncPipe, CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, inject, ViewContainerRef } from '@angular/core';
import { AdService } from './ad.service';

@Component({
  selector: 'app-dynamic-component-loader',
  standalone: true,
  imports: [NgComponentOutlet, AsyncPipe, CommonModule],
  templateUrl: './dynamic-component-loader.component.html',
  styleUrl: './dynamic-component-loader.component.scss'
})
export class DynamicComponentLoaderComponent {
  private adList = inject(AdService).getAds();
  vcr = inject(ViewContainerRef);


  private currentAdIndex = 0;

  get currentAd() {
    return this.adList[this.currentAdIndex];
  }

  displayNextAd() {
    this.currentAdIndex++;
    // Reset the current ad index back to `0` when we reach the end of an array.
    if (this.currentAdIndex === this.adList.length) {
      this.currentAdIndex = 0;
    }
  }
}
