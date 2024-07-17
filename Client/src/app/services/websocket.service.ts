import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, concatAll, retry, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { Message } from '../model/customizable.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService<T> {

  private webSocket$?: WebSocketSubject<Message<T>> ;

  private messagesSubject$ = new BehaviorSubject<Observable<Message<T>>>(EMPTY);

  public messages$ = this.messagesSubject$.pipe(concatAll(), catchError(e => { throw e }));
  public connectionStatus = new BehaviorSubject<boolean>(false);

  public getNewWebSocket(): WebSocketSubject<Message<T>> {
    return webSocket({
      url: environment.wsServerUrl,
      closeObserver: {
        next: () => {
          console.log('[websocket service] connection closed');
          this.connectionStatus.next(false);
        }
      },
      openObserver: {
        next: () => {
          this.connectionStatus.next(true);
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
        tap({ error: error => console.log(error) }), catchError(() => EMPTY)
      );
      this.messagesSubject$.next(messages);
    }
  }

  private reconnect(observable: Observable<Message<T>>): Observable<Message<T>> {
    return observable.pipe(
      retry({ count: 10, delay: environment.reconnectInterval }),
      tap({ error: error => console.log('[websocket service] try to connect', error) })
    );
  }
}
