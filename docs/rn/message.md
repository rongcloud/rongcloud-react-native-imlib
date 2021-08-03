
### 发送消息

融云支持向单聊、群组及聊天室中发送文字消息、图片消息、语音消息、文件消息、富文本消息、地理位置消息以及自定义消息。

#### 发送文本消息

```javascript
import { sendMessage, ConversationType } from "rongcloud-react-native-imlib";

const conversationType = ConversationType.PRIVATE;
const targetId = "userId"; // 根据会话类型的不同，可以是用户 ID、讨论组 ID、组群 ID 等
const content = { type: "text", content: "Hello" };
const callback = {
  success(messageId) {
    console.log("发送成功：" + messageId);
  },
  error(errorCode) {
    console.log("发送失败：" + errorCode);
  }
};

sendMessage({ conversationType, targetId, content }, callback);
```

#### 发送图片信息

```javascript
import { sendMediaMessage, cancelSendMediaMessage } from "rongcloud-react-native-imlib";

const content = { type: "image", local: "file:///image_path" };
const callback = {
  success(messageId) {
    console.log("发送成功：" + messageId);
  },
  progress(progress, messageId) {
    console.log(`发送进度: ${progress} %`);

    // 消息发送过程中可随时取消发送
    cancelSendMediaMessage(messageId);
  },
  cancel() {
    console.log("发送取消");
  },
  error(errorCode) {
    console.log("发送失败：" + errorCode);
  }
};

sendMediaMessage({ conversationType, targetId, content }, callback);
```

#### 发送文件

```javascript
import { sendMediaMessage } from "rongcloud-react-native-imlib";

const content = { type: "file", local: "file:///image_path" };
sendMediaMessage({ conversationType, targetId, content }, callback);
```

#### 发送位置信息

```javascript
import { sendMessage } from "rongcloud-react-native-imlib";

const content = {
  type: "location",
  latitude: 34,
  longitude: 108,
  name: "海龙大厦",
  thumbnail: "http://example.com/thum.jpg"
};

sendMessage({ conversationType, targetId, content }, callback);
```

#### 发送语音信息

融云 React Native SDK 不提供语音录制、转码功能，开发者需要自已实现语音消息录制、转码，通过融云内置的语音消息进行发送。

```javascript
import { sendMessage } from "rongcloud-react-native-imlib";

const content = {
  type: "voice",
  data: "audio raw data", // iOS 使用二进制数据的方式发送
  local: "audio path", // Android 使用文件方式发送
  duration: 9 // 语音持续时间，单位：秒
};

sendMessage({ conversationType, targetId, content }, callback);
```

### 消息监听

通过添加消息监听器，可以监听到所有接收的消息。

```javascript
import { addReceiveMessageListener } from "rongcloud-react-native-imlib";

const listener = addReceiveMessageListener(message => {
  console.log(message);
});
```

### 获取本地消息历史

```javascript
import { getHistoryMessages } from "rongcloud-react-native-imlib";

// 获取指定会话消息，默认获取最新 10 条
const messages = await getHistoryMessages(conversationType, targetId);

// 获取会话中从某条消息开始的指定个数的消息
const messages = await getHistoryMessages(conversationType, targetId, "", messageId, 20);

// 获取会话中从某条消息往前的指定个数的文本消息
const messages = await getHistoryMessages(
  conversationType,
  targetId,
  "RC:TxtMsg",
  messageId,
  20,
  false
);

// 获取会话中从某个时间戳开始的消息
const messages = await getHistoryMessages(conversationType, targetId, [], timestamp);

// 获取会话中从某个时间戳往前的指定类型、指定个数的消息
const messages = await getHistoryMessages(
  conversationType,
  targetId,
  ["RC:TxtMsg", "RC:ImgMsg"],
  timestamp,
  20,
  false
);
```

### 获取服务端历史消息

提供单聊、群聊、客服的历史消息获取，您每次可以从服务器获取之前 20 条以内的消息历史记录，最多获取前 6 个月的历史消息。

该功能需要在开发者后台“应用/IM 服务/高级功能设置”中开通 IM 商用版后，开启`单群聊消息云存储`功能才能使用，开发环境下可免费使用。

