import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WebSocketService<T> {
  webSocket$: WebSocketSubject<T>;
  /** Observers the open event on the websocket. */
  open = new Subject();
  /** Observes the close event on the websocket. */
  close = new Subject();
  isConnected = false;

  constructor() {
    this.webSocket$ = this.initializeWebSocket(environment.wsServerUrl);
  }

  private initializeWebSocket(url: string): WebSocketSubject<T> {
    const newWebSocket = webSocket<T>({
      url: url,
      openObserver: this.open,
      closeObserver: this.close,
      binaryType: 'arraybuffer',
      deserializer: (val: MessageEvent<T>) => {
        return  val.data as T;
      },
      serializer:(val: T) => {
        return (val as Uint8Array).buffer;
      }
    });
    this.close.pipe(tap(() => this.isConnected = false));
    this.open.pipe(tap(() => this.isConnected = true));
    return newWebSocket;
  }

  public getMessages(): Observable<T> {
    return this.webSocket$.asObservable()
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  private handleError(error: Error): Observable<never> {
    // Notify user, attempt reconnection, etc.
    return throwError(() => error);
  }

  public sendMessage(message: T): void {
    this.webSocket$.next(message);
  }

  closeConnection() {
    this.webSocket$.complete();
  }

  openConnection() {
    this.webSocket$ = this.initializeWebSocket(environment.wsServerUrl);
  }
}
