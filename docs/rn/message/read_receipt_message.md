
### 单聊消息阅读回执

您可以在用户查看了单聊会话中的未读消息之后，向会话中发送已读回执，会话中的用户可以根据此回执，在 UI 中更新消息的显示。
其中，timestamp 为会话中用户已经阅读的最后一条消息的发送时间戳（Message 的 sentTime 属性），代表用户已经阅读了该会话中此消息之前的所有消息。

```javascript
import { sendReadReceiptMessage } from "rongcloud-react-native-imlib";

sendReadReceiptMessage(conversationType, targetId, timestamp);
```

在接收端，您可以添加阅读回执消息监听函数。

```javascript
import { addReadReceiptReceivedListener } from "rongcloud-react-native-imlib";

addReadReceiptReceivedListener(message => console.log(message));
```

### 组群消息阅读回执

群组消息请求回执，对于需要阅读之后收到阅读回执的消息，可以调用这个接口来发送阅读回执请求。

```javascript
import { sendReadReceiptRequest, addReceiptRequestListener } from "rongcloud-react-native-imlib";

// 发送阅读回执请求
sendReadReceiptRequest(messageId);

// 收到消息已读回执请求的回调函数（收到此请求后，如果用户阅读了对应的消息，需要调用 sendMessageReadReceiptResponse 接口发送已读响应）
addReceiptRequestListener(message => console.log(message));
```

已读响应，当收到阅读回执请求之后，如果用户阅读了对应的消息，可以调用此接口来发送消息阅读回执响应。

```javascript
import { sendReadReceiptResponse, addReceiptResponseListener } from "rongcloud-react-native-imlib";

// 发送阅读回执
sendReadReceiptResponse(conversationType, targetId, messageList);

// 消息已读回执响应
addReceiptResponseListener(message => console.log(message));
```

### 多端阅读消息数同步

多端登录时，通知其它终端同步某个会话的阅读状态，请调用下面接口：

```javascript
import { syncConversationReadStatus } from "rongcloud-react-native-imlib";

// 其中 timestamp 为该会话中已读的最后一条消息的发送时间戳
syncConversationReadStatus(conversationType, targetId, timestamp);
```
