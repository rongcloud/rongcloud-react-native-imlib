
!!! tip "提示"
    1. 插入的消息只会存储在本地数据库中，不会向外发送。
    2. 插入消息的方法不支持聊天室的会话类型。

```javascript
import {
  insertIncomingMessage,
  insertOutgoingMessage,
  SentStatus,
	ObjectName
} from "rongcloud-react-native-imlib";

const content = { type: "text", content: "Hello" };

// 插入一条发送消息
const message = await insertOutgoingMessage(conversationType, targetId, SentStatus.SENT, content);

// 插入一条接收消息
const message = await insertIncomingMessage(
  conversationType,
  targetId,
  senderId,
  receivedStatus,
  content
);
```
`