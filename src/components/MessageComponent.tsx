import { observer } from "mobx-react-lite";
import { Message } from "../common/interfaces/Message";

const MessageComponent = observer((props: Message) => {
  const { self, text } = props;

  const getCurrentStyle = () =>
    self
      ? { backgroundColor: "#566aa4", marginLeft: "auto" }
      : { backgroundColor: "#56a46e" };

  return (
    <div
      style={{
        maxWidth: 250,
        borderRadius: 8,
        padding: "4px 6px",
        width: "fit-content",
        marginBottom: 4,
        ...getCurrentStyle(),
      }}
    >
      {text}
    </div>
  );
});

export default MessageComponent;
