import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, timer } from 'rxjs';
import { catchError, concatAll, delayWhen, retryWhen, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Message } from '../model/customizable.model';

@Injectable({
  providedIn: 'root'
})
export class NewWebSocketService<T> {

  private webSocket$!: WebSocketSubject<Message<T>> | undefined;

  private messagesSubject$ = new BehaviorSubject<Observable<Message<T>>>(EMPTY);

  public messages$ = this.messagesSubject$.pipe(concatAll(), catchError(e => { throw e }));
  connectionStatus = false;

  public getNewWebSocket(): WebSocketSubject<Message<T>> {
    return webSocket({
      url: environment.wsServerUrl,
      binaryType: 'arraybuffer',
      closeObserver: {
        next: () => {
          console.log('[websocket service] connection closed');
          this.webSocket$ = undefined;
          this.connectionStatus = false;
          this.connect({ reconnect: true });
        }
      },
      openObserver: {
        next: () => {
          this.connectionStatus = true;
          console.log('[websocket service] connection opened');
        }
      }
    })
  }

  sendMessage(message: Message<T>): void {
    this.webSocket$?.next(message);
  }

  close() {
    this.webSocket$?.complete();
  }

  public connect(config: { reconnect: boolean } = { reconnect: false }): void {
    if (!this.webSocket$ || this.webSocket$.closed) {
      this.webSocket$ = this.getNewWebSocket();
      const messages = this.webSocket$.pipe(config.reconnect ? this.reconnect : o => o,
        tap({ error: error => console.log(error) }), catchError(() => EMPTY));
      this.messagesSubject$.next(messages);
    }
  }

  private reconnect(observable: Observable<Message<T>>): Observable<Message<T>> {
    return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[websocket service] try to connect', val)),
      delayWhen(() => timer(environment.reconnectInterval)))));
  }
}
