import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  mode = new FormControl('side' as MatDrawerMode);
  connestionStatus: boolean = false;
  /**
   *
   */
  constructor(public eventService: EventService, public dialog: MatDialog) {
    this.eventService.connectionChanged.subscribe((status: boolean) => {
      this.connestionStatus = status;
    });

  }

  drag(event: DragEvent, data: string) {
    event?.dataTransfer?.setData("Text", data);
  }
}
