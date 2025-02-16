import { useEffect, useState } from "react";
import websocketService from "../store/websocketService";
import { observer } from "mobx-react-lite";
import MessageComponent from "../components/MessageComponent";

const Chat = observer(() => {
  const [message, setMessage] = useState("");

  // Подключаемся к WebSocket при монтировании компонента
  useEffect(() => {
    websocketService.connect();
    return () => {
      websocketService.disconnect();
    };
  }, []);

  // Отправка сообщения
  const handleSendMessage = () => {
    if (message.trim()) {
      websocketService.sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div>
      <div
        style={{
          width: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 350,
            display: "flex",
            flexDirection: "column",
            height: 400,
            overflowY: "auto",
          }}
        >
          {websocketService.messages.map((message, index) => (
            <MessageComponent
              self={message.self}
              text={message.text}
              key={`${message.text} - ${index}`}
            />
          ))}
        </div>
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            style={{
              height: 41,
              width: 250,
              marginRight: 10,
              boxSizing: "border-box",
            }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
});

export default Chat;