[查看收费详情](http://www.rongcloud.cn/pricing#pay)

```javascript
import { getRemoteHistoryMessages } from "rongcloud-react-native-imlib";

// 获取指定会话从某个时间戳开始的 n 条消息
const messages = await getRemoteHistoryMessages(conversationType, targetId, timestamp, 20);
```

### 清除历史消息

```javascript
import { cleanHistoryMessages } from "rongcloud-react-native-imlib";

cleanHistoryMessages(conversationType, targetId, timestamp, isCleanRemote);
```

### 插入消息

您可以只在本地存储中插入一条消息，但是不向外发送。

```javascript
import {
  insertIncomingMessage,
  insertOutgoingMessage,
  SentStatus
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

### 删除消息

```javascript
import { deleteMessages } from "rongcloud-react-native-imlib";

// 删除指定 ID 的消息
deleteMessages(["messageId 1", "messageId 2"]);

// 删除指定会话的所有消息
deleteMessages(conversationType, targetId);
```

### 搜索消息

```javascript
import { searchMessages } from "rongcloud-react-native-imlib";

const messages = await searchMessages(ConversationType, targetId, keyword, count);
```


### 消息撤回

使用 `recallMessage` 接口可以撤回已发送的消息，撤回成功后，该消息在数据库中将被替换成 `RecallNotificationMessage`，您需要在成功回调里重新加载这条数据，刷新聊天界面。

```javascript
import { recallMessage } from "rongcloud-react-native-imlib";

const recallNotificationMessage = await recallMessage(messageId);
```

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

### 输入状态提醒

您可以在用户正在输入的时候，向对方发送正在输入的状态。目前该功能只支持单聊。

其中，您可以在 `typingContentType` 中传入消息的类型名，会话中的其他用户输入状态监听中会收到此消息类型。
您可以通过此消息类型，自定义不同的输入状态提示（如：正在输入、正在讲话、正在拍摄等）。

在 6 秒之内，如果同一个用户在同一个会话中多次调用此接口发送正在输入的状态，为保证产品体验和网络优化，将只有最开始的一次生效。

```javascript
import { sendTypingStatus } from "rongcloud-react-native-imlib";

sendTypingStatus(conversationType, targetId, typingContentType);
```

在接收端，您可以设置输入状态的监听器。

当前会话正在输入的用户有变化时，会触发监听中的 onTypingStatusChanged()，回调里携带有当前正在输入的用户和消息类型。
对于单聊而言，当对方正在输入时，监听会触发一次；当对方不处于输入状态时，该监听还会触发一次，但是回调里并不携带用户和消息类型，开发者需要在此时取消正在输入的显示。

```javascript
import { addTypingStatusListener } from "rongcloud-react-native-imlib";

addTypingStatusListener(({ conversationType, targetId, userId, typingContentType }) => {
  if (userId) {
    console.log("用户输入状态：" + typingContentType);
  } else {
    console.log("用户不再输入");
  }
});
```

### 群定向消息

此方法用于在群组中给部分用户发送消息，其它用户不会收到这条消息，建议向群中部分用户发送状态类消息时使用此功能。

注：群定向消息不存储到云端，通过“单群聊消息云存储”服务无法获取到定向消息。

```javascript
import { sendDirectionalMessage } from "rongcloud-react-native-imlib";

const conversationType = ConversationType.PRIVATE;
const targetId = "groupId"; // 只能是组群 ID
const content = { type: "text", content: "Hello" };
const callback = {
  success(messageId) {
    console.log("发送成功：" + messageId);
  },
  error(errorCode) {
    console.log("发送失败：" + errorCode);
  }
};

const userIds = ["user1", "user2"];

sendDirectionalMessage({ conversationType, targetId, content }, userIds, callback);
```


### ＠ 功能

群组中支持 @ 消息功能，满足您 @ 指定用户或 @ 所有人的需求，只需要在 `MessageContent` 中添加 `mentionedInfo` 字段。

```javascript
import { sendMessage, MentionedType } from "rongcloud-react-native-imlib";

const content = {
  type: "text",
  content: "Hello",
  mentionedInfo: {
    type: MentionedType.PART, // @ 指定的用户
    userIdList: ["userId"]
  }
};

sendMessage({ conversationType, targetId, content }, callback);
```

收到 @ 消息时，在 `Conversation` 里的 `hasUnreadMentioned` 会被设为 `true`。

```javascript
const conversation = await getConversation(conversationType, targetId);
console.log(conversation.hasUnreadMentioned);
```

您可以用 `getUnreadMentionedMessages` 获取会话里所有未读 @ 消息

```javascript
import { getUnreadMentionedMessages } from "rongcloud-react-native-imlib";

const messages = await getUnreadMentionedMessages(conversationType, targetId);
```


### 离线消息设置

设置当前用户离线消息存储时间，以天为单位。

```javascript
import { setOfflineMessageDuration, getOfflineMessageDuration } from "rongcloud-react-native-imlib";

setOfflineMessageDuration(days);

const duration = await getOfflineMessageDuration();
```
