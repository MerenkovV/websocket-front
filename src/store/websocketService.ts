import { makeAutoObservable } from "mobx";
import { Message } from "../common/interfaces/Message";

class WebSocketService {
  private socket: WebSocket | null = null;
  public messages: Message[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Инициализация WebSocket-соединения
  public connect() {
    this.socket = new WebSocket("ws://localhost:3001");

    this.socket.onerror = (ev) => {
      console.log("ws error", ev);
    };

    this.socket.onopen = () => {
      console.log("WebSocket connected");
    };

    this.socket.onmessage = (event) => {
      try {
        if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const text = reader.result;

            if (typeof text === "string") {
              this.addMessage({
                self: false,
                text,
              });
            }
          };
          reader.readAsText(event.data);
        } else {
          this.addMessage({
            self: false,
            text: event.data,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  }

  // Отправка сообщения на сервер
  public sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      this.messages.push({ self: true, text: message });
    }
  }

  // Добавление сообщения в список
  private addMessage(message: Message) {
    this.messages.push(message);
  }

  // Закрытие соединения
  public disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
