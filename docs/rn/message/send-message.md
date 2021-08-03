
### 文本消息

```javascript
import { sendMessage, ConversationType, ObjectName } from "rongcloud-react-native-imlib";

const conversationType = ConversationType.PRIVATE;
const targetId = "userId"; // 根据会话类型的不同，可以是用户 ID、讨论组 ID、组群 ID 等
const content = { objectName: ObjectName.Text, content: "这是一个文本消息" };
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

### 图片消息

```javascript
import { sendMediaMessage, cancelSendMediaMessage, ObjectName } from "rongcloud-react-native-imlib";

const content = { objectName: ObjectName.Image, local: "file:///image_path" };
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

### 文件消息

```javascript
import { sendMediaMessage, ObjectName } from "rongcloud-react-native-imlib";

const content = { objectName: ObjectName.File, local: "file:///image_path" };
sendMediaMessage({ conversationType, targetId, content }, callback);
```

### 位置消息

```javascript
import { sendMessage, ObjectName } from "rongcloud-react-native-imlib";

const content = {
  objectName: ObjectName.Location,
  latitude: 34,
  longitude: 108,
  name: "海龙大厦",
  thumbnail: "http://example.com/thum.jpg"
};

sendMessage({ conversationType, targetId, content }, callback);
```

### 语音消息

融云 React Native SDK 不提供语音录制、转码功能，开发者需要自已实现语音消息录制、转码，通过融云内置的语音消息进行发送。

```javascript
import { sendMessage, ObjectName } from "rongcloud-react-native-imlib";

const content = {
  objectName: ObjectName.Voice,
  data: "audio raw data", // iOS 使用二进制数据的方式发送
  local: "audio path", // Android 使用文件方式发送
  duration: 9 // 语音持续时间，单位：秒
};

sendMessage({ conversationType, targetId, content }, callback);
```

### 输入状态消息

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

### 群组定向消息

此方法用于在群组中给部分用户发送消息，其它用户不会收到这条消息，建议向群中部分用户发送状态类消息时使用此功能。

注：群定向消息不存储到云端，通过“单群聊消息云存储”服务无法获取到定向消息。

```javascript
import { sendDirectionalMessage, ObjectName } from "rongcloud-react-native-imlib";

const conversationType = ConversationType.PRIVATE;
const targetId = "groupId"; // 只能是组群 ID
const content = { objectName: ObjectName.Text, content: "Hello" };
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


### 发送群 ＠消息

群组中支持 @ 消息功能，满足您 @ 指定用户或 @ 所有人的需求，只需要在 `MessageContent` 中添加 `mentionedInfo` 字段。

```javascript
import { sendMessage, MentionedType, ObjectName } from "rongcloud-react-native-imlib";

const content = {
  objectName: ObjectName,
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
