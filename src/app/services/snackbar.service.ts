import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(message: string, action: string = '', panelCalss: string = ''): void {
    this._snackBar.open(message, action, { duration: 3000, panelClass: panelCalss },);
  }

  openPrimary(message: string, action: string = '', duration: number = 3000, panelCalss: string = ''): void {
    this._snackBar.open(message, action, { duration: duration, panelClass: 'primary-snackbar' + panelCalss });
  }

  openGray(message: string, action: string = '', duration: number = 3000, panelCalss: string = ''): void {
    this._snackBar.open(message, action, { duration: duration, panelClass: 'gray-snackbar' + panelCalss });
  }

  openSuccess(message: string, action: string = '', duration: number = 3000, panelCalss: string = ''): void {
    this._snackBar.open(message, action, { duration: duration, panelClass: 'success-snackbar' + panelCalss });
  }

  openWarning(message: string, action: string = '', duration: number = 3000, panelCalss: string = ''): void {
    this._snackBar.open(message, action, { duration: duration, panelClass: 'warning-snackbar' + panelCalss });
  }
  openError(message: string, action: string = '', duration: number = 3000, panelCalss: string = ''): void {
    this._snackBar.open(message, action, { duration: duration, panelClass: 'error-snackbar' + panelCalss });
  }
}
